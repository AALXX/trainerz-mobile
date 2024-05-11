    DROP TABLE IF EXISTS `videos_categoriy_alloc`;

    CREATE TABLE videos_categoriy_alloc (
        id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        VideoToken VARCHAR(150) NOT NULL,
        SportName VARCHAR(50) NOT NULL
    );