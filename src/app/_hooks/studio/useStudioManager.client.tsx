import { useRef, useState } from 'react';
import { audioControl } from './media/audioControls';
import type * as AgoraRTCType from 'agora-rtc-sdk-ng';
import useAudienceCnt from './audience/useAudienceCnt';
import { delClient, initializeClient } from './client/useClient.client';
import { extractMediaTrack, unpublishMediaTracks } from './media/useMediaTrack';
import { useStreamingOnOff } from '@/app/_store/queries/streamingSettings/mutation';

/**
 * 호스트가 사용하는 스트리밍 훅
 */

type micResource = 'screen' | 'mic';
type mediaResource = 'all' | micResource;

const useStudioManager = (uid: string) => {
  const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID! || '';
  const clientRef = useRef<AgoraRTCType.IAgoraRTCClient | null>(null);
  const screenTrackRef = useRef<null | AgoraRTCType.ILocalVideoTrack>(null);
  const screenAudioRef = useRef<null | AgoraRTCType.ILocalAudioTrack>(null);
  const micTrackRef = useRef<null | AgoraRTCType.IMicrophoneAudioTrack>(null);
  const [audioVolume, setAudioVolume] = useState<{
    screen: number;
    mic: number;
  }>({ screen: 0, mic: 0 });
  const audioConrol = audioControl({
    micTrackRef,
    screenAudioRef,
    setAudioVolume,
  }); // 오디오 컨트롤 훅

  const { onMutation, offMutation } = useStreamingOnOff(uid);
  const { activateChannel, deactivateChannel } = useAudienceCnt({ host_uid: uid });

  // 사용법 addTrackShare():스크린 + 마이크 / addTrackShare("mic"):마이크 / addTrackShare("screen"): 스크린
  const addTrackShare = (type: mediaResource = 'all') =>
    extractMediaTrack({
      clientRef,
      micTrackRef,
      screenAudioRef,
      screenTrackRef,
      type,
      audioVolume,
    });

  // 공유 트랙 전부 해제
  const stopTrackShare = () =>
    unpublishMediaTracks({
      clientRef,
      micTrackRef,
      screenAudioRef,
      screenTrackRef,
    });

  // 호스트 클라이언트 생성 및 채널 구독
  const streamOn = async () => {
    try {
      await initializeClient({ APP_ID, channel: uid, clientRef, uid });
      await onMutation();
      activateChannel();
      return true;
    } catch (err: unknown) {
      await delClient(clientRef);
      console.log(err);
      return false;
    }
  };

  // 미디어 공유 해제 및 클라이언트 해제
  const streamOff = async () => {
    try {
      await unpublishMediaTracks({
        clientRef,
        micTrackRef,
        screenAudioRef,
        screenTrackRef,
      });
      await delClient(clientRef);
      await offMutation();
      deactivateChannel();
      return true;
    } catch (err: unknown) {
      console.log(err);
      return false;
    }
  };

  return {
    streamOn,
    streamOff,
    addTrackShare,
    stopTrackShare,
    volumeControl: { ...audioConrol, audioVolume },
    screenTrackRef,
    clientRef,
  };
};

export default useStudioManager;
