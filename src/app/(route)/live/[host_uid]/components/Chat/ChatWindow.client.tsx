"use client";
import { Message } from "@/app/_types/chat/Chat";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getColorFromNickname } from "@/app/_utils/chat/hashColor";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { throttle } from "../../utils/local/throttle.client";
import ArrowBttom from "@public/livePage/Chat/arrowBottom.svg"
/**
 * 채팅 창
 */

//프롭스는 나중에
type MessageListProps = {
  messages: Message[];
  roomId: string;
};

const ChatWindow = ({ messages, roomId }: MessageListProps) => {
  const chatFrameRef = useRef<HTMLDivElement>(null);
  const isScrollendRef = useRef<boolean>(true); 

  // 스크롤 끝으로 이동
  const setScrollEnd = () => {
    const chatContainer = chatFrameRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight; 
      if (!isScrollendRef.current) {
        isScrollendRef.current = true;
      }
    }
  }

  // 새로운 채팅이 들어왔을 때 스크롤이 끝이면 실행행
  const scrollToBottom = () => {
    if (isScrollendRef.current === true) {
      setScrollEnd();
    }
  };

  // 스크롤 상태 가져오기기
  const getScrollState = () => {
    const chatFrame = chatFrameRef.current;
    if (chatFrame) {
      const isAtBottom =
        chatFrame.scrollTop + chatFrame.clientHeight >= chatFrame.scrollHeight - 1;
      isScrollendRef.current = isAtBottom;
    }
  };

  useEffect(()=>{
    const chatFrame = chatFrameRef.current;
    const throttledScrollHandler = throttle(getScrollState, 200);

    chatFrame?.addEventListener("scroll", throttledScrollHandler);

    return ()=> {
      chatFrame?.removeEventListener("scroll", throttledScrollHandler);
    }
  },[]);

  useEffect(() => {
    scrollToBottom(); 
    console.log("msg:", messages);
  }, [messages]);

  return (
    <div
      id="chatting-list-container"
      className="flex flex-[1_1] overflow-hidden relative"
    >
      <div
        ref={chatFrameRef} 
        style={{ scrollbarWidth: "none" }}
        className="flex flex-col overflow-y-auto p-[0_12px] w-full"
      >
        {/* 채팅 */}
        <div id="empty-box-forChat" aria-label="빈 박스" />
        <div className="text-[14px]">
          {messages.map((msg, idx) => (
            <ChatBox
              key={idx}
              nickname={msg.nickname}
              message={msg.message}
              id={msg.id}
              roomId={roomId}
            />
          ))}
          <button onClick={setScrollEnd} className="outline-none absolute rounded-full bottom-0 right-[12px] w-[28px] h-[28px] bg bg-[#eeeeee] flex items-center justify-center text-[18px]">
            <ArrowBttom/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

type ChatProps = {
  nickname: string;
  message: string;
  id: string;
  roomId: string;
};

//채팅 박스
const ChatBox = ({ nickname, message, id, roomId }: ChatProps) => {
  const router = useRouter();
  const handleNicknameClick = () => {
    router.push(`/channel/${id}`);
  };

  const nicknameColor = getColorFromNickname(nickname);
  const isBroadcaster = id === roomId;
  return (
    <div aria-label="chat w-full">
      <button
        onClick={handleNicknameClick}
        style={{ overflowWrap: "anywhere"}}
        className="px-[6px] py-[4px] text-left break-all whitespace-pre-wrap text-black rounded-md hover:bg-[#00000008] cursor-pointer"
      >
        <span className="align-middle mr-[6px]">  
          {isBroadcaster && (
            <span className={`align-middle font-bold text-[#1bb373] mr-1 text-xl inline-block`}>
              <IoShieldCheckmarkSharp />
            </span>
          )}
            <span      
              style={{ 
                color: isBroadcaster ? "#3a4338" : nicknameColor, // 조건에 따라 색상 적용
            }}>{nickname}</span>
          </span>
          {message}
      </button>
    </div>
  );
};

