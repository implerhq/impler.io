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
  serverUrl,
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

  // const webSocketSessionIdRef = useRef<string | null>(null);
  const reconnectAttempts = useRef(0);
  const isIntentionalDisconnectRef = useRef(false);

  const maxReconnectAttempts = 5;
  const isConnectingRef = useRef(false); // Prevent multiple connection attempts

  const connect = useCallback(() => {
    // Prevent multiple simultaneous connection attempts
    if (socket?.connected || isConnectingRef.current) {
      return;
    }

    isConnectingRef.current = true;

    const newSocket = io(serverUrl || WEBSOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: true, // Force new connection to avoid reusing old ones
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;
      isConnectingRef.current = false;
      onConnectionChange?.(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      isConnectingRef.current = false;
      // Only call onConnectionChange if it's not an intentional disconnect
      if (!isIntentionalDisconnectRef.current) {
        onConnectionChange?.(false);
      }

      // Reset the flag after handling
      isIntentionalDisconnectRef.current = false;
    });
    newSocket.on('connect_error', () => {
      setIsConnected(false);
      isConnectingRef.current = false;
      onConnectionChange?.(false);

      // Implement exponential backoff for reconnection
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.pow(2, reconnectAttempts.current) * 1000;

        setTimeout(() => {
          reconnectAttempts.current++;
          connect();
        }, delay);
      } else {
      }
    });

    // Progress data handlers
    newSocket.on('rssxml-progress', (data: IProgressData) => {
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
  }, [serverUrl, onCompletion, onError, onConnectionChange, onSessionAborted]); // Removed socket from deps

  const disconnect = useCallback(() => {
    if (socket) {
      isIntentionalDisconnectRef.current = true; // Set flag before disconnecting
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      isConnectingRef.current = false;
    }
  }, [socket]);

  const joinSession = useCallback(
    (sessionId: string) => {
      if (!socket?.connected) {
        return;
      }

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
      // webSocketSessionIdRef.current = null;
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
    let mounted = true;

    if (autoConnect && mounted) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      mounted = false;
      if (socket) {
        isIntentionalDisconnectRef.current = true;
        socket.removeAllListeners();
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        isConnectingRef.current = false;
      }
    };
  }, [autoConnect]);

  // Handle page visibility changes (reconnect when page becomes visible)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !socket?.connected && !isConnectingRef.current) {
        connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [socket?.connected]); // Only depend on connection status

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
