import {IDepartment, IResponse} from '../../interfaces';
import {BaseService} from '../services';

export class DepartmentService {  
     static getAll = async (): Promise<IDepartment[]> => {
        const result = await BaseService.createInstance().get('Department/GetDepartments');
        return result.data; // Ensure proper data extraction
    }

    static getById = async (departmentId: number): Promise<IDepartment> => {
        const result = await BaseService.createInstance().get('Department/GetDepartment/' + departmentId);
        return result.data;
    }
    
    static add = async (department: IDepartment): Promise<IResponse> => {
    try {
        const response = await BaseService.createInstance().post('Department/InsertDepartment', department);
        
        // Handle successful response (201 Created or 200 OK)
        if (response.status === 201 || response.status === 200) {
            return {
                isSuccess: true,
                message: response.data?.message || "Department added successfully",
                data: response.data,
                httpStatusCode: response.status ? response.status.toString() : "200"
            };
        }
        
        // Handle other status codes
        return {
            isSuccess: false,
            message: response.data?.message || "Unexpected response status",
            data: null,
            httpStatusCode: response.status ? response.status.toString() : "500"
        };
    } catch (error: any) {
        return {
            isSuccess: false,
            message: error.response?.data?.message || 
                   error.message || 
                   "Failed to add department",
            data: null,
            httpStatusCode: error.response?.status ? error.response.status.toString() : "500"
        };
    }
}

    static update = async (department: IDepartment): Promise<IResponse> => {
    try {
        const response = await BaseService.createInstance().put(
            `Department/UpdateDepartment/${department.departmentId}`, 
            department
        );

        // Handle successful response (200 OK or 204 No Content)
        if (response.status === 200 || response.status === 204) {
            return {
                isSuccess: true,
                message: response.data?.message || "Department updated successfully",
                data: response.data || department, // Return updated data
                httpStatusCode: response.status ? response.status.toString() : "200"
            };
        }

        // Handle unexpected status codes
       return {
            isSuccess: false,
            message: response.data?.message || "Unexpected response status",
            data: null,
            httpStatusCode: response.status ? response.status.toString() : "500"
        };
    } catch (error: any) {
        return {
            isSuccess: false,
            message: error.response?.data?.message || 
                   error.message || 
                   "Failed to update department",
            data: null,
            httpStatusCode: error.response?.status ? error.response.status.toString() : "500"
        };
    }
}

// DepartmentService.ts এ
static delete = async (departmentId: number): Promise<IResponse> => {
    try {
        const response = await BaseService.createInstance().delete(`Department/DeleteDepartment/${departmentId}`);
        
        // 204 রেসপন্সের ক্ষেত্রে ম্যানুয়ালি সাকসেস রেসপন্স তৈরি করুন
        if (response.status === 204) {
            return {
                isSuccess: true,
                message: "Department deleted successfully",
                data: null,
                httpStatusCode: response.status.toString()
            };
        }
        
        // অন্যান্য স্ট্যাটাস কোডের জন্য
        return response.data || {
            isSuccess: false,
            message: "Unknown error occurred",
            data: null,
            httpStatusCode: response.status ? response.status.toString() : "500"
        };
    } catch (error: any) {
        console.error("Delete error:", error);
        return {
            isSuccess: false,
            message: error.response?.data?.message || error.message,
            data: null,
            // dayId: null,
            httpStatusCode: error.response?.status || 500
        };
    }
}
}