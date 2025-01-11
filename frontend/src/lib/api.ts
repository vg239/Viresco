import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const learnAPI = {
  generateCourse: async (query: string) => {
    const response = await api.post('/api/learn', { query });
    return response.data;
  },
};

export default api; 