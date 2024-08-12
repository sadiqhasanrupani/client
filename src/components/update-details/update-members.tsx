import { AllClassroomPayload, RoleEnum } from "@/types";
import { DrawerDescription, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { classNames } from "@/lib/utils";

export default function UpdateMembers(props: {
  role: keyof typeof RoleEnum;
  userId: number;
  allClassroomsData?: AllClassroomPayload;
  allClassroomsIsLoading?: boolean;
  formik: any;
}) {
  const { formik, allClassroomsData } = props;

  return (
    <div className="mx-auto w-full max-w-sm md:max-w-4xl overflow-y-auto">
      <DrawerHeader>
        <DrawerTitle>
          {props.role === "teacher" ? "Update Teacher" : props.role === "student" ? "Update Student" : ""}
        </DrawerTitle>
        <DrawerDescription>
          {props.role === "teacher"
            ? "Update teacher account"
            : props.role === "student"
              ? "Update student account"
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
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Name
              </label>
              <div className="mt-2">
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={formik.values.name}
                  autoComplete="given-name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formik.errors.name && formik.touched.name && (
                  <Label className="text-red-500">{formik.errors.name}</Label>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  autoComplete="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formik.errors.email && formik.touched.email && (
                  <Label className="text-red-500">{formik.errors.email}</Label>
                )}
              </div>
            </div>

            {props.role === "teacher" && (
              <div className="sm:col-span-2 sm:col-start-1">
                {props.allClassroomsIsLoading ? (
                  <Skeleton className="w-100 h-[1.5rem]" />
                ) : (
                  <label htmlFor="classroom" className="block text-sm font-medium leading-6 text-gray-900">
                    Avaliable Classrooms
                  </label>
                )}
                <div className="mt-2">
                  {props.allClassroomsIsLoading ? (
                    <Skeleton className="w-100 h-[2.25rem] mb-4" />
                  ) : (
                    <Select
                      onOpenChange={() => formik.setFieldTouched("classId", true)}
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
                            <p className="text-sm text-center p-4 text-red-600"> All Classes are Assigned </p>
                          ) : (
                            allClassroomsData?.classrooms?.map((classroom, index) => (
                              <SelectItem key={index} value={classroom.id.toString()}>
                                {classroom.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                  {formik.errors.classId && formik.touched.classId && (
                    <Label className="text-red-500">{formik.errors.classId}</Label>
                  )}
                </div>
              </div>
            )}

            <div className={classNames(props.role === "teacher" ? "sm:col-span-2" : "sm:col-span-3")}>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
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
                  <Label className="text-red-500">{formik.errors.password}</Label>
                )}
              </div>
            </div>

            <div className={classNames(props.role === "teacher" ? "sm:col-span-2" : "sm:col-span-3")}>
              <label htmlFor="confirmPass" className="block text-sm font-medium leading-6 text-gray-900">
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
                {formik.errors.confirmPass && formik.touched.confirmPass && (
                  <Label className="text-red-500">{formik.errors.confirmPass}</Label>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
