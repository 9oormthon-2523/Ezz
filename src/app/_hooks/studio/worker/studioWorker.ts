export {}; // 전역 네임스페이스 오염 방지

interface StreamMessage {
  type: 'streamOn' | 'streamOff';
}

// self를 명시적으로 SharedWorker 환경으로 캐스팅
const workerSelf = self as unknown as {
  onconnect: (event: MessageEvent) => void;
};

const connections: MessagePort[] = [];

workerSelf.onconnect = (event: MessageEvent) => {
  const port = event.ports[0];
  connections.push(port);

  port.onmessage = (event: MessageEvent<StreamMessage>) => {
    console.log('Received message in worker:', event.data);

    if (event.data.type === 'streamOn' || event.data.type === 'streamOff') {
      // 다른 모든 연결된 탭에 메시지 전달
      connections.forEach((conn) => {
        if (conn !== port) {
          conn.postMessage({ type: event.data.type });
        }
      });
    }
  };

  port.start();
};
