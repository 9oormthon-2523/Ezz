import React, { Suspense, useEffect, useState } from 'react';
import StreamCard from '@/app/_components/StreamList/StreamCard/StreamCard.server';
import { createClient } from '@supabase/supabase-js';

interface StreamCardData {
  uid: string;
  title: string;
  start_time: string;
  is_active: boolean;
  audience_cnt: number;
  nickname: string;
  thumbnail: string;
  profile_img: string;
  tags: string[];
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const StreamList: React.FC = () => {
  const [streamData, setStreamData] = useState<StreamCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        const { data: streamData, error: streamError } = await supabase
          .from('streaming_rooms')
          .select('uid, title, start_time, is_active, audience_cnt, nickname, thumbnail,tags');

        if (streamError) {
          console.error('데이터를 가져오는 중 오류 발생:', streamError.message);
          return;
        }

        const enrichedData = await Promise.all(
          streamData.map(async (stream) => {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('profile_img')
              .eq('id', stream.uid)
              .single();

            if (userError) {
              console.error(`사용자 정보 불러오기 오류 (uid: ${stream.uid})`, userError);
              return { ...stream, profile_img: '' };
            }

            return { ...stream, profile_img: userData.profile_img || '' };
          }),
        );

        setStreamData(enrichedData || []);
      } catch (error) {
        console.error('오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamData();
  }, []);

  return (
    <div className="flex flex-wrap gap-4 px-4 justify-center items-center">
      {loading ? (
        <SkeletonStreamList />
      ) : (
        streamData.map((data: StreamCardData) => <StreamCard key={data.uid} {...data} />)
      )}
    </div>
  );
};

const SkeletonStreamList = () => (
  <div className="flex flex-wrap gap-4 px-4 justify-center items-center">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="animate-pulse w-80 h-44 bg-gray-300 rounded-lg"></div>
    ))}
  </div>
);

export default StreamList;
