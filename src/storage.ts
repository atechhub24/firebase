import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  getStorage,
} from "firebase/storage";
import { getApps, getApp } from "firebase/app";

export async function uploadFile({
  file,
  path,
  metadata,
  onProgress,
  uploadedBy = "anonymous",
}: {
  file: File;
  path: string;
  metadata?: Record<string, string>;
  onProgress?: (progress: number) => void;
  uploadedBy?: string;
}) {
  if (getApps().length === 0) {
    throw new Error("Firebase not initialized");
  }
  const app = getApp();
  const storage = getStorage(app);
  // Create a storage reference
  const storageRef = ref(storage, path);

  // Create file metadata including content type and custom metadata
  const customMetadata = {
    ...metadata,
    uploadedBy,
    uploadedAt: new Date().toISOString(),
  };

  // Start upload
  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
    customMetadata,
  });

  // Return a promise that resolves when the upload is complete
  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      // Progress callback
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        // Call the onProgress callback if provided
        if (onProgress) {
          onProgress(progress);
        }

        console.log("Upload is " + progress + "% done");
      },
      // Error callback
      (error) => {
        console.error("Upload failed:", error);
        reject(error);
      },
      // Complete callback
      async () => {
        try {
          // Get download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const metadata = await getMetadata(uploadTask.snapshot.ref);

          resolve({
            url: downloadURL,
            path: path,
            name: file.name,
            type: file.type,
            size: file.size,
            metadata: metadata.customMetadata,
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

export async function deleteFile(path: string) {
  if (getApps().length === 0) {
    throw new Error("Firebase not initialized");
  }
  const app = getApp();
  const storage = getStorage(app);
  const storageRef = ref(storage, path);
  return deleteObject(storageRef);
}

export async function listFiles(path: string) {
  if (getApps().length === 0) {
    throw new Error("Firebase not initialized");
  }
  const app = getApp();
  const storage = getStorage(app);
  const storageRef = ref(storage, path);
  const result = await listAll(storageRef);

  // Get metadata and download URLs for all items
  const filePromises = result.items.map(async (itemRef) => {
    try {
      const url = await getDownloadURL(itemRef);
      const metadata = await getMetadata(itemRef);

      return {
        name: itemRef.name,
        path: itemRef.fullPath,
        url,
        contentType: metadata.contentType,
        size: metadata.size,
        timeCreated: metadata.timeCreated,
        customMetadata: metadata.customMetadata,
      };
    } catch (error) {
      console.error(`Error getting metadata for ${itemRef.fullPath}`, error);
      return {
        name: itemRef.name,
        path: itemRef.fullPath,
        error: "Failed to load metadata",
      };
    }
  });

  return Promise.all(filePromises);
}

export const file = {
  upload: uploadFile,
  delete: deleteFile,
  list: listFiles,
};
