import {ISlot} from '../interfaces';
import {useEffect, useState} from 'react';
import {SlotService} from '../utilities/services';

import { useDataHook } from './useDataHook';

// export const useSlotHook = (initialLoad: boolean = true) => {
//   return useDataHook<ISlot>(SlotService.getAll, initialLoad);
// };
export const useSlotHook = (initialLoad: boolean = true) => {
  const { data, loading, error, setData, refresh } = useDataHook<ISlot>(SlotService.getAll, initialLoad);
  const [normalizedData, setNormalizedData] = useState<ISlot[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const mapped = data.map((s: any) => ({
        slotId: s.slotID,
        timeSlotType: s.timeSlotType,
        startTime: s.startTime,
        endTime: s.endTime,
        isActive: s.isActive
      }));
      setNormalizedData(mapped);
    }
  }, [data]);

  return { data: normalizedData, loading, error, setData, refresh };
};


export const SlotHook = (loadingSlot: boolean) => {
    const [data, setData] = useState<ISlot[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await SlotService.getAll();
                setData([...result]);
            } catch (error: any) {
                setData([]);
                setError(error.toString())
            } finally {
                setLoading(false);
            }
        }
        if (loadingSlot) {
            fetchData();
        }
    }, [])

    return {data, loading, error, setData}
}
