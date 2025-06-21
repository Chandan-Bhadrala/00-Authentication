// Path pkg helps to preserve the user file extension in the stored file.

// dirname, is used because, multer uses path to store the file in respect to the place from where Node JS process has been started. If NodeJS process is started from the root like "node server/index.js", multer will store file into a different place.

// Similarly, if Node JS process is started from client or server using "node ../server/index.js" or "node index.js". Multer will store the file in a different location as multer refers to the node process to calculate the folder/file path to store the file.

// So, using __dirname to create a file storage path. Will create a path exactly relative to the point from where the script is running. Thus, we use dirname. As __dirname is a file point from where script is running.

import multer from "multer";
import path from "path";

// Below import & concerned variable declarations are used because __dirname is not available directly in the ES Modules ("type": "module"). As __dirname is a part of the commonJS module system.
import { fileURLToPath } from "url"; // <--- Import from 'url'

// Get the equivalent of __filename for the current module
const __filename = fileURLToPath(import.meta.url);

// Get the equivalent of __dirname for the current module
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // __dirname is 'path/to/your/project-root/server/utils'
    // '..' goes up to 'path/to/your/project-root/server'
    // then 'tmp' and 'my-uploads'
    cb(null, path.join(__dirname, "..", "tmp", "my-uploads"));
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // ← get extension
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    // Example: avatar-17185612123.png
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 2 }, // Example: Limit to 2 MB

  // Only allows file types as enclosed by RegEx. test is a RegEx method similar to string includes method.
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
    if (allowed.test(ext) && allowed.test(mime)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});
