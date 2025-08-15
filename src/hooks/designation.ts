import {IDesignation} from '../interfaces';
import {useEffect, useState} from 'react';
import {DesignationService} from '../utilities/services';

import { useDataHook } from './useDataHook';

export const useDesignationHook = (initialLoad: boolean = true) => {
  return useDataHook<IDesignation>(DesignationService.getAll, initialLoad);
};




export const DesignationHook = (loadingDesignation: boolean) => {
    const [data, setData] = useState<IDesignation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await DesignationService.getAll();
                setData([...result]);
            } catch (error: any) {
                setData([]);
                setError(error.toString())
            } finally {
                setLoading(false);
            }
        }
        if (loadingDesignation) {
            fetchData();
        }
    }, [])

    return {data, loading, error, setData}
}