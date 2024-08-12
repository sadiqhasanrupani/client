import { createBrowserRouter, RouterProvider } from "react-router-dom";

// layout
import RootLayout from "@/layouts/root-layout";

// auth page
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import { loader as authLoader } from "@/loaders/verify-token";

// manage users pages
import ManageTeachers from "@/pages/manage-users/manage-teachers";
import ManageStudents from "@/pages/manage-users/manage-students";

// table pages
import Timetables from "@/pages/timetables/timetables";
import ClassroomTimetable from "@/pages/timetables/classroom-timetable";

// members pages
import TeacherLists from "@/pages/members/teacher-lists";
import StudentLists from "@/pages/members/student-lists";

// error page
import Error404 from "@/pages/error/error-404";

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
      ],
    },
    { path: "login", element: <Login />, loader: authLoader },
    { path: "register", element: <Register /> },
  ]);

  return <RouterProvider router={router} />;
}
