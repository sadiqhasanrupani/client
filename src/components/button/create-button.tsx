import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type ButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  title: React.ReactNode | string;
};

export default function CreateButton(props: ButtonProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={props.onClick}
            size={"icon"}
            className="fixed bottom-5 right-5 md:bottom-10 md:right-10 drop-shadow-lg rounded-full w-14 h-14"
          >
            <PlusIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" align="start" alignOffset={-60} sideOffset={-10}>
          <p className="text-sm">{props.title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
