import React from "react";
import Cookies from "js-cookie";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "sonner";
import { MutationKey, useMutation } from "@tanstack/react-query";

// image
import LoginImg from "../../assets/auth/login-screen.png";

// component
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Logo from "@/components/svg/logos/logo";

// types
import { loginHandler } from "@/http/post";
import { LoginContext } from "@/types";
import { Label } from "@/components/ui/label";
import { HttpError } from "@/lib/utils";
import Spinner from "@/components/loaders/spinner";

type InitialValues = {
  email: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();

  const {
    isPending: loginIsPending,
    isError: loginIsError,
    error: loginError,
    mutate: loginMutate,
  } = useMutation<any, HttpError, LoginContext>({
    mutationKey: ["register"] as MutationKey,
    mutationFn: loginHandler,
    onSuccess: (data) => {
      toast.success(data.message as string);
      Cookies.set("authToken", data.token, { expires: 1 });
      navigate("/");
    },
  });

  const schema = yup.object().shape({
    email: yup.string().email().required("email is a required field"),
    password: yup
      .string()
      .min(6)
      .required("Password should at-least 6 character or more than 6"),
  });

  const formik = useFormik<InitialValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit(values) {
      loginMutate({
        email: values.email,
        password: values.password,
      });
    },
  });

  React.useEffect(() => {
    if (loginIsError) {
      toast.error(loginError.message || "Something went wrong.");

      if (loginError.code === 422) {
        for (const error of loginError.info.errorStack) {
          formik.setFieldError(error.path, error.msg);
        }
      }
    }

    // eslint-disable-next-line
  }, [loginIsError, loginError]);

  return (
    <div className="flex min-h-full flex-1 h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Logo className="w-44 h-10" />
            <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-500 flex gap-[0.625rem] items-center">
              Not a member?
              <Link to={"/register"}>
                <Button variant={"link"} className="font-semibold p-0">
                  Register
                </Button>
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <div>
              <form onSubmit={formik.handleSubmit} className="space-y-6">
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
                      autoComplete="off"
                      value={formik.values.password}
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
                  <Button
                    disabled={
                      !formik.isValid || loginIsPending || !formik.dirty
                    }
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <div className="flex gap-2 items-center">
                      <p>Sign In</p>{" "}
                      <span>{loginIsPending && <Spinner />}</span>
                    </div>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={LoginImg}
          alt="login-img"
        />
      </div>
    </div>
  );
}
