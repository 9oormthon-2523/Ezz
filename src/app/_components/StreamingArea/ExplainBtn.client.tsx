'use client';

import React, { useState } from 'react';
import ClientPortal from '../ClientPortal';

const ExplainBtn = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* 모달 열기 버튼 */}
      <div className="absolute top-8 right-8 flex gap-2 items-center">
        <button
          className="group relative h-12 w-12 rounded-full bg-white text-2xl hover:bg-zinc-300"
          onClick={() => setShowModal(true)}
        >
          <span>?</span>
          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 w-[100px] opacity-0 group-hover:opacity-100 transition-opacity bg-[#2e3033] text-white p-2 rounded-lg text-sm font-bold pointer-events-none">
            사용 설명서
          </div>
        </button>
      </div>

      {/* 사용 설명서 모달 */}
      <ClientPortal show={showModal} onClose={() => setShowModal(false)}>
        <div className="relative w-[500px] h-auto flex flex-col bg-white shadow-lg rounded-lg p-6">
          {/* 제목 */}
          <h2 className="font-blackHanSans text-3xl text-center text-gray-800 mb-6">
            Ezz 스트리밍 브라우저 사용 설명서
          </h2>

          {/* 내용 */}
          <div className="flex flex-col justify-center items-center gap-10">
            {/* 스트리밍 시작 안내 */}
            <div className="flex flex-col gap-2 items-center text-center">
              <strong className="text-xl">🚀 스트리밍 시작하기 🚀</strong>
              <p className="text-gray-700">
                1️⃣ <b>스트리밍 시작하기</b> 버튼을 눌러주세요.
              </p>
              <p className="text-sm text-gray-700">
                2️⃣ <b>화면 공유 변경</b> 버튼으로 공유할 화면을 선택하세요.
              </p>
              <p className="text-sm text-gray-700">3️⃣ 우측 하단에 비디오가 보이면 성공!</p>
            </div>

            {/* 주의사항 */}
            <div className="flex flex-col gap-2 items-center text-center">
              <strong className="text-xl text-red-400">🚨 주의 사항 🚨</strong>
              <p className="text-sm text-gray-700">
                ❗ <b>새로고침</b>하거나 <b>페이지를 떠나면</b> 방송이 종료됩니다.
              </p>
            </div>
          </div>

          {/* 닫기 버튼 */}
          <button
            className="absolute -top-9 -right-9 text-white font-extrabold bg-blue-500 hover:bg-blue-600 transition-all rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-md"
            onClick={() => setShowModal(false)}
          >
            ✕
          </button>
        </div>
      </ClientPortal>
    </>
  );
};

export default ExplainBtn;
