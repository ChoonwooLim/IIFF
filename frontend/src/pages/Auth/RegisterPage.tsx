import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/services/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "", password: "", passwordConfirm: "",
    email: "", name: "", nickname: "", phone: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }
    setIsLoading(true);
    try {
      await api.post("/auth/register", {
        username: form.username, password: form.password,
        email: form.email, name: form.name,
        nickname: form.nickname, phone: form.phone,
      });
      navigate("/pending");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (typeof detail === "string") setError(detail);
      else if (Array.isArray(detail)) setError(detail.map((d: any) => d.msg).join(", "));
      else setError("회원가입에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { key: "name", label: "실명", type: "text", placeholder: "홍길동" },
    { key: "username", label: "아이디", type: "text", placeholder: "4~20자 영문+숫자" },
    { key: "email", label: "이메일", type: "email", placeholder: "example@email.com" },
    { key: "password", label: "비밀번호", type: "password", placeholder: "8자 이상, 영문+숫자+특수문자" },
    { key: "passwordConfirm", label: "비밀번호 확인", type: "password", placeholder: "비밀번호 재입력" },
    { key: "nickname", label: "닉네임", type: "text", placeholder: "2~20자" },
    { key: "phone", label: "전화번호", type: "tel", placeholder: "010-1234-5678" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="heading-display text-3xl text-gold text-center mb-8">회원가입</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm text-gray-400 mb-1">{f.label}</label>
              <input type={f.type} value={form[f.key as keyof typeof form]}
                onChange={(e) => updateField(f.key, e.target.value)} placeholder={f.placeholder}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-[var(--color-gold)] focus:outline-none" required />
            </div>
          ))}
          <button type="submit" disabled={isLoading}
            className="w-full py-3 bg-[var(--color-gold)] text-black font-semibold rounded-lg hover:bg-[var(--color-gold-light)] transition disabled:opacity-50">
            {isLoading ? "가입 중..." : "회원가입"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          이미 계정이 있으신가요? <Link to="/login" className="text-gold hover:underline">로그인</Link>
        </p>
      </div>
    </div>
  );
}
