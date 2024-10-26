import { Suspense } from "react";
import { Room } from "./_partials/room";
import { RoomProvider } from "./_partials/room-provider";

export default async function JoinPage() {
	return (
		<Suspense fallback={<div>Joining room...</div>}>
			<RoomProvider>
				<Room />
			</RoomProvider>
		</Suspense>
	);
}
