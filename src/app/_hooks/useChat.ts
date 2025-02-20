'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/app/_utils/supabase/client';
import { Message } from '@/app/_types/chat/Chat';

export const useChat = (roomId: string) => {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [nickname, setNickname] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        console.error('유저 정보를 가져오는 중 오류 발생:', userError);
        return;
      }

      const userId = userData.user.id;
      setUserId(userId);

      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('nickname')
        .eq('id', userId)
        .single();

      if (profileError || !userProfile) {
        console.error('프로필 정보를 가져오는 중 오류 발생:', profileError);
        return;
      }

      setNickname(userProfile.nickname);
    };

    fetchUserDetails();
  }, [supabase]);

  // 채널 구독
  useEffect(() => {
    const channel = supabase.channel(`room:${roomId}`);
    channel
      .on('broadcast', { event: 'message' }, (payload) => {
        const newMessage = payload.payload as Message;
        setMessages((prev) => [...prev, newMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase]);

  const sendMessage = async (message: string) => {
    if (!nickname || !userId) {
      console.error('닉네임 또는 사용자 ID가 설정되지 않았습니다.');
      return;
    }

    const newMessage: Message = {
      id: userId,
      room_id: roomId,
      nickname,
      message,
      created_at: new Date().toISOString(),
    };

    await supabase.channel(`room:${roomId}`).send({
      type: 'broadcast',
      event: 'message',
      payload: newMessage,
    });
  };

  return { messages, sendMessage };
};
