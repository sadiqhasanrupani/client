import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";

import RegisterImg from "../../assets/auth/register-img.jpg";
import { Button } from "@/components/ui/button";
import Logo from "@/components/svg/logos/logo";
import { Input } from "@/components/ui/input";
import { RegisterContext, RoleEnum } from "@/types";
import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { MutationKey, useMutation } from "@tanstack/react-query";

import { registerHandler } from "@/http/post";
import { useEffect } from "react";
import Spinner from "@/components/loaders/spinner";
import Cookies from "js-cookie";
import { HttpError } from "@/lib/utils";

type InitialValues = {
  name: string;
  email: string;
  password: string;
  confirmpassword: string;
  role?: keyof typeof RoleEnum;
};

export default function Register() {
  const navigate = useNavigate();

  const {
    isPending: registerIsPending,
    isError: registerIsError,
    error: registerError,
    mutate: registerMutate,
  } = useMutation<any, HttpError, RegisterContext>({
    mutationKey: ["register"] as MutationKey,
    mutationFn: registerHandler,
    onSuccess: (data) => {
      toast.success(data.message as string);
      Cookies.set("authToken", data.token, { expires: 1 });
      navigate("/");
    },
  });

  const schema = yup.object().shape({
    name: yup.string().required().min(4),
    email: yup.string().email().required("email is a required field"),
    password: yup
      .string()
      .min(6)
      .required("Password should at-least 6 character or more than 6"),
    confirmpassword: yup
      .string()
      .oneOf([yup.ref("password")], "Password much match")
      .required("confirm password is a required field"),
    role: yup
      .mixed<keyof typeof RoleEnum>()
      .oneOf(Object.values(RoleEnum))
      .required("Role is required"),
  });

  const formik = useFormik<InitialValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmpassword: "",
      role: "principle",
    },
    validationSchema: schema,
    onSubmit(values) {
      registerMutate({
        email: values.email,
        name: values.name,
        password: values.password,
        role: values.role as RoleEnum,
      });
    },
  });

  useEffect(() => {
    if (registerIsError) {
      toast.error(registerError.message || "Something went wrong.");

      if (registerError.code === 422) {
        for (const error of registerError.info.errorStack) {
          formik.setFieldError(error.path, error.msg);
        }
      }
    }

    // eslint-disable-next-line
  }, [registerIsError, registerError]);

  return (
    <div className="flex min-h-full flex-1 h-screen">
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={RegisterImg}
          alt=""
        />
      </div>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-[0.5] lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Logo className="w-44 h-10" />
            <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-500 flex gap-[0.625rem] items-center">
              Already have an account?
              <Link to={"/login"}>
                <Button variant={"link"} className="font-semibold p-0">
                  Login
                </Button>
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <div>
              <form onSubmit={formik.handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Username
                  </label>
                  <div className="mt-2">
                    <Input
                      id="username"
                      name="name"
                      autoComplete="off"
                      value={formik.values.name}
                      required
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                    />
                    {formik.errors.name && formik.touched.name && (
                      <Label className="text-red-500">
                        {formik.errors.name}
                      </Label>
                    )}
                  </div>
                </div>
                <div>
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
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      type="email"
                      autoComplete="off"
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                    />
                    {formik.errors.email && formik.touched.email && (
                      <Label className="text-red-500">
                        {formik.errors.email}
                      </Label>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formik.values.password}
                      autoComplete="off"
                      required
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                    />
                    {formik.errors.password && formik.touched.password && (
                      <Label className="text-red-500">
                        {formik.errors.password}
                      </Label>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmpassword"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-2">
                    <Input
                      id="confirmpassword"
                      name="confirmpassword"
                      type="password"
                      value={formik.values.confirmpassword}
                      autoComplete="off"
                      required
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                    />
                    {formik.errors.confirmpassword &&
                      formik.touched.confirmpassword && (
                        <Label className="text-red-500">
                          {formik.errors.confirmpassword}
                        </Label>
                      )}
                  </div>
                </div>

                {/* <div className="w-full">
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Select a Role
                  </label>

                  <Select
                    onOpenChange={() => formik.setFieldTouched("role", true)}
                    onValueChange={(value) => {
                      formik.setFieldValue("role", value);
                    }}
                    required
                  >
                    <SelectTrigger
                      className="w-full"
                      value={formik.values.role}
                    >
                      <SelectValue
                        placeholder="Select a Role"
                        defaultValue={formik.values.role}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        <SelectItem value="principle">Principle</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {formik.errors.role && formik.touched.role && (
                    <Label className="text-red-500">{formik.errors.role}</Label>
                  )}
                </div> */}

                <div>
                  <Button
                    disabled={
                      !formik.isValid || registerIsPending || !formik.dirty
                    }
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <div className="flex gap-2 items-center">
                      <p>Register</p>{" "}
                      <span>{registerIsPending && <Spinner />}</span>
                    </div>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
