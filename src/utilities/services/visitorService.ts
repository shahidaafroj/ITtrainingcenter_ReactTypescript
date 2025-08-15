import axios from 'axios';
import {  IVisitor, IVisitorr } from '../../interfaces';
import { BaseService } from './base';
import { IEmployee } from '../../interfaces/IRegistration';

const API_BASE_URL = 'http://localhost:5281/api/Visitor';

export class VisitorService {
static getAll = async (): Promise<IVisitor[]> => {
        try {
            const result = await BaseService.createInstance().get('Visitor/GetVisitors');
            return result.data;
        } catch (error: any) {
            console.error("Error fetching visitors:", error);
            throw error;
        }
    }



  static getAlll= async (includeEmployee: boolean = true): Promise<IVisitor[]> => {
    try {
      const result = await BaseService.createInstance().get('Visitor/GetVisitors', {
        params: { includeEmployee }  // Pass as query parameter
      });
      return result.data;
    } catch (error: any) {
      console.error("Error fetching visitors:", error);
      throw error;
    }
  }

  static getById = async (id: number, includeEmployee: boolean = true): Promise<IVisitorr> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/GetVisitor/${id}`, {
        params: { includeEmployee }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching visitor ${id}:`, error);
      throw error;
    }
  };

  static create = async (visitor: IVisitorr): Promise<IVisitorr> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/InsertVisitor`, visitor);
      return response.data;
    } catch (error) {
      console.error('Error creating visitor:', error);
      throw error;
    }
  };

  static update = async (id: number, visitor: IVisitorr): Promise<IVisitorr> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/UpdateVisitor/${id}`, visitor);
      return response.data;
    } catch (error) {
      console.error(`Error updating visitor ${id}:`, error);
      throw error;
    }
  };

  static delete = async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/DeleteVisitor/${id}`);
    } catch (error) {
      console.error(`Error deleting visitor ${id}:`, error);
      throw error;
    }
  };

  static getByEmployee = async (employeeId: number): Promise<IVisitorr[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ByEmployee/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching visitors for employee ${employeeId}:`, error);
      throw error;
    }
  };

  static getAllEmp = async (): Promise<IEmployee[]> => {
  try {
    // Use BaseService consistently
    const response = await BaseService.createInstance().get('/Employee/GetEmployees');
    
    console.log('API Response:', response); 
    
    if (!response.data) {
      console.error('No data received from API');
      return [];
    }
    
    return response.data.map((emp: any) => ({
      ...emp,
      employeeId: Number(emp.employeeId)
    }));
  } catch (error) {
    console.error('Error in getAllEmp:', error);
    return [];
  }
};
}