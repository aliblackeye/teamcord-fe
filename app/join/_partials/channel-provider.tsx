import { ChannelContextProvider } from "@/lib/context/channel-context";
import { useSearchParams } from "next/navigation";

export const ChannelProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId") || "Anonim";
  return (
    <ChannelContextProvider channelId={roomId}>
      {children}
    </ChannelContextProvider>
  );
};
