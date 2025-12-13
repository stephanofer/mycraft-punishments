/**
 * Punishment queries service
 * Optimized for performance with prepared statements and efficient pagination
 */
import { query, TABLES } from './database';
import type { 
  Ban, Mute, Warning, Kick, 
  HistoryEntry, PaginatedResult, 
  PunishmentType, PlayerStats, StaffStats,
  PunishmentWithType
} from './types';
import type { RowDataPacket } from 'mysql2';

// Default items per page
const DEFAULT_PER_PAGE = 15;

// Common columns for punishments (avoid selecting unnecessary data)
const PUNISHMENT_COLUMNS = `
  id, uuid, ip, reason, banned_by_uuid, banned_by_name, 
  time, until, server_scope, server_origin,
  CAST(active AS UNSIGNED) AS active, 
  CAST(ipban AS UNSIGNED) AS ipban,
  CAST(silent AS UNSIGNED) AS silent
`;

const REMOVABLE_COLUMNS = `,
  removed_by_uuid, removed_by_name, removed_by_reason, removed_by_date
`;

/**
 * Get paginated bans
 */
export async function getBans(
  page: number = 1,
  perPage: number = DEFAULT_PER_PAGE,
  showInactive: boolean = true
): Promise<PaginatedResult<Ban>> {
  const offset = (page - 1) * perPage;
  
  let whereClause = "WHERE uuid IS NOT NULL AND uuid <> '#offline#'";
  if (!showInactive) {
    const now = Date.now();
    whereClause += ` AND active = 1 AND (until < 1 OR until > ${now})`;
  }
  
  // Count total
  const countResult = await query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM ${TABLES.bans} ${whereClause}`
  );
  const total = (countResult[0] as any).total;
  
  // Get paginated data
  const data = await query<Ban[]>(
    `SELECT ${PUNISHMENT_COLUMNS} ${REMOVABLE_COLUMNS}
     FROM ${TABLES.bans} 
     ${whereClause}
     ORDER BY time DESC 
     LIMIT :limit OFFSET :offset`,
    { limit: perPage, offset }
  );
  
  return createPaginatedResult(data, total, page, perPage);
}

/**
 * Get paginated mutes
 */
export async function getMutes(
  page: number = 1,
  perPage: number = DEFAULT_PER_PAGE,
  showInactive: boolean = true
): Promise<PaginatedResult<Mute>> {
  const offset = (page - 1) * perPage;
  
  let whereClause = "WHERE uuid IS NOT NULL AND uuid <> '#offline#'";
  if (!showInactive) {
    const now = Date.now();
    whereClause += ` AND active = 1 AND (until < 1 OR until > ${now})`;
  }
  
  const countResult = await query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM ${TABLES.mutes} ${whereClause}`
  );
  const total = (countResult[0] as any).total;
  
  const data = await query<Mute[]>(
    `SELECT ${PUNISHMENT_COLUMNS} ${REMOVABLE_COLUMNS}
     FROM ${TABLES.mutes} 
     ${whereClause}
     ORDER BY time DESC 
     LIMIT :limit OFFSET :offset`,
    { limit: perPage, offset }
  );
  
  return createPaginatedResult(data, total, page, perPage);
}

/**
 * Get paginated warnings
 */
export async function getWarnings(
  page: number = 1,
  perPage: number = DEFAULT_PER_PAGE,
  showInactive: boolean = true
): Promise<PaginatedResult<Warning>> {
  const offset = (page - 1) * perPage;
  
  let whereClause = "WHERE uuid IS NOT NULL AND uuid <> '#offline#'";
  if (!showInactive) {
    const now = Date.now();
    whereClause += ` AND active = 1 AND (until < 1 OR until > ${now})`;
  }
  
  const countResult = await query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM ${TABLES.warnings} ${whereClause}`
  );
  const total = (countResult[0] as any).total;
  
  const data = await query<Warning[]>(
    `SELECT ${PUNISHMENT_COLUMNS} ${REMOVABLE_COLUMNS}, CAST(warned AS UNSIGNED) AS warned
     FROM ${TABLES.warnings} 
     ${whereClause}
     ORDER BY time DESC 
     LIMIT :limit OFFSET :offset`,
    { limit: perPage, offset }
  );
  
  return createPaginatedResult(data, total, page, perPage);
}

/**
 * Get paginated kicks
 */
export async function getKicks(
  page: number = 1,
  perPage: number = DEFAULT_PER_PAGE
): Promise<PaginatedResult<Kick>> {
  const offset = (page - 1) * perPage;
  
  const whereClause = "WHERE uuid IS NOT NULL AND uuid <> '#offline#'";
  
  const countResult = await query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM ${TABLES.kicks} ${whereClause}`
  );
  const total = (countResult[0] as any).total;
  
  const data = await query<Kick[]>(
    `SELECT ${PUNISHMENT_COLUMNS}
     FROM ${TABLES.kicks} 
     ${whereClause}
     ORDER BY time DESC 
     LIMIT :limit OFFSET :offset`,
    { limit: perPage, offset }
  );
  
  return createPaginatedResult(data, total, page, perPage);
}

