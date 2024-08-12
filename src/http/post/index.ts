import { HttpError, postRequest } from "@/lib/utils";
import {
  CreateClassroomContext,
  LoginContext,
  RegisterContext,
  StudentRegistrationContext,
  TeacherRegistrationContext,
} from "@/types";

export async function registerHandler(registerContext: RegisterContext) {
  // return postRequest("/auth/register", { ...registerContext }, false);
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerContext),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const error: HttpError = new Error(errorData.message);
    error.info = errorData;
    error.code = response.status;
    throw error;
  }

  return await response.json();
}

export async function loginHandler(loginContext: LoginContext) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginContext),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const error: HttpError = new Error(errorData.message);
    error.info = errorData;
    error.code = response.status;
    throw error;
  }

  return await response.json();
}

export async function teacherRegistrationHandler(teacherRegistrationContext: TeacherRegistrationContext) {
  return postRequest("/teacher/create", teacherRegistrationContext);
}

export async function studentRegistrationHandler(studentRegistrationContext: StudentRegistrationContext) {
  return postRequest("/student/create", studentRegistrationContext);
}

export async function createClassroomHandler(createClassroom: CreateClassroomContext) {
  return postRequest("/classroom/create", createClassroom);
}
