import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const hospitalService = {
  getAll: () => api.get('/hospitals'),
  getById: (id) => api.get('/hospitals/' + id),
  getByCity: (city) => api.get('/hospitals/city/' + city),
};

export const bedService = {
  getByHospital: (hospitalId) => api.get('/beds/hospital/' + hospitalId),
  getAvailable: (hospitalId) => api.get('/beds/hospital/' + hospitalId + '/available'),
};

export const queueService = {
  join: (patientId, hospitalId, bedType, priority) =>
    api.post('/queue/join?patientId=' + patientId + '&hospitalId=' + hospitalId + '&bedType=' + bedType + '&priority=' + priority),
  getPatientQueue: (patientId) => api.get('/queue/patient/' + patientId),
  getHospitalQueue: (hospitalId) => api.get('/queue/hospital/' + hospitalId),
  admit: (queueId) => api.put('/queue/' + queueId + '/admit'),
  cancel: (queueId) => api.put('/queue/' + queueId + '/cancel'),
};

export default api;
