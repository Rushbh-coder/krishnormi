function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.crossOrigin = 'anonymous';
    image.src = url;
  });
}

/** Draws the cropped pixel area of an image onto a canvas and returns it as a Blob. */
export async function getCroppedImageBlob(imageSrc, cropPixels, mimeType = 'image/jpeg') {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(cropPixels.width);
  canvas.height = Math.round(cropPixels.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height
  );
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, 0.92);
  });
}

export function formatBytes(bytes) {
  if (!bytes) return '0 KB';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}
