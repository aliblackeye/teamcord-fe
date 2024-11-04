"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResizablePanel } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatRoom } from "@/lib/context/chat-room-context";
import { useSocket } from "@/lib/context/socket-context";
import { Message, NewMessage } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { channel } from "diagnostics_channel";
import { CirclePlus, Send, SmilePlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  message: z
    .string()
    .min(1, { message: "Mesajınızı yazın." })
    .max(1000, { message: "Karakter sınırını aşıyorsunuz!" }),
});

export const RoomChatPanel = () => {
  const username = useSearchParams().get("username");
  const roomId = useSearchParams().get("roomId");
  const { room } = useChatRoom();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { socket, isSocketConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>(room?.messages || []);

  const onNewRoomMessage = useCallback((message: Message) => {
    console.log("new room message", message);
    setMessages((prev) => [...prev, message]);
  }, []);

  const onSubmit = useCallback(
    (data: z.infer<typeof formSchema>) => {
      socket?.emit("new-room-message", {
        channelId: roomId,
        message: {
          content: data.message,
          username: username,
          avatar: "",
        } as NewMessage,
      });
      form.reset();
    },
    [socket, form]
  );

  useEffect(() => {
    if (!socket || !isSocketConnected) return;
    socket.on("new-room-message", onNewRoomMessage);

    return () => {
      socket.off("new-room-message", onNewRoomMessage);
    };
  }, [socket, isSocketConnected, onNewRoomMessage]);

  return (
    <ResizablePanel defaultSize={50} minSize={30} maxSize={100}>
      <div className="flex flex-col h-full">
        <h1 className="text-2xl font-bold p-4 bg-neutral-300 dark:bg-neutral-800">
          Sohbet
        </h1>
        <ScrollArea className="h-full dark:bg-neutral-900 bg-neutral-100">
          <div className="flex flex-col gap-2 p-4 ">
            {messages?.map((message, index) => (
              <div key={index} className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={message.avatar} />
                  <AvatarFallback>
                    {message.username?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm text-muted-foreground dark:text-white w-full break-all ">
                  {message.content}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2 p-2 bg-muted "
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                form.handleSubmit(onSubmit)();
              }
            }}
          >
            <Button variant="ghost" size="icon" disabled>
              <CirclePlus />
            </Button>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      className="resize-none outline-none focus-visible:ring-0 border-none bg-transparent text-sm "
                      placeholder="Mesajınızı buraya yazın..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              disabled={!form.formState.isValid}
            >
              <Send />
            </Button>
            <Button variant="ghost" size="icon" disabled>
              <SmilePlus />
            </Button>
          </form>
        </Form>
      </div>
    </ResizablePanel>
  );
};
