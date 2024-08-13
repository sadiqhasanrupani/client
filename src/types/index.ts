export enum RoleEnum {
  teacher = "teacher",
  student = "student",
  principle = "principle",
}

export type DayOfWeekEnum = "monday" | "tuesday" | "wednesday" | "friday" | "Thurssday" | "saturday" | "sunday";

export type ClassroomSession = {
  dayOfWeek: DayOfWeekEnum;
  startTime: string;
  endTime: string;
};

export type CreateClassroomContext = {
  name: string;
  classroomDescription: string;
  description?: string;
  daysOfWeek: ClassroomSession[];
  teacherId?: number;
};

// http body context types
export type RegisterContext = {
  name: string;
  email: string;
  password: string;
  role: keyof typeof RoleEnum;
};

export type LoginContext = {
  email: string;
  password: string;
};

export type Member = {
  id: number;
  name: string;
  to: string;
  initial: string;
  current: boolean;
};

export type NavigationItem = {
  name: string;
  to: string;
  icon: any;
  children?: NavigationItem[];
};

export type TeacherRegistrationContext = {
  name: string;
  email: string;
  password: string;
  classId?: number;
};

export type StudentRegistrationContext = {
  name: string;
  email: string;
  password: string;
};

export type DeleteTeacherContext = {
  userId: number;
};

export type DeleteStudentContext = {
  userId: number;
};

export type UpdateStudentRegistrationContext = {
  params: { userId: number };
  data: StudentRegistrationContext;
};

export type UpdateTeacherRegistrationContext = {
  params: { userId: number };
  data: TeacherRegistrationContext;
};

// response payload
export type AllClassroomPayload = {
  message: string;
  classrooms: {
    id: number;
    name: string;
  }[];
};

export type User = {
  id: number;
  name: string;
  email: string;
  // classroomName: string;
  // classroomId: number;
  // students: number;
};

export type GetAllTeacherPayload = {
  message: string;
  teacherDetails: User[];
};
export type GetTeacherPayload = {
  message: string;
  teacherDetail: User;
};

export type GetAllStudentPayload = {
  message: string;
  users: User[];
};

export type GetStudentPayload = {
  message: string;
  student: User;
};

export type VerifyTokenPayload = {
  message: string;
  role: RoleEnum;
  name: string;
};

export type UnassignedTeachersPayload = {
  message: string;
  unassignedTeachers: { id: number; name: string; email: string }[];
};

export type Classroom = {
  id: number;
  name: string;
  assignedTeacher: string | null;
  assignedTeacherId: number | null;
  days: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  startTime: string;
  endTime: string;
  students: 0;
};

export type GetClassroomsPayload = {
  message: string;
  classrooms: Classroom[];
};
