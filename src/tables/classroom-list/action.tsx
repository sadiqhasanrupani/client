import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { EditIcon, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateDrawerAction } from "@/store/slice/update-drawer.slice";

type ActionsProps = {
  id: number;
};

export default function Actions(props: ActionsProps) {
  const dispatch = useDispatch();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => {}}>
            <div className="flex gap-1 items-center">
              <Trash2 className="w-4 text-red-500" />
              <p>Delete</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              dispatch(
                updateDrawerAction.storeUserId({
                  userId: props.id,
                  open: true,
                })
              )
            }
          >
            <div className="flex gap-1 items-center">
              <EditIcon className="w-4 text-primary" />
              <p>Update</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
