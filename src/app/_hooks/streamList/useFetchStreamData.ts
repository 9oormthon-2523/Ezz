import { useQuery } from '@tanstack/react-query';
import { fetchStreamData } from '@/app/_store/queries/streamList/query';

export const useFetchStreamData = (categorySlug?: string | string[] | undefined) => {
  return useQuery({
    queryKey: ['streamData', categorySlug],
    queryFn: () => fetchStreamData(categorySlug),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
