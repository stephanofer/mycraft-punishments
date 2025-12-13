import type { APIRoute } from 'astro';
import { getGlobalStats } from '../../lib/queries';

export const GET: APIRoute = async () => {
  try {
    const stats = await getGlobalStats();

    return new Response(JSON.stringify({
      success: true,
      data: {
        totalBans: stats.totalBans,
        activeBans: stats.activeBans,
        totalMutes: stats.totalMutes,
        activeMutes: stats.activeMutes,
        totalWarnings: stats.totalWarnings,
        totalKicks: stats.totalKicks,
        totalPunishments: stats.totalBans + stats.totalMutes + stats.totalWarnings + stats.totalKicks
      },
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60' // Cache for 1 minute
      }
    });
  } catch (error) {
    console.error('API stats error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
