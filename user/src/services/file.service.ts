import type { IFilePublic } from '@interfaces/file';
import { apiRequest } from './api-request';

class FileService {
  async upload(file: File, type = 'avatar'): Promise<{ data: IFilePublic }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return apiRequest.post('/files/upload', formData, {
      params: { type },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  async findById(id: string): Promise<{ data: IFilePublic }> {
    return apiRequest.get(`/files/${id}`);
  }
}

export const fileService = new FileService();
