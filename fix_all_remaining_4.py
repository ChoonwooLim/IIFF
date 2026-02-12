"""
Part 4: Sponsorship, Marketing, Risk Management, Personnel sections.
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
# SPONSORSHIP (9.1 - 9.3)
# ══════════════════════════════════════════════════════
add_data_en('9.1 스폰서십 등급 (Tier System)', '9.1 Sponsorship Tiers (Tier System)')
add_data_en('>등급<', '>Tier<')
add_data_en('>금액 기준<', '>Amount Criteria<')
add_data_en('>주요 혜택<', '>Key Benefits<')
add_data_en('>타이틀 스폰서<', '>Title Sponsor<')
add_data_en('>5억 원 이상<', '>₩500M+<')
add_data_en('영화제 공식 명칭 삽입, 모든 홍보물 로고 노출, 개막식 VIP석, 전용 브랜드 존 운영', 'Festival official name insertion, logo on all materials, opening VIP seats, dedicated brand zone')
add_data_en('>프리미엄 파트너<', '>Premium Partner<')
add_data_en('>2~5억 원<', '>₩200-500M<')
add_data_en('핵심 섹션 네이밍권 (갈라/캠프/어워드), 주요 행사 VIP 초대, 프레스 월 로고 노출', 'Key section naming rights (Gala/Camp/Awards), VIP invitations, press wall logo')
add_data_en('>공식 파트너<', '>Official Partner<')
add_data_en('>5천만~2억 원<', '>₩50-200M<')
add_data_en('홈페이지 및 공식 인쇄물 로고, K-컬처 존 부스 운영권, SNS 콜라보 콘텐츠', 'Website/print logo, K-Culture zone booth rights, SNS collab content')
add_data_en('>서포터<', '>Supporter<')
add_data_en('>5천만 원 이하<', '>Under ₩50M<')
add_data_en('홈페이지 로고 게시, 공식 굿즈 콜라보, 소규모 체험 부스 운영', 'Website logo, official goods collab, small experience booth')

# 9.2
add_data_en('9.2 타겟 스폰서 업종 및 접근 전략', '9.2 Target Sponsor Industries &amp; Approach')
add_data_en('>업종<', '>Industry<')
add_data_en('>타겟 기업 (예시)<', '>Target Companies (Example)<')
add_data_en('>연계 가능 프로그램<', '>Linked Programs<')
add_data_en('>접근 방식<', '>Approach<')
add_data_en('>IT/모바일<', '>IT/Mobile<')
add_data_en('>삼성, Apple, SKT<', '>Samsung, Apple, SKT<')
add_data_en('모바일 영화 컴피티션 (촬영 기기 제공 + 네이밍)', 'Mobile film competition (filming devices + naming)')
add_data_en('모바일 콘텐츠 제작 인프라 제공 제안', 'Mobile content production infra proposal')
add_data_en('>항공/여행<', '>Aviation/Travel<')
add_data_en('>대한항공, 아시아나<', '>Korean Air, Asiana<')
add_data_en('해외 게스트 항공 지원 + 관광 패키지 공동 개발', 'Overseas guest flight support + tourism package co-development')
add_data_en('인천공항 → 영화제 연결 동선 마케팅', 'Incheon Airport → Festival route marketing')
add_data_en('>소비재/뷰티<', '>Consumer/Beauty<')
add_data_en('>아모레퍼시픽, LG생활건강<', '>Amorepacific, LG H&amp;H<')
add_data_en('K-뷰티 체험 부스 + 스타 메이크업 쇼', 'K-Beauty experience booth + star makeup show')
add_data_en('글로벌 관객 대상 제품 노출 + 체험', 'Product exposure + experience for global audiences')
add_data_en('>식음료<', '>F&amp;B<')
add_data_en('>CJ제일제당, 하이트진로<', '>CJ CheilJedang, HiteJinro<')
add_data_en('K-푸드 팝업 스토어 + 캠프 식음 지원', 'K-Food popup store + camp F&amp;B support')
add_data_en('야외 축제 환경에서 브랜드 체험 극대화', 'Maximize brand experience in outdoor festival setting')
add_data_en('>자동차<', '>Automotive<')
add_data_en('>현대, 기아<', '>Hyundai, Kia<')
add_data_en('공식 의전 차량 + 레드카펫 차량 전시', 'Official protocol vehicles + red carpet vehicle display')
add_data_en('프리미엄 이미지 연계 (EV/수소차)', 'Premium image linkage (EV/hydrogen)')
add_data_en('>금융<', '>Finance<')
add_data_en('>KB, 신한, 하나<', '>KB, Shinhan, Hana<')
add_data_en('K-콘텐츠 펀드/투자 연계 포럼', 'K-Content fund/investment forum')
add_data_en('ESG 활동 + 문화 투자 포트폴리오', 'ESG activities + cultural investment portfolio')

# 9.3
add_data_en('9.3 3개년 스폰서십 전략', '9.3 3-Year Sponsorship Strategy')
add_data_en('>연차<', '>Year<')
add_data_en('>스폰서십 목표<', '>Sponsorship Target<')
add_data_en('>1회차<', '>1st Edition<')
add_data_en('핵심 파트너 확보 + 현물 스폰서 중심', 'Core partner acquisition + in-kind sponsor focus')
add_data_en('>~12억 원 (인스파이어 현물 포함)<', '>~₩1.2B (incl. Inspire in-kind)<')
add_data_en('>2회차<', '>2nd Edition<')
add_data_en('브랜드 경쟁 구도 형성 + 프리미엄 네이밍 판매', 'Brand competition formation + premium naming sales')
add_data_en('>~20억 원<', '>~₩2B<')
add_data_en('>3회차<', '>3rd Edition<')
add_data_en('글로벌 브랜드 유치 + 멀티이어 계약 전환', 'Global brand acquisition + multi-year contract conversion')
add_data_en('>~30억 원<', '>~₩3B<')

# ══════════════════════════════════════════════════════
# MARKETING (6.1 - 6.3)
# ══════════════════════════════════════════════════════
add_data_en('6.1 글로벌 인지도 확보 (전문성 강조)', '6.1 Global Awareness (Professionalism Focus)')
add_data_en('6.2 대중 참여 및 바이럴 (참여성 강조)', '6.2 Public Engagement &amp; Viral (Participation Focus)')
add_data_en('6.3 홍보 콘텐츠 및 프로모션 타임라인', '6.3 PR Content &amp; Promotion Timeline')

# 6.1 table
add_data_en('>세부 활동<', '>Detailed Activities<')
add_data_en('>헐리우드 네트워크 활용<', '>Hollywood Network Utilization<')
add_data_en('헐리우드 스타 및 메소드필름페스타 관계자와의 독점 인터뷰를 글로벌 주요 영화 매체(Variety, Hollywood Reporter 등)에 제공', 'Providing exclusive interviews with Hollywood stars and Method Fest officials to major global film media (Variety, Hollywood Reporter, etc.)')
add_data_en('>아시아 게이트웨이 브랜딩<', '>Asia Gateway Branding<')
add_data_en('아시아 주요 영화 시장 관계자를 초청하고, 개막식에 아시아 대표 배우 및 감독 배치', 'Inviting key Asian film market players and placing representative Asian actors/directors at the opening')
add_data_en('>타겟 미디어 파트너십<', '>Target Media Partnership<')
add_data_en('영화 전문 매거진 및 비즈니스 콘텐츠 미디어(포브스 아시아)와 협력', 'Partnering with film magazines and business content media (Forbes Asia)')

# 6.2 table
add_data_en('모바일 영화 제작 캠프를 숏폼 콘텐츠로 제작·배포. 인플루언서 참가자 초청', 'Producing mobile film camp as short-form content. Inviting influencer participants')
add_data_en('>K-WAVE 페스티벌 통합 홍보<', '>K-WAVE Festival Integrated PR<')
add_data_en("'영화와 캠핑을 함께 즐기는 유일한 축제'로 포지셔닝", "Positioning as 'the only festival where you enjoy film and camping together'")
add_data_en('>인스파이어 연계 마케팅<', '>Inspire Linked Marketing<')
add_data_en('숙박/F&amp;B 패키지와 영화제 티켓 묶어 판매, 상호 시너지 창출', 'Bundle accommodation/F&amp;B packages with festival tickets for mutual synergy')

# 6.3 table
add_data_en('>콘텐츠<', '>Content<')
add_data_en('>시기<', '>Timing<')
add_data_en('>티저 영상<', '>Teaser Video<')
add_data_en("아시아와 헐리우드 스타들의 과거 명장면과 인스파이어의 화려한 시설을 교차 편집하여 'NextWave' 컨셉 강조", "Cross-editing iconic scenes of Asian and Hollywood stars with Inspire's facilities to emphasize 'NextWave' concept")
add_data_en('>공식 포스터<', '>Official Poster<')
add_data_en("인천의 도시 경관, 아레나, 디스커버리 파크의 야외 상영 장면을 모두 담아 영화제의 '공간적 특색' 시각화", "Visualizing the festival's 'spatial character' with Incheon cityscape, Arena, and Discovery Park outdoor screening scenes")
add_data_en('>얼리버드 티켓<', '>Early Bird Tickets<')
add_data_en('개/폐막식 및 NextWave 캠프 참가권을 한정 수량 판매하여 초기 관심도 및 현금 유동성 확보', 'Limited sales of opening/closing and NextWave Camp participation to secure early interest and cash flow')
add_data_en('>인천 시민 우대<', '>Incheon Citizen Priority<')
add_data_en('인천 거주자에게 CGV 인디 섹션 티켓 할인 제공 (지역 밀착형 영화제)', 'CGV indie section ticket discount for Incheon residents (community-based festival)')

print(f"Part 4 done: {count} fixes applied")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Part 4 saved.")
