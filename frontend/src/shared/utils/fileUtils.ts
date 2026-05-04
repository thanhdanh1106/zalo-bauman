export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (fileType: string): string => {
  if (fileType.startsWith('image/')) return '🖼️';
  if (fileType.startsWith('video/')) return '🎥';
  if (fileType.startsWith('audio/')) return '🎵';
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word')) return '📝';
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
  if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
  return '📎';
};

export const isImageFile = (fileType: string): boolean => {
  return fileType.startsWith('image/');
};

export const generateThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file.type)) {
      resolve('');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 100;
      canvas.height = 100;
      ctx?.drawImage(img, 0, 0, 100, 100);
      resolve(canvas.toDataURL());
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};
