"""
Part 5: Risk Management (Political) and Personnel sections.
"""
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

count = 0

def add_data_en(korean, english):
    global html, count
    if korean not in html:
        return
    idx = html.find(korean)
    while idx != -1:
        tag_start = html.rfind('<', 0, idx)
        tag_end = html.find('>', tag_start)
        tag_content = html[tag_start:tag_end+1]
        if 'data-en' not in tag_content and tag_start != -1:
            new_tag = tag_content[:-1] + f' data-en="{english}">'
            html = html[:tag_start] + new_tag + html[tag_end+1:]
            count += 1
            break
        else:
            idx = html.find(korean, idx + 1)
            if idx == -1:
                break

# ══════════════════════════════════════════════════════
# RISK MANAGEMENT (Political)
# ══════════════════════════════════════════════════════
add_data_en('핵심 전략: "先 민간 주도(준비) → 後 관(官) 추인(개최)"', 'Core Strategy: "Private-led preparation → Government endorsement for hosting"')

# Highlight box
add_data_en('2026년 6월 지방선거 변수는 영화제의 생존과 지속성을 결정짓는 가장 중요한 요소.', 'The June 2026 local election variable is the most critical factor determining the festival&apos;s survival and continuity. A sophisticated political solution is needed that &quot;leverages the election as momentum rather than being biased toward any party.&quot;')
add_data_en('여야 후보 모두가', 'A &quot;reverse-proposal strategy&quot; making both ruling and opposition candidates pledge: &quot;If elected, I will actively support this film festival.&quot;')

# Table headers
add_data_en('>정치적 상황<', '>Political Situation<')
add_data_en('>영화제 추진 핵심 과제<', '>Festival Key Tasks<')

# Risk table rows
add_data_en('>민간 발족<', '>Private Launch<')
add_data_en('>2025.12월<', '>Dec 2025<')
add_data_en('>현직 임기 말<', '>End of current term<')
add_data_en('추진위 발족 (경제인+예술인+인스파이어, 정치인 배제). 100% 민간 씨드머니로 운영.', 'Steering committee launch (business + arts + Inspire, no politicians). 100% private seed money operation.')
add_data_en('>공약화<', '>Pledge Phase<')
add_data_en('>2026.1~3월<', '>Jan-Mar 2026<')
add_data_en('>후보 경선 진행<', '>Candidate primaries in progress<')
add_data_en("여야 유력 후보에게 '영화제 지원 확약서' 전달. 헐리우드 섭외 민간 채널로 병행.", "Delivering 'festival support commitment letters' to key candidates. Hollywood outreach via private channels in parallel.")
add_data_en('>선거 기간<', '>Election Period<')
add_data_en('>2026.4~5월<', '>Apr-May 2026<')
add_data_en('>공식 선거운동<', '>Official campaign period<')
add_data_en("선거와 분리된 '문화 비전 선포식' 개최. 후보들의 방문·지지 발언 유도.", "Hosting a 'cultural vision ceremony' separate from elections. Encouraging candidate visits and endorsements.")
add_data_en('>당선자 협력<', '>Winner Cooperation<')
add_data_en('>2026.6~7월<', '>Jun-Jul 2026<')
add_data_en('>선거(6.3) 및 인수위<', '>Election (Jun 3) &amp; transition<')
add_data_en('당선자를 당연직 조직위원장으로 추대. 추경 예산 편성 요청.', 'Nominating the winner as ex-officio organizing chairman. Requesting supplementary budget.')
add_data_en('>개최<', '>Hosting<')
add_data_en('>2026.8~10월<', '>Aug-Oct 2026<')
add_data_en('>신임 시장 취임 초기<', '>New mayor early tenure<')
add_data_en("신임 시장의 '취임 1호 문화 치적'으로 포장하여 전폭적 지원 유도.", "Framing as the new mayor's 'first cultural achievement' to drive full support.")

