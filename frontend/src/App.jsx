import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import LockPage from "./pages/LockPage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect, useState } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { axiosInstance } from "./lib/axios.js";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const [isSiteUnlocked, setIsSiteUnlocked] = useState(false);
  const [isCheckingSiteAccess, setIsCheckingSiteAccess] = useState(true);

  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    axiosInstance
      .get("/auth/access-status")
      .then(({ data }) => setIsSiteUnlocked(data.unlocked))
      .catch(() => setIsSiteUnlocked(false))
      .finally(() => setIsCheckingSiteAccess(false));
  }, [checkAuth]);

  useEffect(() => {
    if (isSiteUnlocked) checkAuth();
  }, [checkAuth, isSiteUnlocked]);

  console.log({ authUser });

  if (isCheckingSiteAccess || (isSiteUnlocked && isCheckingAuth && !authUser))
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      {!isSiteUnlocked ? (
        <LockPage onUnlocked={() => setIsSiteUnlocked(true)} />
      ) : (
        <>
          <Navbar />

          <Routes>
            {/* HomePage */}
            <Route
              path="/"
              element={authUser ? <HomePage /> : <Navigate to="/login" />}
            />
            {/* SignUpPage */}
            <Route
              path="/signup"
              element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
            />
            {/* LoginPage */}
            <Route
              path="/login"
              element={!authUser ? <LoginPage /> : <Navigate to="/" />}
            />
            {/* SettingsPage */}
            <Route path="/settings" element={<SettingsPage />} />
            {/* ProfilePage */}
            <Route
              path="/profile"
              element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
            />
          </Routes>
        </>
      )}

      <Toaster />
    </div>
  );
};

export default App;
