import { Socket } from 'socket.io';
import { Types } from 'mongoose';

// ==========================================
// SOCKET TYPES
// ==========================================
export interface AuthenticatedSocket extends Socket {
  user?: {
    _id: Types.ObjectId;
    username: string;
    email: string;
    name: string;
  };
}
