import axios from 'axios';
import { IRecommendation } from '../../interfaces/IRecommendation';

const API_URL = 'http://localhost:5281/api/Recommendation';

export const RecommendationService = {
  getAll: () => axios.get(`${API_URL}/GetRecommendations`),
  getById: (id: number) => axios.get(`${API_URL}/GetRecommendation/${id}`),
  create: (data: IRecommendation) => axios.post(`${API_URL}/InsertRecommendation`, data),
  update: (id: number, data: IRecommendation) => axios.put(`${API_URL}/UpdateRecommendation/${id}`, data),
  remove: (id: number) => axios.delete(`${API_URL}/DeleteRecommendation/${id}`)
};