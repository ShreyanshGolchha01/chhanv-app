import { useState, useEffect } from 'react';
import axios from 'axios';
import serverUrl from '../services/Server';

export const useBackendConnection = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    try {
      console.log('Testing connection to:', serverUrl);
      
      // Try to make a simple request to test connectivity
      const response = await axios.post(`${serverUrl}show_doctor.php`, {}, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Connection test response:', response.status);
      setIsConnected(true);
      setError(null);
      return true;
    } catch (err: any) {
      console.error('Connection test failed:', err);
      setIsConnected(false);
      
      if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
        setError('Network error - check if backend server is running');
      } else if (err.code === 'ECONNREFUSED') {
        setError('Connection refused - backend server might be down');
      } else if (err.code === 'TIMEOUT') {
        setError('Request timeout - slow network connection');
      } else {
        setError(err.message || 'Unknown error occurred');
      }
      return false;
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return {
    isConnected,
    error,
    testConnection,
    retryConnection: testConnection
  };
};

export default useBackendConnection;