/**
 * Get a specific punishment by ID and type
 */
export async function getPunishmentById(
  type: PunishmentType,
  id: number
): Promise<Ban | Mute | Warning | Kick | null> {
  const table = getTableForType(type);
  const extraColumns = type === 'kick' ? '' : REMOVABLE_COLUMNS;
  const warnedColumn = type === 'warning' ? ', CAST(warned AS UNSIGNED) AS warned' : '';
  
  const result = await query<any[]>(
    `SELECT ${PUNISHMENT_COLUMNS} ${extraColumns} ${warnedColumn}
     FROM ${table} 
     WHERE id = :id`,
    { id }
  );
  
  return result[0] || null;
}

/**
 * Get player name from history by UUID
 */
export async function getPlayerName(uuid: string): Promise<string | null> {
  const result = await query<HistoryEntry[]>(
    `SELECT name FROM ${TABLES.history} 
     WHERE uuid = :uuid 
     ORDER BY date DESC 
     LIMIT 1`,
    { uuid }
  );
  
  return result[0]?.name || null;
}

/**
 * Get player history (all punishments for a player)
 */
export async function getPlayerHistory(
  uuid: string,
  page: number = 1,
  perPage: number = DEFAULT_PER_PAGE
): Promise<PaginatedResult<PunishmentWithType>> {
  const offset = (page - 1) * perPage;
  
  // Get counts from all tables in a single query (optimized)
  const countResult = await query<RowDataPacket[]>(
    `SELECT 
      (SELECT COUNT(*) FROM ${TABLES.bans} WHERE uuid = :uuid) +
      (SELECT COUNT(*) FROM ${TABLES.mutes} WHERE uuid = :uuid) +
      (SELECT COUNT(*) FROM ${TABLES.warnings} WHERE uuid = :uuid) +
      (SELECT COUNT(*) FROM ${TABLES.kicks} WHERE uuid = :uuid) AS total`,
    { uuid }
  );
  const total = (countResult[0] as any).total;
  
  // Use UNION to get all punishments sorted by time
  // This is more efficient than multiple queries
  const allPunishments = await query<any[]>(
    `(SELECT ${PUNISHMENT_COLUMNS} ${REMOVABLE_COLUMNS}, NULL as warned, 'ban' as punishment_type
      FROM ${TABLES.bans} WHERE uuid = :uuid)
     UNION ALL
     (SELECT ${PUNISHMENT_COLUMNS} ${REMOVABLE_COLUMNS}, NULL as warned, 'mute' as punishment_type
      FROM ${TABLES.mutes} WHERE uuid = :uuid)
     UNION ALL
     (SELECT ${PUNISHMENT_COLUMNS} ${REMOVABLE_COLUMNS}, CAST(warned AS UNSIGNED) AS warned, 'warning' as punishment_type
      FROM ${TABLES.warnings} WHERE uuid = :uuid)
     UNION ALL
     (SELECT ${PUNISHMENT_COLUMNS}, NULL as removed_by_uuid, NULL as removed_by_name, 
             NULL as removed_by_reason, NULL as removed_by_date, NULL as warned, 'kick' as punishment_type
      FROM ${TABLES.kicks} WHERE uuid = :uuid)
     ORDER BY time DESC
     LIMIT :limit OFFSET :offset`,
    { uuid, limit: perPage, offset }
  );
  
  const data: PunishmentWithType[] = allPunishments.map(row => ({
    type: row.punishment_type as PunishmentType,
    data: row
  }));
  
  return createPaginatedResult(data, total, page, perPage);
}