# 16.1
add_data_en('16.1 비당파 추진위원회 구성 원칙', '16.1 Non-partisan Steering Committee Principles')
add_data_en('<strong>위원장:</strong> 영화제 관련 문화계 원로', '<strong>Chair:</strong> Cultural elder related to film festivals (economic revitalization cause is non-partisan)')
add_data_en('<strong>공동 위원장:</strong> 인스파이어 리조트 대표, 인천상공회의소 회장', '<strong>Co-chairs:</strong> Inspire Resort CEO, Incheon Chamber of Commerce Chairman')
add_data_en('<strong>고문단:</strong> 인천 지역 대학 총장, 원로 영화감독', '<strong>Advisors:</strong> Incheon university presidents, veteran film directors (politically neutral)')
add_data_en('<strong>원칙:</strong> 선거 전까지는 인천시 예산을 받지 않는 것이 오히려 안전', '<strong>Principle:</strong> Not receiving city budget before elections is actually safer')

# 16.2
add_data_en('16.2 후보 대상 MOU 전략', '16.2 Candidate MOU Strategy')
add_data_en('<strong>제안서 타이틀:</strong>', '<strong>Proposal Title:</strong> "Global Incheon 2026: Cultural Economy Platform Connecting Asia and Hollywood"')
add_data_en("당선 시 '인천 국제 넥스트웨이브 영화제'를 핵심 관광 전략 사업으로 지정", "Upon election, designate 'Incheon Int'l NextWave Film Festival' as core tourism strategy project")
add_data_en('추가경정예산 편성 등 행정/재정적 지원 보장', 'Guarantee administrative/financial support including supplementary budgets')
add_data_en('영화제의 자율성과 독립성 보장, 추진위 성과 계승', "Guarantee the festival's autonomy and independence, inherit steering committee achievements")

# 16.3
add_data_en('16.3 선거 전후 업무 분장 (Shadow Operation)', '16.3 Pre/Post-election Task Division (Shadow Operation)')
add_data_en('>추진위원회 (민간) 역할<', '>Steering Committee (Private) Role<')
add_data_en('>정치권/인천시 역할<', '>Political/Incheon City Role<')
add_data_en('>12월~2월<', '>Dec-Feb<')
add_data_en('법인 설립, 사무국 구성, 인스파이어 자금 집행, 헐리우드 에이전시 접촉 (비공개)', 'Corp. establishment, secretariat setup, Inspire fund execution, Hollywood agency contact (confidential)')
add_data_en('(관망) 선거 준비 돌입', '(Watching) Entering election preparation')
add_data_en('>3월~5월<', '>Mar-May<')
add_data_en('상영작 선정·게스트 가계약 (보안 유지), 스폰서 가계약, 후보자 초청 비전 발표회', 'Film selection, guest pre-contracts (confidential), sponsor pre-contracts, candidate vision presentation')
add_data_en('후보자: 영화제 지원 공약 발표, 서약서 서명', 'Candidates: festival support pledge announcement, commitment signing')
add_data_en('>6월 (선거 직후)<', '>June (Post-election)<')
add_data_en('당선자 인수위에 보고서 제출, "예산만 승인하면 됨" 강조', 'Submit report to winner transition team, emphasize "just approve the budget"')
add_data_en('당선자: 업무 보고 청취, 추경 예산 긴급 편성', 'Winner: briefing, emergency supplementary budget')
add_data_en('>7월~10월<', '>Jul-Oct<')
add_data_en('공식 조직위로 전환, 시장 취임 연계 대대적 홍보', "Official organizing committee transition, major PR tied to mayor's inauguration")
add_data_en('행정 인력 파견, 경찰/소방 안전 대책 지원', 'Administrative personnel dispatch, police/fire safety support')

