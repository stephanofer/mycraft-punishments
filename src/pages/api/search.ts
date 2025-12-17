import type { APIRoute } from "astro";
import {
  searchPlayer,
  searchPlayerByUuid,
  getPlayerStats,
} from "../../lib/queries";
import { isValidUuid, undashifyUuid, dashifyUuid } from "../../lib/utils";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim();

  if (!query) {
    return new Response(JSON.stringify({ error: "Query parameter required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    let player = null;

    if (isValidUuid(query)) {
      const normalizedUuid = dashifyUuid(undashifyUuid(query));
      player = await searchPlayerByUuid(normalizedUuid);
    } else {
      player = await searchPlayer(query);
    }

    if (!player) {
      return new Response(
        JSON.stringify({
          found: false,
          query,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const stats = await getPlayerStats(player.uuid || "");

    return new Response(
      JSON.stringify({
        found: true,
        player: {
          uuid: player.uuid,
          name: player.name,
          stats: stats
            ? {
                totalBans: stats.totalBans,
                totalMutes: stats.totalMutes,
                totalWarnings: stats.totalWarnings,
                totalKicks: stats.totalKicks,
                activeBans: stats.activeBans,
                activeMutes: stats.activeMutes,
                activeWarnings: stats.activeWarnings,
              }
            : null,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("API search error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
