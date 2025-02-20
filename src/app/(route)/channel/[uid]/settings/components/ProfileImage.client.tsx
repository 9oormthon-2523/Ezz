'use client';
import Image from "next/image";

interface ProfileImageProps {
  previewUrl: string;
  defaultImage: string;
  nickname: string;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteImage: () => void;
}

export default function ProfileImage({
  previewUrl,
  defaultImage,
  nickname,
  onImageChange,
  onDeleteImage,
}: ProfileImageProps) {
  return (
    <div className="flex gap-2">
      <p className="w-24 mt-4 shrink-0 font-bold text-gray-700 mr-6 mb-24">프로필 이미지</p>
      <div className="flex flex-row items-center gap-2">
        <div className="w-32 h-32 rounded-full flex-shrink-0 shadow-md mr-4 relative">
          <Image 
            src={previewUrl || defaultImage} 
            alt={`${nickname} profile`} 
            layout="fill" 
            objectFit="cover" 
            className="rounded-full" 
          />
        </div>
        <label className="ml-2 inline-flex items-center h-9 px-4 py-2 bg-gray-50 text-sm font-semibold rounded-md cursor-pointer border border-gray-200 hover:bg-gray-200">
          이미지 수정
          <input type="file" onChange={onImageChange} className="hidden" />
        </label>
        <button
          onClick={onDeleteImage}
          className="ml-2 inline-flex items-center h-9 px-4 py-2 bg-gray-50 text-sm font-semibold rounded-md cursor-pointer border border-gray-200 hover:bg-gray-200"
        >
          이미지 삭제
        </button>
      </div>
    </div>
  );
}
