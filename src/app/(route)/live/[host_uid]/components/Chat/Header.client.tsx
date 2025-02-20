import React from 'react';
import { usePathname } from 'next/navigation';
import SvgIcon from '../../../../../_components/SVGIcon.server';

interface ChatHeaderProps {
  ChatFold: () => void;
  uid: string;
};


/**
* 채팅 헤더 컴포넌트
*/
const ChatHeader = (props: ChatHeaderProps) => {
  const { ChatFold, uid } = props;
  const pathname = usePathname();

  return (
    <div
      id="chatting-header-container"
      className="h-[44px] relative box-border"
    >
      <h2 className="flex items-center justify-center bg-[#fff] border border-solid border-t-[#0000000f] border-b-[#0000000f] border-l-0 border-r-0 text-[#2e3033] text-[15px] font-normal h-full px-11 relative z-10">
        채팅
      </h2>

      {pathname === `/live/${uid}` && (
        <>
          <div className=" absolute top-0 z-[100] box-border w-[44px] h-[44px]">
            <button
              onClick={ChatFold}
              type="button"
              aria-label="chatting-layout-fold"
              className="text-[#666] overflow-hidden p-[8px] w-[inherit] h-[inherit]"
            >
              <SvgIcon
                name="ChatFold"
                width={28}
                height={28}
                className="rounded-lg hover:text-black hover:brightness-90 bg-white"
              />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatHeader;
