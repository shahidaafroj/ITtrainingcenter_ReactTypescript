// =========src/utility/services/courseComboService.ts============
import {ICourseCombo, IResponse} from '../../interfaces';
import {BaseService} from '../services';

export class CourseComboService {  
    static getAll = async (): Promise<ICourseCombo[]> => {
        const result = await BaseService.createInstance().get('CourseCombo/GetCourseCombos');
        return result.data;
    }

    static getById = async (courseComboId: number): Promise<ICourseCombo> => {
        const result = await BaseService.createInstance().get('CourseCombo/GetCourseCombo/' + courseComboId);
        return result.data;
    }
        
    static add = async (courseCombo: ICourseCombo): Promise<IResponse> => {
        try {
            const response = await BaseService.createInstance().post('CourseCombo/InsertCourseCombo', courseCombo);
            
            if (response.status === 201 || response.status === 200) {
                return {
                    isSuccess: true,
                    message: response.data?.message || "Course combo added successfully",
                    data: response.data,
                    httpStatusCode: response.status ? response.status.toString() : "200"
                };
            }
            
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
                       "Failed to add course combo",
                data: null,
                httpStatusCode: error.response?.status ? error.response.status.toString() : "500"
            };
        }
    }

    static update = async (courseCombo: ICourseCombo): Promise<IResponse> => {
        try {
            const response = await BaseService.createInstance().put(
                `CourseCombo/UpdateCourseCombo/${courseCombo.courseComboId}`, 
                courseCombo
            );

            if (response.status === 200 || response.status === 204) {
                return {
                    isSuccess: true,
                    message: response.data?.message || "Course combo updated successfully",
                    data: response.data || courseCombo,
                    httpStatusCode: response.status ? response.status.toString() : "200"
                };
            }

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
                       "Failed to update course combo",
                data: null,
                httpStatusCode: error.response?.status ? error.response.status.toString() : "500"
            };
        }
    }

    static delete = async (courseComboId: number): Promise<IResponse> => {
        try {
            const response = await BaseService.createInstance().delete(`CourseCombo/DeleteCourseCombo/${courseComboId}`);
            
            if (response.status === 204) {
                return {
                    isSuccess: true,
                    message: "Course combo deleted successfully",
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
            console.error("Delete error:", error);
            return {
                isSuccess: false,
                message: error.response?.data?.message || error.message,
                data: null,
                httpStatusCode: error.response?.status || 500
            };
        }
    }

    static checkNameUnique = async (name: string, id: number = 0): Promise<boolean> => {
        try {
            const response = await BaseService.createInstance().get('CourseCombo/CheckNameUnique', {
                params: { name, id }
            });
            return response.data;
        } catch (error) {
            console.error("Error checking name uniqueness:", error);
            return false;
        }
    }
}

