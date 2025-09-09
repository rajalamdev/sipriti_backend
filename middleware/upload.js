const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/proposals");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.fieldname + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Hanya file PDF yang diperbolehkan"), false);
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
