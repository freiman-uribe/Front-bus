import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketResult {
  messages: string[];
  sendMessage: (message: string) => void;
}

const useSocket = (url: string): UseSocketResult => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const messageRef = useRef<string[]>([]);

  useEffect(() => {
    const socketInstance = io(url);
    setSocket(socketInstance);

    socketInstance.on('message', (message: string) => {
      messageRef.current.push(message);
      setMessages([...messageRef.current]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (socket) {
      socket.emit('message', message);
    }
  };

  return { messages, sendMessage };
};

export default useSocket;
