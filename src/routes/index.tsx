import { createBrowserRouter, RouterProvider } from "react-router-dom";

// layout
import RootLayout from "@/layouts/root-layout";

// auth page
import Login, { loader as authLoader } from "@/pages/auth/login";
import Register from "@/pages/auth/register";

export function Routes() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [{ index: true, element: "Home" }],
    },
    { path: "login", element: <Login />, loader: authLoader },
    { path: "register", element: <Register /> },
  ]);

  return <RouterProvider router={router} />;
}
