// ═══════════════════════════════════════════
// IIFF index.html — Full Bilingual KO↔EN
// ═══════════════════════════════════════════
let currentLang = 'ko';

const translations = {
    // ── NAV TOP-LEVEL ──
    '소개': 'Intro', '프로그램': 'Programs', '전략': 'Strategy', '재무': 'Finance',
    '거버넌스': 'Governance', '도구': 'Tools', '운영전략': 'Op. Strategy',
    // ── NAV DROPDOWN ITEMS ──
    'IIFF란?': 'What is IIFF?', '개요': 'Overview',
    '영화제 개요': 'Festival Overview',
    '왜 참여하는가?': 'Why Participate?', '왜 참여해야 하는가': 'Why Participate',
    '왜 인천인가?': 'Why Incheon?', '왜 인천인가': 'Why Incheon',
    '비전 & 철학': 'Vision & Philosophy',

    '핵심 프로그램': 'Core Programs',
    '스타초청 & Creator Camp': 'Star Invitation & Creator Camp',
    '일일 시뮬레이션': 'Daily Simulation', '시민 참여': 'Civic Participation',
    '핵심 전략': 'Core Strategy', '조직체계': 'Organization',
    '3개년 로드맵': '3-Year Roadmap', 'A-Z 로드맵': 'A-Z Roadmap',
    '공간활용 & 파트너': 'Space & Partners', 'BIFF 비교분석': 'BIFF Comparison',
    '예산 계획': 'Budget Plan', '현금 흐름표': 'Cash Flow',
    '프레젠테이션': 'Presentation', '인쇄하기': 'Print',
    '선거 리스크 관리': 'Election Risk Mgmt', '인적 배치': 'Personnel',
    '초기 경비': 'Initial Budget', '스폰서십 플랜': 'Sponsorship Plan', '마케팅 전략': 'Marketing Strategy',


    // ── REMAINING UNTRANSLATED CONTENT ──
    '핵심 포인트:': 'Key Point:',
    '체류형 영화제': 'Immersive Festival',
    '헐리우드 배우/감독의 특별 강연 및 Q&A': 'Hollywood actor/director special lecture & Q&A',
    '프로그램': 'Programs',
    '상세': 'Details',
    'i-NextWave Creator Camp 코디네이터': 'i-NextWave Creator Camp Coordinator',
    '캠프 운영 지원, 외국인 참가자 통역/안내, 야영 안전 관리 보조': 'Camp operations support, foreign participant translation/guidance, camping safety',
    '모바일/야영': 'Mobile/Camping',
    '인천 글로벌 모니터링단 (IGM)': 'Incheon Global Monitoring Team (IGM)',
    '해외 관람객 유치 피드백, K-컬처 체험 동선 점검, 바이럴 홍보 콘텐츠 제작': 'International visitor feedback, K-Culture route check, viral content',
    'K-컬처': 'K-Culture',
    '메소드 인디 섹션 서포터': 'Method Indie Section Supporter',
    '독립 영화관 안내, 아트 스크리닝 셔틀 안내 및 영화 정보 공유': 'Independent cinema guide, art screening shuttle info & film info sharing',
    '메소드': 'Method',
    'VIP 패스, 공식 굿즈, 헐리우드 스타 멘토링 클래스 특별 참석 기회': 'VIP pass, official goods, Hollywood star mentoring class special attendance',
    '"The Gateway: 아시아-헐리우드, 새로운 물결의 시작"': '"The Gateway: Asia-Hollywood, the beginning of a new wave"',
    '"모두가 감독, 모두가 비평가: NextWave Creator Camp"': '"Everyone is a director, everyone is a critic: NextWave Creator Camp"',
    '"Method-Indie Channel: 독립영화 정신 계승"': '"Method-Indie Channel: Inheriting the spirit of independent film"',
    '"Star Power & Global Mentoring"': '"Star Power & Global Mentoring"',
    '"Dual-Hub Strategy: 아시아-태평양 문화 교류"': '"Dual-Hub Strategy: Asia-Pacific cultural exchange"',
    '"Beyond Cinema: K-WAVE Festival"': '"Beyond Cinema: K-WAVE Festival"',
    '개막식 및 레드카펫: 인스파이어 아레나 및 오로라 활용, 글로벌·아시아 스타 공동 레드카펫. 비즈니스 & 포럼: MICE 시설에서 공동 제작 및 투자 유치 포럼 개최.': 'Opening ceremony & red carpet: Inspire Arena & Aurora, global-Asian star co-red carpet. Business & Forum: Co-production & investment forum at MICE.',
    '디스커버리 파크에 국제 야영장 조성. 참가자들이 모바일폰으로 영화를 제작하고, 야외 대형 스크린에서 상영 및 상호 평가 진행.': 'International campsite at Discovery Park. Participants create mobile films, screen on outdoor big screen, and peer-review.',
    '\'i-NWFF 메소드필름 인디 섹션\' 신설. 공동 심사 및 초청을 통해 독립영화의 권위를 확보. 인접 CGV 상영관을 인디 영화 전용관으로 운영.': '\'i-NWFF Method Film Indie Section\' established. Joint jury & invitation to secure indie film authority. Adjacent CGV as indie-exclusive theater.',
    '헐리우드 A급 배우 출연작 상영 및 배우 초청. 아레나에서 \'글로벌 멘토링 클래스\' 운영.': 'Hollywood A-list actor film screenings & invitations. \'Global Mentoring Class\' at the Arena.',
    '1~3회는 인천 기반 구축, 4회부터 하와이 국제영화제와 협력하여 교차 개최 로드맵 수립.': 'Editions 1-3: Build Incheon base. From edition 4: cross-hosting roadmap with Hawaii Int\'l Film Fest.',
    '디스커버리 파크 내 K-팝 미니 콘서트/버스킹 존, K-푸드 팝업 스토어, K-뷰티 체험 부스를 통합 운영.': 'K-Pop mini concert/busking zone, K-Food popup store, K-Beauty booth — integrated at Discovery Park.',
    '인천광역시 & 인천국제공항공사': 'Incheon Metropolitan City & IIAC',
    '조직위원회 및 공동 주최': 'Organizing committee & co-host',
    '행정/재정 지원, 국제 협력, 장소 사용 허가': 'Admin/financial support, int\'l cooperation, venue permits',
    '인스파이어 리조트': 'Inspire Resort',
    '집행위원회 및 공동 주최': 'Executive committee & co-host',
    '주요 시설 제공 및 운영, 숙박/F&B 협력, 마케팅/홍보 협력': 'Facilities, accommodation/F&B, marketing cooperation',
    'CGV (또는 주요 영화관 체인)': 'CGV (or major theater chain)',
    '실무 집행 (상영 시설)': 'Operations (screening facilities)',
    '상영관 시설 제공 및 기술 운영, 티켓 시스템 연동': 'Theater facilities & technical ops, ticket system integration',
    '한국 영화진흥위원회(KOFIC) & 영상위원회': 'KOFIC & Film Commission',
    '전문 위원회 (심사/교육)': 'Expert committee (jury/education)',
    '국내 독립 영화 발굴 및 지원, 영화 인력 양성 프로그램': 'Domestic indie film discovery & support, talent development',
    '메소드필름페스타(Method Fest)': 'Method Film Fest',
    '전문 위원회 (해외 협력)': 'Expert committee (int\'l cooperation)',
    '독립 영화 섹션 공동 기획, 헐리우드 독립영화인 네트워크 연계': 'Co-curating indie section, Hollywood indie filmmaker network',
    '글로벌 콘텐츠 에이전시 (CAA, UTA)': 'Global Content Agencies (CAA, UTA)',
    '전문 위원회 (스타 섭외)': 'Expert committee (star recruitment)',
    '헐리우드 유명 배우 및 감독 초청 대행, 비즈니스 미팅 주선': 'Hollywood talent invitation, business meeting arrangement',
    '엔터테인먼트 기획사 (하이브, JYP 등)': 'Entertainment agencies (HYBE, JYP, etc.)',
    '파트너 그룹 (K-컬처 융합)': 'Partner group (K-Culture convergence)',
    'K-팝 공연 콘텐츠 제공, K-뷰티/푸드 프로그램 기획 협력': 'K-Pop performance content, K-Beauty/Food program cooperation',
    '통신사/IT 기업 (SKT, KT)': 'Telecom/IT (SKT, KT)',
    '파트너 그룹 (모바일 영화)': 'Partner group (mobile film)',
    '모바일 영화 제작 키트 및 기술 지원, 5G 라이브 스트리밍': 'Mobile filmmaking kit & tech support, 5G live streaming',
    '1단계': 'Phase 1',
    '2단계': 'Phase 2',
    '3단계': 'Phase 3',
    '4단계': 'Phase 4',
    '목표:': 'Goal:',
    '영화제의 성공적 런칭 및 글로벌 인지도의 기반 마련': 'Successful festival launch & global awareness foundation',
    '공식 조직위/집행위원회 발족 (인천시-인스파이어-메소드 파트너십)': 'Official organizing/executive committee launch (Incheon-Inspire-Method partnership)',
    '아레나 개막식 & CGV 상영관 인디 섹션 운영 집중': 'Arena opening ceremony & CGV indie section focus',
    '\'NextWave Creator Camp\' 시범 운영 (국내외 100팀 제한)': '\'NextWave Creator Camp\' pilot (100 teams, domestic & int\'l)',
    'K-팝 연계 미니 콘서트 도입': 'K-Pop linked mini concert introduction',
    '아시아-헐리우드 비즈니스 플랫폼 기능 강화 및 프로그램 확장': 'Asia-Hollywood business platform enhancement & program expansion',
    '\'아시아-헐리우드 비즈니스 마켓\' 정식 런칭 및 MICE 활용': '\'Asia-Hollywood Business Market\' official launch & MICE utilization',
    '헐리우드 유명 배우 마스터 클래스 정례화 및 확대': 'Hollywood star master class regularization & expansion',
    '디스커버리 파크 국제 야영/모바일 영화제 규모 2배 확장': 'Discovery Park int\'l camping/mobile film festival 2x expansion',
    'K-컬처 연계 프로그램(푸드, 뷰티) 대폭 강화': 'K-Culture programs (food, beauty) major enhancement',
    '아시아 대표 영화제 도약 및 인천-하와이 교차 개최 준비 완료': 'Leap to Asia\'s leading festival & Incheon-Hawaii cross-hosting preparation complete',
    '하와이 국제영화제와 공식 협력 MOU 체결 및 교차 개최 로드맵 확정': 'Official MOU with Hawaii Int\'l Film Fest & cross-hosting roadmap finalized',
    '메소드 섹션을 공식 경쟁 부문으로 격상': 'Method section elevated to official competition',
    '3개년 성과 분석 및 장기 비전 수립': '3-year performance analysis & long-term vision established',
    '개막/폐막식 및 레드카펫, K-팝 스타 초청 \'갈라 콘서트\'': 'Opening/closing ceremony, red carpet, K-Pop star \'Gala Concert\'',
    '\'NextWave Creator Camp\', 야외 상영 및 평가회, K-푸드/K-뷰티 체험': '\'NextWave Creator Camp\', outdoor screening & review, K-Food/K-Beauty experience',
    '아시아-헐리우드 공동 제작 포럼/마켓, 마스터 클래스': 'Asia-Hollywood co-production forum/market, master class',
    '\'메소드-인디 섹션\' 전용 상영관, 일반 초청작/경쟁작 상영': '\'Method-Indie Section\' exclusive theater, general invited/competition screenings',
    '모바일 영화 수상작 디지털 미디어 상영, 포토존 및 스폰서십 공간': 'Mobile film winners digital screening, photo zone & sponsorship space',
    '추진위 발족 (2025.10 ~ 2026.01)': 'Committee Launch (2025.10 ~ 2026.01)',
    '조직위 출범 (2026.02 ~ 2026.04)': 'Organizing Committee Launch (2026.02 ~ 2026.04)',
    '프로그램 확정 & 마케팅 (2026.05 ~ 2026.07)': 'Program Finalization & Marketing (2026.05 ~ 2026.07)',
    '현장 준비 & 개최 (2026.08 ~ 2026.10)': 'On-site Preparation & Opening (2026.08 ~ 2026.10)',
    '핵심 목표:': 'Key Goal:',
    '예상 비용:': 'Est. Cost:',
    '법인 설립, 초기 씨드 자금 확보(2.5억), 핵심 파트너십(인스파이어, 인천시) MOU 체결': 'Corp. establishment, seed funding (₩250M), key partnership MOU (Inspire, Incheon City)',
    '2.5억 원 (인건비, 법인 설립비, CI 개발, 기획 연구비)': '₩250M (personnel, incorporation, CI development, planning research)',
    '사무국 인력 채용(팀장급), 프로그램 섹션 확정, 1차 스폰서십 유치 완료(30%)': 'Secretariat hiring (team leaders), program sections finalized, 1st sponsorship secured (30%)',
    '5억 원 (운영비, 홈페이지 구축, 해외 게스트 섭외 착수금)': '₩500M (operations, website, overseas guest advance payments)',
    '상영작 선정, 헐리우드 스타 초청 확정, 티켓 예매 오픈, 자원활동가 모집': 'Film selection, Hollywood star invitation confirmed, ticket sales open, volunteer recruitment',
    '10억 원 (게스트 항공/숙박, 홍보비, 시설 계약금)': '₩1B (guest flights/accommodation, PR, facility deposits)',
    '시설물 설치, 리허설, 영화제 개최, 안전 관리': 'Facility installation, rehearsals, festival hosting, safety management',
    '12.5억 원 (행사 운영비, 무대 설치비, 인건비, 체류비)': '₩1.25B (event operations, stage setup, personnel, accommodation)',

    // ── COVER ──
    '아시아와 헐리우드, 그리고 미래 영화계의 새로운 물결': 'A New Wave Connecting Asia, Hollywood, and the Future of Cinema',

    // ── WHAT IS IIFF ──
    '"만약에"': '"What if"',
    '만약에 올해, 내 영화가 이곳에서 처음으로 주목받는다면?': 'What if this year, my film gets noticed here for the first time?',
    '만약에 이 무대에서, 내 연기가 올해의 최우수 연기자로 불린다면?': 'What if on this stage, my performance earns the Best Actor award?',
    '만약에 이 선택이, 내 인생의 방향을 바꾸는 순간이 된다면?': 'What if this choice becomes the moment that changes the direction of my life?',
    'IIFF는': 'IIFF is',

    // ── OVERVIEW ──
    'Method Fest와 함께하는 글로벌 영화 플랫폼': 'Global Film Platform with Method Fest',
    '상업영화와 독립영화가 공존하는 이중 구조': 'Dual Structure: Commercial and Independent Films Coexist',
    '관객이 참여하고, 창작자가 성장하는 체험형 영화제': 'A Participatory Festival Where Audiences Engage and Creators Grow',
    '영화제 이후에도 지속되는 연중 콘텐츠 생태계': 'A Year-Round Content Ecosystem Beyond the Festival',
    '글로벌 상업영화를 통해 대중성과 확장성 확보': 'Securing popularity and scalability through global commercial films',
    'Method Fest 연계를 통한 독립·예술영화의 정체성 강화': 'Strengthening the identity of independent/art films through Method Fest partnership',
    '산업성과 예술성이 균형을 이루는 건강한 영화 생태계 조성': 'Building a healthy film ecosystem balancing industry and artistry',
    '관객 참여형 프로그램 및 투표, 체험 콘텐츠 운영': 'Audience participatory programs, voting, and experiential content',
    '신진 감독, 배우, 창작자를 위한 멘토링·피칭·워크숍': 'Mentoring, pitching, and workshops for emerging directors, actors, and creators',
    '단편, 숏폼, 모바일 콘텐츠 등 새로운 영상 포맷을 포용하는 개방형 경쟁 구조': 'Open competition embracing new video formats: shorts, short-form, mobile content',
    '영화제 이후에도 이어지는 상영, 교육, 제작, 교류 프로그램': 'Screenings, education, production, and exchange programs continuing beyond the festival',
    '인천을 거점으로 한 영화·콘텐츠 관련 인프라 활성화': 'Activating film/content infrastructure based in Incheon',
    '영화, 영상, 공연, 테크 기반 콘텐츠가 연중 지속적으로 생산·유통되는 구조 구축': 'Building a year-round system for continuous production and distribution of film, video, performance, and tech-based content',

    // ── WHY PARTICIPATE ──
    '"노출"을 넘어, 함께 만드는 브랜드 플랫폼': 'Beyond "Exposure": A Co-Created Brand Platform',
    'K-콘텐츠 중심 시장에서의 글로벌 노출 가치': 'Global Exposure Value in K-Content Markets',
    '인스파이어 리조트 × 프리미엄 운영 인프라': 'Inspire Resort × Premium Operations Infrastructure',
    'K-팝·K-푸드·K-뷰티·숏폼의 젊고 글로벌한 관객 유입 구조': 'K-Pop · K-Food · K-Beauty · Short-Form: Young Global Audience Pipeline',
    '모바일 숏필름 컴피티션 + 캠핑형 페스티벌 바이럴 엔진': 'Mobile Short Film Competition + Camping Festival Viral Engine',
    '"콘텐츠가 계속 재생산되는 영화제"': '"A Festival Where Content Keeps Being Reproduced"',
    '브랜드 가치 · 글로벌 네트워크 · 장기 비즈니스 자산': 'Brand Value · Global Network · Long-term Business Assets',
    '1회성 이벤트가 아닌 장기 파트너십 구조': 'Long-term Partnership, Not a One-time Event',

    // ── WHY INCHEON ──
    '인천은 단순한 \'공항 도시\'가 아니라 세계가 가장 먼저 만나는 대한민국의 얼굴입니다.': 'Incheon is not just an \'airport city\' — it is the face of Korea that the world meets first.',

    // ── VISION ──
    '인천 국제 넥스트웨이브 영화제의 기획 철학': 'Planning Philosophy of IIFF NextWave',
    '기술을 부정하지 않되, 사람을 지우지 않고': 'Without denying technology, without erasing humanity',
    '미래를 말하되, 기억과 감정을 잃지 않으며': 'Speaking of the future, without losing memory and emotion',
    '경쟁보다 가능성을, 결과보다 \'다음 장면\'을 남기는 영화제': 'A festival that leaves possibility over competition, the \'next scene\' over results',

    // ── PART 2 ──
    '사업 추진 계획서': 'Business Execution Plan',

    // ── CORE PROGRAMS ──
    '대중성과 국제 화제성을 동시에 확보하는 메인 스트림 섹션': 'Main Stream Section: Popularity and International Buzz',
    '창작자 중심 글로벌 독립영화제 섹션': 'Creator-Centric Global Independent Film Section',
    '모바일로 제작하는 \'새로운 영화 언어\' 대표 미래 섹션': 'The Future Section: A \'New Film Language\' Made on Mobile',
    '캠핑·공연·상영이 결합된 \'영화형 축제\'': '"Cinema Festival" Combining Camping, Performance, and Screening',
    '영화를 중심으로 K-컬처가 스며드는 공간': 'A Space Where K-Culture Permeates Through Film',

    // ── STAR INVITATION ──
    '7.1 헐리우드 스타 초청 전략': '7.1 Hollywood Star Invitation Strategy',
    '7.2 NextWave Creator Camp 규정 (요약)': '7.2 NextWave Creator Camp Rules (Summary)',
    '7.3 의전 및 VIP 관리': '7.3 Protocol and VIP Management',
    '📋 참가 자격': '📋 Eligibility', '🎬 제작 규정': '🎬 Production Rules', '🏆 심사 및 시상': '🏆 Judging & Awards',
    '초청 대상 (예시)': 'Guest (Example)', '섭외 채널': 'Booking Channel', '프로그램 연계': 'Program Link',
    '만 16세 이상 전 세계 누구나': 'Anyone worldwide, age 16+',
    '개인 또는 5인 이내 팀 참가': 'Individual or teams up to 5',
    '스마트폰(아이폰/갤럭시) 촬영 필수': 'Must film on smartphone (iPhone/Galaxy)',
    '참가비 포함 (야영 장비 기본 제공)': 'Entry fee included (camping gear provided)',
    '장르 자유 (실험/다큐/드라마/뮤비)': 'Genre-free (experimental/doc/drama/MV)',
    '러닝타임: 3분~15분 이내': 'Runtime: 3-15 minutes',
    '캠프 기간(48시간) 내 촬영·편집·제출': 'Film, edit, submit within camp (48hrs)',
    '모바일 촬영 원칙 (보조 장비 허용)': 'Mobile filming (accessories allowed)',
    '전문 심사위원단 + 관객 투표 병행': 'Expert jury + audience voting',
    '대상: 상금 + 차기 영화제 정식 상영권': 'Grand Prize: cash + next festival screening',
    '우수작: 온라인 공식 채널 공개': 'Excellence: official channel release',
    '인기상: SNS 투표 기반': 'Popularity award: SNS voting',
    '항목': 'Category', '내용': 'Details',
    '공항 의전': 'Airport Protocol',
    '인천공항 VIP 통로, 전용 의전 차량, 다국어 수행원 배치': 'Incheon Airport VIP lane, dedicated vehicle, multilingual attendants',
    '숙소': 'Accommodation',
    '인스파이어 리조트 최상급 스위트 또는 파르나스호텔': 'Inspire Resort top suite or Parnas Hotel',
    '현장 의전': 'On-site Protocol',
    '전용 대기실, 보안 경호(2인 이상), 전속 코디네이터': 'Private lounge, security (2+), coordinator',
    'Rider 사항': 'Rider Requirements',
    '식이요법, 선호 차량, 동반인 체류, PR 제한 사항 등 사전 계약': 'Diet, vehicle, companion stay, PR restrictions — pre-contracted',
    '보험': 'Insurance',
    '초청 게스트 상해보험, 배상 책임 보험 별도 가입': 'Guest accident & liability insurance',
    '할 베리 (Halle Berry)': 'Halle Berry',
    'CAA / 개인 에이전트': 'CAA / Personal Agent',
    '갈라 스크리닝 주연작 상영 + 마스터 클래스': 'Gala screening feature + Master Class',
    '키아누 리브스 (Keanu Reeves)': 'Keanu Reeves',
    'WME / 개인 에이전트': 'WME / Personal Agent',
    '개막식 특별 게스트 + 관객 밋앤그릿': 'Opening special guest + audience meet & greet',
    '봉준호 감독': 'Director Bong Joon-ho',
    '국내 에이전시': 'Domestic Agency',
    '심사위원장 또는 마스터 클래스 연사': 'Jury chairman or Master Class speaker',
    '송강호': 'Song Kang-ho',
    '개막작/폐막작 주연 배우 초청': 'Opening/Closing film lead actor guest',
    '아시아 톱스타 (예: 량차오웨이)': 'Asian top star (e.g., Tony Leung)',
    '중국/홍콩 에이전시': 'China/HK Agency',
    '아시아 특별전 게스트': 'Asia Special Section guest',

    // ── DAILY SIMULATION ──
    '"관객이 아침에 도착해서 밤늦게까지 머무르는" 체류형 영화제의 하루': '"Audiences arrive in the morning and stay until late at night" — An Immersive Festival Day',
    '시간': 'Time', '장소': 'Venue', '상세': 'Details',
    '디스커버리 파크': 'Discovery Park',
    '🌅 모닝 요가 & 아침 식사': '🌅 Morning Yoga & Breakfast',
    '야영 참가자 기상, 캠프 내 모닝 루틴': 'Campers wake up, camp morning routine',
    '인접 CGV': 'Adjacent CGV',
    '🎬 인디 섹션 상영 (메소드)': '🎬 Indie Section Screening (Method)',
    '메소드-인디 섹션 작품 2~3편 블록 상영 + GV': 'Method-Indie: 2-3 film block + Q&A',
    '📱 Creator Camp 활동': '📱 Creator Camp Activity',
    '모바일 영화 제작 워크숍, 촬영 실습': 'Mobile filmmaking workshop, shooting practice',
    '오로라 푸드코트': 'Aurora Food Court',
    '🍜 K-푸드 팝업 런치': '🍜 K-Food Popup Lunch',
    '인천 맛집 및 K-푸드 셰프 팝업 운영': 'Incheon restaurants & K-Food chef popup',
    'MICE 시설': 'MICE Facility',
    '🎤 마스터 클래스': '🎤 Master Class',
    '헐리우드 배우/감독의 특별 강연 및 Q&A': 'Hollywood actor/director special lecture & Q&A',
    '💼 비즈니스 포럼': '💼 Business Forum',
    '공동 제작·투자 매칭 세션': 'Co-production & investment matching session',
    '오로라': 'Aurora',
    '☕ 네트워킹 브레이크': '☕ Networking Break',
    'K-뷰티 체험 부스 방문, 굿즈 스토어': 'K-Beauty booth visit, goods store',
    '🎬 경쟁작/초청작 상영': '🎬 Competition/Invited Screenings',
    '경쟁 부문 작품 상영 + 감독 GV': 'Competition screening + Director Q&A',
    '레드카펫 존': 'Red Carpet Zone',
    '📸 레드카펫 & 포토콜': '📸 Red Carpet & Photo Call',
    '저녁 행사 전 스타 레드카펫 이벤트': 'Pre-evening star red carpet event',
    '아레나': 'Arena',
    '🌟 갈라 스크리닝': '🌟 Gala Screening',
    '대형 스크린 프리미어 상영, 감독·배우 무대 인사': 'Big screen premiere, director-actor greeting',
    '🎶 K-팝 콘서트 & 야외 상영': '🎶 K-Pop Concert & Outdoor Screening',
    '미니 라이브 공연 후 야외 대형 스크린 상영': 'Mini live concert + outdoor big screen',
    '🔥 캠프파이어 & 네트워킹': '🔥 Campfire & Networking',
    '영화인·관객·캠퍼 자유 교류, DJ 세트': 'Free networking: filmmakers, audience, campers, DJ set',

    // ── CIVIC PARTICIPATION ──
    '구분': 'Category', '프로그램명': 'Program', '역할 및 혜택': 'Roles & Benefits', '연계 특징': 'Feature',
    '핵심 활동 참여': 'Core Activity', '홍보 및 피드백': 'PR & Feedback', '지역 연결고리': 'Local Links', '인센티브': 'Incentive',
    '캠프 운영 지원, 외국인 참가자 통역/안내, 야영 안전 관리 보조': 'Camp support, foreign participant translation/guidance, camping safety',
    '모바일/야영': 'Mobile/Camping',
    '해외 관람객 유치 피드백, K-컬처 체험 동선 점검, 바이럴 홍보 콘텐츠 제작': 'International visitor feedback, K-Culture route check, viral content',
    'K-컬처': 'K-Culture',
    '독립 영화관 안내, 아트 스크리닝 셔틀 안내 및 영화 정보 공유': 'Independent cinema guide, art screening shuttle info & film info sharing',
    '메소드': 'Method',

    // ── CORE STRATEGY ──
    '번호': 'No.', '핵심 특징': 'Key Feature', '영화제 비전': 'Festival Vision', '구체적 구현 전략': 'Implementation Strategy',
    '아시아와 헐리우드의 만남': 'Asia Meets Hollywood',
    '모바일/야영/평가/상영': 'Mobile/Camping/Review/Screening',
    '메소드필름페스타 융합': 'Method Film Fest Integration',
    '헐리우드 유명배우 참여': 'Hollywood Star Involvement',
    '인천-하와이 교차 개최': 'Incheon-Hawaii Cross-hosting',
    'K-컬처 융합': 'K-Culture Convergence',

    // ── ORGANIZATION ──
    '2.1 조직도 (3단계)': '2.1 Organization Chart (3 Tiers)',
    '추진 위원회 (위원장)': 'Steering Committee (Chairman)',
    '총괄사업추진단장': 'General Project Director',
    '예술 전략 및 감독': 'Art Strategy & Direction',
    '사무국 (집행 조직)': 'Secretariat (Exec. Org)',
    '실무 운영': 'Operations',
    '전문 위원회 & 파트너': 'Expert Committee & Partners',
    '2.2 참여 가능 그룹별 역할': '2.2 Roles by Participating Group',
    '그룹': 'Group', '조직 역할': 'Org. Role', '주요 임무 및 참여 명분': 'Key Duties & Rationale',
    '인천광역시 & 인천국제공항공사': 'Incheon City & Airport Corp.',
    '조직위원회 및 공동 주최': 'Organizing Committee & Co-host',
    '행정/재정 지원, 국제 협력, 장소 사용 허가': 'Admin/financial support, international cooperation, venue permits',
    '인스파이어 리조트': 'Inspire Resort',
    '집행위원회 및 공동 주최': 'Executive Committee & Co-host',
    '주요 시설 제공 및 운영, 숙박/F&B 협력, 마케팅/홍보 협력': 'Major facilities, accommodation/F&B, marketing cooperation',
    'CGV (또는 주요 영화관 체인)': 'CGV (or major theater chain)',
    '실무 집행 (상영 시설)': 'Operations (Screening Facilities)',
    '상영관 시설 제공 및 기술 운영, 티켓 시스템 연동': 'Theater facilities, tech operations, ticketing system',
    '한국 영화진흥위원회(KOFIC) & 영상위원회': 'KOFIC & Film Commission',
    '전문 위원회 (심사/교육)': 'Expert Committee (Jury/Education)',
    '국내 독립 영화 발굴 및 지원, 영화 인력 양성 프로그램': 'Indie film discovery & support, film talent development',
    '메소드필름페스타(Method Fest)': 'Method Fest',
    '전문 위원회 (해외 협력)': 'Expert Committee (Int\'l Cooperation)',
    '독립 영화 섹션 공동 기획, 헐리우드 독립영화인 네트워크 연계': 'Co-plan indie section, Hollywood indie network',
    '글로벌 콘텐츠 에이전시 (CAA, UTA)': 'Global Content Agencies (CAA, UTA)',
    '전문 위원회 (스타 섭외)': 'Expert Committee (Star Booking)',
    '헐리우드 유명 배우 및 감독 초청 대행, 비즈니스 미팅 주선': 'Hollywood star/director invitation, business meetings',
    '엔터테인먼트 기획사 (하이브, JYP 등)': 'Entertainment Agencies (HYBE, JYP, etc.)',
    '파트너 그룹 (K-컬처 융합)': 'Partner Group (K-Culture)',
    'K-팝 공연 콘텐츠 제공, K-뷰티/푸드 프로그램 기획 협력': 'K-Pop performance, K-Beauty/Food program cooperation',
    '통신사/IT 기업 (SKT, KT)': 'Telecom/IT (SKT, KT)',
    '파트너 그룹 (모바일 영화)': 'Partner Group (Mobile Film)',
    '모바일 영화 제작 키트 및 기술 지원, 5G 라이브 스트리밍': 'Mobile filmmaking kits, 5G live streaming',

    // ── ROADMAP/SPACE ──
    '4. 공간 활용 및 프로그램 배치 계획': '4. Space Utilization & Program Layout',
    '주요 프로그램': 'Key Programs', '활용 특징': 'Utilization',
    '인스파이어 아레나': 'Inspire Arena', '15,000석 다목적 공연장': '15,000-seat multipurpose arena',
    '개·폐막식, 갈라 스크리닝, K-팝 콘서트, 시상식': 'Opening/Closing, Gala, K-Pop concert, Awards',
    '대규모 야외 공간': 'Large outdoor grounds',
    'Creator Camp 야영, 야외상영, 캠핑 페스티벌, K-푸드/뷰티 존': 'Creator Camp, outdoor screening, camping, K-Food/Beauty zone',
    '컨벤션·회의실': 'Convention & meeting rooms',
    '비즈니스 포럼, 마스터 클래스, 프레스 센터, 투자자 네트워킹': 'Business forum, Master Class, press center, investor networking',
    '오로라(디지털 스트리트)': 'Aurora (Digital Street)',
    '약 200m 디지털 미디어 조형물': '~200m digital media structure',
    '모바일 수상작 디지털 전시, 포토존, 스폰서 디지털 광고': 'Mobile winner digital exhibition, photo zone, sponsor digital ads',
    '호텔·리조트': 'Hotel/Resort', '숙박 시설': 'Lodging facilities',
    'VIP/게스트 숙소, 관객 패키지 연계': 'VIP/guest accommodations, audience packages',
    '인스파이어 MICE 시설': 'Inspire MICE Facility',
    '인접 CGV 등 상영관': 'Adjacent CGV & Theaters',
    '오로라 (디지털 스트리트)': 'Aurora (Digital Street)',

    // ── A-TO-Z ROADMAP ──
    '전체 예산 30억 원 기준, 현금 흐름을 고려한 적시 투입 계획': 'Budget ₩3B: Cash-flow-based timely investment plan',
    '13.1 단계별 추진 로드맵': '13.1 Phase-by-Phase Roadmap',
    '13.2 조직위원회 구조': '13.2 Organizing Committee Structure',
    '조직 위원장 (시장/기업인)': 'Chairman (Mayor/CEO)',
    '집행 위원장 (총괄 Expert)': 'Executive Chairman (Expert)',
    '사무국장': 'Secretary General',
    '경영지원팀': 'Management Support', '예산/계약/인사': 'Budget/Contract/HR',
    '프로그램팀': 'Program Team', '상영작/게스트/캠프': 'Films/Guests/Camp',
    '운영/기술팀': 'Ops/Tech Team', '현장/영사/셔틀': 'Venue/Projection/Shuttle',
    '홍보마케팅팀': 'PR & Marketing', '티켓/SNS/프레스': 'Tickets/SNS/Press',
    '대외협력팀': 'External Affairs', '스폰서/정부/MOU': 'Sponsors/Gov/MOU',
    '13.3 팀별 KPI (핵심 성과 지표)': '13.3 Team KPIs',
    '조직': 'Team', '확인 방법 (KPI)': 'Verification (KPI)', '달성 기준': 'Achievement Standard',
    '초청 수락서(LOI) 확보율': 'LOI acquisition rate',
    'D-3개월까지 주요 게스트/작품 90% 계약 완료': 'D-3 months: 90% contracts done',
    '마케팅팀': 'Marketing Team',
    '티켓 예매율 및 SNS 도달률': 'Ticket reservation & SNS reach',
    '얼리버드 10분 내 매진 / 팔로워 5만 명': 'Early bird sold out in 10min / 50K followers',
    '운영팀': 'Operations Team',
    '시설 안전 점검 필증': 'Facility safety certification',
    'D-1개월 전 모든 시설 안전 검사 \'적합\' 판정': 'D-1 month: all facilities pass safety',
    '스폰서십 입금 달성률': 'Sponsorship payment rate',
    'D-2개월 전 목표 후원금 100% 약정 체결': 'D-2 months: 100% sponsorship committed',

    // ── SPACE & PARTNERS ──
    '10.1 인스파이어 리조트 공간별 활용 전략': '10.1 Inspire Resort Space Strategy',
    '공간': 'Space', '면적/규모': 'Area/Scale', '영화제 활용 프로그램': 'Festival Programs',
    '10.2 인천 도심 연계 전략': '10.2 Incheon Downtown Integration',
    '🎬 영화공간 주안': '🎬 Film Space Juan',
    '🏢 송도 국제도시': '🏢 Songdo International City',
    '🏛️ 인천 구도심': '🏛️ Incheon Old Downtown',
    '10.3 K-컬처 파트너 네트워크': '10.3 K-Culture Partner Network',
    '발굴 카테고리': 'Category', '잠재적 협력 파트너 (예시)': 'Partners', '영화제 기여 역할': 'Contribution',
    'K-식품 / F&B': 'K-Food / F&B', '인천 지역 맛집, CJ푸드빌': 'Incheon restaurants, CJ Foodville',
    'K-푸드 팝업 운영, 캠프 식음 케이터링': 'K-Food popup, camp catering',
    'K-뷰티': 'K-Beauty', '아모레퍼시픽, 올리브영': 'Amorepacific, Olive Young',
    '메이크업 체험 부스, 스타 뷰티 클래스': 'Makeup booth, star beauty class',
    'K-팝·엔터': 'K-Pop/Ent.', '하이브, JYP, SM': 'HYBE, JYP, SM',
    '미니 콘서트, 팬미팅, K-팝 스타 레드카펫': 'Mini concert, fan meeting, K-Pop red carpet',
    'K-관광': 'K-Tourism', '인천관광공사, 한국관광공사': 'Incheon Tourism, Korea Tourism Org.',
    '외국인 관광 패키지, 팸투어 운영': 'Foreign tourist packages, FAM tour',

    // ── BIFF COMPARISON ──
    '선배 영화제의 성과를 \'벤치마크\'로, IIFF만의 차별점을 \'전략적 무기\'로 삼는다': 'Benchmarking senior festivals, making IIFF\'s differentiators strategic weapons',
    '비교 항목': 'Comparison', 'BIFF (부산국제영화제)': 'BIFF (Busan)', 'i-NextWave FF (인천)': 'i-NextWave FF (Incheon)',
    '위상': 'Status', '주요 콘텐츠': 'Key Content', '예산 규모(1회)': 'Budget (1st)',
    '핵심 관객층': 'Core Audience', '헐리우드 연계': 'Hollywood Link', '차별화 무기': 'Differentiator',
    '아시아 최대 A급 국제영화제': 'Asia\'s largest A-class int\'l film festival',
    '아시아 최초 \'미래형 융합 영화 플랫폼\'': 'Asia\'s first future convergence film platform',
    '정통 영화 상영 및 시상 중심': 'Traditional screening & awards focused',
    '영화 + 모바일 + K-컬처 + 야영 + 공연 융합': 'Film + Mobile + K-Culture + Camping + Performance fusion',
    '약 200억 원 (현재)': '~₩20B (current)',
    '약 30억 원 (인스파이어 현물 포함 시 50억+)': '~₩3B (₩5B+ with Inspire in-kind)',
    '영화 관계자, 시네필': 'Film professionals, cinephiles',
    '영화인 + MZ세대 + 글로벌 K-컬처 팬 + 관광객': 'Filmmakers + Gen MZ + K-Culture fans + tourists',
    '영화의 전당 (부산 센텀시티)': 'Busan Cinema Center (Centum City)',
    '인스파이어 리조트 + 인천 도심 상영관': 'Inspire Resort + Incheon city theaters',
    '매년 할리우드 스타 초청 (수동적)': 'Annual Hollywood star invitations (passive)',
    'Method Fest 공동 운영 (구조적 연결)': 'Method Fest co-operation (structural)',
    '30년 축적된 권위와 네트워크': '30 years of authority & network',
    '모바일 영화제, 야영 캠프, K-컬처 융합, 인스파이어 인프라': 'Mobile film fest, camping, K-Culture, Inspire infra',

    // ── BUDGET ──
    '제1회 기준, 30억 원 규모': '1st Edition, ₩3 Billion Scale',
    '재원 확보 (Revenues)': 'Revenue Sources', '지출 항목 (Expenses)': 'Expenditure Items',
    '금액': 'Amount', '비율': 'Ratio',
    '공적 자금 (시/정부)': 'Public Funds (City/Gov)',
    '10억 원': '₩1.0B', '12억 원': '₩1.2B', '6억 원': '₩0.6B', '2억 원': '₩0.2B',
    '30억 원': '₩3.0B', '8억 원': '₩0.8B', '9억 원': '₩0.9B', '4억 원': '₩0.4B', '3억 원': '₩0.3B',
    '기업 스폰서십 (민간)': 'Corporate Sponsorship (Private)',
    '수익 사업 (Ticket & Market)': 'Revenue Business (Ticket & Market)',
    '기타 (재단 기금 등)': 'Others (Foundation etc.)', '합계': 'Total',
    '프로그램 운영비': 'Program Operations', '초청 및 의전비': 'Invitation & Protocol',
    '마케팅 및 홍보비': 'Marketing & PR', '시설 및 인프라': 'Facilities & Infrastructure',
    '인건비 및 일반 관리비': 'Personnel & General Admin',
    '재원 확보 전략': 'Revenue Strategy',

    // ── CASH FLOW ──
    '"성공적인 영화제는 \'돈맥경화\'가 없어야 한다"': '"A successful festival must have no financial bottlenecks"',
    '현금 유입': 'Cash Inflow', '현금 유출': 'Cash Outflow', '현금 잔액': 'Cash Balance',
    '› 지자체/공공': '› Municipality/Public', '› 민간 스폰서': '› Private Sponsors',
    '› 자체 수익': '› Self-Generated Revenue', '› 인건비/운영': '› Personnel/Ops',
    '› 초청/체류비': '› Invitation/Stay', '› 마케팅비': '› Marketing',
    '› 시설/제작비': '› Facilities/Production',
    '(단위: 백만 원)': '(Unit: ₩ million)',

    // ── INITIAL BUDGET ──
    '추진위원회 초기 경비 (약 6개월)': 'Steering Committee Initial Expenses (~6 months)',
    '금액 (백만 원)': 'Amount (₩M)', '용도': 'Purpose',
    '인건비 및 운영비': 'Personnel & Operations',
    '코어 인력(3인) 인건비, 사무실 임차': 'Core team (3) salary, office lease',
    '회의 및 네트워킹': 'Meetings & Networking',
    '추진위/분과위 회의, 비전 발표회': 'Steering/subcommittee meetings, vision launch',
    '초기 네트워크 구축': 'Initial Network Building',
    '메소드페스타/하와이 MOU 출장, 헐리우드 접촉': 'Method Fest/Hawaii MOU trips, Hollywood contacts',
    '홍보물 및 자료 제작': 'Promotional Materials',
    '비전 선포 자료, 홈페이지, 로고/디자인': 'Vision docs, website, logo/design',
    '총계': 'Grand Total', '(한화 2억 5천만 원)': '(₩250 million)',
    '50:50 매칭 펀딩 전략': '50:50 Matching Fund Strategy',
    '단계': 'Phase', '전략': 'Strategy', '목표 금액': 'Target Amount',
    '100백만 원': '₩100M', '50백만 원': '₩50M',

    // ── SPONSORSHIP ──
    '9.1 스폰서십 등급 (Tier System)': '9.1 Sponsorship Tiers',
    '등급': 'Tier', '금액 기준': 'Amount Criteria', '주요 혜택': 'Key Benefits',
    '타이틀 스폰서': 'Title Sponsor', '5억 원 이상': '₩500M+',
    '영화제 공식 명칭 삽입, 모든 홍보물 로고 노출, 개막식 VIP석, 전용 브랜드 존 운영': 'Official name, all PR logo, Opening VIP, exclusive brand zone',
    '프리미엄 파트너': 'Premium Partner', '2~5억 원': '₩200-500M',
    '핵심 섹션 네이밍권 (갈라/캠프/어워드), 주요 행사 VIP 초대, 프레스 월 로고 노출': 'Key section naming (Gala/Camp/Awards), VIP invites, press wall logo',
    '공식 파트너': 'Official Partner', '5천만~2억 원': '₩50-200M',
    '홈페이지 및 공식 인쇄물 로고, K-컬처 존 부스 운영권, SNS 콜라보 콘텐츠': 'Website/print logo, K-Culture zone booth, SNS collab',
    '서포터': 'Supporter', '5천만 원 이하': 'Under ₩50M',
    '홈페이지 로고 게시, 공식 굿즈 콜라보, 소규모 체험 부스 운영': 'Website logo, official goods collab, small booth',

    '9.2 타겟 스폰서 업종 및 접근 전략': '9.2 Target Sponsor Industries & Approach',
    '업종': 'Industry', '타겟 기업 (예시)': 'Target Companies', '연계 가능 프로그램': 'Programs', '접근 방식': 'Approach',
    'IT/모바일': 'IT/Mobile', '삼성, Apple, SKT': 'Samsung, Apple, SKT',
    '모바일 영화 컴피티션 (촬영 기기 제공 + 네이밍)': 'Mobile film competition (devices + naming)',
    '모바일 콘텐츠 제작 인프라 제공 제안': 'Mobile content infra proposal',
    '항공/여행': 'Airlines/Travel', '대한항공, 아시아나': 'Korean Air, Asiana',
    '해외 게스트 항공 지원 + 관광 패키지 공동 개발': 'Guest flights + tourism package co-develop',
    '인천공항 → 영화제 연결 동선 마케팅': 'Airport → Festival route marketing',
    '소비재/뷰티': 'Consumer/Beauty', '아모레퍼시픽, LG생활건강': 'Amorepacific, LG H&H',
    'K-뷰티 체험 부스 + 스타 메이크업 쇼': 'K-Beauty booth + star makeup show',
    '글로벌 관객 대상 제품 노출 + 체험': 'Global audience product exposure',
    '식음료': 'F&B', 'CJ제일제당, 하이트진로': 'CJ CheilJedang, Hite Jinro',
    'K-푸드 팝업 스토어 + 캠프 식음 지원': 'K-Food popup + camp F&B support',
    '야외 축제 환경에서 브랜드 체험 극대화': 'Maximize brand experience in outdoor festival',
    '자동차': 'Automotive', '현대, 기아': 'Hyundai, Kia',
    '공식 의전 차량 + 레드카펫 차량 전시': 'Official vehicles + red carpet exhibit',
    '프리미엄 이미지 연계 (EV/수소차)': 'Premium image (EV/hydrogen)',
    '금융': 'Financial', 'KB, 신한, 하나': 'KB, Shinhan, Hana',
    'K-콘텐츠 펀드/투자 연계 포럼': 'K-Content fund/investment forum',
    'ESG 활동 + 문화 투자 포트폴리오': 'ESG + cultural investment portfolio',

    '9.3 3개년 스폰서십 전략': '9.3 3-Year Sponsorship Strategy',
    '연차': 'Year', '스폰서십 목표': 'Sponsorship Target',
    '1회차': '1st Year', '핵심 파트너 확보 + 현물 스폰서 중심': 'Core partners + in-kind focus',
    '~12억 원 (인스파이어 현물 포함)': '~₩1.2B (incl. Inspire in-kind)',
    '2회차': '2nd Year', '브랜드 경쟁 구도 형성 + 프리미엄 네이밍 판매': 'Brand competition + premium naming',
    '~20억 원': '~₩2.0B',
    '3회차': '3rd Year', '글로벌 브랜드 유치 + 멀티이어 계약 전환': 'Global brands + multi-year contracts',
    '~30억 원': '~₩3.0B',

    // ── MARKETING ──
    '6.1 글로벌 인지도 확보 (전문성 강조)': '6.1 Global Awareness (Expertise)',
    '세부 활동': 'Activities',
    '헐리우드 네트워크 활용': 'Leverage Hollywood Network',
    '아시아 게이트웨이 브랜딩': 'Asia Gateway Branding',
    '타겟 미디어 파트너십': 'Target Media Partnership',
    '6.2 대중 참여 및 바이럴 (참여성 강조)': '6.2 Public Participation & Viral',
    '6.3 홍보 콘텐츠 및 프로모션 타임라인': '6.3 PR Content & Timeline',
    '콘텐츠': 'Content', '시기': 'Timing',
    '티저 영상': 'Teaser Video', '공식 포스터': 'Official Poster',
    '얼리버드 티켓': 'Early Bird Tickets', '인천 시민 우대': 'Incheon Citizen Discount',

    // ── RISK MANAGEMENT ──
    '핵심 전략: "先 민간 주도(준비) → 後 관(官) 추인(개최)"': 'Strategy: "Private-led preparation → Government endorsement"',
    '정치적 상황': 'Political Situation', '영화제 추진 핵심 과제': 'Key Task',
    '민간 발족': 'Private Launch', '현직 임기 말': 'End of current term',
    '공약화': 'Campaign Pledge', '후보 경선 진행': 'Primary elections',
    '선거 기간': 'Election Period', '공식 선거운동': 'Official campaign',
    '당선자 협력': 'Winner Cooperation', '선거(6.3) 및 인수위': 'Election (6.3) & transition',
    '개최': 'Hosting', '신임 시장 취임 초기': 'New mayor\'s early term',
    '16.1 비당파 추진위원회 구성 원칙': '16.1 Non-partisan Committee Principles',
    '16.2 후보 대상 MOU 전략': '16.2 MOU Strategy for Candidates',
    '16.3 선거 전후 업무 분장 (Shadow Operation)': '16.3 Pre/Post-Election Task Division',
    '추진위원회 (민간) 역할': 'Steering Committee (Private) Role',
    '정치권/인천시 역할': 'Political/City Role',

    // ── PERSONNEL ──
    '직책': 'Position', '성명': 'Name', '핵심 역할': 'Key Role', '역할': 'Role',
    '17.1 컨트롤 타워 (Leadership)': '17.1 Control Tower (Leadership)',
    '명예 위원장': 'Honorary Chairman',
    '이용관 (전 BIFF 이사장)': 'Lee Yong-kwan (former BIFF Chairman)',
    '저스틴 김 (메소드영화제 조직위원장)': 'Justin Kim (Method Fest Chairman)',
    '돈 플랑캔 (메소드영화제 조직위원장)': 'Don Franken (Method Fest Chairman)',
    '추진 위원장': 'Steering Chairman',
    '이청산 (전 BIFF 비대위원장)': 'Lee Cheong-san (former BIFF Chair)',
    '공동 위원장': 'Co-Chairman',
    '박병용 (인스파이어 부회장)': 'Park Byung-yong (Inspire VP)',
    '오석근 (전 영진위 위원장)': 'Oh Seok-geun (former KOFIC Chair)',
    '17.2 대외 협력 및 정무': '17.2 External Affairs',
    '상임 고문': 'Standing Advisor',
    '유동수 (국회의원)': 'Yoo Dong-soo (Assembly Member)',
    '자문 위원': 'Advisory Member',
    '조광희 (전 시의원)': 'Cho Kwang-hee (former City Council)',
    '대외협력 이사': 'External Affairs Director',
    '서태웅': 'Seo Tae-woong',
    '17.3 글로벌 네트워크 (USA / Asia / Hollywood)': '17.3 Global Network',
    '해외 프로그래머': 'Int\'l Programmer',
    '하와이 협력 이사': 'Hawaii Director',
    '제니스 (Janice)': 'Janice',
    '17.4 실무 운영 및 기술/디자인': '17.4 Operations & Tech/Design',
    '황보진호 (최초 기안자)': 'Hwangbo Jin-ho (Original Planner)',
    '운영 본부장': 'Operations Director',
    '강준 (제니스글로컬 회장)': 'Kang Jun (Janice Glocal Chair)',
    '예술 감독 (AD)': 'Art Director (AD)',
    '노준석 (LA 디자이너)': 'Noh Jun-seok (LA Designer)',
    '기술 감독 (CTO)': 'Technical Director (CTO)',
    '임춘우': 'Im Chun-woo',
    '재무 감사': 'Financial Auditor',
    '송승희 (세무법인 실장)': 'Song Seung-hee (Tax Corp. Director)',

    // ── FOOTER ──
    'Integrated Proposal v5 · 감사합니다': 'Integrated Proposal v5 · Thank You',
    '✕ 나가기': '✕ Exit',
};

