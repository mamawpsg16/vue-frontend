import apiClient from './apiClient.js';
export const login = async (credentials) => {
    // await apiClient.get("sanctum/csrf-cookie");
    return apiClient.post('/login', credentials);
};

export const getUser = () => {
    return apiClient.get('/user');
};
