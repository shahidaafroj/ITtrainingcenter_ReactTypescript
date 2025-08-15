
import { IDailySalesRecord, IResponse } from '../../interfaces';
import { BaseService } from '../services';

export class DailySalesRecordService {
    static getAll = async (): Promise<IDailySalesRecord[]> => {
        const result = await BaseService.createInstance().get('DailySalesRecord/DailySalesRecords');
        return result.data;
    }

    static getById = async (id: number): Promise<IDailySalesRecord> => {
        const result = await BaseService.createInstance().get(`DailySalesRecord/DailySalesRecords/${id}`);
        return result.data;
    }

    static getByDate = async (date: Date): Promise<IDailySalesRecord[]> => {
        const result = await BaseService.createInstance().get('DailySalesRecord/date', {
            params: { date: date.toISOString().split('T')[0] }
        });
        return result.data;
    }

    static getByEmployee = async (employeeId: number): Promise<IDailySalesRecord[]> => {
        const result = await BaseService.createInstance().get(`DailySalesRecord/employee/${employeeId}`);
        return result.data;
    }

    static create = async (record: IDailySalesRecord): Promise<IResponse> => {
        try {
            const response = await BaseService.createInstance().post('DailySalesRecord/InsertDailySalesRecords', record);
            return {
                isSuccess: true,
                message: response.data?.message || "Record created successfully",
                data: response.data,
                httpStatusCode: response.status.toString()
            };
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.response?.data?.message || error.message,
                data: null,
                httpStatusCode: error.response?.status?.toString() || "500"
            };
        }
    }

    static update = async (id: number, record: IDailySalesRecord): Promise<IResponse> => {
    try {
        console.log('Sending update:', { id, record }); // Add this
        const response = await BaseService.createInstance().put(
            `DailySalesRecord/UpdateDailySalesRecords/${id}`, 
            record
        );
        console.log('Update response:', response.data); // Add this
        return {
            isSuccess: true,
            message: response.data?.message || "Record updated successfully",
            data: response.data,
            httpStatusCode: response.status.toString()
        };
    } catch (error: any) {
        console.error('Update error:', error.response?.data || error.message); // Add this
        return {
            isSuccess: false,
            message: error.response?.data?.message || error.message,
            data: null,
            httpStatusCode: error.response?.status?.toString() || "500"
        };
    }
}
    static delete = async (id: number): Promise<IResponse> => {
        try {
            const response = await BaseService.createInstance().delete(`DailySalesRecord/DeleteDailySalesRecords/${id}`);
            return {
                isSuccess: true,
                message: response.data?.message || "Record deleted successfully",
                data: response.data,
                httpStatusCode: response.status.toString()
            };
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.response?.data?.message || error.message,
                data: null,
                httpStatusCode: error.response?.status?.toString() || "500"
            };
        }
    }

    static getMonthlySummary = async (year: number, month: number): Promise<any> => {
        const result = await BaseService.createInstance().get(`DailySalesRecord/summary/${year}/${month}`);
        return result.data;
    }

    static getTotalCollection = async (employeeId: number, year: number, month: number): Promise<number> => {
        const result = await BaseService.createInstance().get('DailySalesRecord/totalCollection', {
            params: { employeeId, year, month }
        });
        return result.data;
    }

    static getByEmployeeAndDateRange = async (employeeId: number, startDate: string, endDate: string) => {
    const response = await BaseService.createInstance().get('DailySalesRecord/byEmployeeAndDateRange', {
        params: { employeeId, startDate, endDate }
    });
    return response.data;
    };

}