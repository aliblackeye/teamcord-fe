import VideoChat from "@/components/VideoChat";

export default async function Room({ params }: { params: { roomId: string } }) {
  const { roomId } = await params;

  return (
    <div>
      <h1>Oda: {roomId}</h1>
      <VideoChat roomId={roomId as string} />
    </div>
  );
}
