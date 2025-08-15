import axios from 'axios';
import { BaseService } from './base';
import { IRegistration } from '../../interfaces/IRegistration';
export class RegistrationService {
  static async getAll(): Promise<IRegistration[]> {
    const response = await BaseService.createInstance().get('/Registration/GetRegistrations');
    return response.data;
  }

  static async getById(id: number): Promise<IRegistration> {
    const response = await BaseService.createInstance().get(`/Registration/GetRegistration/${id}`);
    return response.data;
  }

 static async create(registration: FormData): Promise<IRegistration> {
    const response = await BaseService.createInstance().post(
      '/Registration/InsertRegistration',
      registration,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  }

  static async update(registration: FormData): Promise<IRegistration> {
    const response = await BaseService.createInstance().put(
      `/Registration/UpdateRegistration/${registration.get('registrationId')}`,
      registration,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await BaseService.createInstance().delete(`/Registration/DeleteRegistration/${id}`);
  }
}