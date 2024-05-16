DROP TABLE IF EXISTS `watched_videos`;

CREATE TABLE `watched_videos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ownerToken` text COLLATE utf8mb4_general_ci NOT NULL,
  `videoToken` text COLLATE utf8mb4_general_ci NOT NULL,
  `watchTime` int COLLATE utf8mb4_general_ci ,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;