DROP TABLE IF EXISTS `photos`;

CREATE TABLE `photos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `PublishDate` date NOT NULL,
  `Description` varchar(50),
  `PhotoToken` varchar(150) NOT NULL,
  `OwnerToken` varchar(150) NOT NULL,
  `Visibility` varchar(10) DEFAULT 'public',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;