import { images } from './images';

export interface SlideData {
  id: string;
  part: number;
  partTitle: string;
  title: string;
  content: string[];
  image?: string;
  video?: string;
  type: 'cover' | 'part-divider' | 'content' | 'table' | 'stats';
}

export const slides: SlideData[] = [
  // 1 — Cover
  {
    id: 'cover',
    part: 0,
    partTitle: '',
    title: 'IIFF NextWave 2026',
    content: [
      '시네마, 문화, 그리고 기술이 만나는 곳.',
      '인천에서 시작되는 글로벌 영화의 새로운 물결.',
    ],
    image: images.hero,
    video: 'zYXrvyNtHlc',
    type: 'cover',
  },

  // 2 — Part 1 divider
  {
    id: 'part1',
    part: 1,
    partTitle: '소개',
    title: 'Part 1 — 소개',
    content: [],
    image: images.partDivider1,
    type: 'part-divider',
  },

  // 3 — What is IIFF?
  {
    id: 'what-is-iiff',
    part: 1,
    partTitle: '소개',
    title: 'What is IIFF?',
    content: [
      '발음은 "이프(if)" — 가능성을 여는 영화제',
      'SEE · ENJOY · CREATE — 보고, 즐기고, 만든다',
      'TOGETHER ACROSS BORDERS — 국경을 넘어 함께 꿈꾼다',
      '아직 발견되지 않은 재능에게 "만약에"를 선물하는 영화제',
      '인천에서 새로운 시대의 관문을 연다',
    ],
    image: images.whatIsIiff,
    type: 'content',
  },

  // 4 — Festival Overview
  {
    id: 'overview',
    part: 1,
    partTitle: '소개',
    title: 'Festival Overview',
    content: [
      'Method Fest와 함께하는 글로벌 영화 플랫폼 (INCHEON × HOLLYWOOD)',
      '상업영화와 독립영화가 공존하는 이중 구조 (DUAL STRUCTURE)',
      '관객이 참여하고 창작자가 성장하는 체험형 영화제',
      '영화제 이후에도 지속되는 연중 콘텐츠 생태계',
      '"iiff" 브랜드 — 칸, 오스카처럼 이름 자체가 권위가 되는 영화제',
    ],
    image: images.overview,
    type: 'content',
  },

  // 5 — Why Participate?
  {
    id: 'why-participate',
    part: 1,
    partTitle: '소개',
    title: 'Why Participate?',
    content: [
      '브랜드가 프로그램 속 주인공으로 결합되는 스폰서 구조',
      'K-콘텐츠 중심 시장에서의 글로벌 노출 가치',
      '인스파이어 리조트 × 프리미엄 운영 인프라',
      'K-팝·K-푸드·K-뷰티·숏폼의 젊은 글로벌 관객 유입',
      '콘텐츠가 계속 재생산되는 영화제 — 장기 브랜드 가치',
    ],
    image: images.whyParticipate,
    type: 'content',
  },

  // 6 — Why Incheon?
  {
    id: 'why-incheon',
    part: 1,
    partTitle: '소개',
    title: 'Why Incheon?',
    content: [
      '"거쳐가는 도시"에서 전 세계 영화인의 문화 종착지로',
      '헐리우드와 직접 연결되는 글로벌 자본·인재·관광객 유입',
      '인천시의 문화 행정 역량을 세계에 증명하는 상징 자산',
      '365일 작동하는 영화·콘텐츠 허브',
      '유휴 부지를 미래 콘텐츠 자산으로 전환',
    ],
    image: images.whyIncheon,
    type: 'content',
  },

  // 7 — Vision & Philosophy
  {
    id: 'vision',
    part: 1,
    partTitle: '소개',
    title: 'Vision & Philosophy',
    content: [
      '"영화가 머무는 도시 / 창작자가 성장하는 도시 / 세계가 다시 찾는 인천"',
      '과거의 낭만과 미래의 기술이 만나는 브릿지',
      '기술을 부정하지 않되, 사람을 지우지 않는 영화제',
      '경쟁보다 가능성을, 결과보다 "다음 장면"을 남기는 영화제',
      'IIFF는 계속해서 "If"를 선물하는 영화제',
    ],
    image: images.vision,
    type: 'content',
  },

  // 8 — Part 2 divider
  {
    id: 'part2',
    part: 2,
    partTitle: '프로그램',
    title: 'Part 2 — 프로그램',
    content: [],
    image: images.partDivider2,
    type: 'part-divider',
  },

  // 9 — Core Programs
  {
    id: 'programs',
    part: 2,
    partTitle: '프로그램',
    title: 'Core Programs',
    content: [
      'COMMERCIAL & GLOBAL SHOWCASE — 대중성과 화제성의 메인 스트림',
      'METHOD FEST INDEPENDENT — 창작자 중심 글로벌 독립영화 섹션',
      'NEXTWAVE MOBILE FILM — 모바일로 만드는 새로운 영화 언어',
      'FESTIVAL CAMP & LIVE CULTURE — 캠핑·공연·상영 결합 체험형 축제',
      'K-CULTURE EXPERIENCE ZONE — K-컬처가 스며드는 체험 공간',
    ],
    image: images.program1,
    type: 'content',
  },

  // 10 — Star Guests & Camp
  {
    id: 'stars',
    part: 2,
    partTitle: '프로그램',
    title: 'Star Invitation & Camp',
    content: [
      'CAA, WME, UTA를 통한 헐리우드 스타 직접 초청 루트',
      '봉준호, 송강호 등 한국 대표 영화인 참여',
      'NextWave Creator Camp — 48시간 내 모바일 영화 제작',
      '만 16세 이상 전 세계 누구나 참가 가능 (개인 또는 5인 팀)',
      '전문 심사위원단 + 관객 투표 병행 심사',
    ],
    image: images.stars,
    type: 'content',
  },

  // 11 — Daily Simulation
  {
    id: 'simulation',
    part: 2,
    partTitle: '프로그램',
    title: 'Daily Simulation',
    content: [
      '09:00 모닝 요가 & 아침 식사 (디스커버리 파크)',
      '10:00 인디 섹션 상영 + Creator Camp 활동',
      '13:30 헐리우드 마스터 클래스 & 비즈니스 포럼 (MICE)',
      '18:00 레드카펫 & 포토콜 → 19:00 갈라 스크리닝 (아레나)',
      '21:00 K-팝 콘서트 & 야외 상영 → 23:00 캠프파이어',
    ],
    image: images.simulation,
    type: 'content',
  },

  // 12 — Civic Participation
  {
    id: 'volunteer',
    part: 2,
    partTitle: '프로그램',
    title: 'Civic Participation',
    content: [
      'Creator Camp 코디네이터 — 캠프 운영·통역·안전 관리',
      '인천 글로벌 모니터링단 (IGM) — 해외 관람객 피드백·바이럴',
      '메소드 인디 섹션 서포터 — 독립영화관 안내·정보 공유',
      '인센티브: VIP 패스, 공식 굿즈, 스타 멘토링 참석 기회',
    ],
    image: images.volunteer,
    type: 'content',
  },

  // 13 — Part 3 divider
  {
    id: 'part3',
    part: 3,
    partTitle: '전략',
    title: 'Part 3 — 전략',
    content: [],
    image: images.partDivider3,
    type: 'part-divider',
  },

  // 14 — Core Strategy
  {
    id: 'strategy',
    part: 3,
    partTitle: '전략',
    title: 'Core Strategy',
    content: [
      '아시아와 헐리우드의 만남 — The Gateway',
      '모바일/야영/평가/상영 — NextWave Creator Camp',
      '메소드필름페스타 융합 — 독립영화 정신 계승',
      '헐리우드 유명배우 참여 — Star Power & Mentoring',
      '인천-하와이 교차 개최 — Dual-Hub Strategy',
      'K-컬처 융합 — Beyond Cinema: K-WAVE Festival',
    ],
    image: images.strategy,
    type: 'content',
  },

  // 15 — Organization
  {
    id: 'organization',
    part: 3,
    partTitle: '전략',
    title: 'Organization',
    content: [
      '3단계 조직: 추진위원회 → 총괄사업추진단장 → 사무국',
      '인천시 & 공항공사 — 행정/재정 지원',
      '인스파이어 리조트 — 시설 제공 및 공동 주최',
      'Method Fest — 독립영화 섹션 공동 기획',
      'CAA, UTA — 헐리우드 스타/감독 초청',
      '하이브, JYP — K-팝 공연·K-컬처 융합',
    ],
    image: images.organization,
    type: 'content',
  },

  // 16 — 3-Year Roadmap
  {
    id: 'roadmap',
    part: 3,
    partTitle: '전략',
    title: '3-Year Roadmap',
    content: [
      '1단계 Foundation — 성공적 런칭 및 글로벌 인지도 기반',
      '2단계 Expansion — 비즈니스 플랫폼 강화, 캠프 규모 2배',
      '3단계 Globalization — 아시아 대표 영화제, 인천-하와이 교차 개최',
      'A-to-Z: 추진위 발족(10월) → 조직위 출범(2월) → 프로그램 확정(5월) → 개최(8~10월)',
    ],
    image: images.roadmap,
    type: 'content',
  },

  // 17 — Space & Partners
  {
    id: 'space',
    part: 3,
    partTitle: '전략',
    title: 'Space & Partners',
    content: [
      '인스파이어 아레나 (15,000석) — 개·폐막식, 갈라, K-팝 콘서트',
      '디스커버리 파크 — Creator Camp, 야외상영, 캠핑 페스티벌',
      'MICE 시설 — 비즈니스 포럼, 마스터 클래스, 프레스 센터',
      '인천 도심 연계 — 영화공간 주안, 송도, 개항장',
      'K-컬처 파트너: 아모레퍼시픽, CJ, 하이브, 인천관광공사',
    ],
    image: images.space,
    type: 'content',
  },

  // 18 — BIFF Comparison
  {
    id: 'biff',
    part: 3,
    partTitle: '전략',
    title: 'BIFF vs IIFF',
    content: [
      'BIFF: 아시아 최대 A급 영화제 → IIFF: 아시아 최초 미래형 융합 플랫폼',
      'BIFF: 정통 영화 상영·시상 → IIFF: 영화 + 모바일 + K-컬처 + 야영',
      'BIFF: 영화 관계자·시네필 → IIFF: MZ세대 + K-컬처 팬 + 관광객',
      'BIFF: 할리우드 수동적 초청 → IIFF: Method Fest 구조적 연결',
      'BIFF가 "권위"의 영화제라면, IIFF는 "경험"의 영화제',
    ],
    image: images.biff,
    type: 'content',
  },

  // 19 — Part 4 divider
  {
    id: 'part4',
    part: 4,
    partTitle: '재무',
    title: 'Part 4 — 재무',
    content: [],
    image: images.partDivider4,
    type: 'part-divider',
  },

  // 20 — Budget Plan
  {
    id: 'budget',
    part: 4,
    partTitle: '재무',
    title: 'Budget Plan',
    content: [
      '총 예산: 30억 원 (제1회 기준)',
      '재원: 공적 자금 33% · 기업 스폰서십 40% · 수익 사업 20% · 기타 7%',
      '지출: 프로그램 27% · 초청/의전 30% · 마케팅 20% · 시설 13% · 인건비 10%',
      '인스파이어 현물 포함 시 실질 50억+ 규모',
    ],
    image: images.budget,
    type: 'stats',
  },

  // 21 — Cash Flow
  {
    id: 'cashflow',
    part: 4,
    partTitle: '재무',
    title: 'Cash Flow',
    content: [
      '1분기 (D-12~9): 유입 2.5억 / 유출 2억 / 잔액 +0.5억',
      '2분기 (D-8~6): 유입 8억 / 유출 6억 / 잔액 +2.5억',
      '3분기 (D-5~3): 유입 10억 / 유출 9억 / 잔액 +3.5억',
      '4분기 (D-2~D+1): 유입 9.5억 / 유출 13억 / 잔액 0',
      '3분기 관리 핵심: 스폰서십 2차 후원금 적시 확보',
    ],
    type: 'stats',
  },

  // 22 — Seed Money
  {
    id: 'seedmoney',
    part: 4,
    partTitle: '재무',
    title: 'Initial Budget (Seed)',
    content: [
      '추진위 초기 경비: 약 2.5억 원 (6개월)',
      '인건비/운영 80M · 회의/네트워킹 60M · 초기 네트워크 80M · 홍보물 30M',
      '50:50 매칭 펀딩: 공공 시드 40% + 민간 매칭 40% + 후원회 20%',
      '인천시 문화예술진흥기금 + 인스파이어 현금/현물 지원',
    ],
    type: 'stats',
  },

  // 23 — Sponsorship
  {
    id: 'sponsorship',
    part: 4,
    partTitle: '재무',
    title: 'Sponsorship Plan',
    content: [
      '타이틀 스폰서 (5억+): 공식 명칭 삽입, 전용 브랜드 존',
      '프리미엄 파트너 (2~5억): 핵심 섹션 네이밍권, VIP 초대',
      '공식 파트너 (0.5~2억): 로고 노출, K-컬처 존 부스 운영',
      '타겟 업종: IT/모바일, 항공, 뷰티, 식음료, 자동차, 금융',
      '3개년: 12억 → 20억 → 30억 성장 목표',
    ],
    image: images.sponsorship,
    type: 'content',
  },

  // 24 — Marketing
  {
    id: 'marketing',
    part: 4,
    partTitle: '재무',
    title: 'Marketing Strategy',
    content: [
      '글로벌: Variety, Hollywood Reporter 독점 인터뷰',
      '대중: NextWave Creator Challenge 숏폼 바이럴',
      'D-120 티저 영상 → D-90 공식 포스터 → D-60 얼리버드 티켓 → D-30 시민 우대',
      '인스파이어 연계 숙박/F&B 패키지 통합 마케팅',
    ],
    image: images.marketing,
    type: 'content',
  },

  // 25 — Part 5 divider
  {
    id: 'part5',
    part: 5,
    partTitle: '거버넌스',
    title: 'Part 5 — 거버넌스',
    content: [],
    image: images.partDivider5,
    type: 'part-divider',
  },

  // 26 — Risk Management
  {
    id: 'political',
    part: 5,
    partTitle: '거버넌스',
    title: 'Risk Management',
    content: [
      '핵심: "先 민간 주도(준비) → 後 관(官) 추인(개최)"',
      '1단계 민간 발족 → 2단계 공약화 → 3단계 선거 분리',
      '4단계 당선자 협력 → 5단계 취임 1호 문화 치적으로 개최',
      '비당파 추진위: 문화계 원로 + 인스파이어 + 상공회의소',
      '여야 후보 모두에게 영화제 지원 확약서 확보',
    ],
    image: images.governance,
    type: 'content',
  },

  // 27 — Personnel
  {
    id: 'personnel',
    part: 5,
    partTitle: '거버넌스',
    title: 'Personnel',
    content: [
      '명예위원장: 이용관(전 BIFF), Justin Kim & Don Franken(Method Fest)',
      '추진위원장: 이청산(전 BIFF 비대위원장) — 실질적 리더십',
      '공동위원장: 박병용(인스파이어), 오석근(전 영진위)',
      '총괄단장: 황보진호 — Control Tower, 전체 업무 조율',
      'BIFF 노하우 + 헐리우드 네트워크 + 실무 전문가 조합',
    ],
    type: 'content',
  },

  // 28 — Closing
  {
    id: 'closing',
    part: 0,
    partTitle: '',
    title: 'Thank You',
    content: [
      'IIFF NextWave 2026',
      'Incheon International Film Festival',
      '"만약에, 이곳에서 내 이야기가 시작된다면?"',
      'iiff-nextwave.org',
    ],
    image: images.hero,
    type: 'cover',
  },
];
