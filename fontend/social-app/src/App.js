import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from "./Page/HomePage";
import ProfilePage from "./Page/ProfilePage";
import AuthPage from "./Page/AuthPage";
import { AuthProvider } from "./Contexts/AuthContext";
import PageLayout from "./Layout/PageLayout";
import SavedPostPage from "./Page/SavedPostPage";
import SavedPost from "./Component/SavedPost/SavedPost";
import ProfilePosts from "./Component/Profile/ProfilePosts";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />

          <Route element={<PageLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />}>
              <Route index element={<ProfilePosts />} />
              <Route path="saved" element={<SavedPost />} />
            </Route>
            <Route path="/profile/:userId/saved/all-posts" element={<SavedPostPage />} />

          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
