import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

interface StreamMessage {
  type: 'streamOn' | 'streamOff';
}

/**
 * 여러 컴포넌트에서 SharedWorker를 사용할 수 있도록 훅으로 만든다.
 */
export const useStreamingWorker = (uid: string) => {
  const queryClient = useQueryClient();
  const workerRef = useRef<SharedWorker | null>(null);
  const [streamingStatus, setStreamingStatus] = useState<'on' | 'off' | null>(null);

  useEffect(() => {
    if (typeof SharedWorker === 'undefined') {
      console.warn('SharedWorker is not supported in this environment.');
      return;
    }

    if (!workerRef.current) {
      workerRef.current = new SharedWorker(new URL('./studioWorker.ts', import.meta.url));
      workerRef.current.port.start();

      workerRef.current.port.onmessage = (event: MessageEvent<StreamMessage>) => {
        queryClient.invalidateQueries({ queryKey: ['user-streaming', uid] });
        setStreamingStatus(event.data.type === 'streamOn' ? 'on' : 'off');
      };
    }

    return () => {
      workerRef.current?.port.close();
    };
  }, [uid, queryClient]);

  /** 메시지를 전송하는 함수 */
  const sendMessage = (type: 'streamOn' | 'streamOff') => {
    workerRef.current?.port.postMessage({ type });
  };

  return { streamingStatus, sendMessage };
};
