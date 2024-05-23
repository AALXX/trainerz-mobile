DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `UserName` varchar(30) NOT NULL,
  `Description` varchar(150) NOT NULL,
  `BirthDate` varchar(60) NOT NULL,
  `LocationCountry` varchar(40) NOT NULL,
  `LocationCity` varchar(40) NOT NULL,
  `Sport` varchar(30) NOT NULL,
  `UserEmail` varchar(50) NOT NULL,
  `PhoneNumber` varchar(50) NOT NULL,
  `UserPwd` varchar(80) NOT NULL,
  `UserVisibility` VARCHAR(255) NOT NULL DEFAULT 'public',
  `AccountType` varchar(80) NOT NULL,
  `UserPrivateToken` varchar(150) NOT NULL,
  `UserPublicToken` varchar(150) NOT NULL,
  `AccountPrice` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

