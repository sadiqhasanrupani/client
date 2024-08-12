import { getRequest, postRequest } from "@/lib/utils";

export async function verifyToken() {
  return postRequest("/verify/token");
}

export async function getAllClassroomHandler() {
  return getRequest("/classroom/get-all");
}

export async function getAllUnassignedClassroomHandler() {
  return getRequest("/classroom/get-all-unassigned");
}

export async function getAllTeachersHandler() {
  return getRequest("/teacher/get-all");
}

export async function getTeacherHandler(userId: number) {
  return getRequest(`/teacher/get/${userId}`);
}

export async function getAllStudentsHandler() {
  return getRequest("/student/get-all");
}

export async function getStudentHandler(userId: number) {
  return getRequest(`/student/get/${userId}`);
}

export async function getAllUnassignedTeachers() {
  return getRequest(`/teacher/get-all-unassigned`);
}
