import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export const fetchStreamData = async (categorySlug?: string | string[] | undefined) => {
  let query = supabase
    .from('streaming_rooms')
    .select('uid, title, start_time, is_active, audience_cnt, nickname, thumbnail, tags');

  // 카테고리 페이지 일 경우 카테고리 별 필터링
  if (categorySlug) {
    query = query.eq('category', categorySlug);
  }

  const { data: streamData, error: streamError } = await query;

  if (streamError) {
    throw new Error(`데이터를 가져오는 중 오류 발생: ${streamError.message}`);
  }

  const userIds = streamData.map((stream) => stream.uid);

  const { data: userData, error: userError } = await supabase.from('users').select('id, profile_img').in('id', userIds);

  if (userError) {
    console.error('사용자 정보 불러오기 오류:', userError.message);
  }

  const userProfileMap = userData?.reduce(
    (acc, user) => {
      acc[user.id] = user.profile_img || '';
      return acc;
    },
    {} as Record<string, string>,
  );

  return streamData.map((stream) => ({
    ...stream,
    profile_img: userProfileMap?.[stream.uid] || '',
  }));
};
