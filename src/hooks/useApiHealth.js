import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export const useApiHealth = () => {
  const [status, setStatus] = useState('checking'); // 'checking' | 'connected' | 'error'
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const check = useCallback(async () => {
    setStatus('checking');
    setError(null);
    try {
      const res = await apiService.checkHealth();
      setData(res);
      setStatus('connected');
    } catch (err) {
      setError(err.message || 'Unable to reach API server');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  return { status, data, error, refetch: check };
};
