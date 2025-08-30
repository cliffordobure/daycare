import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store/store";
import { checkAuthStatus, setInitialLoading } from "./store/slices/authSlice";

// Layout Components
import Layout from "./components/layout/Layout";
import AuthLayout from "./components/layout/AuthLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Dashboard Pages - Role-based dashboards are imported separately

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import CenterManagement from "./pages/admin/CenterManagement";
import CenterSettings from "./pages/admin/CenterSettings";
import AdminReports from "./pages/admin/Reports";
import AdminChildren from "./pages/admin/Children";
import AdminClasses from "./pages/admin/Classes";
import AdminAttendance from "./pages/admin/Attendance";
import AdminActivities from "./pages/admin/Activities";
import AdminHealthRecords from "./pages/admin/HealthRecords";
import AdminPayments from "./pages/admin/Payments";
import Communication from "./pages/admin/Communication";


// Teacher Pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import ClassManagement from "./pages/teacher/ClassManagement";
import TeacherAttendance from "./pages/teacher/Attendance";
import TeacherActivities from "./pages/teacher/Activities";
import ChildProfiles from "./pages/teacher/ChildProfiles";
import TeacherHealthRecords from "./pages/teacher/HealthRecords";
import TeacherReports from "./pages/teacher/Reports";
import TeacherMessages from "./pages/teacher/Messages";

// Parent Pages
import ParentDashboard from "./pages/parent/ParentDashboard";
import MyChildren from "./pages/parent/MyChildren";
import Attendance from "./pages/parent/Attendance";
import Activities from "./pages/parent/Activities";
import HealthRecords from "./pages/parent/HealthRecords";
import ChildDashboard from "./pages/parent/ChildDashboard";
import Payments from "./pages/parent/Payments";
import Messages from "./pages/parent/Messages";
import Reports from "./pages/parent/Reports";

// Shared Pages
import Profile from "./pages/shared/Profile";
import Settings from "./pages/shared/Settings";
import Notifications from "./pages/shared/Notifications";

// Landing Page
import Landing from "./pages/Landing";

// Center Setup Page
import CenterSetup from "./pages/admin/CenterSetup";

// Error Pages
import Error401 from "./pages/Error401";
import Error404 from "./pages/Error404";

