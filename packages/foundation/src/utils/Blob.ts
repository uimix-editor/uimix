import { assertNonNull } from "./Assert";

export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function imageFromURL(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export async function imageToBlob(imageURL: string): Promise<Blob> {
  const image = new Image();
  image.crossOrigin = "";
  image.src = imageURL;
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  const context = assertNonNull(canvas.getContext("2d"));
  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(assertNonNull(blob)), "image/png");
  });
}

export async function dataURLFromURL(url: string) {
  if (url.startsWith("data:")) {
    return url;
  }
  const response = await fetch(url);
  const blob = await response.blob();
  return await blobToDataURL(blob);
}
