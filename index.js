const express = require("express");
const app = express();
const db = require("./db");
app.use(express.static("./public"));
//////////////////////get////////////////////////
app.get("/get-info", (req, res) => {
  db.getdata().then(function(results) {
    res.json(results.rows);
  });
});
////////////////////////downsection/////////////////////
app.listen(8080, () => console.log("listening 8080"));
