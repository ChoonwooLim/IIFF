import { Link } from "react-router-dom";

export default function PendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md text-center">
        <div className="text-6xl mb-6">⏳</div>
        <h1 className="heading-display text-2xl text-gold mb-4">승인 대기 중</h1>
        <p className="text-gray-400 mb-6">
          회원가입이 완료되었습니다.<br />
          관리자가 승인하면 서비스를 이용하실 수 있습니다.
        </p>
        <Link to="/" className="inline-block px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
