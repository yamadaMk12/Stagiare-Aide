import api from '../../../lib/axios';

export const evaluationService = {
  /**
   * Submit a new evaluation.
   * @param {Object} data - Contains post_id, reviewed_id, note, and commentaire
   * @returns {Promise<Object>} The created evaluation
   */
  createEvaluation: async (data) => {
    const response = await api.post('/evaluations', data);
    return response.data;
  },

  /**
   * Get evaluations for a specific user.
   * @param {number} userId - The ID of the user
   * @returns {Promise<Object>} Contains evaluations, average_rating, and total_evaluations
   */
  getUserEvaluations: async (userId) => {
    const response = await api.get(`/evaluations/user/${userId}`);
    return response.data;
  }
};
