import api from '../../../api/axios';

/**
 * Fetch all active posts (statut=ouvert), sorted by newest first.
 * @param {number} page - Page number for pagination
 */
export const getPosts = (page = 1) => {
  return api.get('/posts', { params: { page } });
};

/**
 * Search posts by query string.
 * @param {string} q - Search query
 * @param {number} page - Page number
 */
export const searchPosts = (q, page = 1) => {
  return api.get('/posts/search', { params: { q, page } });
};