/**
 * Get staff history (punishments issued by a staff member)
 */
export async function getStaffHistory(
  uuid: string,
  page: number = 1,
  perPage: number = DEFAULT_PER_PAGE
): Promise<PaginatedResult<PunishmentWithType>> {
  const offset = (page - 1) * perPage;
  
  // Get counts from all tables
  const countResult = await query<RowDataPacket[]>(
    `SELECT 
      (SELECT COUNT(*) FROM ${TABLES.bans} WHERE banned_by_uuid = :uuid) +
      (SELECT COUNT(*) FROM ${TABLES.mutes} WHERE banned_by_uuid = :uuid) +
      (SELECT COUNT(*) FROM ${TABLES.warnings} WHERE banned_by_uuid = :uuid) +
      (SELECT COUNT(*) FROM ${TABLES.kicks} WHERE banned_by_uuid = :uuid) AS total`,
    { uuid }
  );
  const total = (countResult[0] as any).total;
  
  // Use UNION for efficiency - ALL columns must match across all selects
  const allPunishments = await query<any[]>(
    `(SELECT ${PUNISHMENT_COLUMNS} ${REMOVABLE_COLUMNS}, NULL as warned, 'ban' as punishment_type
      FROM ${TABLES.bans} WHERE banned_by_uuid = :uuid)
     UNION ALL
     (SELECT ${PUNISHMENT_COLUMNS} ${REMOVABLE_COLUMNS}, NULL as warned, 'mute' as punishment_type
      FROM ${TABLES.mutes} WHERE banned_by_uuid = :uuid)
     UNION ALL
     (SELECT ${PUNISHMENT_COLUMNS} ${REMOVABLE_COLUMNS}, CAST(warned AS UNSIGNED) AS warned, 'warning' as punishment_type
      FROM ${TABLES.warnings} WHERE banned_by_uuid = :uuid)
     UNION ALL
     (SELECT ${PUNISHMENT_COLUMNS}, NULL as removed_by_uuid, NULL as removed_by_name,
             NULL as removed_by_reason, NULL as removed_by_date, NULL as warned, 'kick' as punishment_type
      FROM ${TABLES.kicks} WHERE banned_by_uuid = :uuid)
     ORDER BY time DESC
     LIMIT :limit OFFSET :offset`,
    { uuid, limit: perPage, offset }
  );
  
  const data: PunishmentWithType[] = allPunishments.map(row => ({
    type: row.punishment_type as PunishmentType,
    data: row
  }));
  
  return createPaginatedResult(data, total, page, perPage);
}

/**
 * Search for a player by name
 */
export async function searchPlayer(name: string): Promise<HistoryEntry | null> {
  // First try exact match
  let result = await query<HistoryEntry[]>(
    `SELECT * FROM ${TABLES.history} 
     WHERE name = :name 
     ORDER BY date DESC 
     LIMIT 1`,
    { name }
  );
  
  if (result.length > 0) {
    return result[0];
  }
  
  // Try case-insensitive search
  result = await query<HistoryEntry[]>(
    `SELECT * FROM ${TABLES.history} 
     WHERE LOWER(name) = LOWER(:name) 
     ORDER BY date DESC 
     LIMIT 1`,
    { name }
  );
  
  return result[0] || null;
}

/**
 * Search for a player by UUID
 */
export async function searchPlayerByUuid(uuid: string): Promise<HistoryEntry | null> {
  const result = await query<HistoryEntry[]>(
    `SELECT * FROM ${TABLES.history} 
     WHERE uuid = :uuid 
     ORDER BY date DESC 
     LIMIT 1`,
    { uuid }
  );
  
  return result[0] || null;
}

/**
 * Get player statistics
 */
