const express = require("express");
const cors = require("cors");
const multer = require("multer");
const zlib = require("zlib");
let fs = require("fs");
let path = require("path");
var app = express();
app.use(cors());
var port = process.env.PORT || 5000;
// -------------------------------------------- //
var storage = multer.memoryStorage();
var upload = multer({
  storage: storage,
});
// -------------------------------------------- //
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
app.post("/compress", upload.single("files"), async (req, res) => {
  try {
    const destination = `compressed/${req.file.originalname}.gz`;
    let fileBuffer = req.file.buffer;
    await zlib.gzip(fileBuffer, (err, response) => {
      if (err) console.log(err);
      fs.writeFile(path.join(__dirname, destination), response, (err, data) => {
        if (err) console.log(err);
        res.download(path.join(__dirname, destination));
      });
    });
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});
