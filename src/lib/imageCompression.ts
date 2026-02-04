/**
 * Compresses an image file and returns a base64 data URL.
 *
 * Strategy:
 * - Keep good visual quality first (higher resolution + quality).
 * - If the encoded image is still large, progressively reduce quality
 *   until it fits under the target size.
 *
 * This keeps a single stored image per photo while avoiding very
 * blurry results and also protecting localStorage from huge files.
 */
export async function compressImage(
  file: File | Blob,
  maxWidth = 1400,
  maxHeight = 1400,
  initialQuality = 0.9,
  maxSizeKB = 350, // soft cap per photo
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Draw with white background (for transparency)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Start with high quality, then step down if the file is too big
        let quality = initialQuality;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        let sizeKB = getBase64SizeKB(dataUrl);

        while (sizeKB > maxSizeKB && quality > 0.5) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          sizeKB = getBase64SizeKB(dataUrl);
        }

        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Re-compress an existing base64 image string for archival purposes.
 * Used when a case has been closed and inactive for a long time.
 */
export async function recompressDataUrl(
  dataUrl: string,
  maxWidth = 1200,
  maxHeight = 1200,
  initialQuality = 0.85,
  maxSizeKB = 220,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      let quality = initialQuality;
      let archivedDataUrl = canvas.toDataURL('image/jpeg', quality);
      let sizeKB = getBase64SizeKB(archivedDataUrl);

      while (sizeKB > maxSizeKB && quality > 0.5) {
        quality -= 0.1;
        archivedDataUrl = canvas.toDataURL('image/jpeg', quality);
        sizeKB = getBase64SizeKB(archivedDataUrl);
      }

      resolve(archivedDataUrl);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Estimates the size of a base64 string in KB
 */
export function getBase64SizeKB(base64: string): number {
  // Base64 increases size by ~33%, plus the data URL prefix
  const base64Length = base64.length - (base64.indexOf(',') + 1);
  const sizeBytes = (base64Length * 3) / 4;
  return Math.round(sizeBytes / 1024);
}
