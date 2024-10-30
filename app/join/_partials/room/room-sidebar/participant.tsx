import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Participant as ParticipantType } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { useSearchParams } from "next/navigation";

export const Participant = ({ user }: { user: ParticipantType }) => {
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "Anonim";
  return (
    <div className="flex gap-2 items-center cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md px-3 py-2">
      <Avatar
        className={cn(
          "w-6 h-6  overflow-hidden ",
          username === user.username && "ring-2 ring-green-500"
        )}
      >
        <AvatarImage
          src={`https://cdn.dribbble.com/userupload/13643081/file/original-6bff19f67096525f84984e9465892dca.png?resize=400x300&vertical=center`}
        />
        <AvatarFallback>{user?.username.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2 max-w-24">
        <p className="text-sm truncate">{user.username}</p>
      </div>
    </div>
  );
};
