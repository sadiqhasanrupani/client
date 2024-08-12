import { ColumnDef } from "@tanstack/react-table";
import Actions from "./action";

export type teacherList = {
  name: string;
  email: string;
  id: number;
};

export const columns: ColumnDef<teacherList>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  // { accessorKey: "classroomName", header: "Class Name" },
  // { accessorKey: "students", header: "No. of Students" },
  {
    id: "Actions",
    enableHiding: false,
    accessorFn: ({ email, id }) => {
      return <Actions id={id} email={email} />;
    },
  },
];
