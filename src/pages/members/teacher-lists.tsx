import CreateMember from "@/components/create-member";
import Spinner from "@/components/loaders/spinner";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import UpdateMembers from "@/components/update-details/update-members";
import { queryClient } from "@/http";
import {
  getAllUnassignedClassroomHandler,
  getTeacherHandler,
} from "@/http/get";
import { updateTeacherRegistrationHandler } from "@/http/update";
import { HttpError } from "@/lib/utils";
import { AppUseSelector } from "@/store";
import { updateDrawerAction } from "@/store/slice/update-drawer.slice";
import TeacherTable from "@/tables/teacher-lists/table";
import {
  AllClassroomPayload,
  GetTeacherPayload,
  RoleEnum,
  UpdateTeacherRegistrationContext,
} from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export default function TeacherLists() {
  const selectedStudentId = AppUseSelector(
    (state) => state.updateDrawer.userId,
  );
  const openDrawer = AppUseSelector((state) => state.updateDrawer.open);
  const dispatch = useDispatch();

  const closeBtnRef = React.useRef<HTMLButtonElement>(null);

  const {
    data: allClassroomsData,
    isLoading: allClassroomsIsLoading,
    isError: allClassroomsIsError,
    error: allClassroomsError,
    refetch: allClassroomsRefetch,
  } = useQuery<AllClassroomPayload, HttpError>({
    queryKey: ["get-all-classrooms"],
    queryFn: getAllUnassignedClassroomHandler,
    staleTime: Infinity,
  });

  React.useEffect(() => {
    if (allClassroomsIsError) {
      toast.error(allClassroomsError.code, {
        description: allClassroomsError.message,
      });
    }
  }, [allClassroomsIsError, allClassroomsError]);

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
    isPending: updateTeacherIsPending,
    isError: updateTeacherIsError,
    error: updateTeacherError,
    mutate: updateTeacherMutate,
  } = useMutation<any, HttpError, UpdateTeacherRegistrationContext>({
    mutationKey: ["update-teacher-registration"],
    mutationFn: updateTeacherRegistrationHandler,
    async onSuccess(data) {
      toast.success(data.message);
      allClassroomsRefetch();
      queryClient.invalidateQueries({
        queryKey: ["get-all-teachers"],
        type: "active",
        exact: true,
      });
      closeBtnRef.current?.click();
    },
  });

  React.useEffect(() => {
    if (updateTeacherIsError) {
      toast.error(updateTeacherError.code, {
        description: updateTeacherError.message,
        position: "top-center",
      });

      if (updateTeacherError.code === 422) {
        for (const error of updateTeacherError.info.errorStack) {
          formik.setFieldError(error.path, error.msg);
        }
      }
    }

    // eslint-disable-next-line
  }, [updateTeacherIsError, updateTeacherError]);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit(value) {
      updateTeacherMutate({
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
  } = useQuery<GetTeacherPayload, HttpError>({
    queryKey: ["get-teacher-user-data", { id: selectedStudentId }],
    queryFn: async ({ queryKey }) => getTeacherHandler((queryKey as any)[1].id),
    enabled: openDrawer,
    staleTime: Infinity,
    gcTime: 0,
  });

  React.useEffect(() => {
    if (!getUserIsLoading || !getUserIsRefetching) {
      formik.setFieldValue("name", getUserData?.teacherDetail.name || "");
      formik.setFieldValue("email", getUserData?.teacherDetail?.email || "");
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
      <TeacherTable />

      <CreateMember role="teacher" />
      <Drawer open={openDrawer} onOpenChange={onOpenChangeHandler}>
        <DrawerContent className="h-[75%] md:h-[unset]">
          {getUserIsLoading || getUserIsRefetching ? (
            "loading..."
          ) : (
            <UpdateMembers
              role="teacher"
              userId={selectedStudentId}
              formik={formik}
              allClassroomsData={allClassroomsData}
              allClassroomsIsLoading={allClassroomsIsLoading}
            />
          )}
          <div className="mx-auto w-full max-w-sm md:max-w-4xl overflow-y-auto">
            <DrawerFooter className="flex flex-col md:flex-row">
              <Button
                type="button"
                onClick={formik.submitForm}
                disabled={
                  !formik.isValid || updateTeacherIsPending || !formik.dirty
                }
                className="w-full"
              >
                <div className="flex gap-2 items-center">
                  <p>Update</p>{" "}
                  <span>{updateTeacherIsPending && <Spinner />}</span>
                </div>
              </Button>
              <DrawerClose asChild>
                <Button
                  type="button"
                  ref={closeBtnRef}
                  className="w-full"
                  variant="outline"
                >
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
