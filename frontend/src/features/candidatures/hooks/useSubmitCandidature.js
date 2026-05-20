import { useMutation } from '@tanstack/react-query';
import { storeCandidature } from '../api/candidaturesApi';

/**
 * Hook to submit a candidature for a post.
 * Usage: const { mutate, isPending, isSuccess, isError, error } = useSubmitCandidature();
 *        mutate({ postId, message });
 */
const useSubmitCandidature = () => {
  return useMutation({
    mutationFn: ({ postId, message }) => storeCandidature(postId, message),
  });
};

export default useSubmitCandidature;
