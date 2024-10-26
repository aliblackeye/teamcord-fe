import { useSearchParams } from "next/navigation";

export const ServerInfo = () => {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId") || "Anonim";
  return (
    <div className="w-full bg-muted border-b min-h-[60px] h-14 flex items-center px-4">
      #{roomId}
    </div>
  );
};
