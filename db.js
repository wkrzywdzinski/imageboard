const spicedPg = require("spiced-pg");
const db = spicedPg(
  /////change the name under///////
  process.env.DATABASE_URL ||
    `postgres:postgres:anneanneanne@localhost:5432/images`
);

exports.getdata = function() {
  return db.query(`SELECT * FROM images`);
};
exports.insertdata = function(url, username, title, description) {
  return db.query(
    `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING url, username, title, description`,
    [url || null, username || null, title || null, description || null]
  );
};
