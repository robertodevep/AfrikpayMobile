


// api.js
/*import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Création de l'instance axios
const api = axios.create({
  baseURL: 'http://192.168.208.253:3000/api',
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
// Modifiez l'intercepteur de requête pour GLPI
api.interceptors.request.use(
  async (config) => {
    // Ne pas ajouter le header pour les routes d'authentification
    if (!config.url.includes('/login') && !config.url.includes('/initSession')) {
      const token = await AsyncStorage.getItem('glpi_session_token');
      if (token) {
        config.headers['Session-Token'] = token;
        config.headers['App-Token'] = 'QPkSMqodMxbHni9fMgrnjowVPwEQDe7PeUhTVMtu';
      }
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
      // Gérer la déconnexion ici si nécessaire
    }
    return Promise.reject(error);
  }
);

export default api;*/

// api.js
/*import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Création de l'instance axios
const api = axios.create({
  baseURL: 'http://192.168.208.253:3000/api',
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
      // Gérer la déconnexion ici si nécessaire
    }
    return Promise.reject(error);
  }
);


export default api;*/



// api.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Création de l'instance axios
const api = axios.create({
  baseURL: 'http://192.168.1.139:3000/api',
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
      // Gérer la déconnexion ici si nécessaire
    }
    return Promise.reject(error);
  }
);

export default api;
