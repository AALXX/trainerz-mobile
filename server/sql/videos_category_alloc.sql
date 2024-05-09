DROP TABLE IF EXISTS `videos_categoriy_alloc`;

CREATE TABLE videos_categoriy_alloc (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    VideoToken VARCHAR(150) NOT NULL,
    CategoryId int NOT NULL,
);