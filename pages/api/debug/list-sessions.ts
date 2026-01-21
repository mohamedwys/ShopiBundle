import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';

/**
 * List All Sessions in Database
 *
 * Shows all sessions currently stored with token information
 * Usage: GET /api/debug/list-sessions
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const sessions = await prisma.session.findMany({
      select: {
        id: true,
        shop: true,
        content: true,
      },
    });

    const sessionsWithTokenInfo = sessions.map(session => {
      let tokenInfo = null;
      let sessionData = null;

      try {
        sessionData = JSON.parse(session.content || '{}');
        const token = sessionData.accessToken || '';

        tokenInfo = {
          exists: !!token,
          length: token.length,
          prefix: token.substring(0, 6),
          suffix: token.substring(token.length - 4),
          isValid: token.length > 50 && (token.startsWith('shpat_') || token.startsWith('shpca_')),
          isInvalid: token.startsWith('shpua_'),
          fullFormat: token.length === 38 ? 'shpua_ format (INVALID)' :
                     token.length > 100 ? 'shpat_/shpca_ format (VALID)' :
                     'Unknown format',
        };
      } catch (e) {
        tokenInfo = { error: 'Failed to parse session content' };
      }

      return {
        id: session.id,
        shop: session.shop,
        isOnline: sessionData?.isOnline,
        tokenInfo,
        sessionAge: sessionData?.expires ?
          `Expires: ${sessionData.expires}` :
          'No expiration (offline session)',
      };
    });

    const summary = {
      totalSessions: sessions.length,
      validSessions: sessionsWithTokenInfo.filter(s => s.tokenInfo?.isValid).length,
      invalidSessions: sessionsWithTokenInfo.filter(s => s.tokenInfo?.isInvalid).length,
      sessionsWithShpuaTokens: sessionsWithTokenInfo.filter(s =>
        s.tokenInfo?.prefix === 'shpua_'
      ).map(s => ({
        id: s.id,
        shop: s.shop,
        tokenLength: s.tokenInfo?.length,
      })),
    };

    return res.status(200).json({
      summary,
      sessions: sessionsWithTokenInfo,
      action: summary.invalidSessions > 0 ?
        'Delete invalid sessions using: /api/debug/force-delete-session?shop=SHOP_NAME&confirm=yes' :
        'All sessions look valid',
    });

  } catch (error) {
    console.error('Error listing sessions:', error);
    return res.status(500).json({
      error: 'Failed to list sessions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default handler;
