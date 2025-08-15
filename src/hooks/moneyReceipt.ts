import { useState } from 'react';
import { 
    getMoneyReceipts, 
    getMoneyReceipt, 
    createMoneyReceipt, 
    updateMoneyReceipt, 
    deleteMoneyReceipt,
    getInvoicesByAdmission,
    getTotalCourseFeeByAdmission,
    getAdmissionPaymentInfo
} from '../utilities/services/moneyReceiptService';
import { IMoneyReceipt, MoneyReceiptFormData } from '../interfaces/IMoneyReceipt';

export const useMoneyReceipt = () => {
    const [moneyReceipts, setMoneyReceipts] = useState<IMoneyReceipt[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMoneyReceipts = async () => {
        setLoading(true);
        try {
            const data = await getMoneyReceipts();
            setMoneyReceipts(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch money receipts');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMoneyReceipt = async (id: number) => {
        setLoading(true);
        try {
            const data = await getMoneyReceipt(id);
            setError(null);
            return data;
        } catch (err) {
            setError('Failed to fetch money receipt');
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const addMoneyReceipt = async (receiptData: MoneyReceiptFormData) => {
        setLoading(true);
        try {
            const data = await createMoneyReceipt(receiptData);
            setError(null);
            return data;
        } catch (err) {
            setError('Failed to create money receipt');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const editMoneyReceipt = async (id: number, receiptData: MoneyReceiptFormData) => {
        setLoading(true);
        try {
            const data = await updateMoneyReceipt(id, receiptData);
            setError(null);
            return data;
        } catch (err) {
            setError('Failed to update money receipt');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeMoneyReceipt = async (id: number) => {
        setLoading(true);
        try {
            await deleteMoneyReceipt(id);
            setError(null);
            fetchMoneyReceipts(); // Refresh the list
        } catch (err) {
            setError('Failed to delete money receipt');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchInvoicesByAdmission = async (admissionNo: string) => {
        setLoading(true);
        try {
            const data = await getInvoicesByAdmission(admissionNo);
            setError(null);
            return data;
        } catch (err) {
            setError('Failed to fetch invoices');
            console.error(err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const fetchTotalCourseFeeByAdmission = async (admissionNo: string) => {
        setLoading(true);
        try {
            const data = await getTotalCourseFeeByAdmission(admissionNo);
            setError(null);
            return data;
        } catch (err) {
            setError('Failed to fetch course fee');
            console.error(err);
            return 0;
        } finally {
            setLoading(false);
        }
    };

    const fetchAdmissionPaymentInfo = async (admissionNo: string) => {
        setLoading(true);
        try {
            const data = await getAdmissionPaymentInfo(admissionNo);
            setError(null);
            return data;
        } catch (err) {
            setError('Failed to fetch payment info');
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        moneyReceipts,
        loading,
        error,
        fetchMoneyReceipts,
        fetchMoneyReceipt,
        addMoneyReceipt,
        editMoneyReceipt,
        removeMoneyReceipt,
        fetchInvoicesByAdmission,
        fetchTotalCourseFeeByAdmission,
        fetchAdmissionPaymentInfo
    };
};