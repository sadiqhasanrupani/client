import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { queryClient } from "@/http";
import { deleteTeacherHandler } from "@/http/delete";
import { HttpError } from "@/lib/utils";
import { DeleteTeacherContext } from "@/types";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { EditIcon, Mail, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateDrawerAction } from "@/store/slice/update-drawer.slice";

type ActionsProps = {
  email: string;
  id: number;
};

export default function Actions(props: ActionsProps) {
  const dispatch = useDispatch();

  const {
    // isPending: deleteTecherIsPending,
    isError: deleteTecherIsError,
    error: deleteTecherError,
    mutate: deleteTecherMutate,
  } = useMutation<any, HttpError, DeleteTeacherContext>({
    mutationKey: ["delete-teacher"],
    mutationFn: deleteTeacherHandler,
    async onSuccess(data) {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["get-all-teachers"],
        type: "active",
        exact: true,
      });
    },
  });

  React.useEffect(() => {
    if (deleteTecherIsError) {
      toast.error(deleteTecherError.code, {
        description: deleteTecherError.message,
        position: "top-center",
      });
    }
  }, [deleteTecherIsError, deleteTecherError]);

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
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(props.email)}
          >
            <div className="flex gap-1 items-center">
              <Mail className="w-4" />
              <p>Copy email ID</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => deleteTecherMutate({ userId: props.id })}
          >
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
                }),
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
