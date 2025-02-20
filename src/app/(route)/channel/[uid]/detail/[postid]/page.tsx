'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/app/_utils/supabase/client';
import Comment from '../../components/Comment';
import CommentInput from '../../components/CommentInput';
import Image from 'next/image';
import ConfirmModal from '../../components/ConfirmModal'; 

interface PostDetail {
  id: number;
  nickname: string;
  content: string;
  created_at: string;
  img_url: string | null;
  profile_img: string | null;
  user_id: string;
}

interface CommentType {
  id: number;
  nickname: string;
  content: string;
  created_at: string;
  profile_img: string | null;
  user_id: string;

  isEditing?: boolean;  
  editContent?: string; 
}

export default function Detail() {
  const router = useRouter();
  const { postid, uid } = useParams();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const formattedDate = post ? new Date(post.created_at).toLocaleString() : '';
  const defaultImage = '/channelPage/blank_profile.svg';

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('로그인 사용자 정보 불러오기 오류:', error);
      } else {
        setLoggedInUserId(data?.user?.id || null);
      }
    };

    fetchLoggedInUser();
  }, []);

  // 게시글 불러오기
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
        } 
        if (data) {
          // 작성자 프로필 이미지 가져오기
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

  // 댓글 목록 불러오기
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
      } else {
        const commentUserInfo = await Promise.all(
          data.map(async (comment) => {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('nickname, profile_img')
              .eq('id', comment.user_id)
              .single();

            if (userError) {
              console.error('사용자 정보 불러오기 오류', userError);
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

  // 게시글 삭제
  const handleDelete = async () => {
    if (!postid) return;
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postid);

      if (error) {
        console.error('게시글 삭제 오류:', error);
      } else {
        console.log('게시글 삭제 완료');
        router.push(`/channel/${uid}`);
      }
    } catch (err) {
      console.error('게시글 삭제 에러:', err);
    }
  };

  // 모달창 확인 삭제
  const confirmDelete = async () => {
    await handleDelete();
    setShowDeleteModal(false);
  };

  // 댓글 추가
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (!newComment) return;

    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();

      if (userData?.user?.id) {
        const { error } = await supabase
          .from('comments')
          .insert([
            {
              content: newComment,
              post_id: postid,
              user_id: userData.user.id,
            },
          ]);

        if (error) {
          console.error('댓글 추가 오류:', error);
        } else {
          setNewComment('');
          await fetchComments();
        }
      }
    } catch (err) {
      console.error('댓글 추가 에러:', err);
    }
  };

  // 댓글 수정
  const handleCommentEditStart = (id: number) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, isEditing: true, editContent: c.content }
          : c
      )
    );
  };

  // 댓글 수정 저장
  const handleCommentEditSave = async (id: number) => {
    const targetComment = comments.find((c) => c.id === id);
    if (!targetComment) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('comments')
        .update({ content: targetComment.editContent })
        .eq('id', id);

      if (error) {
        console.error('댓글 수정 오류:', error);
      } else {
        console.log('댓글 수정 완료');
        setComments((prev) =>
          prev.map((c) =>
            c.id === id
              ? { ...c, isEditing: false, content: c.editContent || '' }
              : c
          )
        );
      }
    } catch (err) {
      console.error('댓글 수정 에러:', err);
    }
  };

  // 댓글 수정 내용 변경
  const handleCommentEditChange = (id: number, value: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, editContent: value } : c
      )
    );
  };

  // 댓글 삭제
  const handleCommentDelete = async (id: number) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('댓글 삭제 오류:', error);
      } else {
        console.log('댓글 삭제 완료');
        setComments((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error('댓글 삭제 에러:', err);
    }
  };

  const isPostOwner = loggedInUserId === post?.user_id;

  if (!post) {
    return <div className="p-4">게시글을 불러오는 중입니다...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex gap-2">
        <button
          className="mt-4 px-4 py-2 bg-gray-100 font-bold rounded-xl hover:bg-gray-200"
          onClick={() => router.push(`/channel/${uid}`)}
        >
          목록
        </button>
        {isPostOwner && (
          <>
            <button
              className="mt-4 px-4 py-2 bg-gray-100 font-bold rounded-xl hover:bg-gray-200"
              onClick={() => router.push(`/channel/${uid}/edit/${post.id}`)}
            >
              수정
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="mt-4 px-4 py-2 bg-gray-100 font-bold text-red-500 rounded-xl hover:bg-gray-200"
            >
              삭제
            </button>
          </>
        )}
      </div>

      <div className="mt-6 max-w-5xl flex flex-row bg-gray-50 p-4 rounded-tl-xl rounded-tr-xl border-b border-gray-300">
        <div className="flex flex-col flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-md text-sm mr-2 relative">
          <Image
            src={post.profile_img || defaultImage}
            alt="프로필 이미지"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col flex-wrap">
          <p className="text-m font-black">{post.nickname}</p>
          <p className="w-full text-sm font-semibold text-gray-700 mt-1">
            {formattedDate}
          </p>
          <div className="text-m w-full min-h-32 break-words mt-4">
            {post.content}
          </div>
          {post.img_url && (
            <div className="mt-4">
              <Image
                src={post.img_url}
                alt="게시글 이미지"
                width={500}
                height={300}
                unoptimized
                className="rounded border"
              />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl flex flex-col bg-gray-50 rounded-lg p-2 pb-10">
        <div className="m-4">
          <CommentInput
            value={newComment}
            onChange={handleCommentChange}
            onClick={handleCommentSubmit}
          />
        </div>

        {comments.map((comment) => (
          <Comment
            key={comment.id}
            nickname={comment.nickname}
            content={comment.content}
            profile_img={comment.profile_img}
            commentUserId={comment.user_id}
            onEdit={() => handleCommentEditStart(comment.id)}
            onDelete={() => handleCommentDelete(comment.id)}
            isEditing={comment.isEditing} 
            editContent={comment.editContent} 
            onEditChange={(value: string) =>
              handleCommentEditChange(comment.id, value)
            }
            onEditSave={() => handleCommentEditSave(comment.id)}
          />
        ))}
      </div>
      <div className="h-32" />

      {showDeleteModal && (
        <ConfirmModal
          message="정말로 이 글을 삭제할까요?"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}
