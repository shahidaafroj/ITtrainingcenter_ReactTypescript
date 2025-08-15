import { useState } from 'react';
import { IDailySalesRecord } from '../interfaces';
import { DailySalesRecordService } from '../utilities/services';

export const useDailySalesRecord = () => {
    const [records, setRecords] = useState<IDailySalesRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentRecord, setCurrentRecord] = useState<IDailySalesRecord | null>(null);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const data = await DailySalesRecordService.getAll();
            setRecords(data);
            setError(null);
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getRecord = async (id: number) => {
        setLoading(true);
        try {
            const record = await DailySalesRecordService.getById(id);
            setCurrentRecord(record);
            setError(null);
            return record;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createRecord = async (record: IDailySalesRecord) => {
        setLoading(true);
        try {
            const response = await DailySalesRecordService.create(record);
            if (response.isSuccess) {
                await fetchRecords();
                return { success: true, data: response.data };
            }
            throw new Error(response.message);
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const updateRecord = async (id: number, record: IDailySalesRecord) => {
        setLoading(true);
        try {
            const response = await DailySalesRecordService.update(id, record);
            if (response.isSuccess) {
                await fetchRecords();
                return { success: true, data: response.data };
            }
            throw new Error(response.message);
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const deleteRecord = async (id: number) => {
        setLoading(true);
        try {
            const response = await DailySalesRecordService.delete(id);
            if (response.isSuccess) {
                await fetchRecords();
                return { success: true };
            }
            throw new Error(response.message);
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    return {
        records,
        currentRecord,
        loading,
        error,
        fetchRecords,
        getRecord,
        createRecord,
        updateRecord,
        deleteRecord,
        setCurrentRecord
    };
};