import { ColumnDef } from "@tanstack/react-table";
import Actions from "./action";
import { Classroom } from "@/types";

export const columns: ColumnDef<Classroom>[] = [
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "assignedTeacher",
    header: () => <p>{"Teacher"}</p>,
    accessorFn({ assignedTeacher }) {
      return <p>{assignedTeacher || <span className="font-bold">N/A</span>}</p>;
    },
  },
  { accessorKey: "days", header: "Days", accessorFn: ({ days }) => <p>{days?.length || 0}</p> },
  { accessorKey: "students", header: "Students" },
  {
    id: "Actions",
    enableHiding: false,
    accessorFn: ({ id }) => {
      return <Actions id={id} />;
    },
  },
];
