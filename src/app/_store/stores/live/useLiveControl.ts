
import { create } from "zustand";

import { AudioAction, AudioTrack, chatType, HostInfoAction, ScreenAction, ScreenState, StreamRoomAction, VideoAction, VideoTrack } from "./useLiveControl.type";
import { HostInfoState, StreamRoomState } from "@/app/_types/live/liveType";

interface Module<TState, TAction> {
    state: TState;
    actions: TAction;
}

export interface LiveControlState {
    screen: Module<ScreenState, ScreenAction>;
    videoTrack: Module<VideoTrack,VideoAction>;
    audioTrack: Module<AudioTrack,AudioAction>;
    hostInfo: Module<HostInfoState, HostInfoAction>;   
    streamRoom: Module<StreamRoomState, StreamRoomAction>;   
};

const useLiveControl = create<LiveControlState>((set) => ({
    // 스크린 모드 제어
    screen: {
        state: {
            isChatOpen: true, // 채팅
            isWidescreen: false, // 와이드
            isFullscreen: false, // 전체화면
            isFullOrWide: false, // 와이드나 or 전체화면
            chatPosition: "side", // 채팅 포지션
        },

        actions: {
            toggleChat: () => {
                set(({ screen }) => {
                    const updatedState = {
                        ...screen.state,
                        isChatOpen: !screen.state.isChatOpen,
                    };
        
                    return { screen: { ...screen, state: updatedState } };
                });
            },

            offFullScreen: () => {
                set(({ screen }) => {
                    const updatedState = {
                        ...screen.state,
                        isFullscreen: false,
                        isFullOrWide: screen.state.isWidescreen,
                    };

                    return { screen: { ...screen, state: updatedState} };
                });
            },

            toggleFullscreen: () => {
                set(({ screen }) => {
                    const updatedState = {
                        ...screen.state,
                        isFullscreen: !screen.state.isFullscreen, 
                        isFullOrWide: !screen.state.isFullscreen || screen.state.isWidescreen,
                    };
            
                    return { screen: { ...screen, state: updatedState } };
                });
            },

            toggleWideScreen: () => {
                set(({ screen }) => {
                    const updatedState = {
                        ...screen.state,
                        isWidescreen: !screen.state.isWidescreen,
                        isFullOrWide: !screen.state.isWidescreen || screen.state.isFullscreen,
                    };

                    return { screen: { ...screen, state: updatedState } };
                });
            },
            
            updateChatPosition: (type:chatType) => {
                set(({screen}) => {
                    const updatedState = {
                        ...screen.state,
                        chatPosition: type,
                    };
                    return { screen: { ...screen, state: updatedState } };
                });
            }
        }
        
    },


    // 비디오 트랙 제어
    videoTrack: {
        state: {
            isEnabled: true, 
        },
    
        actions: {

            videoToggle: () => {
                set((state) => {
                    const videoState = !state.videoTrack.state.isEnabled;
            
                    const updatedAudioTrack = {
                        ...state.audioTrack,
                        state: {
                            ...state.audioTrack.state,
                            isMuted: !videoState,
                        },
                    };
            
                    const updatedVideoTrack = {
                        ...state.videoTrack,
                        state: {
                            ...state.videoTrack.state,
                            isEnabled: videoState,
                        },
                    };
            
                    const updatedState = {
                        ...state,
                        audioTrack: updatedAudioTrack,
                        videoTrack: updatedVideoTrack,
                    };
            
                    return updatedState;
                });
            },
            
        },
    },


    // 오디오 트랙 제어
    audioTrack: {
        state: {
            isMuted: true,
            volumeLevel: 50,
        },

        actions: {
            audioMute: (muted:boolean) => {
                set(({ audioTrack }) => {
                    const updatedState = {
                        ...audioTrack.state,
                        isMuted: muted,
                    };
                    return { audioTrack: { ...audioTrack, state: updatedState } };
                });
            },

            volumeControl: (vol:number) => {
                set(({ audioTrack }) => {
                    const updatedState = {
                        ...audioTrack.state,
                        volumeLevel: vol,
                    };
                    return { audioTrack: { ...audioTrack, state: updatedState } };
                });
            },
        }
    },

    hostInfo: {
        state:{
            nickname:null,
            profile_img:null,
        },

        actions:{
            // 개별 필드 업데이트트
            updateField: (key, value) => {
                set(({ hostInfo }) => ({
                    hostInfo:{
                        ...hostInfo,
                        state: {
                            ...hostInfo.state,
                            [key]: value,
                        }
                    }
                }));
            },

             // 여러 필드 업데이트
             updateState: (newState) =>
                set((state) => ({
                    hostInfo: {
                    ...state.hostInfo,
                    state: {
                      ...state.hostInfo.state,
                      ...newState,
                    },
                },
            })),
        },
    },

    // 스트리밍 룸 정보 제어
    streamRoom: {
        state:{
            host_uid: "",
            client_uid: null,
            title:null,
            tags:[],
            category:null,
            audience_cnt:0,
            is_active:false,
            start_time:null,
        },

        actions:{
            // 개별 필드 업데이트
            updateField: (key, value) => {
                set(({ streamRoom }) => ({
                    streamRoom:{
                        ...streamRoom,
                        state: {
                            ...streamRoom.state,
                            [key]: value,
                        }
                    }
                }));
            },

            // 여러 필드 업데이트
            updateState: (newState) =>
                set((state) => ({
                  streamRoom: {
                    ...state.streamRoom,
                    state: {
                      ...state.streamRoom.state,
                      ...newState,
                    },
                },
            })),
        }
    },
  }));
  
  export default useLiveControl;