import { Session } from '@shopify/shopify-api';
import prisma from './prisma';

const sessionHandler = {
  async storeSession(session: Session): Promise<void> {
    try {
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

      await prisma.session.upsert({
        where: { id: session.id },
        update: {
          shop: session.shop,
          content: JSON.stringify(sessionData),
        },
        create: {
          id: session.id,
          shop: session.shop,
          content: JSON.stringify(sessionData),
        },
      });

      console.log('Session stored successfully:', session.id);
    } catch (error) {
      console.error('Error storing session:', error);
      throw error;
    }
  },

  async loadSession(id: string): Promise<Session | undefined> {
    try {
      const record = await prisma.session.findUnique({
        where: { id }
      });

      if (!record || !record.content) {
        console.log('No session found for id:', id);
        return undefined;
      }

      // Deserialize the session from JSON
      const sessionData = JSON.parse(record.content);

      return new Session({
        id: sessionData.id,
        shop: sessionData.shop,
        state: sessionData.state,
        isOnline: sessionData.isOnline,
        accessToken: sessionData.accessToken || undefined,
        scope: sessionData.scope || undefined,
        expires: sessionData.expires ? new Date(sessionData.expires) : undefined,
      });
    } catch (error) {
      console.error('Error loading session:', error);
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