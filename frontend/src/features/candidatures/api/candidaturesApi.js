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
