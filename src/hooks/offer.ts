import {IOffer} from '../interfaces';
import {useEffect, useState} from 'react';
import {OfferService} from '../utilities/services';

import { useDataHook } from './useDataHook';

export const useOfferHook = (initialLoad: boolean = true) => {
  return useDataHook<IOffer>(OfferService.getAll, initialLoad);
};




export const useOffer = (loadingOffer: boolean) => {
    const [data, setData] = useState<IOffer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await OfferService.getAll();
                setData([...result]);
            } catch (error: any) {
                setData([]);
                setError(error.toString())
            } finally {
                setLoading(false);
            }
        }
        if (loadingOffer) {
            fetchData();
        }
    }, [])

    return {data, loading, error, setData}
}
