/**
 * Type definitions for the punishment system
 */
import type { RowDataPacket } from "mysql2";

// Base punishment interface (common fields across all punishment types)
export interface BasePunishment extends RowDataPacket {
  id: number;
  uuid: string | null;
  ip: string | null;
  reason: string | null;
  banned_by_uuid: string;
  banned_by_name: string | null;
  time: number; // Unix timestamp in milliseconds
  until: number; // Unix timestamp in milliseconds, -1 for permanent
  template: number;
  server_scope: string | null;
  server_origin: string | null;
  silent: number; // BIT field
  ipban: number; // BIT field
  ipban_wildcard: number; // BIT field
  active: number; // BIT field
}

// Ban-specific fields
export interface Ban extends BasePunishment {
  removed_by_uuid: string | null;
  removed_by_name: string | null;
  removed_by_reason: string | null;
  removed_by_date: Date | null;
}

// Mute-specific fields (same as ban)
export interface Mute extends BasePunishment {
  removed_by_uuid: string | null;
  removed_by_name: string | null;
  removed_by_reason: string | null;
  removed_by_date: Date | null;
}

// Warning-specific fields
export interface Warning extends BasePunishment {
  removed_by_uuid: string | null;
  removed_by_name: string | null;
  removed_by_reason: string | null;
  removed_by_date: Date | null;
  warned: number; // BIT field - if the player has seen the warning
}

// Kick (no removed_by fields)
export interface Kick extends BasePunishment {}

// History entry for player names/UUIDs
export interface HistoryEntry extends RowDataPacket {
  id: number;
  date: Date;
  name: string | null;
  uuid: string | null;
  ip: string | null;
}

// Punishment type enum
export type PunishmentType = "ban" | "mute" | "warning" | "kick";

// Union type for any punishment
export type Punishment = Ban | Mute | Warning | Kick;

// Punishment with type metadata (for history view)
export interface PunishmentWithType {
  type: PunishmentType;
  data: Punishment;
}

// Player stats summary
export interface PlayerStats {
  uuid: string;
  name: string;
  totalBans: number;
  totalMutes: number;
  totalWarnings: number;
  totalKicks: number;
  activeBans: number;
  activeMutes: number;
  activeWarnings: number;
  firstSeen: Date | null;
  lastSeen: Date | null;
}

// Staff stats summary
export interface StaffStats {
  uuid: string;
  name: string;
  totalBansIssued: number;
  totalMutesIssued: number;
  totalWarningsIssued: number;
  totalKicksIssued: number;
}

// Pagination result
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
