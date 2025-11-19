// 共通の型定義
export type ParticipantId = string;
export type RoomId = string;
export type AgentId = string;

export type ParticipantKind = "human" | "ai";

export interface Participant {
  id: ParticipantId;
  name: string;
  kind: ParticipantKind;
  agentId?: AgentId; // kind === "ai" のときに紐づくエージェントID
}

export interface ChatMessage {
  id: string;
  roomId: RoomId;
  authorId: ParticipantId;
  createdAt: number;
  content: string;
  emotion?: string;
}

export interface Room {
  id: RoomId;
  name: string;
  participants: ParticipantId[];
  messages: ChatMessage[];
}
