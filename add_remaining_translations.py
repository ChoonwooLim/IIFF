"""
Comprehensive data-en attribute injection for index.html
Adds data-en attributes directly to HTML elements that can't be matched by dictionary lookup.
Covers: simulation, volunteer, strategy, organization, roadmap, atoz-roadmap, and remaining sections.
"""
import re

# Translation map: Korean HTML content -> English HTML content
# Keys are exact innerHTML or textContent that needs translation
TRANSLATIONS = {
    # ── SIMULATION: section-desc ──
    '"관객이 아침에 도착해서 밤늦게까지 머무르는" 체류형 영화제의 하루':
        '"Audiences arrive in the morning and stay until late at night" — An Immersive Festival Day',
    
    # ── SIMULATION: Table headers ──
    '시간': 'Time',
    '장소': 'Venue',
    '프로그램': 'Programs',
    '상세': 'Details',
    
    # ── SIMULATION: Table body ──
    '디스커버리 파크': 'Discovery Park',
    '🌅 모닝 요가 &amp; 아침 식사': '🌅 Morning Yoga &amp; Breakfast',
    '야영 참가자 기상, 캠프 내 모닝 루틴': 'Campers wake up, camp morning routine',
    '인접 CGV': 'Adjacent CGV',
    '🎬 인디 섹션 상영 (메소드)': '🎬 Indie Section Screening (Method)',
    '메소드-인디 섹션 작품 2~3편 블록 상영 + GV': 'Method-Indie: 2-3 film block + Q&amp;A',
    '📱 Creator Camp 활동': '📱 Creator Camp Activity',
    '모바일 영화 제작 워크숍, 촬영 실습': 'Mobile filmmaking workshop, shooting practice',
    '오로라 푸드코트': 'Aurora Food Court',
    '🍜 K-푸드 팝업 런치': '🍜 K-Food Popup Lunch',
    '인천 맛집 및 K-푸드 셰프 팝업 운영': 'Incheon restaurants &amp; K-Food chef popup',
    'MICE 시설': 'MICE Facility',
    '🎤 마스터 클래스': '🎤 Master Class',
    '헐리우드 배우/감독의 특별 강연 및 Q&amp;A': 'Hollywood actor/director special lecture &amp; Q&amp;A',
    '💼 비즈니스 포럼': '💼 Business Forum',
    '공동 제작·투자 매칭 세션': 'Co-production &amp; investment matching session',
    '오로라': 'Aurora',
    '☕ 네트워킹 브레이크': '☕ Networking Break',
    'K-뷰티 체험 부스 방문, 굿즈 스토어': 'K-Beauty booth visit, goods store',
    '🎬 경쟁작/초청작 상영': '🎬 Competition/Invited Screenings',
    '경쟁 부문 작품 상영 + 감독 GV': 'Competition screening + Director Q&amp;A',
    '레드카펫 존': 'Red Carpet Zone',
    '📸 레드카펫 &amp; 포토콜': '📸 Red Carpet &amp; Photo Call',
    '저녁 행사 전 스타 레드카펫 이벤트': 'Pre-evening star red carpet event',
    '아레나': 'Arena',
    '🌟 갈라 스크리닝': '🌟 Gala Screening',
    '대형 스크린 프리미어 상영, 감독·배우 무대 인사': 'Big screen premiere, director-actor greeting',
    '🎶 K-팝 콘서트 &amp; 야외 상영': '🎶 K-Pop Concert &amp; Outdoor Screening',
    '미니 라이브 공연 후 야외 대형 스크린 상영': 'Mini live concert + outdoor big screen',
    '🔥 캠프파이어 &amp; 네트워킹': '🔥 Campfire &amp; Networking',
    '영화인·관객·캠퍼 자유 교류, DJ 세트': 'Free networking: filmmakers, audience, campers, DJ set',
    
    # ── SIMULATION: Highlight box ──
    # This is handled separately due to nested <strong> tags
    
    # ── VOLUNTEER: Table headers ──
    '구분': 'Category',
    '프로그램명': 'Program',
    '역할 및 혜택': 'Roles &amp; Benefits',
    '연계 특징': 'Feature',
    
    # ── VOLUNTEER: Table body ──
    '핵심 활동 참여': 'Core Activity',
    'i-NextWave Creator Camp 코디네이터': 'i-NextWave Creator Camp Coordinator',
    '캠프 운영 지원, 외국인 참가자 통역/안내, 야영 안전 관리 보조': 'Camp support, foreign participant translation/guidance, camping safety',
    '모바일/야영': 'Mobile/Camping',
    '홍보 및 피드백': 'PR &amp; Feedback',
    '인천 글로벌 모니터링단 (IGM)': 'Incheon Global Monitoring Team (IGM)',
    '해외 관람객 유치 피드백, K-컬처 체험 동선 점검, 바이럴 홍보 콘텐츠 제작': 'International visitor feedback, K-Culture route check, viral content',
    'K-컬처': 'K-Culture',
    '지역 연결고리': 'Local Links',
    '메소드 인디 섹션 서포터': 'Method Indie Section Supporter',
    '독립 영화관 안내, 아트 스크리닝 셔틀 안내 및 영화 정보 공유': 'Independent cinema guide, art screening shuttle info &amp; film info sharing',
    '메소드': 'Method',
    '인센티브': 'Incentive',
    'VIP 패스, 공식 굿즈, 헐리우드 스타 멘토링 클래스 특별 참석 기회': 'VIP pass, official goods, Hollywood star mentoring class special attendance',
    
    # ── STRATEGY: Table headers ──
    '번호': 'No.',
    '핵심 특징': 'Key Feature',
    '영화제 비전': 'Festival Vision',
    '구체적 구현 전략': 'Implementation Strategy',
    
    # ── STRATEGY: Table body - Key Feature ──
    '아시아와 헐리우드의 만남': 'Asia Meets Hollywood',
    '모바일/야영/평가/상영': 'Mobile/Camping/Review/Screening',
    '메소드필름페스타 융합': 'Method Film Fest Integration',
    '헐리우드 유명배우 참여': 'Hollywood Star Involvement',
    '인천-하와이 교차 개최': 'Incheon-Hawaii Cross-hosting',
    'K-컬처 융합': 'K-Culture Convergence',
    
    # ── STRATEGY: Table body - Festival Vision ──
    '"The Gateway: 아시아-헐리우드, 새로운 물결의 시작"': '"The Gateway: Asia-Hollywood, a New Wave"',
    '"모두가 감독, 모두가 비평가: NextWave Creator Camp"': '"Everyone directs, everyone critiques: NextWave Creator Camp"',
    '"Method-Indie Channel: 독립영화 정신 계승"': '"Method-Indie Channel: Inheriting indie spirit"',
    '"Dual-Hub Strategy: 아시아-태평양 문화 교류"': '"Dual-Hub Strategy: Asia-Pacific cultural exchange"',
    
    # ── STRATEGY: Table body - Implementation Strategy ──
    '개막식 및 레드카펫: 인스파이어 아레나 및 오로라 활용, 글로벌·아시아 스타 공동 레드카펫. 비즈니스 &amp; 포럼: MICE 시설에서 공동 제작 및 투자\n                                유치 포럼 개최.':
        'Opening &amp; red carpet at Inspire Arena &amp; Aurora, global-Asian star co-red carpet. Business &amp; Forum: Co-production &amp; investment forum at MICE.',
    '디스커버리 파크에 국제 야영장 조성. 참가자들이 모바일폰으로 영화를 제작하고, 야외 대형 스크린에서 상영 및 상호 평가 진행.':
        'International campsite at Discovery Park. Participants create mobile films, screen on outdoor big screen, and peer-review.',
    "'i-NWFF 메소드필름 인디 섹션' 신설. 공동 심사 및 초청을 통해 독립영화의 권위를 확보. 인접 CGV 상영관을 인디 영화 전용관으로 운영.":
        "'i-NWFF Method Film Indie Section' established. Joint jury &amp; invitation to secure indie film authority. Adjacent CGV as indie-exclusive theater.",
    "헐리우드 A급 배우 출연작 상영 및 배우 초청. 아레나에서 '글로벌 멘토링 클래스' 운영.":
        "Hollywood A-list actor film screenings &amp; invitations. 'Global Mentoring Class' at the Arena.",
    '1~3회는 인천 기반 구축, 4회부터 하와이 국제영화제와 협력하여 교차 개최 로드맵 수립.':
        "Editions 1-3: Build Incheon base. From 4th: cross-hosting roadmap with Hawaii Int'l Film Fest.",
    '디스커버리 파크 내 K-팝 미니 콘서트/버스킹 존, K-푸드 팝업 스토어, K-뷰티 체험 부스를 통합 운영.':
        'K-Pop mini concert/busking zone, K-Food popup store, K-Beauty booth — integrated at Discovery Park.',
    
    # ── ORGANIZATION: Org Chart ──
    '2.1 조직도 (3단계)': '2.1 Organization Chart (3 Levels)',
    '추진 위원회 (위원장)': 'Steering Committee (Chairman)',
    '총괄사업추진단장': 'General Project Director',
    '예술 전략 및 감독': 'Art Strategy &amp; Direction',
    '사무국 (집행 조직)': 'Secretariat (Executive)',
    '실무 운영': 'Operations',
    '전문 위원회 &amp; 파트너': 'Expert Committees &amp; Partners',
    
    # ── ORGANIZATION: Group Roles Table ──
    '2.2 참여 가능 그룹별 역할': '2.2 Group Roles &amp; Participation',
    '그룹': 'Group',
    '조직 역할': 'Org. Role',
    '주요 임무 및 참여 명분': 'Key Tasks &amp; Rationale',
    '인천광역시 &amp; 인천국제공항공사': 'Incheon City &amp; IIAC',
    '조직위원회 및 공동 주최': 'Organizing committee &amp; co-host',
    '행정/재정 지원, 국제 협력, 장소 사용 허가': "Admin/financial support, int'l cooperation, venue permits",
    '인스파이어 리조트': 'Inspire Resort',
    '집행위원회 및 공동 주최': 'Executive committee &amp; co-host',
    '주요 시설 제공 및 운영, 숙박/F&amp;B 협력, 마케팅/홍보 협력': 'Facilities, accommodation/F&amp;B, marketing cooperation',
    'CGV (또는 주요 영화관 체인)': 'CGV (or major theater chain)',
    '실무 집행 (상영 시설)': 'Operations (screening facilities)',
    '상영관 시설 제공 및 기술 운영, 티켓 시스템 연동': 'Theater facilities &amp; technical ops, ticket system integration',
    '한국 영화진흥위원회(KOFIC) &amp; 영상위원회': 'KOFIC &amp; Film Commission',
    '전문 위원회 (심사/교육)': 'Expert committee (jury/education)',
    '국내 독립 영화 발굴 및 지원, 영화 인력 양성 프로그램': 'Domestic indie film discovery &amp; support, talent development',
    '메소드필름페스타(Method Fest)': 'Method Film Fest',
    '전문 위원회 (해외 협력)': "Expert committee (int'l cooperation)",
    '독립 영화 섹션 공동 기획, 헐리우드 독립영화인 네트워크 연계': 'Co-curating indie section, Hollywood indie filmmaker network',
    '글로벌 콘텐츠 에이전시 (CAA, UTA)': 'Global Content Agencies (CAA, UTA)',
    '전문 위원회 (스타 섭외)': 'Expert committee (star recruitment)',
    '헐리우드 유명 배우 및 감독 초청 대행, 비즈니스 미팅 주선': 'Hollywood talent invitation, business meeting arrangement',
    '엔터테인먼트 기획사 (하이브, JYP 등)': 'Entertainment agencies (HYBE, JYP, etc.)',
    '파트너 그룹 (K-컬처 융합)': 'Partner group (K-Culture convergence)',
    'K-팝 공연 콘텐츠 제공, K-뷰티/푸드 프로그램 기획 협력': 'K-Pop performance content, K-Beauty/Food program cooperation',
    '통신사/IT 기업 (SKT, KT)': 'Telecom/IT (SKT, KT)',
    '파트너 그룹 (모바일 영화)': 'Partner group (mobile film)',
    '모바일 영화 제작 키트 및 기술 지원, 5G 라이브 스트리밍': 'Mobile filmmaking kit &amp; tech support, 5G live streaming',
    
    # ── 3-YEAR ROADMAP: Phase headers (handled as full h4 innerHTML) ──
    # These need special handling - see below
    
    # ── 3-YEAR ROADMAP: List items ──
    '공식 조직위/집행위원회 발족 (인천시-인스파이어-메소드 파트너십)': 'Official organizing/executive committee launch (Incheon-Inspire-Method partnership)',
    '아레나 개막식 &amp; CGV 상영관 인디 섹션 운영 집중': 'Arena opening ceremony &amp; CGV indie section focus',
    "'NextWave Creator Camp' 시범 운영 (국내외 100팀 제한)": "'NextWave Creator Camp' pilot (100 teams, domestic &amp; int'l)",
    'K-팝 연계 미니 콘서트 도입': 'K-Pop linked mini concert introduction',
    "'아시아-헐리우드 비즈니스 마켓' 정식 런칭 및 MICE 활용": "'Asia-Hollywood Business Market' official launch &amp; MICE utilization",
    '헐리우드 유명 배우 마스터 클래스 정례화 및 확대': 'Hollywood star master class regularization &amp; expansion',
    '디스커버리 파크 국제 야영/모바일 영화제 규모 2배 확장': "Discovery Park int'l camping/mobile film festival 2x expansion",
    'K-컬처 연계 프로그램(푸드, 뷰티) 대폭 강화': 'K-Culture programs (food, beauty) major enhancement',
    '하와이 국제영화제와 공식 협력 MOU 체결 및 교차 개최 로드맵 확정': "Official MOU with Hawaii Int'l Film Fest &amp; cross-hosting roadmap finalized",
    '메소드 섹션을 공식 경쟁 부문으로 격상': 'Method section elevated to official competition',
    '3개년 성과 분석 및 장기 비전 수립': '3-year performance analysis &amp; long-term vision established',
    
    # ── SPACE TABLE ──
    '4. 공간 활용 및 프로그램 배치 계획': '4. Space Utilization &amp; Program Layout Plan',
    '주요 프로그램': 'Main Programs',
    '활용 특징': 'Utilization Features',
    '인스파이어 아레나': 'Inspire Arena',
    "개막/폐막식 및 레드카펫, K-팝 스타 초청 '갈라 콘서트'": "Opening/closing ceremony, red carpet, K-Pop star 'Gala Concert'",
    "'NextWave Creator Camp', 야외 상영 및 평가회, K-푸드/K-뷰티 체험": "'NextWave Creator Camp', outdoor screening &amp; review, K-Food/K-Beauty experience",
    '인스파이어 MICE 시설': 'Inspire MICE Facility',
    '아시아-헐리우드 공동 제작 포럼/마켓, 마스터 클래스': 'Asia-Hollywood co-production forum/market, master class',
    '인접 CGV 등 상영관': 'Adjacent CGV theaters',
    "'메소드-인디 섹션' 전용 상영관, 일반 초청작/경쟁작 상영": "'Method-Indie Section' exclusive theater, general invited/competition screenings",
    '오로라 (디지털 스트리트)': 'Aurora (Digital Street)',
    '모바일 영화 수상작 디지털 미디어 상영, 포토존 및 스폰서십 공간': 'Mobile film winners digital screening, photo zone &amp; sponsorship space',
    
    # ── A-TO-Z ROADMAP ──
    '전체 예산 30억 원 기준, 현금 흐름을 고려한 적시 투입 계획': 'Budget ₩3B: Cash-flow-based timely investment plan',
    '13.1 단계별 추진 로드맵': '13.1 Phase-by-Phase Roadmap',
    '13.2 조직위원회 구조': '13.2 Organizing Committee Structure',
    '조직 위원장 (시장/기업인)': 'Organization Chairman (Mayor/CEO)',
    '집행 위원장 (총괄 Expert)': 'Executive Chairman (General Expert)',
    '사무국장': 'Secretary General',
    '경영지원팀': 'Management Support',
    '예산/계약/인사': 'Budget/Contracts/HR',
    '프로그램팀': 'Program Team',
    '상영작/게스트/캠프': 'Screenings/Guests/Camp',
    '운영/기술팀': 'Operations/Tech Team',
    '현장/영사/셔틀': 'Venue/Projection/Shuttle',
    '홍보마케팅팀': 'PR &amp; Marketing Team',
    '티켓/SNS/프레스': 'Tickets/SNS/Press',
}

