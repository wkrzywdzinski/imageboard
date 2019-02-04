DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR(300) NOT NULL,
    username VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS comments;
CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    imageid INTEGER NOT NULL,
    commentusername VARCHAR(255) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3 preview pictures

INSERT INTO images (url, username, title, description) VALUES (
    'https://www.morebusiness.com/wp-content/uploads/2016/02/free-stock-photos-696x522.jpg',
    'turtlelover',
    'A turtle',
    'I love turles.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://www.stockvault.net/data/2009/07/22/109588/thumb16.jpg',
    'autumnlover',
    'autumn leaves',
    'i like the colors.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://mymodernmet.com/wp/wp-content/uploads/2018/05/free-image-downloads.jpg',
    'kitelover',
    'whale kite',
    'it is impressive.'
);
