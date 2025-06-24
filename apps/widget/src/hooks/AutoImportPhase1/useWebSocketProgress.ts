import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { WEBSOCKET_SERVER_URL } from '@config';
import {
  IProgressData,
  ICompletionData,
  IErrorData,
  ISessionAbortedData,
  UseWebSocketProgressReturn,
  UseWebSocketProgressOptions,
} from '@types';

export const useWebSocketProgress = ({
  serverUrl = WEBSOCKET_SERVER_URL,
  autoConnect = true,
  onCompletion,
  onError,
  onConnectionChange,
  onSessionAborted,
}: UseWebSocketProgressOptions = {}): UseWebSocketProgressReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [progressData, setProgressData] = useState<IProgressData | null>(null);
  const [completionData, setCompletionData] = useState<ICompletionData | null>(null);
  const [errorData, setErrorData] = useState<IErrorData | null>(null);
  const [abortedData, setAbortedData] = useState<ISessionAbortedData | null>(null);

  const webSocketSessionIdRef = useRef<string | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (socket?.connected) {
      return;
    }

    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: false,
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;
      onConnectionChange?.(true);

      // Rejoin session if we had one
      if (webSocketSessionIdRef.current) {
        newSocket.emit('join-session', { sessionId: webSocketSessionIdRef.current });
      }
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      onConnectionChange?.(false);
    });

    newSocket.on('connect_error', () => {
      setIsConnected(false);
      onConnectionChange?.(false);

      // Implement exponential backoff for reconnection
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.pow(2, reconnectAttempts.current) * 1000;

        setTimeout(() => {
          reconnectAttempts.current++;
          connect();
        }, delay);
      }
    });

    // Progress data handlers
    newSocket.on('rssxml-progress', (data: IProgressData) => {
      console.log(data);
      setProgressData(data);
    });

    newSocket.on('rssxml-completed', (data: ICompletionData) => {
      setCompletionData(data);
      onCompletion?.(data);
    });

    newSocket.on('rssxml-error', (data: IErrorData) => {
      setErrorData(data);
      onError?.(data);
    });

    newSocket.on('session-aborted', (data: ISessionAbortedData) => {
      setAbortedData(data);
      abortSession(data.sessionId);
      onSessionAborted?.(data);

      // Clear progress data when session is aborted
      setProgressData(null);
      setCompletionData(null);
      setErrorData(null);
    });

    setSocket(newSocket);
  }, [serverUrl, onCompletion, onError, onConnectionChange, onSessionAborted]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      webSocketSessionIdRef.current = null;
    }
  }, [socket]);

  const joinSession = useCallback(
    (sessionId: string) => {
      if (!socket?.connected) {
        return;
      }
      webSocketSessionIdRef.current = sessionId;
      socket.emit('join-session', { sessionId });
    },
    [socket]
  );

  const leaveSession = useCallback(
    (sessionId: string) => {
      if (!socket?.connected) {
        return;
      }

      socket.emit('leave-session', { sessionId });
      webSocketSessionIdRef.current = null;
    },
    [socket]
  );

  const abortSession = useCallback(
    (sessionId: string) => {
      if (!socket?.connected) {
        return;
      }

      socket.emit('abort-session', { sessionId });
    },
    [socket]
  );

  const clearProgress = useCallback(() => {
    setProgressData(null);
    setCompletionData(null);
    setErrorData(null);
    setAbortedData(null);
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
    abortedData,
    joinSession,
    leaveSession,
    abortSession,
    clearProgress,
    connect,
    disconnect,
  };
};