# Special: elements with <strong> inside (roadmap goals/costs) - keyed by strong text + after text
STRONG_TRANSLATIONS = {
    # 3-Year Roadmap
    ('목표:', '영화제의 성공적 런칭 및 글로벌 인지도의 기반 마련'):
        ('Goal:', 'Successful festival launch &amp; global awareness foundation'),
    ('목표:', '아시아-헐리우드 비즈니스 플랫폼 기능 강화 및 프로그램 확장'):
        ('Goal:', 'Asia-Hollywood business platform enhancement &amp; program expansion'),
    ('목표:', '아시아 대표 영화제 도약 및 인천-하와이 교차 개최 준비 완료'):
        ('Goal:', "Leap to Asia's leading festival &amp; Incheon-Hawaii cross-hosting ready"),
    # A-to-Z Roadmap
    ('핵심 목표:', '법인 설립, 초기 씨드 자금 확보(2.5억), 핵심 파트너십(인스파이어, 인천시) MOU 체결'):
        ('Key Goal:', 'Corp. establishment, seed funding (₩250M), key partnership MOU (Inspire, Incheon City)'),
    ('예상 비용:', '2.5억 원 (인건비, 법인 설립비, CI 개발, 기획 연구비)'):
        ('Est. Cost:', '₩250M (personnel, incorporation, CI development, planning research)'),
    ('핵심 목표:', '사무국 인력 채용(팀장급), 프로그램 섹션 확정, 1차 스폰서십 유치 완료(30%)'):
        ('Key Goal:', 'Secretariat hiring (team leaders), program sections finalized, 1st sponsorship secured (30%)'),
    ('예상 비용:', '5억 원 (운영비, 홈페이지 구축, 해외 게스트 섭외 착수금)'):
        ('Est. Cost:', '₩500M (operations, website, overseas guest advance payments)'),
    ('핵심 목표:', '상영작 선정, 헐리우드 스타 초청 확정, 티켓 예매 오픈, 자원활동가 모집'):
        ('Key Goal:', 'Film selection, Hollywood star invitation confirmed, ticket sales open, volunteer recruitment'),
    ('예상 비용:', '10억 원 (게스트 항공/숙박, 홍보비, 시설 계약금)'):
        ('Est. Cost:', '₩1B (guest flights/accommodation, PR, facility deposits)'),
    ('핵심 목표:', '시설물 설치, 리허설, 영화제 개최, 안전 관리'):
        ('Key Goal:', 'Facility installation, rehearsals, festival hosting, safety management'),
    ('예상 비용:', '12.5억 원 (행사 운영비, 무대 설치비, 인건비, 체류비)'):
        ('Est. Cost:', '₩1.25B (event operations, stage setup, personnel, accommodation)'),
}

