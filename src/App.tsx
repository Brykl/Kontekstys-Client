// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/Home";
import LoginPage from "./pages/authorization/LoginPage";
import RegistrationPage from "./pages/authorization/RegistrationPage";
import PrivateRoute from "./midleware/PrivateRoute";
import ProfilePage from "./pages/private/profile/ProfilePage";
import AllPostsPage from "./pages/private/Posts/PublicPostsPage";
import { UserProvider } from "./contexts/AuthContext";
import AddFriendsPage from "./pages/private/friends/FriendsPage";

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route
            path="/profile/:username"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <PrivateRoute>
                <AllPostsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/friends"
            element={
              <PrivateRoute>
                <AddFriendsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
