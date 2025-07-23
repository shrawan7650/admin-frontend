// lib/uploadImageToCloudinary.ts (Recommended location)

const uploadImageToCloudinary = async (file: File, folder: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch("/api/cloudinary/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await res.json();

    if (!data.secure_url) {
      throw new Error("Invalid Cloudinary response");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};

export default uploadImageToCloudinary;
