import React from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "sonner";

import Spinner from "../loaders/spinner";
import {
  AllClassroomPayload,
  RoleEnum,
  StudentRegistrationContext,
  TeacherRegistrationContext,
} from "@/types";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { classNames, HttpError } from "@/lib/utils";
import {
  studentRegistrationHandler,
  teacherRegistrationHandler,
} from "@/http/post";
import { getAllUnassignedClassroomHandler } from "@/http/get";
import { Skeleton } from "../ui/skeleton";
import { queryClient } from "@/http";

export type CreateMemberProps = {
  role: keyof typeof RoleEnum;
} & React.HTMLAttributes<HTMLDivElement>;

export default function CreateMember(props: CreateMemberProps) {
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
    enabled: props.role === "teacher",
    staleTime: Infinity,
  });

  React.useEffect(() => {
    if (allClassroomsIsError) {
      toast.error(allClassroomsError.code, {
        description: allClassroomsError.message,
      });
    }
  }, [allClassroomsIsError, allClassroomsError]);

  const {
    isPending: studentRegisterIsPending,
    isError: studentRegisterIsError,
    error: studentRegisterError,
    mutate: studentRegisterMutate,
  } = useMutation<any, HttpError, StudentRegistrationContext>({
    mutationKey: ["student-registration"],
    mutationFn: studentRegistrationHandler,
    async onSuccess(data) {
      allClassroomsRefetch();
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
    if (studentRegisterIsError) {
      toast.error(studentRegisterError.code, {
        description: studentRegisterError.message,
        position: "top-center",
      });

      if (studentRegisterError.code === 422) {
        for (const error of studentRegisterError.info.errorStack) {
          formik.setFieldError(error.path, error.msg);
        }
      }
    }

    // eslint-disable-next-line
  }, [studentRegisterIsError, studentRegisterError]);

  const {
    isPending: teacherRegisterIsPending,
    isError: teacherRegisterIsError,
    error: teacherRegisterError,
    mutate: teacherRegisterMutate,
  } = useMutation<any, HttpError, TeacherRegistrationContext>({
    mutationKey: ["teacher-registration"],
    mutationFn: teacherRegistrationHandler,
    onSuccess(data) {
      allClassroomsRefetch();
      queryClient.invalidateQueries({
        queryKey: ["get-all-teachers"],
        type: "active",
        exact: true,
      });
      toast.success(data.message);
      closeBtnRef.current?.click();
    },
  });

  React.useEffect(() => {
    if (teacherRegisterIsError) {
      toast.error(teacherRegisterError.code, {
        description: teacherRegisterError.message,
        position: "top-center",
      });

      if (teacherRegisterError.code === 422) {
        for (const error of teacherRegisterError.info.errorStack) {
          formik.setFieldError(error.path, error.msg);
        }
      }
    }

    // eslint-disable-next-line
  }, [teacherRegisterIsError, teacherRegisterError]);

  type InitialState = {
    name: string;
    email: string;
    password: string;
    confirmPass: string;
    role: keyof typeof RoleEnum;
    classId?: number;
  };

  const schemas = yup.object().shape({
    name: yup.string().min(4).required("User name is required"),
    email: yup.string().email().required("Email ID is required"),
    password: yup
      .string()
      .min(6)
      .required("Password should be at-least 6 character or more than 6"),
    confirmPass: yup
      .string()
      .min(6)
      .oneOf([yup.ref("password")], "Password must match")
      .required("Confirm Password is required."),
  });

  const initialValues: InitialState = {
    name: "",
    email: "",
    password: "",
    confirmPass: "",
    role: props.role,
    classId: undefined,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schemas,
    onSubmit(value) {
      if (value.role === "teacher") {
        teacherRegisterMutate(value);
      } else {
        studentRegisterMutate(value);
      }
    },
  });

  function resetFormHandler(open: boolean) {
    if (!open) {
      formik.resetForm();
    }
  }

  return (
    <section>
      <Drawer onOpenChange={resetFormHandler}>
        <DrawerTrigger>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
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
                <p className="text-sm">
                  {props.role === "teacher" ? "Add Teacher" : "Add Student"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DrawerTrigger>
        <DrawerContent className="h-[75%] md:h-[unset]">
          <div className="mx-auto w-full max-w-sm md:max-w-4xl overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle>
                {props.role === "teacher"
                  ? "Add Teacher"
                  : props.role === "student"
                    ? "Add Student"
                    : ""}
              </DrawerTitle>
              <DrawerDescription>
                {props.role === "teacher"
                  ? "Create teacher account"
                  : props.role === "student"
                    ? "Create student account"
                    : ""}
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <form
                onSubmit={formik.handleSubmit}
                className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-1 w-full"
              >
                <div className="grid max-w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2 w-full">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Name
                    </label>
                    <div className="mt-2">
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="given-name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.name && formik.touched.name && (
                        <Label className="text-red-500">
                          {formik.errors.name}
                        </Label>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.email && formik.touched.email && (
                        <Label className="text-red-500">
                          {formik.errors.email}
                        </Label>
                      )}
                    </div>
                  </div>

                  {props.role === "teacher" && (
                    <div className="sm:col-span-2 sm:col-start-1">
                      {allClassroomsIsLoading ? (
                        <Skeleton className="w-100 h-[1.5rem]" />
                      ) : (
                        <label
                          htmlFor="classroom"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Avaliable Classrooms
                        </label>
                      )}
                      <div className="mt-2">
                        {allClassroomsIsLoading ? (
                          <Skeleton className="w-100 h-[2.25rem] mb-4" />
                        ) : (
                          <Select
                            onOpenChange={() =>
                              formik.setFieldTouched("classId", true)
                            }
                            onValueChange={(value) => {
                              formik.setFieldValue("classId", parseInt(value));
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a Classroom" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[10rem] overflow-y-auto">
                              <SelectGroup>
                                <SelectLabel>Classrooms</SelectLabel>
                                {allClassroomsData?.classrooms?.length === 0 ? (
                                  <p className="text-sm text-center p-4 text-red-600">
                                    {" "}
                                    All Classes are Assigned{" "}
                                  </p>
                                ) : (
                                  allClassroomsData?.classrooms?.map(
                                    (classroom, index) => (
                                      <SelectItem
                                        key={index}
                                        value={classroom.id.toString()}
                                      >
                                        {classroom.name}
                                      </SelectItem>
                                    ),
                                  )
                                )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                        {formik.errors.classId && formik.touched.classId && (
                          <Label className="text-red-500">
                            {formik.errors.classId}
                          </Label>
                        )}
                      </div>
                    </div>
                  )}

                  <div
                    className={classNames(
                      props.role === "teacher"
                        ? "sm:col-span-2"
                        : "sm:col-span-3",
                    )}
                  >
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="mt-2">
                      <Input
                        type="password"
                        name="password"
                        id="password"
                        autoComplete="address-level1"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.password && formik.touched.password && (
                        <Label className="text-red-500">
                          {formik.errors.password}
                        </Label>
                      )}
                    </div>
                  </div>

                  <div
                    className={classNames(
                      props.role === "teacher"
                        ? "sm:col-span-2"
                        : "sm:col-span-3",
                    )}
                  >
                    <label
                      htmlFor="confirmPass"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Confirm Password
                    </label>
                    <div className="mt-2">
                      <Input
                        type="password"
                        name="confirmPass"
                        id="confirmPass"
                        autoComplete="confirmPass"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.confirmPass &&
                        formik.touched.confirmPass && (
                          <Label className="text-red-500">
                            {formik.errors.confirmPass}
                          </Label>
                        )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <DrawerFooter className="flex flex-col md:flex-row">
              <Button
                onClick={formik.submitForm}
                disabled={
                  !formik.isValid ||
                  teacherRegisterIsPending ||
                  studentRegisterIsPending ||
                  !formik.dirty
                }
                className="w-full"
              >
                <div className="flex gap-2 items-center">
                  <p>Register</p>{" "}
                  <span>{teacherRegisterIsPending && <Spinner />}</span>
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
