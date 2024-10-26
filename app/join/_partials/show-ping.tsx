import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  SignalLow,
  SignalMedium,
  SignalHigh,
  Signal,
  SignalZero,
} from "lucide-react";
export const ShowPing = ({ ping }: { ping: number }) => (
  <TooltipProvider delayDuration={250}>
    <Tooltip>
      <TooltipTrigger className="cursor-default">
        <div className="flex items-center gap-2">
          {ping <= 50 ? (
            <Signal className="text-green-500" />
          ) : ping <= 100 ? (
            <SignalHigh className="text-green-500" />
          ) : ping <= 200 ? (
            <SignalMedium className="text-yellow-500" />
          ) : ping <= 300 ? (
            <SignalLow className="text-orange-500" />
          ) : (
            <SignalZero className="text-red-500" />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>{ping}ms</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