// ═══ INIT TRANSLATIONS ═══
function initTranslations() {
    // Strategy 1: Elements with data-en attribute (for complex HTML content)
    document.querySelectorAll('[data-en]').forEach(el => {
        if (el.classList.contains('translatable')) return;
        el.dataset.ko = el.innerHTML;
        el.classList.add('translatable');
    });

    // Strategy 2: Simple text elements via dictionary
    const selectors = 'h2, h3, h4, h5, th, td, li, p, div.section-desc, div.section-title, div.section-label, div.tagline, div.version, blockquote, .badge, .org-box h5, .org-box p, footer p, footer .logo';
    document.querySelectorAll(selectors).forEach(el => {
        if (el.classList.contains('translatable')) return;
        if (el.querySelector('.translatable')) return;
        const txt = el.textContent.trim();
        if (translations[txt]) {
            el.dataset.ko = el.innerHTML;
            el.dataset.en = translations[txt];
            el.classList.add('translatable');
        }
    });

    // Strategy 3: Nav dropdown links (preserve icon spans)
    document.querySelectorAll('.nav-dropdown a').forEach(a => {
        if (a.classList.contains('translatable')) return;
        const iconSpan = a.querySelector('.dd-icon');
        const textOnly = a.textContent.replace(iconSpan ? iconSpan.textContent : '', '').trim();
        if (translations[textOnly]) {
            a.dataset.ko = a.innerHTML;
            a.dataset.en = (iconSpan ? iconSpan.outerHTML : '') + translations[textOnly];
            a.classList.add('translatable');
        }
    });

    // Strategy 4: Nav labels (preserve arrow spans)
    document.querySelectorAll('.nav-label').forEach(lbl => {
        if (lbl.classList.contains('translatable')) return;
        const arrow = lbl.querySelector('.arrow');
        const textOnly = lbl.textContent.replace(arrow ? arrow.textContent : '', '').trim();
        if (translations[textOnly]) {
            lbl.dataset.ko = lbl.innerHTML;
            lbl.dataset.en = translations[textOnly] + (arrow ? ' ' + arrow.outerHTML : '');
            lbl.classList.add('translatable');
        }
    });

    // Strategy 5: Elements with <strong> children (roadmap goals, highlight boxes)
    // Match elements like <p><strong>목표:</strong> text here</p>
    document.querySelectorAll('p, td, li').forEach(el => {
        if (el.classList.contains('translatable')) return;
        const strong = el.querySelector('strong');
        if (!strong) return;
        // Try full textContent match first
        const fullText = el.textContent.trim();
        if (translations[fullText]) {
            el.dataset.ko = el.innerHTML;
            el.dataset.en = translations[fullText];
            el.classList.add('translatable');
            return;
        }
        // Try building translation by parts
        const strongText = strong.textContent.trim();
        const afterStrong = fullText.replace(strongText, '').trim();
        if (translations[strongText] && translations[afterStrong]) {
            el.dataset.ko = el.innerHTML;
            el.dataset.en = '<strong>' + translations[strongText] + '</strong> ' + translations[afterStrong];
            el.classList.add('translatable');
        } else if (translations[strongText] || translations[afterStrong]) {
            // at least translate what we can
            let enHTML = el.innerHTML;
            if (translations[strongText]) {
                enHTML = enHTML.replace(strong.innerHTML, translations[strongText]);
            }
            // Replace the text portion after strong
            if (translations[afterStrong]) {
                el.dataset.ko = el.innerHTML;
                el.dataset.en = '<strong>' + (translations[strongText] || strongText) + '</strong> ' + translations[afterStrong];
                el.classList.add('translatable');
            }
        }
    });

    // Strategy 6: H4 elements with badge spans (roadmap phase headers)
    // e.g. <h4><span class="badge badge-gold">1단계</span> Foundation — 1회</h4>
    document.querySelectorAll('h4').forEach(h4 => {
        if (h4.classList.contains('translatable')) return;
        const badge = h4.querySelector('.badge');
        if (!badge) return;
        const badgeText = badge.textContent.trim();
        const afterBadge = h4.textContent.replace(badgeText, '').trim();
        if (translations[badgeText]) {
            const enBadge = badge.outerHTML.replace(badge.innerHTML, translations[badgeText]);
            let el_en = enBadge + ' ' + (translations[afterBadge] || afterBadge);
            h4.dataset.ko = h4.innerHTML;
            h4.dataset.en = el_en;
            h4.classList.add('translatable');
        }
    });

    // Strategy 7: Remaining un-translated elements — partial text match
    // For elements that contain Korean text mixed with non-Korean
    document.querySelectorAll('td, h3, h5, p, div.section-desc').forEach(el => {
        if (el.classList.contains('translatable')) return;
        const txt = el.textContent.trim();
        // Skip if already translated or empty
        if (!txt || !/[\uac00-\ud7af]/.test(txt)) return;
        // Try full match
        if (translations[txt]) {
            el.dataset.ko = el.innerHTML;
            el.dataset.en = translations[txt];
            el.classList.add('translatable');
            return;
        }
        // Try innerHTML match (for elements with &amp; etc)
        const html = el.innerHTML.trim();
        if (translations[html]) {
            el.dataset.ko = el.innerHTML;
            el.dataset.en = translations[html];
            el.classList.add('translatable');
        }
    });
}

// ═══ TOGGLE FUNCTION ═══
function toggleLang() {
    currentLang = currentLang === 'ko' ? 'en' : 'ko';
    document.body.classList.toggle('lang-en', currentLang === 'en');
    document.getElementById('langBtn').textContent = currentLang === 'ko' ? '🌐 EN' : '🌐 KO';
    document.querySelectorAll('.translatable').forEach(el => {
        el.innerHTML = currentLang === 'en' ? el.dataset.en : el.dataset.ko;
    });
    document.title = currentLang === 'en'
        ? 'IIFF NextWave - Incheon International NextWave Film Festival Proposal'
        : 'IIFF NextWave - 인천 국제 넥스트웨이브 영화제 통합 기획서';
}

initTranslations();