# ══════════════════════════════════════════════════════
# PERSONNEL
# ══════════════════════════════════════════════════════
add_data_en("BIFF 노하우를 가진 '영화계 원로'를 전면에", "Leaders with BIFF know-how at the forefront, 'practical experts' as the backbone running operations")
add_data_en('17.1 컨트롤 타워 (Leadership)', '17.1 Control Tower (Leadership)')
add_data_en('>직책<', '>Position<')
add_data_en('>성명<', '>Name<')
add_data_en('>핵심 역할<', '>Key Role<')
add_data_en('>명예 위원장<', '>Honorary Chairman<')
add_data_en('이용관 (전 BIFF 이사장)', 'Lee Yong-kwan (Former BIFF Chairman)')
add_data_en("상징적 권위 및 방패. BIFF 성공 신화를 인천에 이식하는 상징성. 정치적 외풍을 막는 '어른' 역할.", "Symbolic authority and shield. Symbolizing transplanting BIFF's success to Incheon. 'Elder' role blocking political interference.")
add_data_en('저스틴 김 (메소드영화제 조직위원장)', 'Justin Kim (Method Fest Organizing Chairman)')
add_data_en('비버리힐즈 메소드영화제의 독립영화 정신을 대변. 헐리우드와의 가교 역할.', "Representing Beverly Hills Method Fest's indie spirit. Bridge role to Hollywood.")
add_data_en('돈 플랑캔 (메소드영화제 조직위원장)', 'Don Franken (Method Fest Organizing Chairman)')
add_data_en('헐리우드 영화인 인맥 총동원. 영화 자본과 월가의 큰손들과의 교류 총괄.', 'Mobilizing all Hollywood connections. Managing exchanges with film capital and Wall Street heavyweights.')
add_data_en('>추진 위원장<', '>Steering Chairman<')
add_data_en('이청산 (전 BIFF 비대위원장)', 'Lee Cheong-san (Former BIFF Emergency Chair)')
add_data_en("실질적 리더십 & 위기관리. '무'에서 '유'를 창조하는 추진위의 강력한 드라이브.", "Practical leadership &amp; crisis management. Strong drive creating 'something from nothing.'")
add_data_en('>공동 위원장<', '>Co-chairman<')
add_data_en('박병용 (인스파이어 부회장)', 'Park Byung-yong (Inspire Vice Chairman)')
add_data_en('재정 및 조직, 업무 지원. 인스파이어 공간·설비 제공. 후원 조직 구성 관리.', 'Financial/organizational support. Providing Inspire venues/facilities. Sponsorship organization management.')
add_data_en('오석근 (전 영진위 위원장)', 'Oh Seok-geun (Former KOFIC Chairman)')
add_data_en('정책 및 예산 설계. 영진위 네트워크 활용한 국비 지원. 문체부 행정 조율.', 'Policy &amp; budget design. National funding via KOFIC network. MCST coordination.')

# 17.2
add_data_en('17.2 대외 협력 및 정무', '17.2 External Cooperation &amp; Political Affairs')
add_data_en('>상임 고문<', '>Standing Advisor<')
add_data_en('유동수 (국회의원)', 'Yoo Dong-su (National Assembly Member)')
add_data_en('국회 차원 지원, 국비 예산 확보 교두보, 선거 국면 중립적 지원자 포지셔닝', 'National Assembly-level support, national budget bridgehead, neutral supporter positioning during elections')
add_data_en('>자문 위원<', '>Advisory Member<')
add_data_en('조광희 (전 시의원)', 'Jo Gwang-hee (Former City Council Member)')
add_data_en('영종도 지역 민원 해결, 인근 주민 협조 유도, 소상공인 갈등 관리', 'Yeongjong-do local issue resolution, resident cooperation, small business conflict management')
add_data_en('>대외협력 이사<', '>External Cooperation Director<')
add_data_en('>서태웅<', '>Seo Tae-woong<')
add_data_en('인스파이어 경영진 직접 소통, 초기 씨드머니 담판, 인천 기업 스폰서십 유치', 'Direct communication with Inspire management, initial seed money negotiation, Incheon corporate sponsorship acquisition')

