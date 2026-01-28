import { Session } from '@shopify/shopify-api';
import prisma from './prisma';

/**
 * Session Handler for Shopify App
 *
 * Handles storing and retrieving sessions from the database.
 * Uses atomic operations to prevent race conditions.
 */

const sessionHandler = {
  /**
   * Store a session atomically using upsert
   * This prevents race conditions that occur with delete-then-create pattern
   */
  async storeSession(session: Session): Promise<void> {
    // Validate session before storing
    if (!session.id) {
      throw new Error('Cannot store session: missing session ID');
    }

    if (!session.shop) {
      throw new Error('Cannot store session: missing shop domain');
    }

    if (!session.accessToken) {
      throw new Error('Cannot store session: missing accessToken');
    }

    // Validate token format
    const tokenLength = session.accessToken.length;
    const tokenPrefix = session.accessToken.substring(0, 6);

    console.log('Token validation:', {
      length: tokenLength,
      prefix: tokenPrefix + '...',
      isValid: tokenLength >= 30 && (tokenPrefix.startsWith('shpat_') || tokenPrefix.startsWith('shpca_'))
    });

    // Check prefix (most important)
    if (!tokenPrefix.startsWith('shpat_') && !tokenPrefix.startsWith('shpca_')) {
      console.error(
        `❌ CRITICAL ERROR: Invalid token prefix!`,
        `Received: ${tokenPrefix}... Expected: shpat_... or shpca_...`
      );
      throw new Error(
        `Invalid token prefix: ${tokenPrefix}. ` +
        `Valid Shopify tokens must start with 'shpat_' or 'shpca_'.`
      );
    }

    // Check minimum length
    if (tokenLength < 30) {
      console.error(
        `❌ CRITICAL ERROR: Token too short!`,
        `Length: ${tokenLength} characters (minimum 30 expected).`
      );
      throw new Error(
        `Invalid token: too short (${tokenLength} chars). Token may be corrupted.`
      );
    }

    // Log accepted token format
    if (tokenLength === 38) {
      console.log(`✓ Storing session with 38-char shpat_ token (valid Shopify format)`);
    } else if (tokenLength > 100) {
      console.log(`✓ Storing session with ${tokenLength}-char token (standard format)`);
    } else {
      console.log(`✓ Storing session with ${tokenLength}-char token (valid prefix confirmed)`);
    }

    // Serialize the entire session object to JSON
    const sessionData = {
      id: session.id,
      shop: session.shop,
      state: session.state,
      isOnline: session.isOnline,
      accessToken: session.accessToken,
      scope: session.scope,
      expires: session.expires,
    };

    const contentJson = JSON.stringify(sessionData);

    try {
      // ATOMIC UPSERT - prevents race conditions
      // This replaces the problematic delete-then-create pattern
      await prisma.session.upsert({
        where: { id: session.id },
        create: {
          id: session.id,
          shop: session.shop,
          content: contentJson,
        },
        update: {
          shop: session.shop,
          content: contentJson,
        },
      });

      console.log('✓ Session stored successfully:', {
        id: session.id,
        shop: session.shop,
        isOnline: session.isOnline,
        hasAccessToken: !!session.accessToken,
        tokenLength: session.accessToken.length,
        tokenPrefix: session.accessToken.substring(0, 10) + '...',
      });
    } catch (error) {
      console.error('✗ Error storing session:', error);
      throw error;
    }
  },

  /**
   * Load a session by ID with retry logic for transient DB errors
   */
  async loadSession(id: string, retries = 3): Promise<Session | undefined> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Loading session with ID: ${id} (attempt ${attempt}/${retries})`);

        const record = await prisma.session.findUnique({
          where: { id }
        });

        if (!record || !record.content) {
          console.warn('✗ No session found for id:', id);
          return undefined;
        }

        // Safe JSON parsing with error handling
        let sessionData: any;
        try {
          sessionData = JSON.parse(record.content);
        } catch (parseError) {
          console.error(`✗ Failed to parse session content for ${id}:`, parseError);
          // Delete corrupted session
          await prisma.session.delete({ where: { id } }).catch(() => {});
          return undefined;
        }

        // Validate session data structure
        if (!sessionData.id || !sessionData.shop) {
          console.error(`✗ Invalid session data structure for ${id}`);
          return undefined;
        }

        if (!sessionData.accessToken) {
          console.warn(`✗ Session ${id} has no accessToken`);
        }

        const session = new Session({
          id: sessionData.id,
          shop: sessionData.shop,
          state: sessionData.state,
          isOnline: sessionData.isOnline,
          accessToken: sessionData.accessToken || undefined,
          scope: sessionData.scope || undefined,
          expires: sessionData.expires ? new Date(sessionData.expires) : undefined,
        });

        console.log('✓ Session loaded successfully:', {
          id: session.id,
          shop: session.shop,
          isOnline: session.isOnline,
          hasAccessToken: !!session.accessToken,
        });

        return session;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`✗ Error loading session (attempt ${attempt}/${retries}):`, error);

        // Only retry on transient errors
        if (attempt < retries) {
          const delay = Math.pow(2, attempt) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    console.error('✗ All retry attempts failed for loading session:', lastError);
    return undefined;
  },

  /**
   * Delete a session by ID
   */
  async deleteSession(id: string): Promise<boolean> {
    try {
      await prisma.session.delete({
        where: { id }
      });
      console.log('Session deleted:', id);
      return true;
    } catch (error: any) {
      // Handle case where session doesn't exist (not really an error)
      if (error.code === 'P2025') {
        console.log('Session already deleted or not found:', id);
        return true;
      }
      console.error('Error deleting session:', error);
      return false;
    }
  },

  /**
   * Delete multiple sessions by IDs
   */
  async deleteSessions(ids: string[]): Promise<boolean> {
    try {
      await prisma.session.deleteMany({
        where: {
          id: {
            in: ids
          }
        }
      });
      console.log('Sessions deleted:', ids.length);
      return true;
    } catch (error) {
      console.error('Error deleting sessions:', error);
      return false;
    }
  },

  /**
   * Find all sessions for a shop
   */
  async findSessionsByShop(shop: string): Promise<Session[]> {
    try {
      const records = await prisma.session.findMany({
        where: { shop }
      });

      const sessions: Session[] = [];

      for (const record of records) {
        if (!record.content) continue;

        // Safe JSON parsing
        let sessionData: any;
        try {
          sessionData = JSON.parse(record.content);
        } catch (parseError) {
          console.error(`✗ Failed to parse session content for ${record.id}:`, parseError);
          continue;
        }

        sessions.push(new Session({
          id: sessionData.id,
          shop: sessionData.shop,
          state: sessionData.state,
          isOnline: sessionData.isOnline,
          accessToken: sessionData.accessToken || undefined,
          scope: sessionData.scope || undefined,
          expires: sessionData.expires ? new Date(sessionData.expires) : undefined,
        }));
      }

      return sessions;
    } catch (error) {
      console.error('Error finding sessions by shop:', error);
      return [];
    }
  }
};

export default sessionHandler;
