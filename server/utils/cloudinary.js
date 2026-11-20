import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    cloud_name: process.env.CLOUD_NAME,
});

export const uploadMedia = async (file) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(file, {
            resource_type: "auto",
        });
        return uploadResponse;
    } catch (error) {
        console.log(error);
    }
};
// Uploads a video from a temp file in chunks (works for files over 100MB).
export const uploadVideo = (filePath) =>
    new Promise((resolve, reject) => {
        cloudinary.uploader.upload_large(
            filePath,
            { resource_type: "video", folder: LECTURE_FOLDER, chunk_size: 20 * 1024 * 1024 },
            (error, result) => (error ? reject(error) : resolve(result))
        );
    });

export const LECTURE_FOLDER = "lms/lectures";

// Signature that lets the browser upload a lecture video straight to
// Cloudinary (no double upload through our server). Valid for ~1 hour.
export const getVideoUploadSignature = () => {
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = { timestamp, folder: LECTURE_FOLDER };
    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.API_SECRET);
    return {
        timestamp,
        signature,
        folder: LECTURE_FOLDER,
        apiKey: process.env.API_KEY,
        cloudName: process.env.CLOUD_NAME,
    };
};

export const deleteMediaFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log(error);
    }
};

export const deleteVideoFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    } catch (error) {
        console.log(error);

    }
}
