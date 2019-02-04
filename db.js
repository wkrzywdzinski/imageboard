const spicedPg = require("spiced-pg");
const db = spicedPg(
  process.env.DATABASE_URL ||
    `postgres:postgres:anneanneanne@localhost:5432/images`
);

/// gets the first 9 images
exports.getdata = function() {
  return db.query(
    `SELECT * FROM images
    ORDER BY id DESC
    LIMIT 9`
  );
};

/// gets picture by ID
exports.getpicture = id => {
  return db.query(
    `SELECT images.id, url, username, commentusername, title, description, comment
        FROM images
        LEFT JOIN comments
        ON images.id = comments.imageid
        WHERE images.id = $1
        ORDER BY comments.id DESC`,
    [id]
  );
};

/// gets more pictures
exports.getmoreimages = id => {
  return db.query(
    `SELECT *, (
      SELECT ID AS last_id FROM images WHERE ID = 5
    )
        FROM images
        WHERE ID < $1
        ORDER BY id DESC
        LIMIT 9`,
    [id]
  );
};

/// picture upload
exports.insertdata = function(url, username, title, description) {
  return db.query(
    `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING id, url, username, title, description`,
    [url || null, username || null, title || null, description || null]
  );
};

/// comment
exports.insertcomment = function(imageid, commentusername, comment) {
  return db.query(
    `INSERT INTO comments (imageid, commentusername, comment)
        VALUES ($1, $2, $3)
        RETURNING id, imageid, commentusername, comment`,
    [imageid || null, commentusername || null, comment || null]
  );
};
