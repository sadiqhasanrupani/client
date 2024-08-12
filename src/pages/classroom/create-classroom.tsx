import { useFormik } from "formik";
import * as yup from "yup";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { BadgeInfo } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { CheckedState } from "@radix-ui/react-checkbox";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllUnassignedTeachers } from "@/http/get";
import { HttpError } from "@/lib/utils";
import { ClassroomSession, CreateClassroomContext, DayOfWeekEnum, UnassignedTeachersPayload } from "@/types";
import { toast } from "sonner";
import { AppUseSelector } from "@/store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { createClassroomHandler } from "@/http/post";
import Spinner from "@/components/loaders/spinner";

/**
Subjects
Subject Name:
Field Type: Text
Placeholder: "Enter subject name"
Description: Name of the subject (e.g., Mathematics, Science).

Assign Teacher:
Field Type: Dropdown/Select
Options: List of teachers
Description: Assign a teacher to the subject.

Subject Description:
Field Type: Textarea
Placeholder: "Enter subject description"
Description: Brief description of the subject.
*/

export default function CreateClassroom() {
  const role = AppUseSelector((state) => state.userDetail.role);

  const navigate = useNavigate();
  const [schema, setSchema] = useState(
    yup.object().shape({
      classroomName: yup.string().required("Class name is required."),
      startTime: yup
        .string()
        .required("Start time is required.")
        .test("is-valid-time", "Start time must be before end time", function (startTime) {
          const { endTime } = this.parent;
          if (!endTime) return true;
          return startTime < endTime;
        }),
      endTime: yup
        .string()
        .required("End time is required.")
        .test("is-valid-time", "End time must be after start time", function (endTime) {
          const { startTime } = this.parent;
          if (!startTime) return true;
          return endTime > startTime;
        }),
      daysOfWeek: yup
        .array()
        .min(1, "You must select at least one day of the week.")
        .of(
          yup.object().shape({
            day: yup.string().required("Day is required."),
            showSeparateTimes: yup.boolean().required(),
            wantSeparateTime: yup.boolean().required("This field is required."),
          }),
        ),
    }),
  );

  const {
    data: unassignedTeachersData,
    isLoading: unassignedTeachersIsLoading,
    isRefetching: unassignedTeachersIsRefetching,
    isError: unassignedTeachersIsError,
    error: unassignedTeachersError,
  } = useQuery<UnassignedTeachersPayload, HttpError>({
    queryKey: ["get-all-unassigned-teachers"],
    queryFn: getAllUnassignedTeachers,
    enabled: role === "principle",
    staleTime: Infinity,
    gcTime: 0,
  });

  React.useEffect(() => {
    if (unassignedTeachersIsError) {
      toast.error(unassignedTeachersError.code, {
        description: unassignedTeachersError.message,
      });
    }
  }, [unassignedTeachersIsError, unassignedTeachersError]);

  const {
    isPending: createClassroomIsPending,
    isError: createClassroomIsError,
    error: createClassroomError,
    mutate: createClassroomMutate,
  } = useMutation<any, HttpError, CreateClassroomContext>({
    mutationFn: createClassroomHandler,
    mutationKey: ["create-classroom"],

    onSuccess(data) {
      toast.success(data.message);
    },
  });

  type DayOfWeek = {
    day: DayOfWeekEnum;
    showSeparateTimes: boolean;
    startTime: string;
    endTime: string;
    wantSeparateTime: boolean;
  };

  type DaysOfWeek = {
    day: string;
    showSeparateTimes: boolean;
    startTime: string;
    endTime: string;
    wantSeparateTime: boolean;
  }[];

  const daysOfWeeks: DayOfWeek[] = [
    { day: "monday", showSeparateTimes: false, startTime: "", endTime: "", wantSeparateTime: false },
    { day: "tuesday", showSeparateTimes: false, startTime: "", endTime: "", wantSeparateTime: false },
    { day: "wednesday", showSeparateTimes: false, startTime: "", endTime: "", wantSeparateTime: false },
    { day: "Thurssday", showSeparateTimes: false, startTime: "", endTime: "", wantSeparateTime: false },
    { day: "friday", showSeparateTimes: false, startTime: "", endTime: "", wantSeparateTime: false },
    { day: "saturday", showSeparateTimes: false, startTime: "", endTime: "", wantSeparateTime: false },
    { day: "sunday", showSeparateTimes: false, startTime: "", endTime: "", wantSeparateTime: false },
  ];

  type InitialValues = {
    classroomName: string;
    startTime: string;
    endTime: string;
    daysOfWeek: DaysOfWeek;
    classroomDescription: string;
    teacherId?: number;
  };

  const initialValues: InitialValues = {
    classroomName: "",
    startTime: "",
    endTime: "",
    classroomDescription: "",
    daysOfWeek: [],
  };

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit(values) {
      // Transform the daysOfWeek array based on the provided logic
      const result: CreateClassroomContext = {
        name: values.classroomName,
        daysOfWeek: values.daysOfWeek.map((day) => {
          // Determine if the current day has separate times
          const dayData = values.daysOfWeek.find((d) => d.day === day.day);

          // Return the appropriate object based on whether separate times are used
          return {
            dayOfWeek: day.day,
            startTime: dayData && dayData.wantSeparateTime ? dayData.startTime : values.startTime,
            endTime: dayData && dayData.wantSeparateTime ? dayData.endTime : values.endTime,
          };
        }) as ClassroomSession[],
        classroomDescription: values.classroomDescription,
        teacherId: values.teacherId,
      };

      createClassroomMutate(result);
    },
  });

  useEffect(() => {
    if (formik.values.daysOfWeek.some((value) => value.wantSeparateTime)) {
      setSchema(
        yup.object().shape({
          classroomName: yup.string().required("Class name is required."),
          startTime: yup
            .string()
            .required("Start time is required.")
            .test("is-valid-time", "Start time must be before end time", function (startTime) {
              const { endTime } = this.parent;
              if (!endTime) return true;
              return startTime < endTime;
            }),
          endTime: yup
            .string()
            .required("End time is required.")
            .test("is-valid-time", "End time must be after start time", function (endTime) {
              const { startTime } = this.parent;
              if (!startTime) return true;
              return endTime > startTime;
            }),
          daysOfWeek: yup
            .array()
            .min(1, "You must select at least one day of the week.")
            .of(
              yup.object().shape({
                day: yup.string().required("Day is required."),
                showSeparateTimes: yup.boolean().required(),
                startTime: yup
                  .string()
                  .required("Start time is required.")
                  .test("is-valid-time", "Start time must be before end time", function (startTime) {
                    const { endTime } = this.parent;
                    if (!endTime) return true;
                    return startTime < endTime;
                  }),
                endTime: yup
                  .string()
                  .required("End time is required.")
                  .test("is-valid-time", "End time must be after start time", function (endTime) {
                    const { startTime } = this.parent;
                    if (!startTime) return true;
                    return endTime > startTime;
                  }),
                wantSeparateTime: yup.boolean().required("This field is required."),
              }),
            )
            .test("valid-time", "Start time must be before end time for all selected days", function (daysOfWeek) {
              if (!daysOfWeek || daysOfWeek.length === 0) return false;

              return daysOfWeek.every((day) => {
                if (day.showSeparateTimes) {
                  if (!day.startTime || !day.endTime) return true;
                  return day.startTime < day.endTime;
                }
                return true;
              });
            }),
        }),
      );
    }
  }, [formik.values.daysOfWeek]);

  React.useEffect(() => {
    if (createClassroomIsError) {
      toast.error(createClassroomError.code, {
        description: createClassroomError.message,
        position: "top-center",
      });

      if (createClassroomError.code === 422) {
        for (const error of createClassroomError.info.errorStack) {
          formik.setFieldError(error.path, error.msg);
        }
      }
    }

    // eslint-disable-next-line
  }, [createClassroomIsError, createClassroomError]);

  function daysOfWeekCheckedHandler(checked: CheckedState, dayOfweek: DayOfWeek, index: number) {
    const updatedDaysOfWeek = formik.values.daysOfWeek.map((d, i) => {
      if (d.day === dayOfweek.day && index === i) {
        return {
          ...d,
          showSeparateTimes: checked,
        };
      }
      return d;
    });

    if (checked) {
      if (!formik.values.daysOfWeek.some((d) => d.day === dayOfweek.day)) {
        formik.setFieldValue("daysOfWeek", [...formik.values.daysOfWeek, { ...dayOfweek, showSeparateTimes: true }]);
      } else {
        formik.setFieldValue("daysOfWeek", updatedDaysOfWeek);
      }
    } else {
      formik.setFieldValue(
        "daysOfWeek",
        formik.values.daysOfWeek.filter((d) => d.day !== dayOfweek.day),
      );
    }
  }

  function wantSeparateCheckedHandler(checked: CheckedState, dayOfWeek: DayOfWeek, index: number) {
    const updatedDaysOfWeek = formik.values.daysOfWeek.map((d, i) => {
      if (d.day === dayOfWeek.day && index === i) {
        return {
          ...d,
          wantSeparateTime: checked,
        };
      }
      return d;
    });

    formik.setFieldValue("daysOfWeek", updatedDaysOfWeek);
  }

  function dayOfWeekStartTimeChangeHandler(
    event: React.ChangeEvent<HTMLInputElement>,
    dayOfWeek: DayOfWeek,
    index: number,
  ) {
    const newStartTime = event.target.value;

    const updatedDaysOfWeek = formik.values.daysOfWeek.map((d, i) => {
      if (d.day === dayOfWeek.day && index === i) {
        return {
          ...d,
          startTime: newStartTime,
        };
      }
      return d;
    });

    formik.setFieldValue("daysOfWeek", updatedDaysOfWeek);
  }

  function dayOfWeekEndTimeChangeHandler(
    event: React.ChangeEvent<HTMLInputElement>,
    dayOfWeek: DayOfWeek,
    index: number,
  ) {
    const newEndTime = event.target.value;

    const updatedDaysOfWeek = formik.values.daysOfWeek.map((d, i) => {
      if (d.day === dayOfWeek.day && index === i) {
        return {
          ...d,
          endTime: newEndTime,
        };
      }
      return d;
    });

    formik.setFieldValue("daysOfWeek", updatedDaysOfWeek);
  }

  return (
    <div className="space-y-10 divide-y divide-gray-900/10">
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Classroom Detail</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Create a classroom to manage your students and courses efficiently. Set up your class, assign roles, and
              organize learning resources all in one place.
            </p>
          </div>

          <Card className="bg-white sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="classroomName" className="block text-sm font-medium leading-6 text-gray-900">
                    Class Name
                  </label>
                  <div className="mt-2">
                    <Input
                      type="text"
                      name="classroomName"
                      id="classroomName"
                      value={formik.values.classroomName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.classroomName && formik.touched.classroomName && (
                      <Label className="text-red-500">{formik.errors.classroomName}</Label>
                    )}
                  </div>
                </div>

                {unassignedTeachersIsLoading || unassignedTeachersIsRefetching ? (
                  <div className="flex flex-col gap-4 sm:col-span-3">
                    <Skeleton className="w-100 h-4" />
                    <Skeleton className="w-100 h-[2.25rem]" />
                  </div>
                ) : (
                  role === "principle" && (
                    <div className="sm:col-span-3">
                      <label htmlFor="classroom" className="block text-sm font-medium leading-6 text-gray-900">
                        Avaliable Teachers
                      </label>
                      <div className="mt-2">
                        <Select
                          onOpenChange={() => formik.setFieldTouched("classId", true)}
                          onValueChange={(value) => {
                            formik.setFieldValue("teacherId", parseInt(value));
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Assign a Teacher" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[10rem] overflow-y-auto">
                            <SelectGroup>
                              <SelectLabel>Teachers</SelectLabel>
                              {unassignedTeachersData?.unassignedTeachers?.length === 0 ? (
                                <p className="text-sm text-center p-4 text-red-600"> no result </p>
                              ) : (
                                unassignedTeachersData?.unassignedTeachers?.map((teacher, index) => (
                                  <SelectItem key={index} value={teacher.id.toString()}>
                                    {teacher.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )
                )}

                <div className="col-span-full">
                  <label htmlFor="classroomDescription" className="block text-sm font-medium leading-6 text-gray-900">
                    Class Description
                  </label>
                  <div className="mt-2">
                    <Textarea
                      id="classroomDescription"
                      name="classroomDescription"
                      value={formik.values.classroomDescription}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      rows={3}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={""}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Write a few sentences about the overview of the classroom's purpose.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Classroom Sessions</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Organize and schedule your classroom sessions effectively. Define the days and times your class will meet.
            </p>
          </div>

          <Card className="bg-white sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="startTime"
                    className="flex gap-2 items-center text-sm font-medium leading-6 text-gray-900"
                  >
                    <span>Start Time</span>
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <BadgeInfo className="w-4 text-slate-500" />
                        </TooltipTrigger>
                        <TooltipContent side="top" align="start">
                          <p>This will applied as by default start time</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="mt-2">
                    <Input
                      type="time"
                      name="startTime"
                      id="startTime"
                      value={formik.values.startTime}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {formik.errors.startTime && formik.touched.startTime && (
                      <Label className="text-red-500">{formik.errors.startTime}</Label>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="endTime"
                    className="flex gap-2 items-center text-sm font-medium leading-6 text-gray-900"
                  >
                    <span>End Time</span>
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <BadgeInfo className="w-4 text-slate-500" />
                        </TooltipTrigger>
                        <TooltipContent side="top" align="start">
                          <p>This will applied as by default end time</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="mt-2">
                    <Input
                      type="time"
                      name="endTime"
                      id="endTime"
                      value={formik.values.endTime}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {formik.errors.endTime && formik.touched.endTime && (
                      <Label className="text-red-500">{formik.errors.endTime}</Label>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-full">
                  <label
                    htmlFor="daysOfWeek"
                    className="flex gap-2 items-center text-sm font-medium leading-6 text-gray-900"
                  >
                    <span>Days of week</span>
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <BadgeInfo className="w-4 text-slate-500" />
                        </TooltipTrigger>
                        <TooltipContent side="right" align="center">
                          <p>Select at-least on of the day inside the days of the week</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>

                  <div className="mt-4 grid grid-cols-1 gap-4">
                    {daysOfWeeks.map((dayOfWeek, index) => {
                      const currentDayOfWeek = formik.values.daysOfWeek.find((item) => item.day === dayOfWeek.day);
                      const wantSepareted =
                        currentDayOfWeek?.wantSeparateTime && currentDayOfWeek.day === dayOfWeek.day;

                      return (
                        <div
                          key={index}
                          className={`flex flex-col lg:flex-row lg:items-center ${wantSepareted ? "lg:gap-10 lg:justify-normal" : "lg:justify-between"}`}
                        >
                          <div className="relative flex gap-x-3">
                            <div className="flex h-6 items-center">
                              <Checkbox
                                id={dayOfWeek.day}
                                name="daysOfWeek"
                                value={dayOfWeek.day}
                                checked={formik.values.daysOfWeek.some((d) => d.day === dayOfWeek.day)}
                                onCheckedChange={(checked) => daysOfWeekCheckedHandler(checked, dayOfWeek, index)}
                                onBlur={() => formik.setFieldTouched("daysOfWeek", true)}
                              />
                            </div>
                            <div className="text-sm leading-6">
                              <label htmlFor={dayOfWeek.day} className="capitalize font-medium text-gray-900">
                                {dayOfWeek.day === "Thurssday" ? "thursday" : dayOfWeek.day}
                              </label>
                            </div>
                          </div>

                          {/* Conditionally render time inputs */}
                          {wantSepareted && (
                            <>
                              <div className="w-full">
                                <label
                                  htmlFor={`startTime${dayOfWeek.day}`}
                                  className="flex gap-2 items-center text-sm font-medium leading-6 text-gray-900"
                                >
                                  <span>Start Time</span>
                                </label>
                                <div className="mt-2">
                                  <Input
                                    type="time"
                                    name={`startTime${dayOfWeek.day}`}
                                    id={`startTime${dayOfWeek.day}`}
                                    value={
                                      formik.values.daysOfWeek[index] ? formik.values.daysOfWeek[index].startTime : ""
                                    }
                                    onChange={(event) => dayOfWeekStartTimeChangeHandler(event, dayOfWeek, index)}
                                    onBlur={formik.handleBlur}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                  {formik.errors.daysOfWeek &&
                                    formik.touched.daysOfWeek &&
                                    formik.errors.daysOfWeek[index] && (
                                      <Label className="text-red-500">
                                        {(formik.errors.daysOfWeek as any)[index]?.startTime}
                                      </Label>
                                    )}
                                </div>
                              </div>

                              <div className="w-full">
                                <label
                                  htmlFor={`endTime${dayOfWeek.day}`}
                                  className="flex gap-2 items-center text-sm font-medium leading-6 text-gray-900"
                                >
                                  <span>End Time</span>
                                </label>
                                <div className="mt-2">
                                  <Input
                                    type="time"
                                    name={`endTime${dayOfWeek.day}`}
                                    id={`endTime${dayOfWeek.day}`}
                                    value={
                                      formik.values.daysOfWeek[index] ? formik.values.daysOfWeek[index].endTime : ""
                                    }
                                    onChange={(event) => dayOfWeekEndTimeChangeHandler(event, dayOfWeek, index)}
                                    onBlur={formik.handleBlur}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                  {formik.errors.daysOfWeek &&
                                    formik.touched.daysOfWeek &&
                                    formik.errors.daysOfWeek[index] && (
                                      <Label className="text-red-500">
                                        {(formik.errors.daysOfWeek as any)[index]?.endTime}
                                      </Label>
                                    )}
                                </div>
                              </div>
                            </>
                          )}

                          {/* Conditionally render separate time option */}
                          {!wantSepareted
                            ? formik.values.daysOfWeek.map((day, index) => {
                                if (day.day === dayOfWeek.day && day.showSeparateTimes) {
                                  return (
                                    <div key={index} className="relative flex gap-x-3">
                                      <div className="flex h-6 items-center">
                                        <Checkbox
                                          id={`separateTime-${dayOfWeek.day}`}
                                          name="daysOfWeek"
                                          value={dayOfWeek.day}
                                          checked={
                                            formik.values.daysOfWeek.find((d) => d.day === dayOfWeek.day)
                                              ?.wantSeparateTime || false
                                          }
                                          onCheckedChange={(checked) =>
                                            wantSeparateCheckedHandler(checked, dayOfWeek, index)
                                          }
                                          onBlur={() => formik.setFieldTouched("daysOfWeek", true)}
                                        />
                                      </div>
                                      <div className="text-sm leading-6">
                                        <label
                                          htmlFor={`separateTime-${dayOfWeek.day}`}
                                          className="capitalize font-medium text-gray-900"
                                        >
                                          Want a separate time?
                                        </label>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              })
                            : ""}
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    {formik.errors.daysOfWeek &&
                      formik.touched.daysOfWeek &&
                      typeof formik.errors.daysOfWeek === "string" && (
                        <Label className="text-red-500">{formik.errors.daysOfWeek}</Label>
                      )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-4 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <Button onClick={() => navigate(-1)} type="button" variant={"ghost"}>
                Cancel
              </Button>
              <Button disabled={!formik.isValid || !formik.dirty} type="submit" className="flex gap-2 items-center">
                {createClassroomIsPending ? <Spinner /> : ""}
                <span>Create</span>
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
