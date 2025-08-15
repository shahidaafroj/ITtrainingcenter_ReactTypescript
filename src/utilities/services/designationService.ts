// import {IDesignation, IResponse} from '../../interfaces';
// import {BaseService} from '../services';

// export class DesignationService {
//     static getAll = async (): Promise<IDesignation[]> => {
//         const result = await BaseService.createInstance().get('Designation/GetDesignations');
//         return result.data;
//     }

//     static getById = async (designationId: number): Promise<IDesignation> => {
//         const result = await BaseService.createInstance().get('Designation/GetDesignation/' + designationId);
//         return result.data;
//     }

//     static add = async (designation: IDesignation): Promise<IResponse> => {
//         const result = await BaseService.createInstance().post('Designation/InsertDesignation', designation);
//         return result.data;
//     }

//     static update = async (designation: IDesignation): Promise<IResponse> => {
//         const result = await BaseService.createInstance().put('Designation/UpdateDesignation/' + designation.designationId, designation);
//         return result.data;
//     }

//     static delete = async (designationId: number): Promise<IResponse> => {
//         const result = await BaseService.createInstance().delete('Designation/DeleteDesignation/' + designationId);
//         return result.data;
//     }
// }


import { IDesignation, IResponse } from '../../interfaces';
import { BaseService } from '../services';

export class DesignationService {
    static getAll = async (): Promise<IDesignation[]> => {
        const result = await BaseService.createInstance().get('Designation/GetDesignations');
        return result.data;
    }

    static getById = async (designationId: number): Promise<IDesignation> => {
        const result = await BaseService.createInstance().get('Designation/GetDesignation/' + designationId);
        return result.data;
    }

    static add = async (designation: IDesignation): Promise<IResponse> => {
        try {
            const response = await BaseService.createInstance().post('Designation/InsertDesignation', designation);
            
            if (response.status === 201 || response.status === 200) {
                return {
                    isSuccess: true,
                    message: response.data?.message || "Designation added successfully",
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
                       "Failed to add designation",
                data: null,
                httpStatusCode: error.response?.status ? error.response.status.toString() : "500"
            };
        }
    }

    static update = async (designation: IDesignation): Promise<IResponse> => {
        try {
            const response = await BaseService.createInstance().put(
                `Designation/UpdateDesignation/${designation.designationId}`, 
                designation
            );

            if (response.status === 200 || response.status === 204) {
                return {
                    isSuccess: true,
                    message: response.data?.message || "Designation updated successfully",
                    data: response.data || designation,
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
                       "Failed to update designation",
                data: null,
                httpStatusCode: error.response?.status ? error.response.status.toString() : "500"
            };
        }
    }

    static delete = async (designationId: number): Promise<IResponse> => {
        try {
            const response = await BaseService.createInstance().delete(`Designation/DeleteDesignation/${designationId}`);
            
            if (response.status === 204) {
                return {
                    isSuccess: true,
                    message: "Designation deleted successfully",
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
}