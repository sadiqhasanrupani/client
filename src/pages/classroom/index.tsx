import { useNavigate } from "react-router-dom";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AppUseSelector } from "@/store";

export default function Classroom() {
  const userRole = AppUseSelector((state) => state.userDetail.role);
  const navigate = useNavigate();

  return (
    <section>
      <h1>Classroom</h1>
      {userRole === "principle" && (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => navigate("create")}
                size={"icon"}
                className="fixed bottom-5 right-5 md:bottom-10 md:right-10 drop-shadow-lg rounded-full w-14 h-14"
              >
                <PlusIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              align="start"
              alignOffset={-60}
              sideOffset={-10}
            >
              <p className="text-sm">Create Classroom</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </section>
  );
}
