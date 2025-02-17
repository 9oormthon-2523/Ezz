import React, { useState } from 'react';
import SvgIcon from '@/app/_components/SVGIcon.server';
/**
 * 채팅 입력란
 */
type MessageInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  client_uid: string | undefined;
};
const ChatInput = ({ value, onChange, onSend, client_uid }: MessageInputProps) => {
  const [isComposing, setIsComposing] = useState(false);
  const onPressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (navigator.userAgent.includes('Firefox')) {
        if (!e.nativeEvent.isComposing) {
          onSend();
        }
      } else if (!isComposing) {
        onSend();
      }
    }
  };
  return (
    <div id="live-chatting-area" className="flex-none p-[10px_20px] relative z-[30]">
      <div className="items-center bg-[#f5f5f5] rounded-[8px] flex p-[5px] relative w-full">
        <button className="items-center flex-none h-[30px] relative w-[30px]">
          <i className="bg-[#0000001a] rounded-[5px] text-[#2e3033] inline-block h-[24px] p-[2px] align-top w-[24px]">
            <SvgIcon name="ChatSetting" width={20} height={20} />
          </i>
        </button>
        <div className="flex w-full items-center">
          <textarea
            aria-label="채팅 입력"
            disabled={!client_uid}
            style={{ cursor: client_uid ? undefined : 'not-allowed' }}
            className="h-[40px] p-[10px] bg-transparent border-[0px] text-[#2e3033] max-h-[60px] min-h-[20px] outline-none overflow-hidden resize-none whitespace-normal flex-grow"
            value={value}
            onChange={onChange}
            onKeyDown={onPressEnter}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder="채팅을 입력해주세요"
            maxLength={100}
          />

          <span className="w-full text-right text-sm text-gray-400 mt-1">{value.length}/100</span>
        </div>
      </div>

      <div className="items-center flex mt-[10px] p-[2px_0] relative">
        <button
          type="button"
          className="bg-[#f5f5f5] rounded-[8px] flex-none text-[13px] h-[28px] ml-auto p-[0_9px]"
          onClick={onSend}
        >
          채팅
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
