import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { RoomSidebar } from "./room-sidebar/room-sidebar";
import { RoomChatPanel } from "./room-chat-panel";
import { RoomContentPanel } from "./room-content-panel";

export const Room = () => {
  return (
    <div className="h-screen">
      <div className="flex h-full">
        <RoomSidebar />
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full items-stretch"
        >
          <RoomContentPanel />
          <ResizableHandle withHandle />
          <RoomChatPanel />
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
