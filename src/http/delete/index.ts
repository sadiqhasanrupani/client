import { deleteRequest } from "@/lib/utils";
import { DeleteStudentContext, DeleteTeacherContext } from "@/types";

export async function deleteTeacherHandler(item: DeleteTeacherContext) {
  return deleteRequest(`/teacher/delete/${item.userId}`);
}

export async function deleteStudentHandler(item: DeleteStudentContext) {
  return deleteRequest(`/student/delete/${item.userId}`);
}

export async function deleteClassroomHandler(item: { classId: number }) {
  return deleteRequest(`/classroom/delete/${item.classId}`);
}
