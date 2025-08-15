import {IVisitor} from '../interfaces';
import {useEffect, useState} from 'react';
import {VisitorService} from '../utilities/services';

import { useDataHook } from './useDataHook';

export const useVisitorHook = (initialLoad: boolean = true) => {
  return useDataHook<IVisitor>(VisitorService.getAll, initialLoad);
};



export const VisitorHook = (loadingVisitor: boolean) => {
    const [data, setData] = useState<IVisitor[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await VisitorService.getAll();
                setData([...result]);
            } catch (error: any) {
                setData([]);
                setError(error.toString())
            } finally {
                setLoading(false);
            }
        }
        if (loadingVisitor) {
            fetchData();
        }
    }, [])

    return {data, loading, error, setData}
}