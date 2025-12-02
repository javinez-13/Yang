import { useCallback, useEffect, useRef, useState } from 'react';

const useAutoRefresh = (refreshFn, intervalMs = 60000) => {
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const savedCallback = useRef(refreshFn);

  useEffect(() => {
    savedCallback.current = refreshFn;
  }, [refreshFn]);

  const runRefresh = useCallback(async () => {
    if (!savedCallback.current) return;
    setIsRefreshing(true);
    try {
      await savedCallback.current();
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Auto refresh failed', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    runRefresh();
    if (!intervalMs) return undefined;

    const id = setInterval(() => {
      runRefresh();
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs, runRefresh]);

  return {
    lastUpdated,
    isRefreshing,
    manualRefresh: runRefresh,
  };
};

export default useAutoRefresh;


