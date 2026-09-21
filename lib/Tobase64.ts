export const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const toBase64Multiple = (files: File[]): Promise<string[]> => {
  return Promise.all(files.map((file) => toBase64(file)));
};