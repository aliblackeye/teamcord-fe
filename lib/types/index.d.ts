export type SocketUser = {
  username: string;
  socketId: string;
};

export type OngoingCall = {
  participants: Participant[];
};

export type Participant = {
  username: string;
  socketId: string;
};
