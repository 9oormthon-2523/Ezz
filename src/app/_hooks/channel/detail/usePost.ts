import { useEffect, useState } from 'react';
import { createClient } from '@/app/_utils/supabase/client';

export interface PostDetail {
  id: number;
  nickname: string;
  content: string;
  created_at: string;
  img_url: string | null;
  profile_img: string | null;
  user_id: string;
}

export function usePost(postid: string | undefined) {
  const [post, setPost] = useState<PostDetail | null>(null);

  useEffect(() => {
    if (!postid) {
      console.log('postid가 없음');
      return;
    }

    const fetchPostById = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('posts')
          .select('id, nickname, content, created_at, img_url, user_id')
          .eq('id', postid)
          .single();

        if (error) {
          console.error('게시글 불러오기 오류:', error);
        } else if (data) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('profile_img')
            .eq('id', data.user_id)
            .single();

          if (userError) {
            console.error('작성자 프로필 이미지 가져오기 오류:', userError);
          }

          setPost({
            ...data,
            profile_img: userData?.profile_img || null,
          });
        }
      } catch (err) {
        console.error('불러오기 에러:', err);
      }
    };

    fetchPostById();
  }, [postid]);

  return post;
}
