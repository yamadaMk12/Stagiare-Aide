import api from '../../../api/axios';

/**
 * Submit a candidature for a given post.
 * @param {number} postId - The ID of the post to apply to
 * @param {string} message - The motivation message (min 10 chars)
 */
export const storeCandidature = (postId, message) => {
  return api.post(`/posts/${postId}/candidatures`, { message });
};
