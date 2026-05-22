import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMyAbonnement,
  subscribe,
  adminGetAbonnements,
  adminValidate,
  adminReject,
} from '../api/abonnementsApi';

/** Current user's subscription state. */
export const useMyAbonnement = () => {
  return useQuery({
    queryKey: ['abonnement', 'me'],
    queryFn: () => getMyAbonnement().then((res) => res.data),
  });
};

/** Submit a subscription request. */
export const useSubscribe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ plan, cycle }) => subscribe(plan, cycle),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['abonnement', 'me'] }),
  });
};

/** Admin: all subscriptions. */
export const useAdminAbonnements = () => {
  return useQuery({
    queryKey: ['abonnement', 'admin'],
    queryFn: () => adminGetAbonnements().then((res) => res.data),
  });
};

/** Admin: validate a subscription. */
export const useValidateAbonnement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => adminValidate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['abonnement', 'admin'] }),
  });
};

/** Admin: reject a subscription. */
export const useRejectAbonnement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => adminReject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['abonnement', 'admin'] }),
  });
};
