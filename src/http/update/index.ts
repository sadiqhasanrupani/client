import { putRequest } from "@/lib/utils";
import {
  UpdateStudentRegistrationContext,
  UpdateTeacherRegistrationContext,
} from "@/types";

export function updateStudentRegistrationHandler(
  data: UpdateStudentRegistrationContext,
) {
  return putRequest(`/student/update/${data.params.userId}`, data.data);
}

export function updateTeacherRegistrationHandler(
  data: UpdateTeacherRegistrationContext,
) {
  return putRequest(`/teacher/update/${data.params.userId}`, data.data);
}
