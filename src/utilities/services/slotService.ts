import { ISlot, IResponse } from '../../interfaces';
import { BaseService } from '../services';

export class SlotService {
    static getAll = async (): Promise<ISlot[]> => {
        try {
            const result = await BaseService.createInstance().get('Slot/GetSlots');
            return result.data;
        } catch (error: any) {
            throw error;
        }
    }

    static getById = async (slotId: number): Promise<ISlot> => {
        try {
            const result = await BaseService.createInstance().get(`Slot/GetSlot/${slotId}`);
            return result.data;
        } catch (error: any) {
            throw error;
        }
    }

    static add = async (slot: ISlot): Promise<IResponse> => {
        try {
            const formattedSlot = {
                ...slot,
                startTime: slot.startTime.includes(":") ? slot.startTime : `${slot.startTime}:00`,
                endTime: slot.endTime.includes(":") ? slot.endTime : `${slot.endTime}:00`
            };

            const response = await BaseService.createInstance().post('Slot/InsertSlot', formattedSlot);
            
            return {
                isSuccess: true,
                message: response.data?.message || "Slot added successfully",
                data: response.data,
                httpStatusCode: response.status?.toString() || "200"
            };
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.response?.data?.message || 
                       error.message || 
                       "Failed to add slot",
                data: null,
                httpStatusCode: error.response?.status?.toString() || "500"
            };
        }
    }

    // static update = async (slot: ISlot): Promise<IResponse> => {
    //     try {
    //         if (!slot.slotId) {
    //             throw new Error("Slot ID is required for update");
    //         }

    //         const formattedSlot = {
    //             ...slot,
    //             startTime: slot.startTime.includes(":") ? slot.startTime : `${slot.startTime}:00`,
    //             endTime: slot.endTime.includes(":") ? slot.endTime : `${slot.endTime}:00`
    //         };

    //         const response = await BaseService.createInstance().put(
    //             `Slot/UpdateSlot/${slot.slotId}`,
    //             formattedSlot
    //         );

    //         return {
    //             isSuccess: true,
    //             message: response.data?.message || "Slot updated successfully",
    //             data: response.data,
    //             httpStatusCode: response.status?.toString() || "200"
    //         };
    //     } catch (error: any) {
    //         return {
    //             isSuccess: false,
    //             message: error.response?.data?.message || 
    //                    error.message || 
    //                    "Failed to update slot",
    //             data: null,
    //             httpStatusCode: error.response?.status?.toString() || "500"
    //         };
    //     }
    // }

    static update = async (slot: ISlot): Promise<IResponse> => {
        try {
            if (!slot.slotId) {
                throw new Error("Slot ID is required for update");
            }

            // Transform to match backend DTO
            const formattedSlot = {
                SlotId: slot.slotId,  // Note uppercase to match backend
                TimeSlotType: slot.timeSlotType,
                StartTime: slot.startTime.includes(":") ? slot.startTime : `${slot.startTime}:00`,
                EndTime: slot.endTime.includes(":") ? slot.endTime : `${slot.endTime}:00`,
                IsActive: slot.isActive
            };

            const response = await BaseService.createInstance().put(
                `Slot/UpdateSlot/${slot.slotId}`,
                formattedSlot
            );

            return {
                isSuccess: true,
                message: response.data?.message || "Slot updated successfully",
                data: response.data,
                httpStatusCode: response.status?.toString() || "200"
            };
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.response?.data?.message || 
                    error.message || 
                    "Failed to update slot",
                data: null,
                httpStatusCode: error.response?.status?.toString() || "500"
            };
        }
    }
    static delete = async (slotId: number): Promise<IResponse> => {
        try {
            if (!slotId) {
                throw new Error("Invalid slot ID provided for deletion");
            }

            const response = await BaseService.createInstance().delete(`Slot/DeleteSlot/${slotId}`);
            
            if (response.status === 204) {
                return {
                    isSuccess: true,
                    message: "Slot deleted successfully",
                    data: null,
                    httpStatusCode: "204"
                };
            }

            return response.data || {
                isSuccess: false,
                message: "Unknown error occurred during deletion",
                data: null,
                httpStatusCode: response.status?.toString() || "500"
            };
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.response?.data?.message || 
                       error.message || 
                       "Failed to delete slot",
                data: null,
                httpStatusCode: error.response?.status?.toString() || "500"
            };
        }
    }
}