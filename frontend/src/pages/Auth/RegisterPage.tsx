import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/hooks/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "", password: "", passwordConfirm: "",
    email: "", name: "", nickname: "", phone: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

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
      const { data } = await api.post("/auth/register", {
        username: form.username, password: form.password,
        email: form.email, name: form.name,
        nickname: form.nickname, phone: form.phone,
      });
      if (data.access_token) {
        await login(data.access_token);
      }
      navigate("/");
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
    { key: "name", label: "실명", type: "text", placeholder: "홍길동", half: true },
    { key: "nickname", label: "닉네임", type: "text", placeholder: "2~20자", half: true },
    { key: "username", label: "아이디", type: "text", placeholder: "4~20자 영문+숫자" },
    { key: "email", label: "이메일", type: "email", placeholder: "example@email.com" },
    { key: "password", label: "비밀번호", type: "password", placeholder: "8자 이상" },
    { key: "passwordConfirm", label: "비밀번호 확인", type: "password", placeholder: "비밀번호 재입력" },
    { key: "phone", label: "전화번호", type: "tel", placeholder: "010-1234-5678" },
  ];

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    padding: '14px 0',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${focused === field ? '#c9a96e' : 'rgba(255,255,255,0.12)'}`,
    color: '#f0f0f5',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.3s ease',
    letterSpacing: '0.02em',
  });

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      position: 'relative',
    }}>
      {/* Left — Cinematic image */}
      <div style={{
        flex: '1 1 45%',
        position: 'relative',
        display: 'none',
      }} className="lg:!flex">
        <img
          src="/images/hero/audience.webp"
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(5,5,10,0.5) 0%, rgba(5,5,10,0.2) 40%, rgba(5,5,10,0.85) 100%)',
        }} />
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '60px',
        }}>
          <p style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 14,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#c9a96e',
            marginBottom: 16,
          }}>
            Join the Festival
          </p>
          <h2 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 32,
            fontWeight: 700,
            color: '#f0f0f5',
            lineHeight: 1.3,
            maxWidth: 360,
          }}>
            Be Part of Something Extraordinary
          </h2>
          <div style={{
            width: 40,
            height: 1,
            background: '#c9a96e',
            marginTop: 24,
          }} />
        </div>
      </div>

      {/* Right — Register form */}
      <div style={{
        flex: '1 1 55%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        background: '#05050a',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <Link to="/" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
              marginBottom: 36,
            }}>
              <img src="/images/logos/iiff-white.png" alt="IIFF" width={32} height={32} />
              <span style={{
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#c9a96e',
              }}>
                NextWave 2026
              </span>
            </Link>
            <h1 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 32,
              fontWeight: 700,
              color: '#f0f0f5',
              marginBottom: 8,
            }}>
              회원가입
            </h1>
            <p style={{ fontSize: 14, color: '#6a6a7a', lineHeight: 1.6 }}>
              IIFF 커뮤니티에 합류하세요
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: 24,
              padding: '12px 16px',
              background: 'rgba(220,80,80,0.08)',
              borderLeft: '2px solid rgba(220,80,80,0.6)',
              color: '#dc5050',
              fontSize: 13,
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 24px' }}>
              {fields.map((f) => (
                <div key={f.key} style={{
                  marginBottom: 24,
                  width: f.half ? 'calc(50% - 12px)' : '100%',
                  minWidth: f.half ? 160 : undefined,
                  flex: f.half ? '1 1 calc(50% - 12px)' : undefined,
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: 11,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: focused === f.key ? '#c9a96e' : '#5a5a6a',
                    marginBottom: 4,
                    transition: 'color 0.3s ease',
                  }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => updateField(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    onFocus={() => setFocused(f.key)}
                    onBlur={() => setFocused(null)}
                    style={{
                      ...inputStyle(f.key),
                      '::placeholder': { color: '#3a3a4a' },
                    } as React.CSSProperties}
                    required
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                marginTop: 12,
                background: isLoading ? '#8a7a5a' : '#c9a96e',
                color: '#05050a',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: isLoading ? 'wait' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? "가입 중..." : "회원가입"}
            </button>
          </form>

          <p style={{
            marginTop: 32,
            textAlign: 'center',
            fontSize: 13,
            color: '#5a5a6a',
          }}>
            이미 계정이 있으신가요?{' '}
            <Link to="/login" style={{ color: '#c9a96e', textDecoration: 'none' }}>
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
