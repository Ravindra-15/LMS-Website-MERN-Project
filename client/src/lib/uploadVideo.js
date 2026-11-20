import axios from "axios";

const MEDIA_API = "http://localhost:8080/api/v1/media";
const CHUNK_SIZE = 20 * 1024 * 1024; // 20 MB per request

/**
 * Upload a lecture video directly from the browser to Cloudinary.
 * The server only signs the request, so the file is sent once instead of
 * twice (browser -> server -> Cloudinary). Large files go up in chunks.
 *
 * Falls back to uploading through our server if the direct upload fails
 * before any data was sent (e.g. a network policy blocks Cloudinary).
 *
 * @returns {Promise<{ videoUrl: string, publicId: string }>}
 */
export async function uploadLectureVideo(file, { onProgress, signal } = {}) {
  try {
    return await uploadDirect(file, { onProgress, signal });
  } catch (error) {
    if (axios.isCancel(error) || error?.name === "CanceledError") throw error;
    console.warn("Direct upload failed, falling back to server upload:", error);
    return uploadViaServer(file, { onProgress, signal });
  }
}

async function uploadDirect(file, { onProgress, signal }) {
  const { data: sig } = await axios.get(`${MEDIA_API}/upload-signature`, {
    withCredentials: true,
    signal,
  });

  const url = `https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`;
  const uploadId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const total = file.size;
  let result = null;

  for (let start = 0; start < total; start += CHUNK_SIZE) {
    const end = Math.min(start + CHUNK_SIZE, total);
    const form = new FormData();
    form.append("file", file.slice(start, end), file.name);
    form.append("api_key", sig.apiKey);
    form.append("timestamp", sig.timestamp);
    form.append("signature", sig.signature);
    form.append("folder", sig.folder);

    const headers =
      total > CHUNK_SIZE
        ? {
            "X-Unique-Upload-Id": uploadId,
            "Content-Range": `bytes ${start}-${end - 1}/${total}`,
          }
        : {};

    const res = await axios.post(url, form, {
      headers,
      signal,
      onUploadProgress: ({ loaded }) => {
        // Cap at 99% until Cloudinary confirms the final chunk
        const percent = Math.round(((start + Math.min(loaded, end - start)) / total) * 100);
        onProgress?.(Math.min(percent, 99));
      },
    });
    result = res.data;
  }

  if (!result?.secure_url || !result?.public_id) {
    throw new Error("Cloudinary did not return a video URL");
  }
  onProgress?.(100);
  return { videoUrl: result.secure_url, publicId: result.public_id };
}

async function uploadViaServer(file, { onProgress, signal }) {
  const form = new FormData();
  form.append("file", file);
  const res = await axios.post(`${MEDIA_API}/upload-video`, form, {
    withCredentials: true,
    signal,
    onUploadProgress: ({ loaded, total }) => {
      // The server still has to forward the file to Cloudinary after this
      onProgress?.(Math.min(Math.round((loaded * 100) / (total || file.size)), 95));
    },
  });
  if (!res.data?.success) throw new Error(res.data?.message || "Upload failed");
  onProgress?.(100);
  return { videoUrl: res.data.data.url, publicId: res.data.data.public_id };
}
