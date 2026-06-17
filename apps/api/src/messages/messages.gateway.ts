/**
 * Zelya — WebSocket Gateway (Messages temps réel)
 *
 * TODO: Cette implémentation est un scaffold de production.
 * Avant la mise en production :
 * 1. Activer l'authentification JWT sur le handshake WS (voir validateConnection)
 * 2. Brancher Redis adapter pour le multi-instance (npm i @nestjs/platform-socket.io ioredis)
 * 3. Implémenter la modération des messages (filtre spam, contenu)
 * 4. Ajouter les limites de débit par connexion
 * 5. Logger toutes les connexions/déconnexions pour audit RGPD
 */
import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  MessageBody, ConnectedSocket, OnGatewayConnection,
  OnGatewayDisconnect, WsException,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { MessagesService } from './messages.service'

@WebSocketGateway({
  cors: { origin: process.env.WEB_URL ?? 'http://localhost:5173', credentials: true },
  namespace: '/messages',
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server
  private readonly logger = new Logger(MessagesGateway.name)

  // userId → Set<socketId>
  private connectedUsers = new Map<string, Set<string>>()

  constructor(private messages: MessagesService) {}

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  handleConnection(client: Socket) {
    // TODO: Extract userId from JWT handshake auth token
    // const token = client.handshake.auth?.token
    // For now, use query param as placeholder (NOT secure — replace before production)
    const userId = client.handshake.query?.userId as string | undefined

    if (!userId) {
      client.disconnect()
      return
    }

    client.data.userId = userId
    client.join(`user:${userId}`)

    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, new Set())
    }
    this.connectedUsers.get(userId)!.add(client.id)

    this.logger.log(`Client connected: ${client.id} (user ${userId})`)
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId
    if (userId) {
      const sockets = this.connectedUsers.get(userId)
      sockets?.delete(client.id)
      if (sockets?.size === 0) this.connectedUsers.delete(userId)
    }
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  // ── Events ───────────────────────────────────────────────────────────────────

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { receiverId: string; content: string },
  ) {
    const senderId = client.data.userId
    if (!senderId) throw new WsException('Non authentifié')

    try {
      const message = await this.messages.send(senderId, {
        receiverId: data.receiverId,
        content: data.content,
      })

      // Emit to receiver's room if online
      this.server.to(`user:${data.receiverId}`).emit('new_message', message)

      // Confirm to sender
      return { event: 'message_sent', data: message }
    } catch (err) {
      throw new WsException(err.message ?? 'Erreur lors de l\'envoi')
    }
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string },
  ) {
    // TODO: implement single-message read receipt
    return { event: 'marked_read', data: { messageId: data.messageId } }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { receiverId: string; isTyping: boolean },
  ) {
    const senderId = client.data.userId
    if (!senderId) return

    this.server.to(`user:${data.receiverId}`).emit('user_typing', {
      userId: senderId,
      isTyping: data.isTyping,
    })
  }

  // ── Helpers ───────────────────────────────────────────────────────────────────

  isUserOnline(userId: string): boolean {
    return (this.connectedUsers.get(userId)?.size ?? 0) > 0
  }

  notifyUser(userId: string, event: string, payload: unknown) {
    this.server.to(`user:${userId}`).emit(event, payload)
  }
}
