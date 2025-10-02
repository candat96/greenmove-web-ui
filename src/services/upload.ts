import axiosInstance from './axios';

export interface UploadResponse {
  statusCode: number;
  data: {
    publicUrl: string;
    fileName: string;
    fileSize: number;
    contentType: string;
  };
  pagination: null;
}

export const uploadImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axiosInstance.Instance.post<UploadResponse>(
      '/azure-blob-storage/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi upload ảnh:', error);
    throw error;
  }
}; 