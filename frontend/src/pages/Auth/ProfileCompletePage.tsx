import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "@/services/api";

export default function ProfileCompletePage() {
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const tempToken = searchParams.get("token");
    try {
      await api.post("/auth/google/complete-profile", { nickname, phone },
        { headers: { Authorization: `Bearer ${tempToken}` } });
      navigate("/pending");
    } catch (err: any) {
      setError(err.response?.data?.detail || "프로필 저장에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="heading-display text-2xl text-gold text-center mb-2">프로필 완성</h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Google 계정으로 가입하셨습니다. 추가 정보를 입력해주세요.
        </p>
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">닉네임</label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="2~20자"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-[var(--color-gold)] focus:outline-none" required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">전화번호</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-1234-5678"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-[var(--color-gold)] focus:outline-none" required />
          </div>
          <button type="submit" disabled={isLoading}
            className="w-full py-3 bg-[var(--color-gold)] text-black font-semibold rounded-lg hover:bg-[var(--color-gold-light)] transition disabled:opacity-50">
            {isLoading ? "저장 중..." : "프로필 완성"}
          </button>
        </form>
      </div>
    </div>
  );
}