// Role-based Dashboard Component
const RoleBasedDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  switch (user?.role) {
    case "admin":
      return <AdminDashboard />;
    case "teacher":
      return <TeacherDashboard />;
    case "parent":
      return <ParentDashboard />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Role-based Route Component
const RoleBasedRoute = ({ children, allowedRoles }) => {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>{children}</ProtectedRoute>
  );
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  // Check authentication status on app startup
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      dispatch(checkAuthStatus());
    } else {
      // If no token, set loading to false immediately
      dispatch(setInitialLoading(false));
    }
  }, [dispatch]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            Loading Nurtura...
          </h2>
          <p className="text-gray-500 mt-2">
            Please wait while we set up your experience
          </p>
        </div>
      </div>
    );
  }

  return (
    <PersistGate loading={null} persistor={persistor}>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/center-registration" element={<CenterSetup />} />

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* Protected Routes */}
          <Route path="/dashboard" element={<Layout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <RoleBasedDashboard />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<Layout />}>
            <Route
              index
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </RoleBasedRoute>
              }
            />

            <Route
              path="centers"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <CenterManagement />
                </RoleBasedRoute>
              }
            />
            <Route
              path="children"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <AdminChildren />
                </RoleBasedRoute>
              }
            />
            <Route
              path="classes"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <AdminClasses />
                </RoleBasedRoute>
              }
            />
            <Route
              path="attendance"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <AdminAttendance />
                </RoleBasedRoute>
              }
            />
            <Route
              path="activities"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <AdminActivities />
                </RoleBasedRoute>
              }
            />
            <Route
              path="health-records"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <AdminHealthRecords />
                </RoleBasedRoute>
              }
            />
            <Route
              path="payments"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <AdminPayments />
                </RoleBasedRoute>
              }
            />
            <Route
              path="communication"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <Communication />
                </RoleBasedRoute>
              }
            />
            <Route
              path="users"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <UserManagement />
                </RoleBasedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <CenterSettings />
                </RoleBasedRoute>
              }
            />
            <Route
              path="reports"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <AdminReports />
                </RoleBasedRoute>
              }
            />
          </Route>

          {/* Teacher Routes */}
          <Route path="/teacher" element={<Layout />}>
            <Route
              index
              element={
                <RoleBasedRoute allowedRoles={["teacher"]}>
                  <TeacherDashboard />
                </RoleBasedRoute>
              }
            />
            <Route
              path="class"
              element={
                <RoleBasedRoute allowedRoles={["teacher"]}>
                  <ClassManagement />
                </RoleBasedRoute>
              }
            />
            <Route
              path="children"
              element={
                <RoleBasedRoute allowedRoles={["teacher"]}>
                  <ChildProfiles />
                </RoleBasedRoute>
              }
            />
            <Route
              path="attendance"
              element={
                <RoleBasedRoute allowedRoles={["teacher"]}>
                  <TeacherAttendance />
                </RoleBasedRoute>
              }
            />
            <Route
              path="activities"
              element={
                <RoleBasedRoute allowedRoles={["teacher"]}>
                  <TeacherActivities />
                </RoleBasedRoute>
              }
            />
            <Route
              path="health-records"
              element={
                <RoleBasedRoute allowedRoles={["teacher"]}>
                  <TeacherHealthRecords />
                </RoleBasedRoute>
              }
            />
            <Route
              path="reports"
              element={
                <RoleBasedRoute allowedRoles={["teacher"]}>
                  <TeacherReports />
                </RoleBasedRoute>
              }
            />
            <Route
              path="messages"
              element={
                <RoleBasedRoute allowedRoles={["teacher"]}>
                  <TeacherMessages />
                </RoleBasedRoute>
              }
            />
          </Route>

          {/* Parent Routes */}
          <Route path="/parent" element={<Layout />}>
            <Route
              index
              element={
                <RoleBasedRoute allowedRoles={["parent"]}>
                  <ParentDashboard />
                </RoleBasedRoute>
              }
            />
            <Route
              path="children"
              element={
                <RoleBasedRoute allowedRoles={["parent"]}>
                  <MyChildren />
                </RoleBasedRoute>
              }
            />
            <Route
              path="attendance"
              element={
                <RoleBasedRoute allowedRoles={["parent"]}>
                  <Attendance />
                </RoleBasedRoute>
              }
            />
            <Route
              path="activities"
              element={
                <RoleBasedRoute allowedRoles={["parent"]}>
                  <Activities />
                </RoleBasedRoute>
              }
            />
            <Route
              path="health"
              element={
                <RoleBasedRoute allowedRoles={["parent"]}>
                  <HealthRecords />
                </RoleBasedRoute>
              }
            />
            <Route
              path="child/:childId"
              element={
                <RoleBasedRoute allowedRoles={["parent"]}>
                  <ChildDashboard />
                </RoleBasedRoute>
              }
            />
            <Route
              path="payments"
              element={
                <RoleBasedRoute allowedRoles={["parent"]}>
                  <Payments />
                </RoleBasedRoute>
              }
            />
            <Route
              path="messages"
              element={
                <RoleBasedRoute allowedRoles={["parent"]}>
                  <Messages />
                </RoleBasedRoute>
              }
            />
            <Route
              path="reports"
              element={
                <RoleBasedRoute allowedRoles={["parent"]}>
                  <Reports />
                </RoleBasedRoute>
              }
            />
          </Route>

          {/* Shared Routes */}
          <Route path="/profile" element={<Layout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/settings" element={<Layout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/notifications" element={<Layout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Error Routes */}
          <Route path="/unauthorized" element={<Error401 />} />

          <Route path="/404" element={<Error404 />} />

          {/* Catch all route */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
    </PersistGate>
  );
}

export default App;
