import { createBrowserRouter, RouterProvider } from "react-router-dom";

// error page
import Error404 from "@/pages/error/error-404";

// layout
import RootLayout from "@/layouts/root-layout";

// auth page
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";

// manage users pages
import ManageTeachers from "@/pages/manage-users/manage-teachers";
import ManageStudents from "@/pages/manage-users/manage-students";

// table pages
import Timetables from "@/pages/timetables/timetables";
import ClassroomTimetable from "@/pages/timetables/classroom-timetable";

// members pages
import TeacherLists from "@/pages/members/teacher-lists";
import StudentLists from "@/pages/members/student-lists";

// classrooms
import Classrooms from "@/pages/classroom";
import CreateClassroom from "@/pages/classroom/create-classroom";

export function Routes() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <Error404 />,
      children: [
        { index: true, element: "Home" },
        {
          path: "manage-users",
          children: [
            { index: true, element: "" },
            { path: "teachers", element: <ManageTeachers /> },
            { path: "students", element: <ManageStudents /> },
          ],
        },
        {
          path: "timetables",
          children: [
            { index: true, element: <Timetables /> },
            { path: ":classroomId", element: <ClassroomTimetable /> },
          ],
        },
        {
          path: "members",
          children: [
            { index: true, element: "Members" },
            { path: "teachers", element: <TeacherLists /> },
            { path: "students", element: <StudentLists /> },
          ],
        },
        {
          path: "classrooms",
          children: [
            { index: true, element: <Classrooms /> },
            { path: "create", element: <CreateClassroom /> },
          ],
        },
      ],
    },
    { path: "login", element: <Login />, errorElement: <Error404 /> },
    { path: "register", element: <Register />, errorElement: <Error404 /> },
  ]);

  return <RouterProvider router={router} />;
}
