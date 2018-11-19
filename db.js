const spicedPg = require("spiced-pg");
const db = spicedPg(
  /////change the name under///////
  process.env.DATABASE_URL ||
    `postgres:postgres:anneanneanne@localhost:5432/images`
);

exports.getdata = function() {
  return db.query(`SELECT * FROM images`);
};
