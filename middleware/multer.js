const multer = require('multer');

const path = require('path');
const fs = require('fs');
const { dirname } = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const __dirname = dirname(__filename);
    const dir = path.join(__dirname, '../uploads');
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    } catch (err) {
      console.log(err);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const extensions = file.originalname.toString().split('.');
    const extension = extensions[extensions.length - 1];
    const fileName = `${Date.now()}.${extension}`;
    cb(null, fileName);
  },
});

module.exports = multer({ storage });
// // ------------------ Used to upload data through multer ---------------------
// const upload = catchAsync(async (req, res) => {
//   try {
//     if (req.file) {
//       const data = `${process.env.BACKEND_URL}/${req.file.filename}`;
//       return res.status(200).json({
//         status: 200,
//         message: "Image uploaded successfully",
//         file: data,
//       });
//     }
//     return res.status(400).json({
//       status: 400,
//       message: "File does not exist !",
//       file: {},
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 500,
//       message: "An error occurred while adding employee data",
//       error: error.message,
//       stack: error.stack,
//     });
//   }
// });
