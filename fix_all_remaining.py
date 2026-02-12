"""
Comprehensive fix for ALL remaining untranslated Korean content in index.html.
Adds data-en attributes directly to HTML elements.
"""
import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

count = 0

def add_data_en(korean, english, tag_pattern=None):
    """Add data-en to element containing korean text that doesn't already have data-en."""
    global html, count
    # Find the korean text that's inside a tag but NOT already having data-en
    if korean not in html:
        return
    # Check if already has data-en near this korean text
    # Find the tag that contains this korean
    idx = html.find(korean)
    while idx != -1:
        # Go backwards to find the opening tag
        tag_start = html.rfind('<', 0, idx)
        tag_end = html.find('>', tag_start)
        tag_content = html[tag_start:tag_end+1]
        if 'data-en' not in tag_content and tag_start != -1:
            # Insert data-en before the closing >
            new_tag = tag_content[:-1] + f' data-en="{english}">'
            html = html[:tag_start] + new_tag + html[tag_end+1:]
            count += 1
            break
        else:
            idx = html.find(korean, idx + 1)
            if idx == -1:
                break

def replace_data_en(old_data_en, new_data_en):
    """Fix incorrect data-en values."""
    global html, count
    if old_data_en in html:
        html = html.replace(old_data_en, new_data_en, 1)
        count += 1

# ══════════════════════════════════════════════════════
# FIX A-to-Z Roadmap h4 data-en values (Korean still in data-en!)
# ══════════════════════════════════════════════════════
replace_data_en(
    'Phase 1</span> 추진위 발족 (2025.10 ~ 2026.01)"',
    'Phase 1</span> Steering Committee Launch (2025.10 ~ 2026.01)"'
)
replace_data_en(
    'Phase 2</span> 조직위 출범 (2026.02 ~ 2026.04)"',
    'Phase 2</span> Organizing Committee Launch (2026.02 ~ 2026.04)"'
)
replace_data_en(
    'Phase 3</span> 프로그램 확정 &amp; 마케팅 (2026.05 ~ 2026.07)"',
    'Phase 3</span> Program Finalization &amp; Marketing (2026.05 ~ 2026.07)"'
)
replace_data_en(
    'Phase 3</span> 프로그램 확정 & 마케팅 (2026.05 ~ 2026.07)"',
    'Phase 3</span> Program Finalization &amp; Marketing (2026.05 ~ 2026.07)"'
)
replace_data_en(
    'Phase 4</span> 현장 준비 &amp; 개최 (2026.08 ~ 2026.10)"',
    'Phase 4</span> On-site Preparation &amp; Hosting (2026.08 ~ 2026.10)"'
)
replace_data_en(
    'Phase 4</span> 현장 준비 & 개최 (2026.08 ~ 2026.10)"',
    'Phase 4</span> On-site Preparation &amp; Hosting (2026.08 ~ 2026.10)"'
)

# ══════════════════════════════════════════════════════
# CORE STRATEGY ROW 1 - Implementation Strategy (line 2259)
# ══════════════════════════════════════════════════════
old_td = '<td>개막식 및 레드카펫: 인스파이어 아레나 및 오로라 활용, 글로벌·아시아 스타 공동 레드카펫. 비즈니스 &amp; 포럼: MICE 시설에서 공동 제작 및 투자\r\n                                유치 포럼 개최.</td>'
new_td = '<td data-en="Opening ceremony &amp; red carpet: Utilizing Inspire Arena and Aurora, global-Asia star joint red carpet. Business &amp; Forum: Co-production and investment forum at MICE facility.">개막식 및 레드카펫: 인스파이어 아레나 및 오로라 활용, 글로벌·아시아 스타 공동 레드카펫. 비즈니스 &amp; 포럼: MICE 시설에서 공동 제작 및 투자\r\n                                유치 포럼 개최.</td>'
if old_td in html:
    html = html.replace(old_td, new_td, 1)
    count += 1

# ══════════════════════════════════════════════════════
# STARS SECTION (7.1 - 7.3)
# ══════════════════════════════════════════════════════
# 7.1 heading
add_data_en('7.1 헐리우드 스타 초청 전략', '7.1 Hollywood Star Invitation Strategy')
# 7.1 paragraph
add_data_en('헐리우드 현지 법인 또는 에이전시(CAA, WME, UTA)를 통한',
            'Securing direct invitation routes through Hollywood local agencies (CAA, WME, UTA). Appearance fees, accommodation, and protocol details are pre-agreed via international-standard Rider contracts.')
