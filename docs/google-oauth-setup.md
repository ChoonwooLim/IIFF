# Google OAuth 2.0 Setup Guide

## 1. Google Cloud Console 설정

### 1-1. 프로젝트 생성
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 상단 프로젝트 선택 > "새 프로젝트" 클릭
3. 프로젝트 이름: `IIFF Platform` 입력 후 생성

### 1-2. OAuth 동의 화면 설정
1. 좌측 메뉴: API 및 서비스 > OAuth 동의 화면
2. User Type: **외부** 선택
3. 앱 정보:
   - 앱 이름: `IIFF NextWave`
   - 사용자 지원 이메일: 관리자 이메일
   - 개발자 연락처 정보: 관리자 이메일
4. 범위(Scope):
   - `email` (이메일 주소 조회)
   - `profile` (기본 프로필 정보)
   - `openid` (OpenID Connect)
5. 테스트 사용자: 개발 중에는 테스트 사용자 추가 필요

### 1-3. OAuth 2.0 클라이언트 ID 생성
1. 좌측 메뉴: API 및 서비스 > 사용자 인증 정보
2. "+ 사용자 인증 정보 만들기" > "OAuth 클라이언트 ID"
3. 애플리케이션 유형: **웹 애플리케이션**
4. 이름: `IIFF Web Client`
5. **승인된 JavaScript 원본** (Authorized JavaScript origins):
   - 개발: `http://localhost:5173`
   - 프로덕션: `https://yourdomain.com`
6. **승인된 리디렉션 URI** (Authorized redirect URIs):
   - 개발: `http://localhost:5173`
   - 프로덕션: `https://yourdomain.com`
7. 생성 후 **클라이언트 ID**와 **클라이언트 보안 비밀번호** 복사

## 2. 환경변수 설정

### 2-1. `.env` 파일 (프로젝트 루트)
```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

### 2-2. 프론트엔드 환경변수
```env
# frontend/.env
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

## 3. 프론트엔드 Google 로그인 버튼 연동

### 3-1. @react-oauth/google 설치
```bash
cd frontend
npm install @react-oauth/google
```

### 3-2. main.tsx에 GoogleOAuthProvider 추가
```tsx
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

root.render(
  <GoogleOAuthProvider clientId={googleClientId}>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
```

### 3-3. LoginPage에 Google 로그인 버튼 추가
```tsx
import { useGoogleLogin } from '@react-oauth/google';

// 로그인 핸들러
const googleLogin = useGoogleLogin({
  onSuccess: async (codeResponse) => {
    const res = await api.post('/api/auth/google/callback', {
      code: codeResponse.code,
    });
    if (res.data.needs_profile) {
      // 프로필 완성 페이지로 이동
      localStorage.setItem('temp_token', res.data.temp_token);
      navigate('/complete-profile');
    } else if (res.data.access_token) {
      await login(res.data.access_token);
      navigate('/');
    }
  },
  flow: 'auth-code',
});

// JSX
<button onClick={() => googleLogin()} className="...">
  Google로 로그인
</button>
```

## 4. 인증 플로우 요약

```
사용자 → Google 로그인 버튼 클릭
  → Google OAuth 팝업 (동의 화면)
  → Authorization Code 획득
  → POST /api/auth/google/callback { code }
  → 백엔드: Google Token Exchange + UserInfo 조회
  → 신규 사용자: needs_profile=true → /complete-profile 페이지
  → 기존 사용자 (active): access_token 발급 → 로그인 완료
  → 기존 사용자 (pending): 승인 대기 메시지
```

## 5. 프로덕션 배포 체크리스트

- [ ] Google Cloud Console에서 프로덕션 도메인을 승인된 원본/리디렉션 URI에 추가
- [ ] OAuth 동의 화면을 "프로덕션"으로 전환 (게시)
- [ ] `.env`에 실제 `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` 설정
- [ ] `frontend/.env`에 `VITE_GOOGLE_CLIENT_ID` 설정
- [ ] HTTPS 필수 (Google OAuth는 프로덕션에서 HTTP를 허용하지 않음)
- [ ] `allowed_origins`에 프로덕션 도메인 추가

## 6. 테스트

### 개발 환경 테스트
1. `.env`에 Google OAuth 키 설정
2. `npm run dev` (프론트엔드)
3. `uvicorn main:app --reload` (백엔드)
4. Google 로그인 버튼 클릭 → OAuth 팝업 → 프로필 완성 → 관리자 승인 대기

### 현재 백엔드 지원 상태
- `POST /api/auth/google/callback` - Google 인증 코드 교환 + 사용자 생성/로그인
- `POST /api/auth/google/complete-profile` - 닉네임/전화번호 프로필 완성
- redirect_uri는 `postmessage` 방식 사용 (팝업 기반 OAuth)