# 17.3
add_data_en('17.3 글로벌 네트워크 (USA / Asia / Hollywood)', '17.3 Global Network (USA / Asia / Hollywood)')
add_data_en('>해외 프로그래머<', '>Overseas Programmer<')
add_data_en('메소드 섹션 총괄. 헐리우드 독립영화 감독·배우 섭외 창구.', 'Method section head. Hollywood indie film director/actor recruitment channel.')
add_data_en('헐리우드 스타 섭외. CAA, WME 등과 직접 접촉. A급 스타 및 심사위원단 섭외.', 'Hollywood star recruitment. Direct contact with CAA, WME. A-list star and jury recruitment.')
add_data_en('>아시아 전략 이사<', '>Asia Strategy Director<')
add_data_en('>김무전<', '>Kim Mu-jeon<')
add_data_en('중화권 톱스타 섭외 및 중국 거대 자본(알리바바 픽처스 등) 투자/스폰서십 연결.', 'Greater China top star recruitment and connecting Chinese mega-capital (Alibaba Pictures, etc.) investment/sponsorship.')
add_data_en('>하와이 협력 이사<', '>Hawaii Cooperation Director<')
add_data_en('>제니스 (Janice)<', '>Janice<')
add_data_en('하와이 국제영화제 MOU 체결 실무. 교민 사회 후원 유도.', 'Hawaii Int&apos;l Film Fest MOU coordination. Encouraging Korean diaspora community support.')

# 17.4
add_data_en('17.4 실무 운영 및 기술/디자인', '17.4 Operations &amp; Technical/Design')
add_data_en('>총괄사업추진단장<', '>General Project Director<')
add_data_en('황보진호 (최초 기안자)', 'Hwangbo Jin-ho (Original Initiator)')
add_data_en('Control Tower. 위원장 보좌, 전체 파트 업무 조율, 예산 집행 승인, 3개년 로드맵 관리. 모든 인맥의 허브.', 'Control Tower. Chairman support, all-part coordination, budget execution approval, 3-year roadmap management. Hub of all connections.')
add_data_en('>운영 본부장<', '>Operations Director<')
add_data_en('강준 (제니스글로컬 회장)', 'Kang Jun (Janice Glocal Chairman)')
add_data_en('현장 인력 및 자원봉사. 영종도 기획사 인프라 활용, 대학생 자원활동가 모집·교육.', 'On-site staffing and volunteers. Utilizing Yeongjong-do agency infra, recruiting/training university volunteers.')
add_data_en('>예술 감독 (AD)<', '>Art Director (AD)<')
add_data_en('노준석 (LA 디자이너)', 'Noh Jun-seok (LA Designer)')
add_data_en("글로벌 브랜딩. LA 트렌드 반영 CI/포스터/굿즈 디자인. 시각적 아이덴티티 '글로벌 스탠다드'로 격상.", "Global branding. CI/poster/goods design reflecting LA trends. Elevating visual identity to 'global standard.'")
add_data_en('>기술 감독 (CTO)<', '>Technical Director (CTO)<')
add_data_en('>임춘우<', '>Im Chun-woo<')
add_data_en('모바일 영화제 구현. 디스커버리 파크 야외 상영 시스템, 모바일 출품 플랫폼, 아레나 영사 기술 자문.', 'Mobile film fest implementation. Discovery Park outdoor screening system, mobile submission platform, Arena projection tech advisory.')
add_data_en('>재무 감사<', '>Financial Auditor<')
add_data_en('송승희 (세무법인 실장)', 'Song Seung-hee (Tax Firm Director)')
add_data_en('자금 투명성 확보. 예산 집행 감시, 기부금 세무 처리, 스폰서 기업 세제 혜택 자문.', 'Ensuring fund transparency. Budget monitoring, donation tax processing, sponsor tax benefit advisory.')

print(f"Part 5 done: {count} fixes applied")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Part 5 saved.")
