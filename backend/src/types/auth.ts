// ==========================================
// AUTH TYPES
// ==========================================

export type SignupRequest = {
  username: string;
  name: string;
  email: string;
  password: string;
};

export type SigninRequest = {
  email: string;
  password: string;
};

export type SignupResponse = {
  user: {
    id: string; // serialized ObjectId
    username: string;
    name: string;
    email: string;
    accessToken: string;
  };
  // Optional server info if created during signup
  server?: {
    serverId: string;
    roomId: string;
    serverName: string;
    roomName: string;
  };
  refreshToken: string;
};

export type SigninResponse = {
  user: {
    id: string; // serialized ObjectId
    username: string;
    name: string;
    email: string;
    accessToken: string;
  };
  refreshToken: string;
};
