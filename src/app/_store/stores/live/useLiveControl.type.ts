import { HostInfoState, StreamRoomState } from "@/app/_types/live/liveType";

export type chatType = "side"|"bottom";

// 스크린 제어
export interface ScreenState {
    isChatOpen: boolean;
    isWidescreen: boolean;
    isFullscreen: boolean;
    isFullOrWide: boolean; 
    chatPosition: chatType;
}

export interface ScreenAction {
    toggleChat: () => void;
    offFullScreen: () => void;
    toggleFullscreen: () => void;
    toggleWideScreen: () => void;
    updateChatPosition: (type : chatType) => void;
}


export type VideoTrack = {
    isEnabled: boolean; 
};

export interface VideoAction {
    videoToggle:() => void;
};
  

export type AudioTrack = {
    isMuted: boolean; 
    volumeLevel: number; 
};

export interface AudioAction {
    volumeControl: (vol: number) => void;
    audioMute: (mute:boolean) => void;
};

export interface DBStateActions<T> {
    updateField: <K extends keyof T>(key: K, value: T[K]) => void;
    updateState: (newState: Partial<T>) => void;
}

export type StreamRoomAction = DBStateActions<StreamRoomState>;
export type HostInfoAction = DBStateActions<HostInfoState>;
