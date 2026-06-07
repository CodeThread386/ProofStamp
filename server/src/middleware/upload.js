const multer = require('multer');
const { validateFileMagic } = require('../utils/fileMagic');

const MAX_SIZE = 100 * 1024 * 1024;

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
});

function validateUploadedMagic(req, res, next) {
  const files = req.files || (req.file ? [req.file] : []);
  for (const file of files) {
    const check = validateFileMagic(file.buffer, file.mimetype);
    if (!check.ok) {
      return res.status(415).json({ error: check.error });
    }
    if (check.mime && check.mime !== file.mimetype) {
      file.mimetype = check.mime;
    }
  }
  next();
}

module.exports = upload;
module.exports.validateUploadedMagic = validateUploadedMagic;
