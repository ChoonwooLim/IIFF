import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";

interface Props {
  children: React.ReactNode;
  requireActive?: boolean;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireActive = true, requireAdmin = false }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireActive && user.status !== "active") {
    return <Navigate to="/pending" replace />;
  }

  if (requireAdmin && !["admin", "superadmin"].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
