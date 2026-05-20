import api from '../../../api/axios';

/**
 * Fetch both received and sent candidatures for the current user.
 */
export const getCandidatures = () => {
  return api.get('/candidatures');
};

/**
 * Update the status of a candidature (accepte / refuse).
 * @param {string|number} id - Candidature ID
 * @param {string} statut - 'accepte' or 'refuse'
 */
export const updateCandidatureStatut = (id, statut) => {
  return api.put(`/candidatures/${id}`, { statut });
};

/**
 * Submit a candidature for a given post.
 * @param {number} postId - The ID of the post to apply to
 * @param {string} message - The motivation message (min 10 chars)
 */
export const storeCandidature = (postId, message) => {
  return api.post(`/posts/${postId}/candidatures`, { message });
};