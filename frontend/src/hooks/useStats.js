import { useQuery } from '@tanstack/react-query';
import { getUserStats, getTrendingTechnologies, getTopHelpers, getFilieres, getTechnologies } from '../api/statsApi';

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

export const useFilieres = () => {
  return useQuery({
    queryKey: ['filieres'],
    queryFn: () => getFilieres().then(res => res.data.filieres),
  });
};

export const useTechnologies = () => {
  return useQuery({
    queryKey: ['technologies'],
    queryFn: () => getTechnologies().then(res => res.data.technologies),
  });
};
