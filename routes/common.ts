import multer from 'multer';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads")
  }, 
  filename: (req,file, cb) =>{
    cb(null, req.body.name);
  }
});

const upload = multer({storage: storage})

export default upload;

// import path from 'path';

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     const fileExtension = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
//   }
// });

// const fileFilter = (req:any, file:any, cb:any) => {
//   const allowedFileTypes = ['application/vnd.ms-powerpoint', 'application/pdf', 'application/msword'];
//   if (allowedFileTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Le type de fichier n\'est pas autorisé'));
//   }
// };

// const upload = multer({ storage, fileFilter , limits: { fileSize: 10000000 }});

// export default upload;