"""
Part 2: Fix remaining untranslated content - BIFF, Budget, CashFlow, SeedMoney,
Sponsorship, Marketing, Risk Management, Personnel, Organization, Space sections.
"""
import re

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
# ORGANIZATION - org-box p tags (under atoz-roadmap)
# ══════════════════════════════════════════════════════
add_data_en('>예산/계약/인사<', '>Budget/Contracts/HR<')
add_data_en('>상영작/게스트/캠프<', '>Films/Guests/Camp<')
add_data_en('>현장/영사/셔틀<', '>Venue/Projection/Shuttle<')
add_data_en('>티켓/SNS/프레스<', '>Tickets/SNS/Press<')
add_data_en('>대외협력팀<', '>External Cooperation Team<')
add_data_en('>스폰서/정부/MOU<', '>Sponsors/Government/MOU<')

# ══════════════════════════════════════════════════════
# KPI TABLE (13.3)
# ══════════════════════════════════════════════════════
add_data_en('13.3 팀별 KPI (핵심 성과 지표)', '13.3 Team KPIs (Key Performance Indicators)')
add_data_en('>조직<', '>Team<')
add_data_en('>확인 방법 (KPI)<', '>Verification Method (KPI)<')
add_data_en('>달성 기준<', '>Achievement Criteria<')
add_data_en('초청 수락서(LOI) 확보율', 'Invitation acceptance (LOI) acquisition rate')
add_data_en('D-3개월까지 주요 게스트/작품 90% 계약 완료', '90% of key guests/works contracted by D-3 months')
add_data_en('>마케팅팀<', '>Marketing Team<')
add_data_en('티켓 예매율 및 SNS 도달률', 'Ticket reservation rate and SNS reach')
add_data_en('얼리버드 10분 내 매진 / 팔로워 5만 명', 'Early bird sold out within 10 min / 50K followers')
add_data_en('>운영팀<', '>Operations Team<')
add_data_en('시설 안전 점검 필증', 'Facility safety inspection certificate')
add_data_en("D-1개월 전 모든 시설 안전 검사 '적합' 판정", "All facilities rated 'compliant' by D-1 month")
add_data_en('>대외협력팀<', '>External Cooperation Team<')
add_data_en('스폰서십 입금 달성률', 'Sponsorship deposit achievement rate')
add_data_en('D-2개월 전 목표 후원금 100% 약정 체결', '100% target sponsorship pledged by D-2 months')

# ══════════════════════════════════════════════════════
# SPACE & PARTNERS (10.1 - 10.3)
# ══════════════════════════════════════════════════════
add_data_en('10.1 인스파이어 리조트 공간별 활용 전략', '10.1 Inspire Resort Space Utilization Strategy')
add_data_en('>공간<', '>Space<')
add_data_en('>면적/규모<', '>Area/Scale<')
add_data_en('>영화제 활용 프로그램<', '>Festival Utilization Programs<')
add_data_en('15,000석 다목적 공연장', '15,000-seat multipurpose venue')
add_data_en('개·폐막식, 갈라 스크리닝, K-팝 콘서트, 시상식', 'Opening/closing, gala screening, K-Pop concert, awards ceremony')
add_data_en('>대규모 야외 공간<', '>Large outdoor space<')
add_data_en('Creator Camp 야영, 야외상영, 캠핑 페스티벌, K-푸드/뷰티 존', 'Creator Camp camping, outdoor screening, camping festival, K-Food/Beauty zone')
add_data_en('>컨벤션·회의실<', '>Convention/Meeting rooms<')
add_data_en('비즈니스 포럼, 마스터 클래스, 프레스 센터, 투자자 네트워킹', 'Business forum, master class, press center, investor networking')
add_data_en('오로라(디지털 스트리트)', 'Aurora (Digital Street)')
add_data_en('약 200m 디지털 미디어 조형물', '~200m digital media sculpture')
add_data_en('모바일 수상작 디지털 전시, 포토존, 스폰서 디지털 광고', 'Mobile winners digital exhibit, photo zone, sponsor digital ads')
add_data_en('호텔·리조트', 'Hotel/Resort')
add_data_en('>숙박 시설<', '>Lodging facilities<')
add_data_en('VIP/게스트 숙소, 관객 패키지 연계', 'VIP/guest lodging, audience package link')

# 10.2
add_data_en('10.2 인천 도심 연계 전략', '10.2 Incheon Downtown Integration Strategy')
add_data_en('🎬 영화공간 주안', '🎬 Film Space Juan')
add_data_en('🏢 송도 국제도시', '🏢 Songdo International City')
add_data_en('🏛️ 인천 구도심', '🏛️ Incheon Old Downtown')

