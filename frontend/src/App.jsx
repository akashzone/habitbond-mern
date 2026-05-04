import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import JoinRoom from "./pages/JoinRoom";
import CreateRoom from "./pages/CreateRoom";
import RoomPage from "./pages/RoomPage";
import HabitsPage from "./pages/HabitsPage";
import SettingsPage from "./pages/SettingsPage";
import RoomLayout from "./components/RoomLayout";
import { RoomProvider, useRoom } from "./context/RoomContext";
import { UserProvider } from "./context/UserContext";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Route for pages that require authentication (Dashboard / Habits)
const PrivateRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Route for pages that require auth but NO room (Join / Create)
const RequireNoRoomRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

import { useUser } from "./context/UserContext";

// Route for public marketing/auth pages (Landing / Login / Signup)
const GuestRoute = ({ children }) => {
  const { currentRoomId } = useRoom();
  const { loading } = useUser();

  if (isAuthenticated()) {
    if (loading) {
      return (
        <div className="min-h-screen bg-[#0d0f12] text-white flex items-center justify-center font-medium">
          Loading...
        </div>
      );
    }
    return currentRoomId ? <Navigate to={`/room/${currentRoomId}`} /> : <Navigate to="/join" />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route
        path="/"
        element={
          <GuestRoute>
            <LandingPage />
          </GuestRoute>
        }
      />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestRoute>
            <SignupPage />
          </GuestRoute>
        }
      />

      {/* Room Setup Pages */}
      <Route
        path="/join"
        element={
          <RequireNoRoomRoute>
            <JoinRoom />
          </RequireNoRoomRoute>
        }
      />
      <Route
        path="/create"
        element={
          <RequireNoRoomRoute>
            <CreateRoom />
          </RequireNoRoomRoute>
        }
      />

      {/* Room Page Workspace Layout */}
      <Route
        path="/room/:roomId"
        element={
          <PrivateRoute>
            <RoomLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<RoomPage />} />
        <Route path="habits" element={<HabitsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "288581775000-ej0bnsh423f6f2t7b7tr68ecjbllm11a.apps.googleusercontent.com";
  
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserProvider>
        <RoomProvider>
          <Router>
            <AppRoutes />
          </Router>
        </RoomProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;