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
import CollectionPage from "./Page/CollectionPage"
import PostDetailPage from "./Page/PostDetailPage";
import ChatInterfacePage from "./Page/ChatInterfacePage";
import { ChatProvider } from "./Contexts/ChatContext";

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
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
              <Route path="/profile/:userId/saved/:collectionName/:collectionId" element={<CollectionPage />} />
              <Route path="/post/:postId" element={<PostDetailPage />} />
              <Route path="/chat" element={<ChatInterfacePage />} />
            </Route>
          </Routes>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
