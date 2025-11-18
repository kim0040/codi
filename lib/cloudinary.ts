import { v2 as cloudinary } from 'cloudinary';

let configured = false;

export function configureCloudinary() {
  if (configured) return;
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    configured = true;
  }
}

export function createUploadSignature(folder = 'codingmaker') {
  configureCloudinary();
  if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary 환경 변수가 설정되지 않았습니다.');
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, process.env.CLOUDINARY_API_SECRET);
  return { timestamp, signature, folder };
}

export async function deleteResource(publicId: string) {
  configureCloudinary();
  if (!configured) return;
  await cloudinary.uploader.destroy(publicId);
}
