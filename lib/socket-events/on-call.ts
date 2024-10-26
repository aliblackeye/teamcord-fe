import { io } from "@/server";
export const onCall = (participants: string[]) => {
	if (participants) {
		io.to("").emit("incoming-call", participants);
	}
};