# H4 badge translations (badge text --> English)
BADGE_TRANSLATIONS = {
    '1단계': 'Phase 1',
    '2단계': 'Phase 2',
    '3단계': 'Phase 3',
    '4단계': 'Phase 4',
}

# Highlight box: full paragraph replacement
HIGHLIGHT_BOX = (
    '<strong>핵심 포인트:</strong> 관객은 CGV에서 영화를 보고, 아레나에서 갈라를 경험하고, 디스커버리 파크에서 캠핑과 K-컬처를 즐기며, MICE에서 비즈니스 미팅을\n                    한다. 하루 종일 다양한 콘텐츠가 끊임없이 이어지는 <strong>체류형 영화제</strong>의 완성.',
    '<strong>Key Point:</strong> Audiences watch films at CGV, experience galas at the Arena, enjoy camping &amp; K-Culture at Discovery Park, and attend business meetings at MICE. A full day of diverse, non-stop content — the completion of an <strong>Immersive Festival</strong>.'
)

def add_data_en(line, ko_text, en_text):
    """Add data-en attribute to an element containing ko_text."""
    if ko_text not in line:
        return line, False
    
    # Find the opening tag that contains this text
    # Strategy: find the <tag> before the ko_text and add data-en to it
    idx = line.find(ko_text)
    if idx == -1:
        return line, False
    
    # Look backwards from idx to find the opening tag
    tag_end = line.rfind('>', 0, idx)
    if tag_end == -1:
        return line, False
    
    # Check if data-en already exists in this tag
    tag_start = line.rfind('<', 0, tag_end + 1)
    tag_content = line[tag_start:tag_end + 1]
    if 'data-en=' in tag_content:
        return line, False
    
    # Insert data-en before the closing >
    en_escaped = en_text.replace('"', '&quot;')
    new_tag = line[:tag_end] + f' data-en="{en_escaped}"' + line[tag_end:]
    return new_tag, True


