import api from '../../../api/axios';

/** Get the current user's subscription state (plan, pending, post count). */
export const getMyAbonnement = () => api.get('/abonnement');

/** Submit a subscription request for a plan + billing cycle. */
export const subscribe = (plan, cycle) => api.post('/abonnement/subscribe', { plan, cycle });

/** Admin: list all subscriptions (pending first). */
export const adminGetAbonnements = () => api.get('/admin/abonnements');

/** Admin: validate (activate) a subscription. */
export const adminValidate = (id) => api.put(`/admin/abonnements/${id}/validate`);

/** Admin: reject (cancel) a subscription. */
export const adminReject = (id) => api.put(`/admin/abonnements/${id}/reject`);
