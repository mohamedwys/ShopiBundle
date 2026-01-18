import { Session } from '@shopify/shopify-api';
import prisma from './prisma';

interface SessionData {
  id: string;
  shop: string;
  state: string;
  isOnline: boolean;
  accessToken?: string;
  scope?: string;
  expires?: Date | null;
}

const sessionHandler = {
  async storeSession(session: Session): Promise<void> {
    try {
      await prisma.session.upsert({
        where: { id: session.id },
        update: {
          shop: session.shop,
          state: session.state,
          isOnline: session.isOnline,
          accessToken: session.accessToken || null,
          scope: session.scope || null,
          expires: session.expires ? new Date(session.expires) : null,
          updatedAt: new Date(),
        },
        create: {
          id: session.id,
          shop: session.shop,
          state: session.state,
          isOnline: session.isOnline,
          accessToken: session.accessToken || null,
          scope: session.scope || null,
          expires: session.expires ? new Date(session.expires) : null,
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
      const sessionData = await prisma.session.findUnique({
        where: { id }
      });
      
      if (!sessionData) {
        console.log('No session found for id:', id);
        return undefined;
      }
      
      return new Session({
        id: sessionData.id,
        shop: sessionData.shop,
        state: sessionData.state,
        isOnline: sessionData.isOnline,
        accessToken: sessionData.accessToken || undefined,
        scope: sessionData.scope || undefined,
        expires: sessionData.expires || undefined,
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
      const sessions = await prisma.session.findMany({
        where: { shop }
      });

      return sessions.map(sessionData => new Session({
        id: sessionData.id,
        shop: sessionData.shop,
        state: sessionData.state,
        isOnline: sessionData.isOnline,
        accessToken: sessionData.accessToken || undefined,
        scope: sessionData.scope || undefined,
        expires: sessionData.expires || undefined,
      }));
    } catch (error) {
      console.error('Error finding sessions by shop:', error);
      return [];
    }
  }
};

export default sessionHandler;