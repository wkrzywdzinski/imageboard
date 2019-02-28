const express = require("express");
const app = express();
const db = require("./db");
const s3 = require("./s3");
const bodyParser = require("body-parser");
const config = require("./config.json");
app.use(bodyParser.json());
app.use(express.static("./public"));
app.use(express.static("./uploads"));

/////////////////// FILE UPLOAD ///////////////////

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

///sets limit
var uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152
  }
});

//////////////////////GET ROUTES////////////////////////

///gets all the valid infos to show website
app.get("/get-info", (req, res) => {
  db.getdata().then(function(results) {
    res.json(results.rows);
  });
});

///gets picture by ID
app.get("/get-picture/:id", function(req, res) {
  db.getpicture(req.params.id).then(function(results) {
    if (results.rows[0]) {
      res.json(results.rows);
    } else {
      res.json([
        {
          id: 0,
          title: "IMAGE NOT FOUND",
          username: "imagenotfound",
          url: "notfound.jpg"
        }
      ]);
    }
  });
});

/// gets more pictures after user clicks button
app.get("/getmoreimages/:id", function(req, res) {
  db.getmoreimages(req.params.id).then(function(results) {
    res.json(results.rows);
  });
});

//////////////////////POST ROUTES////////////////////////

/// image upload
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

///image comment
app.post("/comment", function(req, res) {
  db.insertcomment(
    req.body.imageid,
    req.body.commentusername,
    req.body.comment
  ).then(function(results) {
    res.json(results.rows);
  });
});
////////////////////////server setup/////////////////////
app.listen(process.env.PORT || 8080, () => {
  console.log("listening 8080");
});
