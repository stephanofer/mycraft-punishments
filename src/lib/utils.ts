/**
 * Utility functions and helpers
 */

import type { PunishmentType, Punishment, Ban, Mute, Warning } from "./types";

// Console aliases
export const CONSOLE_ALIASES = ["CONSOLE", "Console", "#console#", "LiteBans"];
export const CONSOLE_NAME = "Consola";

/**
 * Format a timestamp (in milliseconds) to a readable date
 */
export function formatDate(timestamp: number): string {
  if (!timestamp) return "-";

  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Format a date for relative time (e.g., "hace 2 días")
 */
export function formatRelativeTime(timestamp: number): string {
  if (!timestamp) return "-";

  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) return `hace ${months} ${months === 1 ? "mes" : "meses"}`;
  if (weeks > 0) return `hace ${weeks} ${weeks === 1 ? "semana" : "semanas"}`;
  if (days > 0) return `hace ${days} ${days === 1 ? "día" : "días"}`;
  if (hours > 0) return `hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
  if (minutes > 0)
    return `hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
  return "hace unos segundos";
}

/**
 * Format expiry time
 */
export function formatExpiry(until: number, active: number): string {
  if (until <= 0) {
    return "Permanente";
  }

  const now = Date.now();

  if (until < now || active === 0) {
    return "Expirado";
  }

  const diff = until - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

/**
 * Get punishment status
 */
export function getPunishmentStatus(
  punishment: Punishment
): "active" | "expired" | "removed" {
  // Check if it was manually removed
  if ("removed_by_uuid" in punishment && punishment.removed_by_uuid) {
    return "removed";
  }

  // Check if active flag is set
  if (punishment.active === 0) {
    return "expired";
  }

  // Check if it has expired based on time
  if (punishment.until > 0 && punishment.until < Date.now()) {
    return "expired";
  }

  return "active";
}

/**
 * Check if a punishment is permanent
 */
export function isPermanent(until: number): boolean {
  return until <= 0;
}

/**
 * Clean text from Minecraft color codes
 */
export function cleanMinecraftText(text: string | null): string {
  if (!text) return "";

  // Remove section symbol color codes (§a, §b, etc.)
  let cleaned = text.replace(/§[0-9a-fk-or]/gi, "");

  // Remove ampersand color codes (&a, &b, etc.)
  cleaned = cleaned.replace(/&[0-9a-fk-or]/gi, "");

  // Remove hex color codes (#FFFFFF)
  cleaned = cleaned.replace(/#[0-9a-f]{6}/gi, "");

  // Replace \n with actual newlines
  cleaned = cleaned.replace(/\\n/g, "\n");

  return cleaned;
}

/**
 * Get the banner name (staff who issued the punishment)
 */
export function getBannerName(
  bannedByUuid: string | null,
  bannedByName: string | null
): string {
  if (!bannedByUuid && !bannedByName) return CONSOLE_NAME;
  if (
    CONSOLE_ALIASES.includes(bannedByUuid || "") ||
    CONSOLE_ALIASES.includes(bannedByName || "")
  ) {
    return CONSOLE_NAME;
  }
  return bannedByName || "Desconocido";
}

/**
 * Get punishment type label in Spanish
 */
export function getPunishmentTypeLabel(type: PunishmentType): string {
  switch (type) {
    case "ban":
      return "Baneo";
    case "mute":
      return "Silencio";
    case "warning":
      return "Advertencia";
    case "kick":
      return "Expulsión";
  }
}

/**
 * Get punishment type plural label
 */
export function getPunishmentTypePluralLabel(type: PunishmentType): string {
  switch (type) {
    case "ban":
      return "Baneos";
    case "mute":
      return "Silencios";
    case "warning":
      return "Advertencias";
    case "kick":
      return "Expulsiones";
  }
}

/**
 * Get color class for punishment type
 */
export function getPunishmentTypeColor(type: PunishmentType): string {
  switch (type) {
    case "ban":
      return "text-red-500";
    case "mute":
      return "text-yellow-500";
    case "warning":
      return "text-orange-500";
    case "kick":
      return "text-blue-500";
  }
}

/**
 * Get background color class for punishment type
 */
export function getPunishmentTypeBgColor(type: PunishmentType): string {
  switch (type) {
    case "ban":
      return "bg-red-500/20";
    case "mute":
      return "bg-yellow-500/20";
    case "warning":
      return "bg-orange-500/20";
    case "kick":
      return "bg-blue-500/20";
  }
}

/**
 * Get border color class for punishment type
 */
export function getPunishmentTypeBorderColor(type: PunishmentType): string {
  switch (type) {
    case "ban":
      return "border-red-500/50";
    case "mute":
      return "border-yellow-500/50";
    case "warning":
      return "border-orange-500/50";
    case "kick":
      return "border-blue-500/50";
  }
}

/**
 * Format a UUID with dashes
 */
export function dashifyUuid(uuid: string): string {
  if (uuid.length !== 32) return uuid;
  return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(
    12,
    16
  )}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
}

/**
 * Remove dashes from UUID
 */
export function undashifyUuid(uuid: string): string {
  return uuid.replace(/-/g, "");
}

/**
 * Validate if a string is a valid UUID
 */
export function isValidUuid(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Validate if a string is a valid Minecraft username
 */
export function isValidUsername(str: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{1,16}$/;
  return usernameRegex.test(str);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Generate pagination array
 */
export function generatePaginationArray(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): (number | "...")[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];
  const half = Math.floor(maxVisible / 2);

  if (currentPage <= half + 1) {
    // Near the start
    for (let i = 1; i <= maxVisible - 1; i++) {
      pages.push(i);
    }
    pages.push("...");
    pages.push(totalPages);
  } else if (currentPage >= totalPages - half) {
    // Near the end
    pages.push(1);
    pages.push("...");
    for (let i = totalPages - maxVisible + 2; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // In the middle
    pages.push(1);
    pages.push("...");
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      pages.push(i);
    }
    pages.push("...");
    pages.push(totalPages);
  }

  return pages;
}
