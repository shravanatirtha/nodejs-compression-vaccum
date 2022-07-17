const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const zlib = require("zlib");
let fs = require("fs");
let path = require("path");
var app = express();
app.use(cors());
var port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// -------------------------------------------- //
var storage = multer.memoryStorage();
var upload = multer({
    dest: "./upload",
  storage: storage,
});
// -------------------------------------------- //

app.post("/compress", upload.single("file"), async (req, res) => {
  try {
    const destination = `upload/${req.file.originalname}.gz`;
    let fileBuffer = req.file.buffer;
    await zlib.gzip(fileBuffer, (err, response) => {
      if (err) {
        console.log(err);
      }
      fs.writeFile(path.join(__dirname, destination), response, (err, data) => {
        if (err) {
          console.log(err);
        }
        res.download(path.join(__dirname, destination));
      });
    });
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});