import Peer from "simple-peer";

export type OngoingCall = {
  participants: Participant[];
};

export type Participant = {
  username: string;
  socketId: string;
};
export type Message = {
  id: string;
  content: string;
  createdAt: Date;
  username: string;
  avatar: string;
  systemMessage?: boolean;
};

export type NewMessage = {
  content: string;
  username: string;
  avatar: string;
};

export type Room = {
  channelId: string;
  users: Participant[];
  usersInCall: Participant[];
  messages: Message[];
};

export type Subscriber = {
  socketId: string;
};

export type PeerData = {
  peerConnection: Peer.Instance;
  stream: MediaStream | null;
  participant: Participant;
};

export type WebRTCSignal = {
  sdp: SignalData;
  participant: Participant;
};

export type Channel = { channelId: string; subscribers: Subscriber[] };
