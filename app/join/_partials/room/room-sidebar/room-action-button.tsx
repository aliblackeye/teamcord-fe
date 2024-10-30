import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/cn";

export const RoomActionButton = ({
  children,
  tooltip,
  variant,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  tooltip: string;
  variant?: "success" | "destructive";
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          className={cn("w-9 h-8")}
          variant={variant}
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>
  );
};
