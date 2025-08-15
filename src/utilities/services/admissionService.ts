import axios from 'axios';
import { Admission } from '../../interfaces';

const API_URL = "http://localhost:5281/api/Admission";

export const getAdmissions = () => axios.get(`${API_URL}/GetAdmissions`);
// export const getAdmission = (id: string | number) => axios.get(`${API_URL}/GetAdmission/${id}`);
export const getAdmission = (id: number) =>   axios.get(`${API_URL}/GetAdmission/${id}`);
export const createAdmission = (data: Record<string, any>) => axios.post(`${API_URL}/InsertAdmission`, data);
// export const updateAdmission = (id: string | number, data: Record<string, any>) => axios.put(`${API_URL}/UpdateAdmission/${id}`, data);
export const updateAdmission = (id: number, data: Admission) => 
  axios.put(`${API_URL}/UpdateAdmission/${id}`, data, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });export const deleteAdmission = (id: string | number) => axios.delete(`${API_URL}/DeleteAdmission/${id}`);
export const getTraineesDisplay = () => axios.get(`${API_URL}/trainee-display-list`);
export const getAdmissionById = (id: number) =>
  axios.get(`${API_URL}/GetAdmissionById/${id}`);