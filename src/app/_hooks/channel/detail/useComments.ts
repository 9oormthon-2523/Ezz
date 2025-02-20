import { useEffect, useState } from 'react';
import { createClient } from '@/app/_utils/supabase/client';

export interface CommentType {
  id: number;
  nickname: string;
  content: string;
  created_at: string;
  profile_img: string | null;
  user_id: string;
  isEditing?: boolean;
  editContent?: string;
}

export function useComments(postid: string | undefined) {
  const [comments, setComments] = useState<CommentType[]>([]);

  const fetchComments = async () => {
    if (!postid) return;
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('comments')
        .select('id, content, created_at, user_id')
        .eq('post_id', postid);

      if (error) {
        console.error('댓글 불러오기 오류:', error);
      } else if (data) {
        const commentUserInfo = await Promise.all(
          data.map(async (comment) => {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('nickname, profile_img')
              .eq('id', comment.user_id)
              .single();

            if (userError) {
              console.error('사용자 정보 불러오기 오류:', userError);
            }

            return {
              ...comment,
              nickname: userData?.nickname || '익명',
              profile_img: userData?.profile_img || null,
              isEditing: false,
              editContent: comment.content,
            };
          })
        );
        setComments(commentUserInfo);
      }
    } catch (err) {
      console.error('댓글 불러오기 에러:', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postid]);

  return { comments, setComments, fetchComments };
}
