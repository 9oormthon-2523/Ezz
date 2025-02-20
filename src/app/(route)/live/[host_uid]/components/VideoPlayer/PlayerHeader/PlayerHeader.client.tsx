"use client"
import React from 'react'
import LiveBox from './LiveBox';
import PlayerHeaderButton, { PlayerHeaderButtonProps } from './PlayerHeaderButton.client';
import useLiveControl from '@/app/_store/stores/live/useLiveControl';

/**
 * 비디오 플레이어 헤더
 */

const PlayerHeader = () => {;
  const isChatOpen = useLiveControl(state => state.screen.state.isChatOpen);
  const toggleChat = useLiveControl(state => state.screen.actions.toggleChat);
  const is_active = useLiveControl(state => state.streamRoom.state.is_active);

  const ChattingControl:PlayerHeaderButtonProps = {
    fnName:"채팅 토글",
    iconName:"VideoChatFold",
    onClick: () => toggleChat(),
  }

  return (
    <div className='absolute left-0 right-0 top-0'>
        <div className='flex justify-end gap-[0_40px] p-[15px_15px_0] w-full'>
          <div className='flex flex-col'>
            {/* LIVE BOX */}
            {is_active && <LiveBox/>}

            {/* CONTROL BUTTONS */}
            <div className='items-end flex flex-col gap-[10px_0] mt-[20px]'>
              { !isChatOpen && <PlayerHeaderButton {...ChattingControl}/> }
            </div>
          </div>
      </div>
    </div>
  );
};
//리사이즈 될 때마다 불필요하게 렌더링 되서 memo사용
export default React.memo(PlayerHeader);