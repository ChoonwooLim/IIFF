import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/AuthContext";
import api from "@/services/api";

interface UserItem {
  id: number;
  auth_provider: string;
  username: string | null;
  email: string;
  name: string;
  nickname: string;
  role: string;
  status: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "대기", active: "활성", rejected: "거절", banned: "차단",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  active: "bg-green-500/20 text-green-400",
  rejected: "bg-gray-500/20 text-gray-400",
  banned: "bg-red-500/20 text-red-400",
};

export default function UserManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const fetchUsers = () => {
    const params: Record<string, string | number> = { page, per_page: 20 };
    if (statusFilter) params.status_filter = statusFilter;
    api.get("/admin/users", { params }).then(({ data }) => {
      setUsers(data.users);
      setTotal(data.total);
    });
  };

  useEffect(() => { fetchUsers(); }, [page, statusFilter]);

  const updateStatus = async (userId: number, status: string) => {
    await api.patch(`/admin/users/${userId}/status`, { status });
    fetchUsers();
  };

  const updateRole = async (userId: number, role: string) => {
    await api.patch(`/admin/users/${userId}/role`, { role });
    fetchUsers();
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <h1 className="heading-display text-2xl text-gold mb-6">회원 관리</h1>

      <div className="flex gap-2 mb-6">
        {["", "pending", "active", "rejected", "banned"].map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${
              statusFilter === s ? "bg-[var(--color-gold)] text-black font-semibold" : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}>
            {s === "" ? "전체" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-white/10">
              <th className="py-3 px-2">닉네임</th>
              <th className="py-3 px-2">이메일</th>
              <th className="py-3 px-2">인증</th>
              <th className="py-3 px-2">역할</th>
              <th className="py-3 px-2">상태</th>
              <th className="py-3 px-2">가입일</th>
              <th className="py-3 px-2">액션</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-2 text-white">{u.nickname}</td>
                <td className="py-3 px-2 text-gray-400">{u.email}</td>
                <td className="py-3 px-2 text-gray-400">{u.auth_provider}</td>
                <td className="py-3 px-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300">{u.role}</span>
                </td>
                <td className="py-3 px-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[u.status] || ""}`}>
                    {STATUS_LABELS[u.status] || u.status}
                  </span>
                </td>
                <td className="py-3 px-2 text-gray-500">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString("ko-KR") : ""}
                </td>
                <td className="py-3 px-2">
                  <div className="flex gap-1 flex-wrap">
                    {u.status === "pending" && (
                      <>
                        <button onClick={() => updateStatus(u.id, "active")}
                          className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded hover:bg-green-500/30">승인</button>
                        <button onClick={() => updateStatus(u.id, "rejected")}
                          className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">거절</button>
                      </>
                    )}
                    {u.status === "active" && u.role !== "superadmin" && (
                      <button onClick={() => updateStatus(u.id, "banned")}
                        className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">차단</button>
                    )}
                    {u.status === "banned" && (
                      <button onClick={() => updateStatus(u.id, "active")}
                        className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded hover:bg-green-500/30">해제</button>
                    )}
                    {currentUser?.role === "superadmin" && u.role !== "superadmin" && (
                      <button onClick={() => updateRole(u.id, u.role === "admin" ? "user" : "admin")}
                        className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30">
                        {u.role === "admin" ? "관리자 해제" : "관리자 지정"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded text-sm ${
                p === page ? "bg-[var(--color-gold)] text-black" : "bg-white/5 text-gray-400"
              }`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
