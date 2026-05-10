import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../api/postsApi';

/**
 * Hook to fetch and manage the list of active posts.
 * Returns { data, isLoading, isError, error } from React Query.
 */
const usePosts = (page = 1) => {
  return useQuery({
    queryKey: ['posts', page],
    queryFn: () => getPosts(page).then((res) => res.data),
    keepPreviousData: true,
  });
};

export default usePosts;