def process_simple_td_th(line, translations):
    """Process simple <td> or <th> elements with exact innerHTML match."""
    for ko, en in translations.items():
        patterns = [
            (f'<td>{ko}</td>', f'<td data-en="{en}">{ko}</td>'),
            (f'<th>{ko}</th>', f'<th data-en="{en}">{ko}</th>'),
            (f'<li>{ko}</li>', f'<li data-en="{en}">{ko}</li>'),
            (f'<h3>{ko}</h3>', f'<h3 data-en="{en}">{ko}</h3>'),
            (f'<h5>{ko}</h5>', f'<h5 data-en="{en}">{ko}</h5>'),
        ]
        for old, new in patterns:
            if old in line and 'data-en=' not in line.split(old)[0].split('<')[-1]:
                line = line.replace(old, new, 1)
    return line


def process_file():
    with open('index.html', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    count = 0
    
    for i, line in enumerate(lines):
        original = line
        
        # 1. Process simple element matches
        line = process_simple_td_th(line, TRANSLATIONS)
        
        # 2. Handle section-desc divs
        for ko, en in TRANSLATIONS.items():
            pattern = f'<div class="section-desc">{ko}</div>'
            replacement = f'<div class="section-desc" data-en="{en}">{ko}</div>'
            if pattern in line:
                line = line.replace(pattern, replacement)
        
        # 3. Handle <td colspan="3"> for incentive row
        for ko, en in TRANSLATIONS.items():
            pattern = f'<td colspan="3">{ko}</td>'
            replacement = f'<td colspan="3" data-en="{en}">{ko}</td>'
            if pattern in line:
                line = line.replace(pattern, replacement)
        
        # 4. Handle <p> with <strong> elements
        for (strong_ko, after_ko), (strong_en, after_en) in STRONG_TRANSLATIONS.items():
            pattern = f'<strong>{strong_ko}</strong>'
            if pattern in line and after_ko in line and 'data-en=' not in line:
                en_content = f'<strong>{strong_en}</strong> {after_en}'
                en_escaped = en_content.replace('"', '&quot;')
                # Add data-en to the <p> tag
                line = line.replace('<p><strong>', f'<p data-en="{en_escaped}"><strong>', 1)
                count += 1
        
        # 5. Handle h4 elements with badge spans
        for badge_ko, badge_en in BADGE_TRANSLATIONS.items():
            pattern = f'>{badge_ko}</span>'
            if pattern in line and 'data-en=' not in line:
                # Extract the full h4 innerHTML and build English version
                # e.g., <h4><span class="badge badge-gold">1단계</span> Foundation — 1회</h4>
                h4_match = re.search(r'<h4>(.*?)</h4>', line)
                if h4_match:
                    inner = h4_match.group(1)
                    # Replace badge text
                    en_inner = inner.replace(f'>{badge_ko}<', f'>{badge_en}<')
                    en_escaped = en_inner.replace('"', '&quot;')
                    line = line.replace('<h4>', f'<h4 data-en="{en_escaped}">', 1)
                    count += 1
        
        if line != original:
            if 'data-en=' in line and 'data-en=' not in original:
                count += line.count('data-en=') - original.count('data-en=')
            lines[i] = line
    
    # Handle the highlight box (multi-line)
    content = ''.join(lines)
    if HIGHLIGHT_BOX[0] in content and 'data-en=' not in content.split(HIGHLIGHT_BOX[0])[0].split('<p>')[-1]:
        en_escaped = HIGHLIGHT_BOX[1].replace('"', '&quot;')
        content = content.replace(
            f'<p>{HIGHLIGHT_BOX[0]}',
            f'<p data-en="{en_escaped}">{HIGHLIGHT_BOX[0]}'
        )
        count += 1
    
    # Handle A-to-Z roadmap h4 with date ranges (more complex patterns)
    atoz_h4_translations = {
        '추진위 발족 (2025.10 ~ 2026.01)': 'Committee Launch (2025.10 ~ 2026.01)',
        '조직위 출범 (2026.02 ~ 2026.04)': 'Organizing Committee Launch (2026.02 ~ 2026.04)',
        '프로그램 확정 &amp; 마케팅 (2026.05 ~ 2026.07)': 'Program Finalization &amp; Marketing (2026.05 ~ 2026.07)',
        '현장 준비 &amp; 개최 (2026.08 ~ 2026.10)': 'On-site Prep &amp; Opening (2026.08 ~ 2026.10)',
    }
    
    for ko, en in atoz_h4_translations.items():
        if ko in content:
            # Find the h4 containing this text and add data-en
            pattern = f'>{ko}</h4>'
            if pattern in content:
                h4_match = re.search(r'<h4>(.*?)' + re.escape(ko) + r'</h4>', content)
                if h4_match:
                    full_inner = h4_match.group(1) + ko
                    # Build English version - replace badge and after-badge text
                    en_inner = full_inner
                    for bk, be in BADGE_TRANSLATIONS.items():
                        en_inner = en_inner.replace(f'>{bk}<', f'>{be}<')
                    en_inner = en_inner.replace(ko, en)
                    en_escaped = en_inner.replace('"', '&quot;')
                    old_h4 = f'<h4>{full_inner}</h4>'
                    new_h4 = f'<h4 data-en="{en_escaped}">{full_inner}</h4>'
                    if old_h4 in content and 'data-en=' not in old_h4:
                        content = content.replace(old_h4, new_h4, 1)
                        count += 1
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Added data-en attributes to approximately {count} elements")

if __name__ == '__main__':
    process_file()
