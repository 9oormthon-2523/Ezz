'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CommentInput from './CommentInput';
import { createClient } from '@/app/_utils/supabase/client';
import ConfirmModal from './ConfirmModal'; 

interface Props {
  nickname: string;
  content: string;
  profile_img: string | null;
  commentUserId: string;
  onEdit: () => void;
  onDelete: () => void;
  isEditing?: boolean;
  editContent?: string;
  onEditChange?: (value: string) => void;
  onEditSave?: () => void;
}

const Comment = (props: Props) => {
  const {
    nickname,
    content,
    profile_img,
    commentUserId,
    onEdit,
    onDelete,
    isEditing = false,
    editContent = '',
    onEditChange,
    onEditSave,
  } = props;

  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const defaultImage = '/channelPage/blank_profile.svg';

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

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleEditClick = () => {
    onEdit();
    setIsDropdownOpen(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true); 
    setIsDropdownOpen(false);
  };

  const confirmDelete = async () => {
    await onDelete();
    setShowDeleteModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onEditChange) {
      onEditChange(e.target.value);
    }
  };

  const handleSave = async () => {
    if (onEditSave) {
      await onEditSave();
    }
  };

  return (
    <div className="flex items-start w-full p-4 bg-gray-50 border-b border-gray-200 relative">
      {isEditing ? (
        <CommentInput
          value={editContent}
          onChange={handleChange}
          onClick={handleSave}
        />
      ) : (
        <>
          <div className="flex flex-col flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-md text-sm mr-2 relative">
            <Image
              src={profile_img || defaultImage}
              alt="프로필 이미지"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>

          <div className="flex flex-col flex-wrap w-full">
            <p className="text-m font-black">{nickname}</p>
            <div className="text-m w-full break-words">{content}</div>
          </div>
        </>
      )}

      <div className="ml-auto relative">
        <button
          onClick={toggleDropdown}
          className="w-4 h-4 flex items-center justify-center bg-gray-50 rounded-md hover:bg-gray-300 z-10"
        >
          <Image
            src="/channelPage/more_vert.svg"
            alt="아이콘"
            width={18}
            height={18}
          />
        </button>

        {isDropdownOpen && (
          <div
            className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-20 z-[10]"
            style={{ overflow: 'visible' }}
          >
            {loggedInUserId === commentUserId ? (
              <>
                <button
                  onClick={handleEditClick}
                  className="flex w-full p-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Image
                    src="/channelPage/edit.svg"
                    alt="수정"
                    width={18}
                    height={18}
                    className="mr-2"
                  />
                  수정
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="flex w-full text-left font-bold p-2 text-sm text-red-500 hover:bg-gray-100 rounded-lg"
                >
                  <Image
                    src="/channelPage/delete.svg"
                    alt="삭제"
                    width={18}
                    height={18}
                    className="mr-2"
                  />
                  삭제
                </button>
              </>
            ) : (
              <button
                className="flex w-full text-left m-auto align-middle font-bold p-2 text-sm hover:bg-gray-100 rounded-lg"
                onClick={() => alert('신고 기능은 준비 중입니다.')}
              >
                <Image
                  src="/channelPage/invisible.svg"
                  alt="신고"
                  width={18}
                  height={18}
                  className="ml-1 mr-2"
                />
                신고
              </button>
            )}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <ConfirmModal
          message="정말로 이 댓글을 삭제할까요?"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default Comment;
