import { useQuery } from '@tanstack/react-query';
import { searchPosts } from '../api/postsApi';

/**
 * Hook to search posts based on a query.
 * @param {string} query - The search term
 * @param {number} page - Current page
 */
const useSearchPosts = (query, page = 1) => {
  return useQuery({
    queryKey: ['posts', 'search', query, page],
    queryFn: () => searchPosts(query, page).then((res) => res.data),
    enabled: !!query, // Only run if there's a query
    keepPreviousData: true,
  });
};

export default useSearchPosts;
