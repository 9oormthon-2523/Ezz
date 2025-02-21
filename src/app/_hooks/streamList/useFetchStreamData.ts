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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'streaming_rooms' }, async (payload) => {
        const updatedStream = await fetchStreamData(categorySlug);

        setRealTimeData((prevData) => {
          const updatedMap = new Map(prevData.map((stream) => [stream.uid, stream]));

          updatedStream.forEach((stream) => {
            updatedMap.set(stream.uid, stream);
          });

          return Array.from(updatedMap.values());
        });
      })
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
