    DROP TABLE IF EXISTS `videos_categoriy_alloc`;

    CREATE TABLE videos_categoriy_alloc (
        id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        VideoToken VARCHAR(150) NOT NULL,
        SportName VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;