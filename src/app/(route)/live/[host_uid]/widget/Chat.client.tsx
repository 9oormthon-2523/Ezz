// ChatLayout.tsx
'use client';

import ChatWindow from '../components/Chat/ChatWindow.client';
import ChatHeader from '../components/Chat/Header.client';
import ChatInput from '../components/Chat/Input.client';
import { useChat } from '@/app/_hooks/useChat';
import { CSSProperties, useState } from 'react';

import useLiveControl from '@/app/_store/stores/live/useLiveControl';

const ChatLayout = ({ roomId, client_uid }: { roomId: string; client_uid: string | null }) => {
  const chatPosition = useLiveControl((state) => state.screen.state.chatPosition);
  const isChatOpen = useLiveControl((state) => state.screen.state.isChatOpen);
  const toggleChat = useLiveControl((state) => state.screen.actions.toggleChat);

  const { messages, sendMessage } = useChat(roomId);
  const [newMessage, setNewMessage] = useState('');

  if (!isChatOpen) return null;

  const viewChatStyle: CSSProperties = {
    width: chatPosition === 'side' ? '353px' : 'auto',
    flex: chatPosition === 'side' ? undefined : '1',
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <aside id="view-chat" style={viewChatStyle} className="bg-white flex relative flex-col min-h-0">
      <ChatHeader ChatFold={toggleChat} uid={roomId} />
      <ChatWindow messages={messages} roomId={roomId} />
      <ChatInput
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onSend={handleSendMessage}
        client_uid={client_uid}
      />
    </aside>
  );
};

export default ChatLayout;