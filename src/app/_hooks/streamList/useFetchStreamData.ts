import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchStreamData } from '@/app/_store/queries/streamList/query';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export const useFetchStreamData = (categorySlug?: string | string[] | undefined) => {
  const [realTimeData, setRealTimeData] = useState<any[]>([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['streamData', categorySlug],
    queryFn: () => fetchStreamData(categorySlug),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  useEffect(() => {
    const subscription = supabase
      .channel('streaming_rooms')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'streaming_rooms' }, // ✅ 모든 이벤트 감지
        async (payload) => {
          console.log('🔄 실시간 업데이트 감지:', payload);

          const updatedData = await fetchStreamData(categorySlug);
          setRealTimeData(updatedData);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [categorySlug]);

  return {
    data: realTimeData.length > 0 ? realTimeData : data,
    isLoading,
    error,
    refetch,
  };
};
