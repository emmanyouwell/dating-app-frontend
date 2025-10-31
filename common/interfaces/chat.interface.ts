// types/chat.ts
export interface Message {
  fromUserId: string;
  toUserId: string;
  message: string;
  createdAt: string;
}

export interface ChatRoom {
  matchId: string;
  messages: Message[];
}

export interface RoomDto {
  fromName: { name: string; avatar: { url: string } };
  toName: { name: string; avatar: { url: string } };
  roomName: string;
}

export interface ChatUnlockedPayload {
  users: string[];
  room: {
    fromName: { name: string; avatar: { url: string } };
    toName: { name: string; avatar: { url: string } };
    roomName: string;
  };
};