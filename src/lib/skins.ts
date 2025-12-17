/**
 * Servicio para obtener URLs de skins de jugadores de Minecraft
 * Soporta integración con SkinRestorer API
 */

const CRAFTY_API_URL = "https://render.crafty.gg/2d/front";
const SKIN_API_URL = import.meta.env.SKIN_API_URL || "";

// Cache simple en memoria para evitar múltiples requests a la API
const skinCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

/**
 * Obtiene la URL del skin del jugador desde SkinRestorer API
 */
async function getSkinFromAPI(uuid: string): Promise<string | null> {
  if (!SKIN_API_URL) return null;

  try {
    // Limpiar UUID (remover guiones)
    const cleanUuid = uuid.replace(/-/g, "");
    const apiUrl = `${SKIN_API_URL}/${cleanUuid}`;

    const response = await fetch(apiUrl, {
      signal: AbortSignal.timeout(3000), // 3 segundos timeout
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // SkinRestorer puede devolver diferentes formatos
    if (data.skinUrl) {
      return data.skinUrl;
    } else if (data.textures?.SKIN?.url) {
      return data.textures.SKIN.url;
    }

    return null;
  } catch (error) {
    // Error silencioso, usar fallback
    return null;
  }
}

/**
 * Obtiene la URL del avatar del jugador (async con verificación de API)
 */
export async function getSkinUrl(uuid: string): Promise<string> {
  if (!uuid) {
    return `${CRAFTY_API_URL}/8667ba71b85a4004af54457a9734eed7`; // Steve por defecto
  }

  // Limpiar UUID
  const cleanUuid = uuid.replace(/-/g, "");

  // Verificar cache
  const cached = skinCache.get(cleanUuid);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.url;
  }

  // Intentar obtener desde API de SkinRestorer
  const skinUrl = await getSkinFromAPI(cleanUuid);

  if (skinUrl) {
    skinCache.set(cleanUuid, { url: skinUrl, timestamp: Date.now() });
    return skinUrl;
  }

  // Fallback a Crafty
  const craftyUrl = `${CRAFTY_API_URL}/${cleanUuid}`;
  skinCache.set(cleanUuid, { url: craftyUrl, timestamp: Date.now() });

  return craftyUrl;
}

/**
 * Obtiene la URL del avatar del jugador (versión síncrona sin verificación de API)
 * Útil para componentes que no pueden usar async
 */
export function getSkinUrlSync(uuid: string): string {
  if (!uuid) {
    return `${CRAFTY_API_URL}/8667ba71b85a4004af54457a9734eed7`; // Steve por defecto
  }

  const cleanUuid = uuid.replace(/-/g, "");

  // Verificar cache
  const cached = skinCache.get(cleanUuid);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.url;
  }

  // Devolver Crafty directamente
  return `${CRAFTY_API_URL}/${cleanUuid}`;
}

/**
 * Obtiene información del skin desde la API de SkinRestorer
 */
export async function getSkinInfo(
  uuid: string
): Promise<{ hasCustomSkin: boolean; skinUrl: string }> {
  const skinUrl = await getSkinUrl(uuid);
  const hasCustomSkin = !skinUrl.includes("crafty.gg");

  return {
    hasCustomSkin,
    skinUrl,
  };
}

/**
 * Limpia el cache de skins (útil para testing o forzar refresh)
 */
export function clearSkinCache(): void {
  skinCache.clear();
}

/**
 * Verifica si un UUID es de la consola
 */
export function isConsoleUuid(uuid: string | null | undefined): boolean {
  if (!uuid) return false;
  const cleanUuid = uuid.replace(/-/g, "").toLowerCase();
  return (
    cleanUuid === "00000000000000000000000000000000" ||
    cleanUuid === "0" ||
    uuid.toLowerCase() === "console"
  );
}
