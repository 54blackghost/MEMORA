export interface PhotoUploadInput {
  file: File;
  memoryId: string;
}

export interface StoredPhoto {
  id: string;
  url: string;
  width?: number;
  height?: number;
  mimeType?: string;
  sizeBytes?: number;
  storageKey?: string;
}

export interface PhotoStorage {
  upload(input: PhotoUploadInput): Promise<StoredPhoto>;
  remove(storageKey: string): Promise<void>;
}

/**
 * Browser-only adapter kept behind an interface until the backend/object storage exists.
 * Do not persist the returned data URL in production localStorage.
 */
export const legacyDataUrlPhotoStorage: PhotoStorage = {
  async upload({ file }) {
    const url = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error ?? new Error("Unable to read image"));
      reader.readAsDataURL(file);
    });
    return { id: crypto.randomUUID(), url, mimeType: file.type, sizeBytes: file.size };
  },
  async remove() {},
};
