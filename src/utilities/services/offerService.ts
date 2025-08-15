import {IOffer, IResponse} from '../../interfaces';
import {BaseService} from '../services';

export class OfferService {
    static getAll = async (): Promise<IOffer[]> => {
        const result = await BaseService.createInstance().get('Offer/GetOffers');
        return result.data;
    }

    static getById = async (offerId: number): Promise<IOffer> => {
        const result = await BaseService.createInstance().get('Offer/GetOffer/' + offerId);
        return result.data;
    }

    static add = async (offer: IOffer): Promise<IResponse> => {
        try {
            const response = await BaseService.createInstance().post('Offer/InsertOffer', offer);
            
            if (response.status === 201 || response.status === 200) {
                return {
                    isSuccess: true,
                    message: response.data?.message || "Offer added successfully",
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
                       "Failed to add offer",
                data: null,
                httpStatusCode: error.response?.status ? error.response.status.toString() : "500"
            };
        }
    }

    static update = async (offer: IOffer): Promise<IResponse> => {
        try {
            const response = await BaseService.createInstance().put(
                `Offer/UpdateOffer/${offer.offerId}`, 
                offer
            );

            if (response.status === 200 || response.status === 204) {
                return {
                    isSuccess: true,
                    message: response.data?.message || "Offer updated successfully",
                    data: response.data || offer,
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
                       "Failed to update offer",
                data: null,
                httpStatusCode: error.response?.status ? error.response.status.toString() : "500"
            };
        }
    }

    static delete = async (offerId: number): Promise<IResponse> => {
        try {
            const response = await BaseService.createInstance().delete(`Offer/DeleteOffer/${offerId}`);
            
            if (response.status === 204) {
                return {
                    isSuccess: true,
                    message: "Offer deleted successfully",
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