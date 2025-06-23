import {
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

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

@Injectable()
@WebSocketGateway(3002, { cors: true })
export class WebSocketService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private readonly logger = new Logger(WebSocketService.name);
  private connectedClients = new Map<string, Socket>();

  // Track active abort controllers for each session
  private sessionAbortControllers = new Map<string, AbortController>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);

    // Find sessions this client was part of and potentially abort them
    const clientRooms = Array.from(client.rooms);
    clientRooms.forEach((sessionId) => {
      if (sessionId !== client.id) {
        // Skip the socket's own room
        this.checkAndAbortSession(sessionId);
      }
    });
  }

  @SubscribeMessage('join-session')
  handleJoinSession(@MessageBody() data: { sessionId: string }, @ConnectedSocket() client: Socket) {
    const { sessionId } = data;
    client.join(sessionId);
    this.logger.log(`Client ${client.id} joined session ${sessionId}`);

    // Send acknowledgment
    client.emit('session-joined', { sessionId });
  }

  @SubscribeMessage('leave-session')
  handleLeaveSession(@MessageBody() data: { sessionId: string }, @ConnectedSocket() client: Socket) {
    const { sessionId } = data;
    client.leave(sessionId);
    this.logger.log(`Client ${client.id} left session ${sessionId}`);

    this.checkAndAbortSession(sessionId);
  }

  @SubscribeMessage('abort-session')
  handleAbortSession(@MessageBody() data: { sessionId: string }, @ConnectedSocket() client: Socket) {
    console.log('Abort Session called');
    const { sessionId } = data;
    this.logger.log(`Abort requested for session ${sessionId} by client ${client.id}`);

    // Abort the operation
    this.abortSession(sessionId);

    // Notify all clients in the session
    this.server.to(sessionId).emit('session-aborted', {
      sessionId,
      message: 'Operation cancelled by user HA HA HA ',
      timestamp: new Date().toISOString(),
    });
  }

  // Check if session should be aborted (no more clients)
  private checkAndAbortSession(sessionId: string) {
    const clientsInSession = Array.from(this.server.sockets.sockets.values()).filter((socket) =>
      socket.rooms.has(sessionId)
    );

    if (clientsInSession.length === 0) {
      this.logger.log(`No clients left in session ${sessionId}, aborting operation`);
      this.abortSession(sessionId);
    }
  }

  // Abort a specific session
  private abortSession(sessionId: string) {
    const abortController = this.sessionAbortControllers.get(sessionId);
    if (abortController && !abortController.signal.aborted) {
      this.logger.log(`Aborting session ${sessionId}`);
      abortController.abort();
      this.sessionAbortControllers.delete(sessionId);
    }
  }

  // Register abort controller for a session
  registerSessionAbort(sessionId: string, abortController: AbortController) {
    this.logger.log(`Registering abort controller for session ${sessionId}`);
    this.sessionAbortControllers.set(sessionId, abortController);

    // Clean up when operation completes
    abortController.signal.addEventListener('abort', () => {
      this.logger.log(`Session ${sessionId} aborted`);
      this.sessionAbortControllers.delete(sessionId);
    });
  }

  // Get abort signal for a session
  getSessionAbortSignal(sessionId: string): AbortSignal | undefined {
    return this.sessionAbortControllers.get(sessionId)?.signal;
  }

  // Use arrow functions to automatically bind 'this'
  sendProgress = (sessionId: string, progressData: IProgressData) => {
    console.log('📤 Sending progress to session:', sessionId, progressData);

    if (!this.server) {
      console.error('❌ WebSocket server not initialized');

      return;
    }

    // Check if session is aborted before sending progress
    const abortController = this.sessionAbortControllers.get(sessionId);
    if (abortController?.signal.aborted) {
      console.log('⚠️ Session aborted, skipping progress update');

      return;
    }

    try {
      this.server.to(sessionId).emit('rssxml-progress', progressData);
      this.logger.debug(`✅ Progress sent to session ${sessionId}: ${progressData.percentage}%`);
    } catch (err) {
      console.error('❌ Error sending progress:', err);
      this.logger.error(`Failed to send progress to session ${sessionId}:`, err);
    }
  };

  sendError = (sessionId: string, error: string) => {
    console.log('📤 Sending error to session:', sessionId, error);

    if (!this.server) {
      console.error('❌ WebSocket server not initialized');

      return;
    }

    try {
      this.server.to(sessionId).emit('rssxml-error', {
        sessionId,
        error,
        timestamp: new Date().toISOString(),
      });
      this.logger.error(`✅ Error sent to session ${sessionId}: ${error}`);
    } catch (err) {
      console.error('❌ Error sending error message:', err);
      this.logger.error(`Failed to send error to session ${sessionId}:`, err);
    } finally {
      // Clean up abort controller on error
      this.sessionAbortControllers.delete(sessionId);
    }
  };

  sendCompletion = (sessionId: string, result: any) => {
    console.log('📤 Sending completion to session:', sessionId, result);

    if (!this.server) {
      console.error('❌ WebSocket server not initialized');

      return;
    }

    try {
      this.server.to(sessionId).emit('rssxml-completed', {
        sessionId,
        result,
        timestamp: new Date().toISOString(),
      });
      this.logger.log(`✅ Completion sent to session ${sessionId}`);
    } catch (err) {
      console.error('❌ Error sending completion:', err);
      this.logger.error(`Failed to send completion to session ${sessionId}:`, err);
    } finally {
      // Clean up abort controller on completion
      this.sessionAbortControllers.delete(sessionId);
    }
  };

  // Helper method to check if a session has connected clients
  hasClientsInSession = (sessionId: string): boolean => {
    const room = this.server.sockets.adapter.rooms.get(sessionId);

    return room && room.size > 0;
  };

  // Method to get session info for debugging
  getSessionInfo = (sessionId: string) => {
    const room = this.server.sockets.adapter.rooms.get(sessionId);
    const hasAbortController = this.sessionAbortControllers.has(sessionId);
    const isAborted = this.sessionAbortControllers.get(sessionId)?.signal.aborted;

    return {
      sessionId,
      clientCount: room ? room.size : 0,
      hasClients: room && room.size > 0,
      hasAbortController,
      isAborted,
    };
  };

  // Method to manually abort all sessions (useful for cleanup)
  abortAllSessions() {
    this.logger.log('Aborting all active sessions');
    this.sessionAbortControllers.forEach((controller, sessionId) => {
      if (!controller.signal.aborted) {
        controller.abort();
        this.logger.log(`Aborted session ${sessionId}`);
      }
    });
    this.sessionAbortControllers.clear();
  }
}
