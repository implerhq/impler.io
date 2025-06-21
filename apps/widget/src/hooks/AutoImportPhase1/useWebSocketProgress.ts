import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// Types matching your backend interfaces
export interface IProgressData {
  sessionId: string;
  percentage: number;
  processedBytes: number;
  totalBytes: number;
  elementsProcessed: number;
  speedMBps: number;
  eta: string;
  stage: 'fetching' | 'parsing' | 'extracting' | 'mapping' | 'completed' | 'error';
  message?: string;
  error?: string;
}

export interface ICompletionData {
  sessionId: string;
  result: any;
  timestamp: string;
}

export interface IErrorData {
  sessionId: string;
  error: string;
  timestamp: string;
}

interface UseWebSocketProgressOptions {
  serverUrl?: string;
  autoConnect?: boolean;
  onProgress?: (data: IProgressData) => void;
  onCompletion?: (data: ICompletionData) => void;
  onError?: (data: IErrorData) => void;
  onConnectionChange?: (connected: boolean) => void;
}

interface UseWebSocketProgressReturn {
  socket: Socket | null;
  isConnected: boolean;
  progressData: IProgressData | null;
  completionData: ICompletionData | null;
  errorData: IErrorData | null;
  joinSession: (sessionId: string) => void;
  leaveSession: (sessionId: string) => void;
  clearProgress: () => void;
  connect: () => void;
  disconnect: () => void;
}

export const useWebSocketProgress = ({
  serverUrl = 'http://localhost:3000/rssxml-progress', //ToDo use constant .env
  autoConnect = false, //true,
  onProgress,
  onCompletion,
  onError,
  onConnectionChange,
}: UseWebSocketProgressOptions = {}): UseWebSocketProgressReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [progressData, setProgressData] = useState<IProgressData | null>(null);
  const [completionData, setCompletionData] = useState<ICompletionData | null>(null);
  const [errorData, setErrorData] = useState<IErrorData | null>(null);

  const currentSessionId = useRef<string | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (socket?.connected) {
      console.log('Socket already connected');

      return;
    }

    console.log('🔌 Connecting to WebSocket server:', serverUrl);

    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: true,
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected:', newSocket.id);
      setIsConnected(true);
      reconnectAttempts.current = 0;
      onConnectionChange?.(true);

      // Rejoin session if we had one
      if (currentSessionId.current) {
        console.log('🔄 Rejoining session:', currentSessionId.current);
        newSocket.emit('join-session', { sessionId: currentSessionId.current });
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      setIsConnected(false);
      onConnectionChange?.(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔴 WebSocket connection error:', error);
      setIsConnected(false);
      onConnectionChange?.(false);

      // Implement exponential backoff for reconnection
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.pow(2, reconnectAttempts.current) * 1000;
        console.log(
          `🔄 Retrying connection in ${delay}ms (attempt ${reconnectAttempts.current + 1}/${maxReconnectAttempts})`
        );

        setTimeout(() => {
          reconnectAttempts.current++;
          connect();
        }, delay);
      }
    });

    // Progress data handlers
    newSocket.on('rssxml-progress', (data: IProgressData) => {
      console.log('📊 Progress update received:', data);
      setProgressData(data);
      onProgress?.(data);
    });

    newSocket.on('rssxml-completed', (data: ICompletionData) => {
      console.log('✅ Completion received:', data);
      setCompletionData(data);
      onCompletion?.(data);
    });

    newSocket.on('rssxml-error', (data: IErrorData) => {
      console.log('❌ Error received:', data);
      setErrorData(data);
      onError?.(data);
    });

    // Session management handlers
    newSocket.on('session-joined', (data: { sessionId: string }) => {
      console.log('🎯 Session joined successfully:', data.sessionId);
    });

    setSocket(newSocket);
  }, [serverUrl, onProgress, onCompletion, onError, onConnectionChange]);

  const disconnect = useCallback(() => {
    if (socket) {
      console.log('🔌 Disconnecting WebSocket');
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      currentSessionId.current = null;
    }
  }, [socket]);

  const joinSession = useCallback(
    (sessionId: string) => {
      if (!socket?.connected) {
        console.warn('⚠️ Socket not connected, cannot join session');

        return;
      }

      console.log('🎯 Joining session:', sessionId);
      currentSessionId.current = sessionId;
      socket.emit('join-session', { sessionId });
    },
    [socket]
  );

  const leaveSession = useCallback(
    (sessionId: string) => {
      if (!socket?.connected) {
        console.warn('⚠️ Socket not connected, cannot leave session');

        return;
      }

      console.log('🚪 Leaving session:', sessionId);
      socket.emit('leave-session', { sessionId });
      currentSessionId.current = null;
    },
    [socket]
  );

  const clearProgress = useCallback(() => {
    setProgressData(null);
    setCompletionData(null);
    setErrorData(null);
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [autoConnect, connect]);

  // Handle page visibility changes (reconnect when page becomes visible)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !socket?.connected) {
        console.log('🔄 Page became visible, reconnecting...');
        connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [connect, socket]);

  return {
    socket,
    isConnected,
    progressData,
    completionData,
    errorData,
    joinSession,
    leaveSession,
    clearProgress,
    connect,
    disconnect,
  };
};
