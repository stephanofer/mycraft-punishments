/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `litebans_allow`;
CREATE TABLE `litebans_allow` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` binary(16) NOT NULL,
  `type` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `litebans_bans`;
CREATE TABLE `litebans_bans` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `ip` varchar(45) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `reason` varchar(2048) DEFAULT NULL,
  `banned_by_uuid` varchar(36) NOT NULL,
  `banned_by_name` varchar(128) DEFAULT NULL,
  `removed_by_uuid` varchar(36) DEFAULT NULL,
  `removed_by_name` varchar(128) DEFAULT NULL,
  `removed_by_reason` varchar(2048) DEFAULT NULL,
  `removed_by_date` timestamp NULL DEFAULT NULL,
  `time` bigint(20) NOT NULL,
  `until` bigint(20) NOT NULL,
  `template` tinyint(3) unsigned NOT NULL DEFAULT 255,
  `server_scope` varchar(32) DEFAULT NULL,
  `server_origin` varchar(32) DEFAULT NULL,
  `silent` bit(1) NOT NULL,
  `ipban` bit(1) NOT NULL,
  `ipban_wildcard` bit(1) NOT NULL DEFAULT b'0',
  `active` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `idx_litebans_bans_template` (`template`),
  KEY `idx_litebans_bans_ipban_wildcard` (`ipban_wildcard`),
  KEY `idx_litebans_bans_uuid` (`uuid`),
  KEY `idx_litebans_bans_ip` (`ip`),
  KEY `idx_litebans_bans_banned_by_uuid` (`banned_by_uuid`),
  KEY `idx_litebans_bans_time` (`time`),
  KEY `idx_litebans_bans_until` (`until`),
  KEY `idx_litebans_bans_ipban` (`ipban`),
  KEY `idx_litebans_bans_active` (`active`)
) ENGINE=InnoDB AUTO_INCREMENT=601 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `litebans_cache8k`;
CREATE TABLE `litebans_cache8k` (
  `id` tinyint(3) unsigned NOT NULL,
  `b` blob NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `litebans_config`;
CREATE TABLE `litebans_config` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `version` varchar(128) NOT NULL,
  `build` varchar(128) NOT NULL,
  `timezone` varchar(64) NOT NULL DEFAULT '+00:00',
  `accept` tinyint(3) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `litebans_history`;
CREATE TABLE `litebans_history` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `date` timestamp NULL DEFAULT current_timestamp(),
  `name` varchar(16) DEFAULT NULL,
  `uuid` varchar(36) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `idx_litebans_history_uuid` (`uuid`),
  KEY `idx_litebans_history_name` (`name`),
  KEY `idx_litebans_history_ip` (`ip`)
) ENGINE=InnoDB AUTO_INCREMENT=6992 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `litebans_kicks`;
CREATE TABLE `litebans_kicks` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `ip` varchar(45) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `reason` varchar(2048) DEFAULT NULL,
  `banned_by_uuid` varchar(36) NOT NULL,
  `banned_by_name` varchar(128) DEFAULT NULL,
  `time` bigint(20) NOT NULL,
  `until` bigint(20) NOT NULL,
  `template` tinyint(3) unsigned NOT NULL DEFAULT 255,
  `server_scope` varchar(32) DEFAULT NULL,
  `server_origin` varchar(32) DEFAULT NULL,
  `silent` bit(1) NOT NULL,
  `ipban` bit(1) NOT NULL,
  `ipban_wildcard` bit(1) NOT NULL DEFAULT b'0',
  `active` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `idx_litebans_kicks_template` (`template`),
  KEY `idx_litebans_kicks_ipban_wildcard` (`ipban_wildcard`),
  KEY `idx_litebans_kicks_uuid` (`uuid`),
  KEY `idx_litebans_kicks_ip` (`ip`),
  KEY `idx_litebans_kicks_banned_by_uuid` (`banned_by_uuid`),
  KEY `idx_litebans_kicks_time` (`time`),
  KEY `idx_litebans_kicks_until` (`until`),
  KEY `idx_litebans_kicks_ipban` (`ipban`),
  KEY `idx_litebans_kicks_active` (`active`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `litebans_mutes`;
CREATE TABLE `litebans_mutes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `ip` varchar(45) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `reason` varchar(2048) DEFAULT NULL,
  `banned_by_uuid` varchar(36) NOT NULL,
  `banned_by_name` varchar(128) DEFAULT NULL,
  `removed_by_uuid` varchar(36) DEFAULT NULL,
  `removed_by_name` varchar(128) DEFAULT NULL,
  `removed_by_reason` varchar(2048) DEFAULT NULL,
  `removed_by_date` timestamp NULL DEFAULT NULL,
  `time` bigint(20) NOT NULL,
  `until` bigint(20) NOT NULL,
  `template` tinyint(3) unsigned NOT NULL DEFAULT 255,
  `server_scope` varchar(32) DEFAULT NULL,
  `server_origin` varchar(32) DEFAULT NULL,
  `silent` bit(1) NOT NULL,
  `ipban` bit(1) NOT NULL,
  `ipban_wildcard` bit(1) NOT NULL DEFAULT b'0',
  `active` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `idx_litebans_mutes_template` (`template`),
  KEY `idx_litebans_mutes_ipban_wildcard` (`ipban_wildcard`),
  KEY `idx_litebans_mutes_uuid` (`uuid`),
  KEY `idx_litebans_mutes_ip` (`ip`),
  KEY `idx_litebans_mutes_banned_by_uuid` (`banned_by_uuid`),
  KEY `idx_litebans_mutes_time` (`time`),
  KEY `idx_litebans_mutes_until` (`until`),
  KEY `idx_litebans_mutes_ipban` (`ipban`),
  KEY `idx_litebans_mutes_active` (`active`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `litebans_servers`;
CREATE TABLE `litebans_servers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `uuid` varchar(32) NOT NULL,
  `date` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `litebans_sync`;
CREATE TABLE `litebans_sync` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `info` int(10) unsigned NOT NULL,
  `msg` varchar(4096) NOT NULL,
  `time` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2783 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `litebans_warnings`;
CREATE TABLE `litebans_warnings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `ip` varchar(45) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `reason` varchar(2048) DEFAULT NULL,
  `banned_by_uuid` varchar(36) NOT NULL,
  `banned_by_name` varchar(128) DEFAULT NULL,
  `removed_by_uuid` varchar(36) DEFAULT NULL,
  `removed_by_name` varchar(128) DEFAULT NULL,
  `removed_by_reason` varchar(2048) DEFAULT NULL,
  `removed_by_date` timestamp NULL DEFAULT NULL,
  `time` bigint(20) NOT NULL,
  `until` bigint(20) NOT NULL,
  `template` tinyint(3) unsigned NOT NULL DEFAULT 255,
  `server_scope` varchar(32) DEFAULT NULL,
  `server_origin` varchar(32) DEFAULT NULL,
  `silent` bit(1) NOT NULL,
  `ipban` bit(1) NOT NULL,
  `ipban_wildcard` bit(1) NOT NULL DEFAULT b'0',
  `active` bit(1) NOT NULL,
  `warned` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `idx_litebans_warnings_template` (`template`),
  KEY `idx_litebans_warnings_ipban_wildcard` (`ipban_wildcard`),
  KEY `idx_litebans_warnings_uuid` (`uuid`),
  KEY `idx_litebans_warnings_ip` (`ip`),
  KEY `idx_litebans_warnings_banned_by_uuid` (`banned_by_uuid`),
  KEY `idx_litebans_warnings_time` (`time`),
  KEY `idx_litebans_warnings_until` (`until`),
  KEY `idx_litebans_warnings_ipban` (`ipban`),
  KEY `idx_litebans_warnings_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;