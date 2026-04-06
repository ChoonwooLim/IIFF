import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Critical path — loaded eagerly
import HomePage from "@/pages/Home/HomePage";

// Lazy-loaded routes
const PresentationPage = lazy(() => import("@/pages/Presentation/PresentationPage"));
const DocsPage = lazy(() => import("@/pages/Docs/DocsPage"));
const LoginPage = lazy(() => import("@/pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/Auth/RegisterPage"));
const PendingPage = lazy(() => import("@/pages/Auth/PendingPage"));
const ProfileCompletePage = lazy(() => import("@/pages/Auth/ProfileCompletePage"));
const BoardListPage = lazy(() => import("@/pages/Board/BoardListPage"));
const PostListPage = lazy(() => import("@/pages/Board/PostListPage"));
const PostDetailPage = lazy(() => import("@/pages/Board/PostDetailPage"));
const PostCreatePage = lazy(() => import("@/pages/Board/PostCreatePage"));
const MeetingListPage = lazy(() => import("@/pages/Meeting/MeetingListPage"));
const VideoRoomPage = lazy(() => import("@/pages/Meeting/VideoRoomPage"));
const TextChatPage = lazy(() => import("@/pages/Meeting/TextChatPage"));
const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));
const AdminDashboardPage = lazy(() => import("@/pages/Admin/AdminDashboardPage"));
const UserManagementPage = lazy(() => import("@/pages/Admin/UserManagementPage"));
const PostModerationPage = lazy(() => import("@/pages/Admin/PostModerationPage"));
const MeetingManagementPage = lazy(() => import("@/pages/Admin/MeetingManagementPage"));

function PageFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
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
    </Suspense>
  );
}
