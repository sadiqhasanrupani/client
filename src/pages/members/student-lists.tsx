import CreateMember from "@/components/create-member";
import Spinner from "@/components/loaders/spinner";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter } from "@/components/ui/drawer";
import UpdateMembers from "@/components/update-details/update-members";
import { queryClient } from "@/http";
import { getStudentHandler } from "@/http/get";
import { updateStudentRegistrationHandler } from "@/http/update";
import { HttpError } from "@/lib/utils";
import { AppUseSelector } from "@/store";
import { updateDrawerAction } from "@/store/slice/update-drawer.slice";
import StudentTable from "@/tables/student-list/table";
import { GetStudentPayload, RoleEnum, UpdateStudentRegistrationContext } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export default function StudentLists() {
  const selectedStudentId = AppUseSelector((state) => state.updateDrawer.userId);
  const openDrawer = AppUseSelector((state) => state.updateDrawer.open);
  const dispatch = useDispatch();

  const closeBtnRef = React.useRef<HTMLButtonElement>(null);

  type InitialState = {
    name: string;
    email: string;
    password: string;
    confirmPass: string;
    role: keyof typeof RoleEnum;
    classId?: number;
  };

  const initialValues: InitialState = {
    name: "",
    email: "",
    password: "",
    confirmPass: "",
    role: "teacher",
    classId: undefined,
  };

  const {
    isPending: updateStudentIsPending,
    isError: updateStudentIsError,
    error: updateStudentError,
    mutate: updateStudentMutate,
  } = useMutation<any, HttpError, UpdateStudentRegistrationContext>({
    mutationKey: ["udpate-student-registration"],
    mutationFn: updateStudentRegistrationHandler,
    async onSuccess(data) {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["get-all-students"],
        type: "active",
        exact: true,
      });
      closeBtnRef.current?.click();
    },
  });

  React.useEffect(() => {
    if (updateStudentIsError) {
      toast.error(updateStudentError.code, {
        description: updateStudentError.message,
        position: "top-center",
      });

      if (updateStudentError.code === 422) {
        for (const error of updateStudentError.info.errorStack) {
          formik.setFieldError(error.path, error.msg);
        }
      }
    }

    // eslint-disable-next-line
  }, [updateStudentIsError, updateStudentError]);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit(value) {
      updateStudentMutate({
        params: { userId: selectedStudentId },
        data: value,
      });
    },
  });

  const {
    data: getUserData,
    isLoading: getUserIsLoading,
    isRefetching: getUserIsRefetching,
    isError: getUserIsError,
    error: getUserError,
  } = useQuery<GetStudentPayload, HttpError>({
    queryKey: ["get-user-data", { id: selectedStudentId }],
    queryFn: async ({ queryKey }) => getStudentHandler((queryKey as any)[1].id),
    enabled: openDrawer,
    staleTime: Infinity,
    gcTime: 0,
  });

  React.useEffect(() => {
    if (!getUserIsLoading || !getUserIsRefetching) {
      formik.setFieldValue("name", getUserData?.student?.name || "");
      formik.setFieldValue("email", getUserData?.student?.email || "");
    }

    // eslint-disable-next-line
  }, [getUserData, getUserIsLoading, getUserIsRefetching]);

  React.useEffect(() => {
    if (getUserIsError) {
      toast.error(getUserError.code, {
        description: getUserError.message,
      });
    }
  }, [getUserIsError, getUserError]);

  function onOpenChangeHandler(open: boolean) {
    if (!open) {
      dispatch(updateDrawerAction.storeUserId({ userId: -1, open: open }));
      formik.resetForm();
    }
  }

  return (
    <section>
      <StudentTable />
      <CreateMember role="student" />
      <Drawer open={openDrawer} onOpenChange={onOpenChangeHandler}>
        <DrawerContent className="h-[75%] md:h-[unset]">
          {getUserIsLoading || getUserIsRefetching ? (
            "loading..."
          ) : (
            <UpdateMembers role="student" userId={selectedStudentId} formik={formik} />
          )}
          <div className="mx-auto w-full max-w-sm md:max-w-4xl overflow-y-auto">
            <DrawerFooter className="flex flex-col md:flex-row">
              <Button
                type="button"
                onClick={formik.submitForm}
                disabled={!formik.isValid || updateStudentIsPending || !formik.dirty}
                className="w-full"
              >
                <div className="flex gap-2 items-center">
                  <p>Update</p> <span>{updateStudentIsPending && <Spinner />}</span>
                </div>
              </Button>
              <DrawerClose asChild>
                <Button type="button" ref={closeBtnRef} className="w-full" variant="outline">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </section>
  );
}
