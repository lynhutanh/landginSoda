import type { IUser } from '@interfaces/user';
import { apiRequest } from './api-request';

export type IProfileUpdatePayload = {
  name: string;
  username: string;
  email: string;
  phone?: string;
  avatarId?: string;
  password?: string;
};

class ProfileService {
  async update(payload: IProfileUpdatePayload): Promise<IUser> {
    const res = (await apiRequest.put('/users/me', payload)) as { data: IUser };
    if (!res?.data) {
      throw new Error('Cập nhật thất bại');
    }
    return res.data;
  }
}

export const profileService = new ProfileService();
