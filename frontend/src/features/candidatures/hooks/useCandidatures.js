import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCandidatures, updateCandidatureStatut } from '../api/candidaturesApi';

/**
 * Hook to retrieve all received and sent candidatures.
 */
export const useCandidatures = () => {
  return useQuery({
    queryKey: ['candidatures'],
    queryFn: () => getCandidatures().then((res) => res.data),
  });
};

/**
 * Hook to update the status of a candidature.
 */
export const useUpdateCandidatureStatut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, statut }) => updateCandidatureStatut(id, statut).then((res) => res.data),
    onSuccess: () => {
      // Invalidate and refetch to keep the list synchronized
      queryClient.invalidateQueries({ queryKey: ['candidatures'] });
    },
  });
};
