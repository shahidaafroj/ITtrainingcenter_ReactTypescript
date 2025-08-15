import { useState, useEffect, useCallback } from 'react';

export const useDataHook = <T,>(
  fetchFunction: () => Promise<T[]>,
  initialLoad: boolean = true
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchFunction();
      setData(Array.isArray(result) ? result : []);
      setError("");
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    initialLoad && fetchData();
  }, [fetchData, initialLoad]);

  return { 
    data, 
    loading, 
    error, 
    refresh: fetchData,
    setData // Optional if you need manual updates
  };
};