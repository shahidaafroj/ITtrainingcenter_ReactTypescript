import { IEmployee, IResponse } from '../../interfaces';
// import { BaseService } from './base';
import {BaseService} from '../services';

export class EmployeeService {
    static getAll = async (): Promise<IEmployee[]> => {
        const result = await BaseService.createInstance().get('Employee/GetEmployees');
        return result.data;
    }

    static getById = async (employeeId: number): Promise<IEmployee> => {
        const result = await BaseService.createInstance().get(`Employee/GetEmployee/${employeeId}`);
        return result.data;
    }

static add = async (employee: FormData): Promise<IResponse> => {
    try {
        const response = await BaseService.createInstance().post('Employee/InsertEmployee', employee, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return {
            isSuccess: true,
            message: response.data?.message || "Employee added successfully",
            data: response.data,
            httpStatusCode: response.status.toString()
        };
    } catch (error: any) {
        console.error('Detailed error:', {
            message: error.message,
            response: error.response?.data,
            config: error.config,
            stack: error.stack
        });
        
        return {
            isSuccess: false,
            message: error.response?.data?.message || 
                   error.response?.data?.title || 
                   error.message || 
                   "Failed to add employee",
            data: error.response?.data || null,
            httpStatusCode: error.response?.status?.toString() || "500"
        };
    }
}
    static update = async (employeeId: number, employee: FormData): Promise<IResponse> => {
        try {
            const response = await BaseService.createInstance().put(`Employee/UpdateEmployee/${employeeId}`, employee, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return {
                isSuccess: true,
                message: response.data?.message || "Employee updated successfully",
                data: response.data,
                httpStatusCode: response.status.toString()
            };
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.response?.data?.message || error.message,
                data: null,
                httpStatusCode: error.response?.status || 500
            };
        }
    }

    static delete = async (employeeId: number): Promise<IResponse> => {
        try {
            const response = await BaseService.createInstance().delete(`Employee/DeleteEmployee/${employeeId}`);
            
            if (response.status === 204) {
                return {
                    isSuccess: true,
                    message: "Employee deleted successfully",
                    data: null,
                    httpStatusCode: response.status.toString()
                };
            }
            
            return response.data || {
                isSuccess: false,
                message: "Unknown error occurred",
                data: null,
                httpStatusCode: response.status ? response.status.toString() : "500"
            };
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.response?.data?.message || error.message,
                data: null,
                httpStatusCode: error.response?.status || 500
            };
        }
    }

    static getAvailableEmployees = async (): Promise<IEmployee[]> => {
        const result = await BaseService.createInstance().get('Employee/Available');
        return result.data;
    }

    static getWillingToSellEmployees = async (): Promise<IEmployee[]> => {
        const result = await BaseService.createInstance().get('Employee/WillingToSell');
        return result.data;
    }
}