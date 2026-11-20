import express from "express";
import fs from "fs/promises";
import upload from "../utils/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getVideoUploadSignature, uploadVideo } from "../utils/cloudinary.js";

const router = express.Router();

// Preferred: the browser asks for a signature, then uploads the video directly
// to Cloudinary. This is roughly twice as fast as sending it through our server.
router.route("/upload-signature").get(isAuthenticated, (req, res) => {
    try {
        return res.status(200).json({ success: true, ...getVideoUploadSignature() });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Could not prepare upload." });
    }
});

// Fallback: upload through the server (used if the direct upload is blocked).
router.route("/upload-video").post(isAuthenticated, upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Please choose a video file." });
    }
    try {
        const result = await uploadVideo(req.file.path);
        return res.status(200).json({
            success: true,
            message: "Video uploaded successfully.",
            data: { ...result, url: result.secure_url },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error uploading video." });
    } finally {
        // Always remove the temp file so the disk doesn't fill up
        fs.unlink(req.file.path).catch(() => {});
    }
});

export default router;
