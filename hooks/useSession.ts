import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

interface SessionData {
  // Define aquí la estructura de tu sesión decodificada
  [key: string]: any;
}

export const useSession = () => {
  const [session, setSessionData] = useState<SessionData | null>(null);

  const getSession = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      console.log('access token xddd', accessToken)
      if (accessToken) {
        const decoded = jwtDecode(accessToken) as SessionData;
        setSessionData(decoded);
      }
    } catch (error) {
      console.error('Error getting session data', error);
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  return { session, getSession };
};