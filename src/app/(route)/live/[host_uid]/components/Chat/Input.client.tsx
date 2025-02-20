import React from 'react';
import SvgIcon from '@/app/_components/SVGIcon.server';
/**
 * 채팅 입력란
 */
type MessageInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  client_uid: string | null;
};

const ChatInput = ({ value, onChange, onSend, client_uid }: MessageInputProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.length > 0) {
      onSend();
    }
  };

  return (
    <div 
      id="live-chatting-area" 
      className="flex-none p-[10px_20px] relative z-[30]"
    >
      <form onSubmit={handleSubmit} className="items-center bg-[#f5f5f5] rounded-[8px] flex p-[5px] relative w-full">

        <button disabled aria-label="chat-setting" type="button" className="cursor-not-allowed items-center flex-none h-[30px] relative w-[30px]">
          <i className="bg-[#0000001a] rounded-[5px] text-[#2e3033] inline-block h-[24px] p-[2px] align-top w-[24px]">
            <SvgIcon name="ChatSetting" width={20} height={20} />
          </i>
        </button>

        <div className="flex w-full items-center">

          <label htmlFor="chat-input" className="sr-only">채팅 입력</label>
          <input
            type="text"
            id='chat-input'
            autoComplete='off'
            disabled={!client_uid}
            style={{ cursor: client_uid ? undefined : 'not-allowed' }}
            className="h-[40px] p-[10px] bg-transparent border-[0px] text-[#2e3033] outline-none overflow-hidden flex-grow"
            value={value}
            onChange={onChange}
            placeholder="채팅을 입력해주세요"
            maxLength={100}
          />
          <span className="w-[50px] text-right text-sm text-gray-400 mt-1">{value.length}/100</span>
        </div>
      </form>

      <div className="items-center flex mt-[10px] p-[2px_0] relative">
        <button
          type="button"
          aria-label="send-chat-message"
          className={`rounded-[8px] flex-none text-[13px] h-[28px] ml-auto p-[0_9px] 
            ${value.length > 0 ? 'bg-[#1bb373] text-white' : 'bg-[#f5f5f5] text-[#2e3033]'}`}
          onClick={onSend}
          disabled={value.length <= 0}
        >
          채팅
        </button>
      </div>

    </div>
  );
};

export default ChatInput;