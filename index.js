const express = require("express");
const app = express();
const db = require("./db");
const s3 = require("./s3");
const config = require("./config.json");
app.use(express.static("./public"));
app.use(express.static("./uploads"));
///////////////////upload file///////////////////
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  filename: function(req, file, callback) {
    //codes the file name to have unique///////
    uidSafe(24).then(function(uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  }
});
//sets limit/////////
var uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152
  }
});
//////////////////////get////////////////////////
app.get("/get-info", (req, res) => {
  db.getdata().then(function(results) {
    res.json(results.rows);
  });
});
////////////////////post///////////////////
app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
  let fullurl = config.s3Url + req.file.filename;
  if (req.file) {
    db.insertdata(
      fullurl,
      req.body.username,
      req.body.title,
      req.body.description
    ).then(function(results) {
      res.json(results.rows);
    });
  } else {
    res.json({
      success: false
    });
  }
});
////////////////////////downsection/////////////////////
app.listen(8080, () => console.log("listening 8080"));
