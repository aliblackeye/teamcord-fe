import { Room } from "./_partials/room";
import { RoomProvider } from "./_partials/room-provider";

export default async function JoinPage() {
  return (
    <RoomProvider>
      <Room />
    </RoomProvider>
  );
}
