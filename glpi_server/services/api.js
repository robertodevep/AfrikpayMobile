
  // api.js
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import axios from 'axios';

  // Création de l'instance axios
  const api = axios.create({
    baseURL: 'http://192.168.100.37:3000/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Ajout de la méthode isAxiosError directement à l'instance
  api.isAxiosError = function(payload) {
    return axios.isAxiosError(payload);
  };

  // Intercepteur de requête
  api.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem('session_token');
      if (token) {
        config.headers['Session-Token'] = token;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Intercepteur de réponse
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        
      }
      return Promise.reject(error);
    }
  );

  export default api;
