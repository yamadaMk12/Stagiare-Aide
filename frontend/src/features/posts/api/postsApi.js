import api from '../../../api/axios';

/**
 * Fetch all active posts (statut=ouvert), sorted by newest first.
 * @param {number} page - Page number for pagination
 */
export const getPosts = (page = 1) => {
  return api.get('/posts', { params: { page } });
};