# 10.3
add_data_en('10.3 K-컬처 파트너 네트워크', '10.3 K-Culture Partner Network')
add_data_en('>발굴 카테고리<', '>Discovery Category<')
add_data_en('>잠재적 협력 파트너 (예시)<', '>Potential Partners (Example)<')
add_data_en('>영화제 기여 역할<', '>Festival Contribution Role<')
add_data_en('>K-식품 / F&B<', '>K-Food / F&amp;B<')
add_data_en('인천 지역 맛집, CJ푸드빌', 'Incheon local restaurants, CJ Foodville')
add_data_en('K-푸드 팝업 운영, 캠프 식음 케이터링', 'K-Food popup operation, camp F&amp;B catering')
add_data_en('>K-뷰티<', '>K-Beauty<')
add_data_en('아모레퍼시픽, 올리브영', 'Amorepacific, Olive Young')
add_data_en('메이크업 체험 부스, 스타 뷰티 클래스', 'Makeup experience booth, star beauty class')
add_data_en('>K-팝·엔터<', '>K-Pop/Entertainment<')
add_data_en('하이브, JYP, SM', 'HYBE, JYP, SM')
add_data_en('미니 콘서트, 팬미팅, K-팝 스타 레드카펫', 'Mini concert, fan meeting, K-Pop star red carpet')
add_data_en('>K-관광<', '>K-Tourism<')
add_data_en('인천관광공사, 한국관광공사', 'Incheon Tourism Org, Korea Tourism Org')
add_data_en('외국인 관광 패키지, 팸투어 운영', 'Foreign tourist packages, FAM tour operation')

# ══════════════════════════════════════════════════════
# BIFF COMPARISON
# ══════════════════════════════════════════════════════
add_data_en('선배 영화제의 성과를 \'벤치마크\'로', 'Using the achievements of predecessor festivals as a &quot;benchmark&quot; and IIFF&apos;s differentiators as &quot;strategic weapons&quot;')
add_data_en('>비교 항목<', '>Comparison<')
add_data_en('>BIFF (부산국제영화제)<', '>BIFF (Busan Int&apos;l Film Fest)<')
add_data_en('>i-NextWave FF (인천)<', '>i-NextWave FF (Incheon)<')
add_data_en('>위상<', '>Status<')
add_data_en('아시아 최대 A급 국제영화제', "Asia's largest A-class international film festival")
add_data_en("아시아 최초 '미래형 융합 영화 플랫폼'", "Asia's first 'future-oriented convergence film platform'")
add_data_en('>주요 콘텐츠<', '>Key Content<')
add_data_en('정통 영화 상영 및 시상 중심', 'Traditional film screening and awards-focused')
add_data_en('영화 + 모바일 + K-컬처 + 야영 + 공연 융합', 'Film + Mobile + K-Culture + Camping + Performance convergence')
add_data_en('>예산 규모(1회)<', '>Budget (1st edition)<')
add_data_en('약 200억 원 (현재)', '~₩20B (current)')
add_data_en('약 30억 원 (인스파이어 현물 포함 시 50억+)', '~₩3B (₩5B+ with Inspire in-kind)')
add_data_en('>핵심 관객층<', '>Core Audience<')
add_data_en('영화 관계자, 시네필', 'Film professionals, cinephiles')
add_data_en('영화인 + MZ세대 + 글로벌 K-컬처 팬 + 관광객', 'Filmmakers + MZ Gen + Global K-Culture fans + tourists')
add_data_en('영화의 전당 (부산 센텀시티)', 'Busan Cinema Center (Centum City)')
add_data_en('인스파이어 리조트 + 인천 도심 상영관', 'Inspire Resort + Incheon city theaters')
add_data_en('>헐리우드 연계<', '>Hollywood Link<')
add_data_en('매년 할리우드 스타 초청 (수동적)', 'Annual Hollywood star invitations (passive)')
add_data_en('Method Fest 공동 운영 (구조적 연결)', 'Method Fest co-operation (structural link)')
add_data_en('>차별화 무기<', '>Differentiator<')
add_data_en('30년 축적된 권위와 네트워크', '30 years of accumulated authority and network')
add_data_en('모바일 영화제, 야영 캠프, K-컬처 융합, 인스파이어 인프라', 'Mobile film fest, camping, K-Culture convergence, Inspire infrastructure')

# BIFF highlight box
add_data_en('<strong>전략적 시사점:</strong>', '<strong>Strategic Implication:</strong> Not competing head-on with BIFF, but securing an independent position in the &quot;future-oriented, experiential, K-Culture convergence&quot; space that BIFF doesn&apos;t cover. If BIFF is a festival of &quot;authority,&quot; IIFF is a festival of &quot;experience.&quot;')

print(f"Part 2 done: {count} fixes applied")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Part 2 saved.")
