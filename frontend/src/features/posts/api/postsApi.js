import api from '../../../api/axios';

/**
 * Fetch all active posts (statut=ouvert), sorted by newest first.
 * @param {object} params - Object containing page and filters
 */
export const getPosts = (params = { page: 1 }) => {
  return api.get('/posts', { params });
};

/**
 * Search posts by query string.
 * @param {string} q - Search query
 * @param {number} page - Page number
 */
export const searchPosts = (q, page = 1) => {
  return api.get('/posts/search', { params: { q, page } });
};

/**
 * Create a new help request post.
 * @param {FormData|object} postData - Post data including potential image files
 */
export const createPost = (postData) => {
  return api.post('/posts', postData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
