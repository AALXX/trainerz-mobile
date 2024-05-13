DROP TABLE IF EXISTS `videos`;

CREATE TABLE `videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `VideoTitle` tinytext NOT NULL,
  `VideoDescription` varchar(40) NOT NULL DEFAULT "",
  `PublishDate` date NOT NULL,
  `VideoPrice` int(11) DEFAULT 0,
  `VideoToken` varchar(150) NOT NULL,
  `OwnerToken` varchar(150) NOT NULL,
  `Visibility` varchar(10) DEFAULT 'public',
  `Views` int NOT NULL DEFAULT 0,
  `BasePrice` int(2) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;