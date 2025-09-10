import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Screen1 from "./Screens/Screen1.jsx";
import Screen2 from "./Screens/Screen2.jsx";
import AdminDashboard from "./protectedRoute/AdminDashboard.jsx";
import VisitorsLog from "./protectedRoute/VisitorsLog.jsx";
import RegisterFace from "./protectedRoute/RegisterFace.jsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/verification", element: <Screen1 /> },
  { path: "/admin", element: <Screen2 /> },
  {
    path: "/protectedRoute",
    element: <AdminDashboard />,
    children: [
      { path: "visitors-log", element: <VisitorsLog /> },
      { path: "register-face", element: <RegisterFace /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
