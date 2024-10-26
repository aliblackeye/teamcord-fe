"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { Participants } from "./participants";
import { ServerInfo } from "./server-info";
import { ServerList } from "./server-list";

export const RoomSidebar = () => {
	const [dark, setDark] = useState<boolean>(false);
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const { theme, setTheme } = useTheme();

	const getMediaStream = useCallback(
		async (faceMode?: string) => {
			if (localStream) {
				return localStream;
			}

			try {
				const devices = await navigator.mediaDevices.enumerateDevices();
				const videoDevices = devices.filter(
					(device) => device.kind === "videoinput"
				);

				const stream = await navigator.mediaDevices.getUserMedia({
					video: {
						width: { min: 640, ideal: 1280, max: 1920 },

						height: { min: 360, ideal: 720, max: 1080 },
						frameRate: { min: 16, ideal: 30, max: 30 },
						facingMode: videoDevices.length > 0 ? faceMode : undefined,
					},
					audio: true,
				});

				setLocalStream(stream);
				return stream;
			} catch (error) {
				console.error("Failed to get media stream", error);
				setLocalStream(null);
				return null;
			}
		},
		[localStream]
	);

	const handleCall = useCallback(async () => {
		const stream = await getMediaStream();
		if (!stream) {
			console.log("No stream");
			return;
		}
	}, []);

	useEffect(() => {
		if (theme === "dark") {
			setDark(true);
		} else {
			setDark(false);
		}
	}, [theme]);

	return (
		<aside className="flex border-r-2 dark:bg-neutral-900 bg-neutral-100 ">
			<div className="flex flex-col !w-[60px]">
				<div className="min-h-[63px] gap-2 flex-col border-r h-16 flex items-center justify-end">
					<div className="min-w-10 min-h-10 text-2xl font-bold text-center flex justify-center items-center">
						tc
					</div>
					<hr className="w-8 h-1" />
				</div>

				<ServerList />

				<div
					onClick={() => setTheme(dark ? "light" : "dark")}
					className="cursor-pointer min-h-[60px] text-primary flex items-center justify-center border-r ">
					{dark ? <Sun /> : <Moon />}
				</div>
			</div>
			<div className="flex flex-col dark:bg-neutral-900 bg-neutral-100">
				<ServerInfo />
				<Participants />
			</div>
		</aside>
	);
};