# Star table headers
add_data_en('초청 대상 (예시)', 'Invitation Target (Example)')
add_data_en('>섭외 채널<', '>Recruitment Channel<')
add_data_en('프로그램 연계', 'Program Integration')
# Star table rows
add_data_en('할 베리 (Halle Berry)', 'Halle Berry')
add_data_en('CAA / 개인 에이전트', 'CAA / Personal Agent')
add_data_en('갈라 스크리닝 주연작 상영 + 마스터 클래스', 'Gala screening lead film + Master Class')
add_data_en('키아누 리브스 (Keanu Reeves)', 'Keanu Reeves')
add_data_en('WME / 개인 에이전트', 'WME / Personal Agent')
add_data_en('개막식 특별 게스트 + 관객 밋앤그릿', 'Opening ceremony special guest + audience meet &amp; greet')
add_data_en('봉준호 감독', 'Director Bong Joon-ho')
add_data_en('>국내 에이전시<', '>Domestic Agency<')
add_data_en('심사위원장 또는 마스터 클래스 연사', 'Jury President or Master Class speaker')
add_data_en('>송강호<', '>Song Kang-ho<')
add_data_en('개막작/폐막작 주연 배우 초청', 'Opening/closing film lead actor invitation')
add_data_en('아시아 톱스타 (예: 량차오웨이)', 'Asia Top Star (e.g., Tony Leung)')
add_data_en('중국/홍콩 에이전시', 'China/Hong Kong Agency')
add_data_en('아시아 특별전 게스트', 'Asia Special Exhibition guest')

# 7.2 heading + cards
add_data_en('7.2 NextWave Creator Camp 규정 (요약)', '7.2 NextWave Creator Camp Rules (Summary)')
add_data_en('📋 참가 자격', '📋 Eligibility')
add_data_en('만 16세 이상 전 세계 누구나', 'Anyone worldwide aged 16+')
add_data_en('개인 또는 5인 이내 팀 참가', 'Individual or team of up to 5')
add_data_en('스마트폰(아이폰/갤럭시) 촬영 필수', 'Must film with smartphone (iPhone/Galaxy)')
add_data_en('참가비 포함 (야영 장비 기본 제공)', 'Entry fee included (basic camping gear provided)')
add_data_en('🎬 제작 규정', '🎬 Production Rules')
add_data_en('장르 자유 (실험/다큐/드라마/뮤비)', 'Free genre (experimental/documentary/drama/MV)')
add_data_en('러닝타임: 3분~15분 이내', 'Runtime: 3-15 minutes')
add_data_en('캠프 기간(48시간) 내 촬영·편집·제출', 'Film, edit, and submit within camp period (48 hours)')
add_data_en('모바일 촬영 원칙 (보조 장비 허용)', 'Mobile filming principle (auxiliary equipment allowed)')
add_data_en('🏆 심사 및 시상', '🏆 Judging &amp; Awards')
add_data_en('전문 심사위원단 + 관객 투표 병행', 'Professional jury + audience voting combined')
add_data_en('대상: 상금 + 차기 영화제 정식 상영권', 'Grand Prize: prize money + official screening at next festival')
add_data_en('우수작: 온라인 공식 채널 공개', 'Excellence: released on official online channels')
add_data_en('인기상: SNS 투표 기반', 'Popularity Award: SNS voting-based')

# 7.3 heading + table
add_data_en('7.3 의전 및 VIP 관리', '7.3 Protocol &amp; VIP Management')
add_data_en('>항목<', '>Category<')
add_data_en('>내용<', '>Details<')
add_data_en('>공항 의전<', '>Airport Protocol<')
add_data_en('인천공항 VIP 통로, 전용 의전 차량, 다국어 수행원 배치', 'Incheon Airport VIP passage, dedicated protocol vehicle, multilingual attendants')
add_data_en('>숙소<', '>Accommodation<')
add_data_en('인스파이어 리조트 최상급 스위트 또는 파르나스호텔', 'Inspire Resort top-tier suite or Parnas Hotel')
add_data_en('>현장 의전<', '>On-site Protocol<')
add_data_en('전용 대기실, 보안 경호(2인 이상), 전속 코디네이터', 'Private lounge, security (2+ guards), dedicated coordinator')
add_data_en('>Rider 사항<', '>Rider Requirements<')
add_data_en('식이요법, 선호 차량, 동반인 체류, PR 제한 사항 등 사전 계약', 'Dietary needs, preferred vehicle, companion stays, PR restrictions — pre-contracted')
add_data_en('>보험<', '>Insurance<')
add_data_en('초청 게스트 상해보험, 배상 책임 보험 별도 가입', 'Guest accident insurance, liability insurance separately enrolled')

