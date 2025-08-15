import {ICourseCombo} from '../interfaces';
import {useEffect, useState} from 'react';
import {CourseComboService} from '../utilities/services';
import { useDataHook } from './useDataHook';

export const useCourseComboHook = (initialLoad: boolean = true) => {
  return useDataHook<ICourseCombo>(CourseComboService.getAll, initialLoad);
};

export const CourseComboHook = (loadingCourseCombo: boolean) => {
    const [data, setData] = useState<ICourseCombo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await CourseComboService.getAll();
                setData([...result]);
            } catch (error: any) {
                setData([]);
                setError(error.toString())
            } finally {
                setLoading(false);
            }
        }
        if (loadingCourseCombo) {
            fetchData();
        }
    }, [])

    return {data, loading, error, setData}
}
