import api from './axios';

export const getUserStats = () => api.get('/stats/user');
export const getTrendingTechnologies = () => api.get('/stats/trending-technologies');
export const getTopHelpers = () => api.get('/stats/top-helpers');
export const getFilieres = () => api.get('/filieres');
export const getTechnologies = () => api.get('/technologies');
