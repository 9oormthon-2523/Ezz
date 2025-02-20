"use client";

import { HostInfoState, StreamRoomState } from "@/app/_types/live/liveType";
import usePing from "@/app/_utils/live/db/usePing.client";
import useLiveInfo from "@/app/_utils/live/db/useLiveInfo.client";
import useLiveControl from "@/app/_store/stores/live/useLiveControl";
import useNavToggle from "@/app/_store/main/useNavToggle.client";
import LiveTotalWrapper from "../components/Wrapper/LiveTotalWrapper.clinet";
import LiveStreamWrapper from "../components/Wrapper/LiveStreamWrapper.client";
import NavBar from "@/app/(route)/(main)/_components/NavBar/NavBar.client";
import LiveDetail from "./LiveDetails.client";
import ChatLayout from "./Chat.client";

import dynamic from "next/dynamic";
import VideoLoadingCompo from "../components/Loading/VideoLoadingCompo.client";

const VideoPlayer = dynamic(() => import("./VideoPlayer.client"), { 
  ssr: false,
  loading: ()=> <VideoLoadingCompo/>
});

interface StreamingPageProps {
  hostInfo:HostInfoState;
  streamRoom:StreamRoomState;
};

export default function StreamingPage(props: StreamingPageProps) {
  const isOpen = useNavToggle((state) => state.isOpen);
  const isFullOrWide = useLiveControl(state => state.screen.state.isFullOrWide);

  // 초기값 세팅
  useLiveInfo(props);

  // 핑(시청자 수)
  usePing(props.streamRoom.client_uid);
  
  return (
    <>
    {isOpen && <NavBar />}
      <LiveTotalWrapper>
        <LiveStreamWrapper>

          {/* 비디오 플레이어 */}
          <VideoPlayer/>
          
          {/* 방송 정보 */}
          {!isFullOrWide &&<LiveDetail/>}

        </LiveStreamWrapper>

        {/* 채팅창 */}
        <ChatLayout client_uid={props.streamRoom.client_uid} roomId={props.streamRoom.host_uid}/>
      </LiveTotalWrapper>
    </>
  );
};
