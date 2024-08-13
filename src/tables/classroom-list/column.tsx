import { ColumnDef } from "@tanstack/react-table";
import Actions from "./action";
import { Classroom } from "@/types";

/**
  Suggested Columns for the Classroom UI Table
  Classroom Name:

  Description: The name of the classroom.
  Column Header: Name
  Description:

  Description: A brief description or summary of the classroom.
  Column Header: Description
  Teacher:

  Description: The name of the teacher assigned to the classroom.
  Column Header: Teacher
  Days of the Week:

  Description: The days on which the classroom sessions occur.
  Column Header: Days
  Start Time:

  Description: The start time of the classroom sessions.
  Column Header: Start Time
  End Time:

  Description: The end time of the classroom sessions.
  Column Header: End Time
  Number of Students:

  Description: The number of students enrolled in the classroom.
  Column Header: Students
  Actions:

  Description: Buttons or links for actions like editing or deleting the classroom.
  Column Header: Actions
  */

export const columns: ColumnDef<Classroom>[] = [
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "assignedTeacher",
    header: () => <p>{"Teacher"}</p>,
    accessorFn({ assignedTeacher }) {
      return <p>{assignedTeacher || <span className="font-bold">N/A</span>}</p>;
    },
  },
  { accessorKey: "days", header: "Days", accessorFn: ({ days }) => <p>{days.length}</p> },
  { accessorKey: "students", header: "Students" },
  {
    id: "Actions",
    enableHiding: false,
    accessorFn: ({ id }) => {
      return <Actions id={id} />;
    },
  },
];
