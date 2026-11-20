import multer from "multer";
import os from "os";

// Store uploads in the OS temp folder (routes delete them after use).
const upload = multer({
    dest: os.tmpdir(),
    limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2 GB
});

export default upload;
