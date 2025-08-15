import axios from 'axios';
import { ICertificate, ITraineeDropdown, ITraineeInfo } from '../../interfaces/ICertificate';

const API_URL = 'http://localhost:5281/api/Certificate';

export const CertificateService = {
  getAll: () => axios.get(`${API_URL}/GetCertificates`),
  getById: (id: number) => axios.get(`${API_URL}/GetCertificate/${id}`),
  create: (data: ICertificate) => axios.post(`${API_URL}/InsertCertificate`, data),
  update: (id: number, data: ICertificate) => axios.put(`${API_URL}/UpdateCertificate/${id}`, data),
  remove: (id: number) => axios.delete(`${API_URL}/DeleteCertificate/${id}`),
  getTraineeDropdown: () => axios.get<ITraineeDropdown[]>(`${API_URL}/GetAllTraineeIdAndNames`),
  getTraineeInfo: (traineeId: number) => axios.get<ITraineeInfo>(`${API_URL}/GetTraineeInfo/${traineeId}`),
  getAvailableTrainees: () => axios.get<ITraineeDropdown[]>(`${API_URL}/GetAvailableTrainees`),
};