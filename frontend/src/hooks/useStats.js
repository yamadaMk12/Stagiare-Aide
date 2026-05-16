import { useQuery } from '@tanstack/react-query';
import { getUserStats, getTrendingTechnologies, getTopHelpers } from '../api/statsApi';

export const useUserStats = () => {
  return useQuery({
    queryKey: ['stats', 'user'],
    queryFn: () => getUserStats().then(res => res.data),
  });
};

export const useTrendingTechnologies = () => {
  return useQuery({
    queryKey: ['stats', 'trending'],
    queryFn: () => getTrendingTechnologies().then(res => res.data),
  });
};

export const useTopHelpers = () => {
  return useQuery({
    queryKey: ['stats', 'top-helpers'],
    queryFn: () => getTopHelpers().then(res => res.data),
  });
};
