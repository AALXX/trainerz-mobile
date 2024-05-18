DROP TABLE IF EXISTS `ratings`;

CREATE TABLE `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `UserToken` text COLLATE utf8mb4_general_ci NOT NULL,
  `AccountViews` int COLLATE utf8mb4_general_ci NOT NULL,
  `Rating` int COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;