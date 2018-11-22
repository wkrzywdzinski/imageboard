const spicedPg = require("spiced-pg");
const db = spicedPg(
  /////change the name under///////
  process.env.DATABASE_URL ||
    `postgres:postgres:anneanneanne@localhost:5432/images`
);

exports.getdata = function() {
  return db.query(
    `SELECT * FROM images
    ORDER BY id DESC
    LIMIT 9`
  );
};
exports.getpicture = id => {
  return db.query(
    `SELECT *
        FROM images
        WHERE ID = $1`,
    [id]
  );
};
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
exports.insertdata = function(url, username, title, description) {
  return db.query(
    `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING id, url, username, title, description`,
    [url || null, username || null, title || null, description || null]
  );
};
