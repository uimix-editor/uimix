export async function showImageInputDialog(): Promise<File | undefined> {
  const file = await new Promise<File | undefined>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg";
    input.onchange = () => {
      resolve(input.files?.[0]);
    };
    input.click();
  });
  return file;
}
