import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/hooks/AuthContext";
import api from "@/services/api";

const hasGoogleAuth = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

/* Separate component so useGoogleLogin hook is only called when Provider exists */
function GoogleLoginButton({ onError, onLoading }: { onError: (msg: string) => void; onLoading: (v: boolean) => void }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      onError("");
      onLoading(true);
      try {
        const { data } = await api.post("/auth/google/callback", { code: codeResponse.code });
        if (data.needs_profile) {
          localStorage.setItem("temp_token", data.temp_token);
          navigate("/complete-profile");
        } else if (data.access_token) {
          await login(data.access_token);
          navigate("/");
        }
      } catch (err: any) {
        onError(err.response?.data?.detail || "Google 로그인에 실패했습니다");
      } finally {
        onLoading(false);
      }
    },
    onError: () => onError("Google 로그인이 취소되었습니다"),
    flow: "auth-code",
  });

  return (
    <button
      onClick={() => googleLogin()}
      style={{
        width: '100%',
        padding: '13px',
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#9a9aaa',
        fontSize: 13,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)';
        e.currentTarget.style.color = '#d0d0d8';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.color = '#9a9aaa';
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      Google 계정으로 계속하기
    </button>
  );
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/login", { username, password });
      await login(data.access_token);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "로그인에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

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
      overflow: 'hidden',
    }}>
      {/* Left — Cinematic image panel (hidden on mobile) */}
      <div style={{
        flex: '1 1 50%',
        position: 'relative',
        display: 'none',
      }} className="md:!flex md:!flex-1">
        <img
          src="/images/hero/redcarpet.webp"
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
          background: 'linear-gradient(135deg, rgba(5,5,10,0.7) 0%, rgba(5,5,10,0.3) 50%, rgba(5,5,10,0.8) 100%)',
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
            Incheon International Film Festival
          </p>
          <h2 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 36,
            fontWeight: 700,
            color: '#f0f0f5',
            lineHeight: 1.3,
            maxWidth: 400,
          }}>
            Where Cinema Meets the Future
          </h2>
          <div style={{
            width: 40,
            height: 1,
            background: '#c9a96e',
            marginTop: 24,
          }} />
        </div>
      </div>

      {/* Right — Login form */}
      <div style={{
        flex: '1 1 100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        background: '#05050a',
      }} className="md:!flex-[1_1_50%] md:!p-10">
        <div style={{ width: '100%', maxWidth: 380 }}>
          {/* Header */}
          <div style={{ marginBottom: 48 }}>
            <Link to="/" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
              marginBottom: 40,
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
              로그인
            </h1>
            <p style={{ fontSize: 14, color: '#6a6a7a', lineHeight: 1.6 }}>
              IIFF 플랫폼에 오신 것을 환영합니다
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
            <div style={{ marginBottom: 28 }}>
              <label style={{
                display: 'block',
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: focused === 'username' ? '#c9a96e' : '#5a5a6a',
                marginBottom: 4,
                transition: 'color 0.3s ease',
              }}>아이디</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocused('username')}
                onBlur={() => setFocused(null)}
                style={inputStyle('username')}
                required
              />
            </div>
            <div style={{ marginBottom: 36 }}>
              <label style={{
                display: 'block',
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: focused === 'password' ? '#c9a96e' : '#5a5a6a',
                marginBottom: 4,
                transition: 'color 0.3s ease',
              }}>비밀번호</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('password')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 4,
                    color: showPassword ? '#c9a96e' : '#5a5a6a',
                    transition: 'color 0.3s ease',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {showPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
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
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* Google login — only when VITE_GOOGLE_CLIENT_ID is configured */}
          {hasGoogleAuth && (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                margin: '32px 0',
              }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                <span style={{ fontSize: 11, color: '#4a4a5a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>또는</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              </div>
              <GoogleLoginButton onError={setError} onLoading={setIsLoading} />
            </>
          )}

          {/* Footer */}
          <p style={{
            marginTop: 40,
            textAlign: 'center',
            fontSize: 13,
            color: '#5a5a6a',
          }}>
            계정이 없으신가요?{' '}
            <Link to="/register" style={{ color: '#c9a96e', textDecoration: 'none' }}>
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
