'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import CommentInput from './CommentInput.client';
import ConfirmModal from './ConfirmModal.client';
import { useLoggedInUser } from '@/app/_hooks/channel/useLoggedInUser';
import CommentDropdown from './CommentDropdown.client';

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

  // 커스텀 훅을 통해 로그인 사용자 정보 사용
  const loggedInUserId = useLoggedInUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const defaultImage = '/channelPage/blank_profile.svg';

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

  const handleReport = () => {
    alert('신고 기능은 준비 중입니다.');
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-start w-full p-4 bg-gray-50 border-b border-gray-200 relative">
      {isEditing ? (
        <CommentInput value={editContent} onChange={handleChange} onClick={handleSave} />
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
          <Image src="/channelPage/more_vert.svg" alt="아이콘" width={18} height={18} />
        </button>
        {isDropdownOpen && (
          <CommentDropdown
            isOwner={loggedInUserId === commentUserId}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onReport={handleReport}
          />
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