# ══════════════════════════════════════════════════════
# VISION/OVERVIEW SECTION - Card h3 titles
# ══════════════════════════════════════════════════════
add_data_en('Method Fest와 함께하는 글로벌 영화 플랫폼', 'Global Film Platform with Method Fest')
add_data_en('상업영화와 독립영화가 공존하는 이중 구조', 'Dual Structure: Commercial &amp; Independent Films Coexist')
add_data_en('관객이 참여하고, 창작자가 성장하는 체험형 영화제', 'An Experiential Festival Where Audiences Participate and Creators Grow')
add_data_en('영화제 이후에도 지속되는 연중 콘텐츠 생태계', 'Year-Round Content Ecosystem That Continues After the Festival')
# li items in card 02
add_data_en('글로벌 상업영화를 통해 대중성과 확장성 확보', 'Securing popularity and scalability through global commercial films')
add_data_en('Method Fest 연계를 통한 독립·예술영화의 정체성 강화', 'Strengthening indie/art film identity through Method Fest partnership')
add_data_en('산업성과 예술성이 균형을 이루는 건강한 영화 생태계 조성', 'Creating a healthy film ecosystem balancing industry and artistry')
# li items in card 03
add_data_en('관객 참여형 프로그램 및 투표, 체험 콘텐츠 운영', 'Participatory programs, voting, and experiential content')
add_data_en('신진 감독, 배우, 창작자를 위한 멘토링·피칭·워크숍', 'Mentoring, pitching, and workshops for emerging directors, actors, and creators')
add_data_en('단편, 숏폼, 모바일 콘텐츠 등 새로운 영상 포맷을 포용하는 개방형 경쟁 구조', 'Open competition embracing new formats: short films, short-form, mobile content')
# li items in card 04
add_data_en('영화제 이후에도 이어지는 상영, 교육, 제작, 교류 프로그램', 'Screenings, education, production, and exchange programs that continue after the festival')
add_data_en('인천을 거점으로 한 영화·콘텐츠 관련 인프라 활성화', 'Activating film/content infrastructure centered on Incheon')
add_data_en('영화, 영상, 공연, 테크 기반 콘텐츠가 연중 지속적으로 생산·유통되는 구조 구축', 'Building a structure where film, video, performance, and tech-based content is continuously produced and distributed year-round')

# ══════════════════════════════════════════════════════
# WHY PARTICIPATE - Card h3 titles
# ══════════════════════════════════════════════════════
add_data_en('"노출"을 넘어, 함께 만드는 브랜드 플랫폼', 'Beyond "Exposure": A Brand Platform Built Together')
add_data_en('K-콘텐츠 중심 시장에서의 글로벌 노출 가치', 'Global Exposure Value in the K-Content Market')
add_data_en('인스파이어 리조트 × 프리미엄 운영 인프라', 'Inspire Resort × Premium Operations Infrastructure')
add_data_en('K-팝·K-푸드·K-뷰티·숏폼의 젊고 글로벌한 관객 유입 구조', 'Young, Global Audience Influx Through K-Pop, K-Food, K-Beauty, Short-Form')
add_data_en('모바일 숏필름 컴피티션 + 캠핑형 페스티벌 바이럴 엔진', 'Mobile Short Film Competition + Camping Festival Viral Engine')
add_data_en('"콘텐츠가 계속 재생산되는 영화제"', '"A Festival Where Content Keeps Being Reproduced"')
add_data_en('브랜드 가치 · 글로벌 네트워크 · 장기 비즈니스 자산', 'Brand Value · Global Network · Long-term Business Assets')
add_data_en('1회성 이벤트가 아닌 장기 파트너십 구조', 'Long-term Partnership Structure, Not a One-time Event')

# ══════════════════════════════════════════════════════
# PROGRAMS SECTION - Card h3 titles
# ══════════════════════════════════════════════════════
add_data_en('창작자 중심 글로벌 독립영화제 섹션', 'Creator-Centered Global Independent Film Festival Section')
add_data_en("모바일로 제작하는 '새로운 영화 언어' 대표 미래 섹션", "The Future Section Representing 'New Film Language' Made on Mobile")
add_data_en("캠핑·공연·상영이 결합된 '영화형 축제'", "'Film-Type Festival' Combining Camping, Performance, and Screening")
add_data_en('영화를 중심으로 K-컬처가 스며드는 공간', 'A Space Where K-Culture Permeates Through Film')

print(f"Part 1 done: {count} fixes applied")

# Save intermediate
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Part 1 saved. Run fix_all_remaining_2.py next.")
