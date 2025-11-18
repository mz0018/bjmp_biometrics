import { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import { GlobalProvider } from "./context/GlobalContext.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
const App = lazy(() => import("./App.jsx"));
const Screen1 = lazy(() => import("./Screens/Screen1.jsx"));
const Screen2 = lazy(() => import("./Screens/Screen2.jsx"));
const AdminDashboard = lazy(() => import("./protectedRoute/AdminDashboard.jsx"));
const VisitorsLog = lazy(() => import("./protectedRoute/VisitorsLog.jsx"));
const RegisterFace = lazy(() => import("./protectedRoute/RegisterFace.jsx"));
const InmateRegistration = lazy(() => import("./protectedRoute/InmateRegistration.jsx"));
const UserManagement = lazy(() => import("./protectedRoute/UserManagement.jsx"));
const Settings = lazy(() => import("./protectedRoute/SettingsDashboard.jsx"));
const ForgotPassword = lazy(() => import("./protectedRoute/ForgotPassword.jsx"));
const ResetPasswordForm = lazy(() => import("./protectedRoute/ResetPasswordForm.jsx"));

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
      { path: "register-inmate", element: <InmateRegistration /> }, 
      { path: "manage-user", element: <UserManagement />},
      { path: "account-settings", element: <Settings />},
    ],
  },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPasswordForm /> }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalProvider>
      <RouterProvider router={router} />
    </GlobalProvider>
  </StrictMode>
);
