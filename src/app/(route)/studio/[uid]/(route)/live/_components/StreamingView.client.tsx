'use client';

import React from 'react';
import Link from 'next/link';
import StreamingStatus from '@/app/_components/StreamingArea/StreamingStatus.client';

const StreamingView = ({ uid }: { uid: string }) => {
  return (
    <div className="relative flex flex-col justify-center items-center min-h-[500px] bg-gray-200 bg-[url('https://ssl.pstatic.net/static/nng/glive-center/resource/p/static/media/player_loading_chzzk.784104a77733493ed42f.gif')] bg-cover bg-center">
      <p className="text-white">방송 시작 및 종료를 위한 페이지로 이동합니다.</p>
      <p className="text-white font-bold">{'방송을 시작하기 위해서 아래 버튼을 눌러 페이지를 띄워주세요.'}</p>
      <div className="mt-[30px]">
        <Link
          href={`/streaming-view/${uid}`}
          target="_blank"
          className="rounded-2xl bg-white text-[#697183] text-[15px] font-blackHanSans py-2 px-4"
        >
          이동하기
        </Link>
      </div>
      <StreamingStatus />
    </div>
  );
};

export default StreamingView;
