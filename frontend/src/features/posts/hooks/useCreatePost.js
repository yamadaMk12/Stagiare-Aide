import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../api/postsApi';

/**
 * Custom hook to handle post creation.
 * Invalidates the 'posts' query key to automatically refresh the feed on success.
 */
const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData) => createPost(postData).then((res) => res.data),
    onSuccess: () => {
      // Refresh the feed posts list
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      // Refresh the user's sidebar stats (demandes count)
      queryClient.invalidateQueries({ queryKey: ['stats', 'user'] });
      // Refresh trending technologies (a new technology might have been added/trending)
      queryClient.invalidateQueries({ queryKey: ['stats', 'trending'] });
    },
  });
};

export default useCreatePost;
