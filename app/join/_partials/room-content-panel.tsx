import { ResizablePanel } from "@/components/ui/resizable";
import { useRoom } from "@/lib/context/room-context";
import { useSocket } from "@/lib/context/socket-context";
import { useEffect, useRef } from "react";

export const RoomContentPanel = ({ stream }: { stream: MediaStream }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const { participants } = useRoom();
	const { socket } = useSocket();

	useEffect(() => {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	return (
		<ResizablePanel
			defaultSize={100}
			minSize={0}>
			<div className="p-4 h-full flex gap-4 flex-wrap justify-center items-center ">
				{participants.map((p, index) => (
					<div
						key={index}
						className="min-w-[300px] min-h-[200px] flex items-center justify-center">
						<video
							ref={videoRef}
							className="w-full h-full object-cover"
							autoPlay
							muted={p.socketId === socket?.id}
							playsInline
						/>
					</div>
				))}
			</div>
		</ResizablePanel>
	);
};
