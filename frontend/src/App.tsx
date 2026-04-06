import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import HomePage from "@/pages/Home/HomePage";
import PresentationPage from "@/pages/Presentation/PresentationPage";
import DocsPage from "@/pages/Docs/DocsPage";
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";
import PendingPage from "@/pages/Auth/PendingPage";
import ProfileCompletePage from "@/pages/Auth/ProfileCompletePage";
import BoardListPage from "@/pages/Board/BoardListPage";
import PostListPage from "@/pages/Board/PostListPage";
import PostDetailPage from "@/pages/Board/PostDetailPage";
import PostCreatePage from "@/pages/Board/PostCreatePage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MeetingListPage from "@/pages/Meeting/MeetingListPage";
import VideoRoomPage from "@/pages/Meeting/VideoRoomPage";
import TextChatPage from "@/pages/Meeting/TextChatPage";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboardPage from "@/pages/Admin/AdminDashboardPage";
import UserManagementPage from "@/pages/Admin/UserManagementPage";
import PostModerationPage from "@/pages/Admin/PostModerationPage";
import MeetingManagementPage from "@/pages/Admin/MeetingManagementPage";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/pending" element={<PendingPage />} />
      <Route path="/complete-profile" element={<ProfileCompletePage />} />

      {/* Main site routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/presentation" element={<PresentationPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/boards" element={<BoardListPage />} />
        <Route path="/boards/:boardSlug" element={<PostListPage />} />
        <Route path="/boards/:boardSlug/posts/:postId" element={<PostDetailPage />} />
        <Route path="/boards/:boardSlug/write" element={
          <ProtectedRoute><PostCreatePage /></ProtectedRoute>
        } />
        <Route path="/meetings" element={<MeetingListPage />} />
        <Route path="/meetings/video/:meetingId" element={
          <ProtectedRoute><VideoRoomPage /></ProtectedRoute>
        } />
        <Route path="/meetings/chat/:meetingId" element={
          <ProtectedRoute><TextChatPage /></ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>
        }>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="posts" element={<PostModerationPage />} />
          <Route path="meetings" element={<MeetingManagementPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
