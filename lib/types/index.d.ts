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
  sender: string;
  avatar: string;
};

export type VoiceChannel = {
  channelId: string;
  subscribers: Participant[];
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
