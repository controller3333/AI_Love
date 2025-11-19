import { Room, RoomId, ParticipantId, ChatMessage } from "./types";

// シンプルなインメモリのルーム管理クラス
export class RoomManager {
  private rooms: Map<RoomId, Room> = new Map();

  createRoom(id: RoomId, name: string): Room {
    if (this.rooms.has(id)) {
      return this.rooms.get(id)!;
    }
    const room: Room = {
      id,
      name,
      participants: [],
      messages: [],
    };
    this.rooms.set(id, room);
    return room;
  }

  getRoom(id: RoomId): Room | undefined {
    return this.rooms.get(id);
  }

  ensureRoom(id: RoomId, name = "default"): Room {
    const existing = this.getRoom(id);
    if (existing) return existing;
    return this.createRoom(id, name);
  }

  addParticipant(roomId: RoomId, participantId: ParticipantId) {
    const room = this.ensureRoom(roomId);
    if (!room.participants.includes(participantId)) {
      room.participants.push(participantId);
    }
  }

  addMessage(message: ChatMessage) {
    const room = this.ensureRoom(message.roomId);
    room.messages.push(message);
  }

  getMessages(roomId: RoomId): ChatMessage[] {
    const room = this.getRoom(roomId);
    return room ? room.messages : [];
  }
}