export async function getPlayerStats(uuid: string): Promise<PlayerStats | null> {
  const name = await getPlayerName(uuid);
  if (!name) return null;
  
  // Get all stats in a single optimized query
  const statsResult = await query<RowDataPacket[]>(
    `SELECT 
      (SELECT COUNT(*) FROM ${TABLES.bans} WHERE uuid = :uuid) as totalBans,
      (SELECT COUNT(*) FROM ${TABLES.bans} WHERE uuid = :uuid AND active = 1) as activeBans,
      (SELECT COUNT(*) FROM ${TABLES.mutes} WHERE uuid = :uuid) as totalMutes,
      (SELECT COUNT(*) FROM ${TABLES.mutes} WHERE uuid = :uuid AND active = 1) as activeMutes,
      (SELECT COUNT(*) FROM ${TABLES.warnings} WHERE uuid = :uuid) as totalWarnings,
      (SELECT COUNT(*) FROM ${TABLES.warnings} WHERE uuid = :uuid AND active = 1) as activeWarnings,
      (SELECT COUNT(*) FROM ${TABLES.kicks} WHERE uuid = :uuid) as totalKicks`,
    { uuid }
  );
  
  // Get first and last seen
  const seenResult = await query<RowDataPacket[]>(
    `SELECT MIN(date) as firstSeen, MAX(date) as lastSeen 
     FROM ${TABLES.history} 
     WHERE uuid = :uuid`,
    { uuid }
  );
  
  const stats = statsResult[0] as any;
  const seen = seenResult[0] as any;
  
  return {
    uuid,
    name,
    totalBans: stats.totalBans,
    totalMutes: stats.totalMutes,
    totalWarnings: stats.totalWarnings,
    totalKicks: stats.totalKicks,
    activeBans: stats.activeBans,
    activeMutes: stats.activeMutes,
    activeWarnings: stats.activeWarnings,
    firstSeen: seen.firstSeen,
    lastSeen: seen.lastSeen,
  };
}

/**
 * Get staff statistics
 */
export async function getStaffStats(uuid: string): Promise<StaffStats | null> {
  const name = await getPlayerName(uuid);
  if (!name) return null;
  
  const statsResult = await query<RowDataPacket[]>(
    `SELECT 
      (SELECT COUNT(*) FROM ${TABLES.bans} WHERE banned_by_uuid = :uuid) as totalBansIssued,
      (SELECT COUNT(*) FROM ${TABLES.mutes} WHERE banned_by_uuid = :uuid) as totalMutesIssued,
      (SELECT COUNT(*) FROM ${TABLES.warnings} WHERE banned_by_uuid = :uuid) as totalWarningsIssued,
      (SELECT COUNT(*) FROM ${TABLES.kicks} WHERE banned_by_uuid = :uuid) as totalKicksIssued`,
    { uuid }
  );
  
  const stats = statsResult[0] as any;
  
  return {
    uuid,
    name,
    totalBansIssued: stats.totalBansIssued,
    totalMutesIssued: stats.totalMutesIssued,
    totalWarningsIssued: stats.totalWarningsIssued,
    totalKicksIssued: stats.totalKicksIssued,
  };
}

/**
 * Get global statistics (for dashboard)
 */
export async function getGlobalStats(): Promise<{
  totalBans: number;
  totalMutes: number;
  totalWarnings: number;
  totalKicks: number;
  activeBans: number;
  activeMutes: number;
}> {
  const result = await query<RowDataPacket[]>(
    `SELECT 
      (SELECT COUNT(*) FROM ${TABLES.bans}) as totalBans,
      (SELECT COUNT(*) FROM ${TABLES.bans} WHERE active = 1) as activeBans,
      (SELECT COUNT(*) FROM ${TABLES.mutes}) as totalMutes,
      (SELECT COUNT(*) FROM ${TABLES.mutes} WHERE active = 1) as activeMutes,
      (SELECT COUNT(*) FROM ${TABLES.warnings}) as totalWarnings,
      (SELECT COUNT(*) FROM ${TABLES.kicks}) as totalKicks`,
    {}
  );
  
  return result[0] as any;
}

// Helper functions
function getTableForType(type: PunishmentType): string {
  switch (type) {
    case 'ban': return TABLES.bans;
    case 'mute': return TABLES.mutes;
    case 'warning': return TABLES.warnings;
    case 'kick': return TABLES.kicks;
  }
}

function createPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  perPage: number
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / perPage);
  return {
    data,
    total,
    page,
    perPage,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
