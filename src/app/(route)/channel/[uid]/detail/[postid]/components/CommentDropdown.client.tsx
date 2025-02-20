'use client';

import Image from 'next/image';
import React from 'react';

interface CommentDropdownProps {
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
}

const CommentDropdown: React.FC<CommentDropdownProps> = ({ isOwner, onEdit, onDelete, onReport }) => {
  return (
    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-20 z-[10]" style={{ overflow: 'visible' }}>
      {isOwner ? (
        <>
          <button onClick={onEdit} className="flex w-full p-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-lg">
            <Image src="/channelPage/edit.svg" alt="수정" width={18} height={18} className="mr-2" />
            수정
          </button>
          <button onClick={onDelete} className="flex w-full text-left font-bold p-2 text-sm text-red-500 hover:bg-gray-100 rounded-lg">
            <Image src="/channelPage/delete.svg" alt="삭제" width={18} height={18} className="mr-2" />
            삭제
          </button>
        </>
      ) : (
        <button onClick={onReport} className="flex w-full text-left m-auto align-middle font-bold p-2 text-sm hover:bg-gray-100 rounded-lg">
          <Image src="/channelPage/invisible.svg" alt="신고" width={18} height={18} className="ml-1 mr-2" />
          신고
        </button>
      )}
    </div>
  );
};

export default CommentDropdown;
