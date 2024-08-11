export enum RoleEnum {
  teacher = "teacher",
  student = "student",
  principle = "principle",
}

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
