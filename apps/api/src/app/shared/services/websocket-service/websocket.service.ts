import {
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
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
export class WebSocketService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private readonly logger = new Logger(WebSocketService.name);
  private connectedClients = new Map<string, Socket>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
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

    // Notify the RSS service to terminate if there are no more clients
    const clientsInSession = Array.from(this.server.sockets.sockets.values()).filter((socket) =>
      socket.rooms.has(sessionId)
    );

    if (clientsInSession.length === 0) {
      // Send abort signal to RSS service
      this.server.to(sessionId).emit('abort', { sessionId });
    }
  }

  @SubscribeMessage('abort')
  handleAbort(@MessageBody() data: { sessionId: string }) {
    console.log('Received abort signal for session:', data.sessionId);
    // This will be received by the RSS service
    this.server.to(data.sessionId).emit('abort', { sessionId: data.sessionId });
  }

  // Method to send abort signal
  sendAbortSignal = (sessionId: string) => {
    console.log('Sending abort signal for session:', sessionId);
    this.server.to(sessionId).emit('abort', { sessionId });
  };

  // Use arrow functions to automatically bind 'this'
  sendProgress = (sessionId: string, progressData: IProgressData) => {
    console.log('📤 Sending progress to session:', sessionId, progressData);

    if (!this.server) {
      console.error('❌ WebSocket server not initialized');

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

    return {
      sessionId,
      clientCount: room ? room.size : 0,
      hasClients: room && room.size > 0,
    };
  };
}
