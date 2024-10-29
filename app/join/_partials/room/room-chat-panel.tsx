import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ResizablePanel } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Message } from "@/lib/types";

export const RoomChatPanel = ({ messages }: { messages: Message[] }) => {
  return (
    <ResizablePanel defaultSize={50} minSize={30} maxSize={100}>
      <div className="flex flex-col h-full">
        <h1 className="text-2xl font-bold p-4 bg-neutral-300 dark:bg-neutral-800">
          Sohbet
        </h1>
        <ScrollArea className="h-full dark:bg-neutral-900 bg-neutral-100">
          <div className="flex flex-col gap-2 p-4 ">
            {messages.map((message) => (
              <div key={message.id} className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={message.avatar} />
                  <AvatarFallback>{message.sender.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex items-center justify-center p-4 bg-muted h-24">
          <Textarea className="h-16 my-4 resize-none" />
        </div>
      </div>
    </ResizablePanel>
  );
};
