import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { queryClient } from "@/http";
import { HttpError } from "@/lib/utils";
import { DeleteStudentContext } from "@/types";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { EditIcon, Trash2 } from "lucide-react";
import { deleteStudentHandler } from "@/http/delete";
import { useDispatch } from "react-redux";
import { updateDrawerAction } from "@/store/slice/update-drawer.slice";

type ActionsProps = {
  id: number;
};

export default function Actions(props: ActionsProps) {
  const dispatch = useDispatch();

  const {
    // isPending: deleteTecherIsPending,
    isError: deleteStudentIsError,
    error: deleteStduentError,
    mutate: deleteStudentMutate,
  } = useMutation<any, HttpError, DeleteStudentContext>({
    mutationKey: ["delete-students"],
    mutationFn: deleteStudentHandler,
    async onSuccess(data) {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["get-all-students"],
        type: "active",
        exact: true,
      });
    },
  });

  React.useEffect(() => {
    if (deleteStudentIsError) {
      toast.error(deleteStduentError.code, {
        description: deleteStduentError.message,
        position: "top-center",
      });
    }
  }, [deleteStudentIsError, deleteStduentError]);

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
          <DropdownMenuItem onClick={() => deleteStudentMutate({ userId: props.id })}>
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
