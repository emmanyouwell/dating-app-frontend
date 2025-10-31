import { RoomDto } from '@/common/interfaces/chat.interface';
import api from '@/lib/api';
import { handleAxiosError } from '@/lib/handleAxiosError';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface ChatMessage {
  from: string;
  to: string;
  message: string;
  createdAt: string;
  room?: string;
}

export interface ChatRoom {
  userId: string;
  roomName: string;
  messages: ChatMessage[];
  fromName?: { name: string; avatar: { url: string } };
  toName?: { name: string; avatar: { url: string } };
}

interface ChatState {
  rooms: Record<string, ChatRoom>;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  rooms: {},
  loading: false,
  error: null,
};

// ✅ Fetch messages for a specific room only
export const fetchMessagesByRoom = createAsyncThunk<
  ChatMessage[],
  string, // roomName
  { rejectValue: string }
>('chat/fetchMessagesByRoom', async (roomName) => {
  try {
    const res = await api.get(`/chat/messages/${roomName}`);
    return res.data; // ChatMessage[]
  } catch (err) {
    handleAxiosError(err, 'Messages not fetched');
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const msg = action.payload;
      const roomName = msg.room;
      if (!roomName) return;

      // If room doesn't exist, skip — creation happens only on backend
      if (!state.rooms[roomName]) return;

      state.rooms[roomName].messages.push(msg);
    },

    addRoom: (
      state,
      action: PayloadAction<{ userId: string; room: RoomDto }>
    ) => {
      const { userId, room } = action.payload;
      if (!state.rooms[room.roomName]) {
        state.rooms[room.roomName] = {
          userId,
          roomName: room.roomName,
          messages: [],
          toName: room.toName,
        };
      }
    },

    clearChat: (state) => {
      state.rooms = {};
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMessagesByRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesByRoom.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        const messages = action.payload;
        if (!messages.length) return;

        // ✅ Get the room name from the first message
        const roomName = messages[0].room!;
        if (!roomName) return;

        // ✅ Only update messages, never overwrite existing rooms
        state.rooms[roomName].messages = messages;
      })
      .addCase(fetchMessagesByRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch messages';
      });
  },
});

export const { addMessage, addRoom, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
