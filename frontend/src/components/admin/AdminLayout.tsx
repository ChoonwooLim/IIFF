import { NavLink, Outlet } from "react-router-dom";

const ADMIN_NAV = [
  { label: "대시보드", path: "/admin" },
  { label: "회원 관리", path: "/admin/users" },
  { label: "게시글 관리", path: "/admin/posts" },
  { label: "회의실 관리", path: "/admin/meetings" },
];

export default function AdminLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6 min-h-[calc(100vh-120px)]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 hidden md:block">
        <h2 className="text-lg font-bold text-[var(--color-gold)] mb-6">관리자</h2>
        <nav className="space-y-1">
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-[var(--color-gold)]/10 text-[var(--color-gold)] font-semibold"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
