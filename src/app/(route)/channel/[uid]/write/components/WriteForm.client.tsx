'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/app/_utils/supabase/client';
import useFilePreview from '@/app/_hooks/channel/write/useFilePreview';

const supabase = createClient();

interface WriteFormProps {
  initialNickname: string;
  uid: string;
}

export default function WriteForm({ initialNickname, uid }: WriteFormProps) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [nickname] = useState(initialNickname);
  const { selectedFile, previewUrl, onFileChange } = useFilePreview();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let imageUrl = "";
    if (selectedFile) {
      const fileName = `${Date.now()}_${crypto.randomUUID()}`;
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('post_img')
        .upload(fileName, selectedFile);
      if (storageError) {
        console.error('이미지 업로드 오류:', storageError);
      } else if (storageData) {
        const { data: publicUrlData } = supabase
          .storage
          .from('post_img')
          .getPublicUrl(storageData.path);
        if (publicUrlData?.publicUrl) {
          imageUrl = publicUrlData.publicUrl;
        }
      }
    }

    const { error } = await supabase
      .from('posts')
      .insert([{ content: text, nickname: nickname, img_url: imageUrl, user_id: uid }]);
    if (error) {
      console.error('글쓰기 오류:', error);
    } else {
      router.push(`/channel/${uid}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="m-auto mt-12 p-8 w-full bg-gray-50 rounded-lg">
        <p className="text-xl font-black mb-4">글쓰기</p>
        <div className="mb-4">
          <label className="inline-flex items-center px-4 py-2 bg-gray-100 font-bold rounded-full cursor-pointer hover:bg-gray-200">
            <Image
              src="/channelPage/post_img.svg"
              alt="아이콘"
              width={24}
              height={24}
              className="mr-2"
            />
            사진
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </label>
        </div>
        {previewUrl && (
          <div className="mb-4">
            <div className="relative w-[200px] h-[200px]">
              <Image
                src={previewUrl}
                alt="미리 보기"
                fill
                unoptimized
                className="rounded border object-cover"
              />
            </div>
          </div>
        )}
        <textarea
          name="text"
          className="form-textarea mt-1 pt-4 block w-full h-96 bg-gray-50 outline-none resize-none border-t border-b border-gray-300"
          placeholder="어떤 이야기를 남길건가요?"
          value={text}
          onChange={handleInputChange}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className={`inline-flex justify-center py-2 px-4 w-24 border border-transparent shadow-sm text-sm rounded-md mt-4 font-black ${
              text ? "bg-[#1bb373] text-white" : "bg-gray-300 text-gray-500"
            }`}
          >
            등록
          </button>
        </div>
      </form>
      <div className="h-32" />
    </>
  );
}
