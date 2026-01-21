import { Session } from '@shopify/shopify-api';
import prisma from './prisma';

const sessionHandler = {
  async storeSession(session: Session): Promise<void> {
    try {
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

      // CRITICAL: Validate token format and length
      const tokenLength = session.accessToken.length;
      const tokenPrefix = session.accessToken.substring(0, 6);

      console.log('Token validation:', {
        length: tokenLength,
        prefix: tokenPrefix + '...',
        isValid: tokenLength >= 30 && (tokenPrefix.startsWith('shpat_') || tokenPrefix.startsWith('shpca_'))
      });

      // Validate token format - CORRECTED VALIDATION
      // Shopify returns different token formats:
      // - 38-character tokens: shpat_... (valid for certain app configs)
      // - 100+ character tokens: shpat_... or shpca_... (standard format)

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

      // CRITICAL: Delete any existing sessions for this shop before storing new one
      // This ensures we don't update a corrupted session, we create a fresh one
      const existingSession = await prisma.session.findUnique({
        where: { id: session.id }
      });

      if (existingSession) {
        console.log(`⚠️ Deleting existing session ${session.id} before storing new one`);
        await prisma.session.delete({
          where: { id: session.id }
        });
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

      // Use create instead of upsert to ensure fresh session
      await prisma.session.create({
        data: {
          id: session.id,
          shop: session.shop,
          content: JSON.stringify(sessionData),
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

  async loadSession(id: string): Promise<Session | undefined> {
    try {
      console.log('Loading session with ID:', id);

      const record = await prisma.session.findUnique({
        where: { id }
      });

      if (!record || !record.content) {
        console.warn('✗ No session found for id:', id);
        return undefined;
      }

      // Deserialize the session from JSON
      const sessionData = JSON.parse(record.content);

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
      console.error('✗ Error loading session:', error);
      return undefined;
    }
  },

  async deleteSession(id: string): Promise<boolean> {
    try {
      await prisma.session.delete({
        where: { id }
      });
      console.log('Session deleted:', id);
      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      return false;
    }
  },

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

  async findSessionsByShop(shop: string): Promise<Session[]> {
    try {
      const records = await prisma.session.findMany({
        where: { shop }
      });

      return records
        .filter(record => record.content)
        .map(record => {
          const sessionData = JSON.parse(record.content!);
          return new Session({
            id: sessionData.id,
            shop: sessionData.shop,
            state: sessionData.state,
            isOnline: sessionData.isOnline,
            accessToken: sessionData.accessToken || undefined,
            scope: sessionData.scope || undefined,
            expires: sessionData.expires ? new Date(sessionData.expires) : undefined,
          });
        });
    } catch (error) {
      console.error('Error finding sessions by shop:', error);
      return [];
    }
  }
};

export default sessionHandler;