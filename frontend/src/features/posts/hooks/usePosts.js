import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../api/postsApi';

/**
 * Hook to fetch and manage the list of active posts.
 * Returns { data, isLoading, isError, error } from React Query.
 */
const usePosts = (filters = {}) => {
  const page = filters.page || 1;
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: () => getPosts(filters).then((res) => res.data),
    keepPreviousData: true,
  });
};

export default usePosts;
