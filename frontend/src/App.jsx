import React from 'react';
import {Navigate, Route, Routes} from "react-router";
import HomePage from "./Pages/HomePage.jsx";
import SignUpPage from "./Pages/SignUpPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import NotificationsPage from "./Pages/NotificationsPage.jsx";
import OnboardingPage from "./Pages/OnboardingPage.jsx";
import ChatPage from "./Pages/ChatPage.jsx";
import CallPage from "./Pages/CallPage.jsx";
import {Toaster} from "react-hot-toast";
import PageLoader from "./components/PageLoader.jsx";
import Navbar from "./components/Navbar.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import useAuthUser from "./hooks/useAuthUser.js";


const App = () => {
    const {isLoading,authUser}=useAuthUser();

     const isAuthenticated = Boolean(authUser);
     const isOnboarded = authUser?.isOnboarded;

    if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen flex flex-col" data-theme="corporate">
      {isAuthenticated && isOnboarded && <Navbar />}
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={isAuthenticated && isOnboarded ?
              (
                  <HomePage />
              ) :
              (
                  <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )}/>
          <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/notifications" element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" />} />
          <Route path="/onboarding" element={isAuthenticated ? (
              !isOnboarded ? (<OnboardingPage />) : (<Navigate to="/" />)) : (<Navigate to="/login" />)} />
          <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
          <Route path="/call" element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated && isOnboarded ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes>
      </div>

      <Toaster />
    </div>
  );
};

export default App;
