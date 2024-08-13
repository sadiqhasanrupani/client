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
import { useMutation } from "@tanstack/react-query";
import { deleteClassroomHandler } from "@/http/delete";
import { toast } from "sonner";
import { queryClient } from "@/http";
import React from "react";

type ActionsProps = {
  id: number;
};

export default function Actions(props: ActionsProps) {
  const dispatch = useDispatch();

  const {
    isError: deleteClassIsError,
    error: deleteClassError,
    mutate: deleteClassMutate,
    reset: deleteClassReset,
  } = useMutation({
    mutationKey: ["delete-classroom"],
    mutationFn: deleteClassroomHandler,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["get-all-classrooms"],
        exact: true,
        type: "active",
      });
    },
  });

  React.useEffect(() => {
    if (deleteClassIsError) {
      toast.error(deleteClassError.message);
      deleteClassReset();
    }
  }, [deleteClassIsError, deleteClassError, deleteClassReset]);

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
            onClick={() => {
              deleteClassMutate({ classId: props.id });
            }}
          >
            <div className="flex gap-1 items-center">
              <Trash2 className="w-4 text-red-500" />
              <p>Delete</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              dispatch(
                updateDrawerAction.classroomDrawerHandler({
                  userId: props.id,
                  editClassOpen: true,
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
