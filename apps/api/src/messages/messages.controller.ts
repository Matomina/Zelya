import {
  Controller, Get, Post, Delete, Body, Param,
  Query, UseGuards, Req, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger'
import { IsString, MaxLength, IsUUID } from 'class-validator'
import { MessagesService } from './messages.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

class SendMessageDto {
  @IsUUID() receiverId: string
  @IsString() @MaxLength(2000) content: string
}

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private messages: MessagesService) {}

  @Get('inbox')
  @ApiOperation({ summary: 'Liste des conversations (inbox)' })
  inbox(@Req() req: any) {
    return this.messages.getInbox(req.user.id)
  }

  @Get('unread/count')
  @ApiOperation({ summary: 'Nombre de messages non lus' })
  async unreadCount(@Req() req: any) {
    const count = await this.messages.getUnreadCount(req.user.id)
    return { count }
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Conversation avec un utilisateur' })
  @ApiParam({ name: 'userId', type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  conversation(
    @Req() req: any,
    @Param('userId') otherId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.messages.getConversation(req.user.id, otherId, page)
  }

  @Post()
  @ApiOperation({ summary: 'Envoyer un message (fallback HTTP — préférer WebSocket)' })
  send(@Req() req: any, @Body() dto: SendMessageDto) {
    return this.messages.send(req.user.id, dto)
  }

  @Delete(':messageId')
  @ApiOperation({ summary: 'Supprimer un message (soft delete)' })
  @ApiParam({ name: 'messageId', type: String })
  remove(@Req() req: any, @Param('messageId') messageId: string) {
    return this.messages.softDelete(req.user.id, messageId)
  }
}
