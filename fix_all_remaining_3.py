"""
Part 3: Budget, Cash Flow, Seed Money, Sponsorship, Marketing, Risk Management, Personnel.
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
# BUDGET PLAN
# ══════════════════════════════════════════════════════
add_data_en('제1회 기준, 30억 원 규모', '1st edition, ₩3 billion scale')
add_data_en('>재원 확보 (Revenues)<', '>Revenue Sources (Revenues)<')
add_data_en('>지출 항목 (Expenses)<', '>Expenditure Items (Expenses)<')

# Revenue table headers (shared)
add_data_en('>항목<', '>Item<')
add_data_en('>금액<', '>Amount<')
add_data_en('>비율<', '>Ratio<')

# Revenue rows
add_data_en('공적 자금 (시/정부)', 'Public Funds (City/Government)')
add_data_en('>10억 원<', '>₩1B<')
add_data_en('기업 스폰서십 (민간)', 'Corporate Sponsorship (Private)')
add_data_en('>12억 원<', '>₩1.2B<')
add_data_en('수익 사업 (Ticket &amp; Market)', 'Revenue Business (Ticket &amp; Market)')
add_data_en('>6억 원<', '>₩600M<')
add_data_en('기타 (재단 기금 등)', 'Others (Foundation funds, etc.)')
add_data_en('>2억 원<', '>₩200M<')
add_data_en('>합계<', '>Total<')
add_data_en('>30억 원<', '>₩3B<')

# Expense rows
add_data_en('프로그램 운영비', 'Program Operations')
add_data_en('>8억 원<', '>₩800M<')
add_data_en('초청 및 의전비', 'Invitation &amp; Protocol')
add_data_en('>9억 원<', '>₩900M<')
add_data_en('마케팅 및 홍보비', 'Marketing &amp; PR')
add_data_en('시설 및 인프라', 'Facilities &amp; Infrastructure')
add_data_en('>4억 원<', '>₩400M<')
add_data_en('인건비 및 일반 관리비', 'Personnel &amp; Admin')
add_data_en('>3억 원<', '>₩300M<')

# Budget strategy
add_data_en('>재원 확보 전략<', '>Revenue Securing Strategy<')
add_data_en('❶ 정부/지자체 지원:', '❶ Government/Municipal Support:')
add_data_en('인천시, 문체부, 영화진흥위원회 등 공적 지원금 유치', 'Securing public grants from Incheon City, MCST, KOFIC')
add_data_en('❷ 인스파이어 공동 주최:', '❷ Inspire Co-hosting:')
add_data_en('아레나, 디스커버리 파크, MICE 등 시설 사용료 대폭 감면 또는 현물 투자', 'Arena, Discovery Park, MICE facility fee reduction or in-kind investment')
add_data_en('❸ 기업 스폰서십:', '❸ Corporate Sponsorship:')
add_data_en('K-컬처, IT/모바일, 항공사 등 연계 기업의 전략적 스폰서십 유치', 'Strategic sponsorship from K-Culture, IT/mobile, airline companies')
add_data_en('❹ 수익 사업:', '❹ Revenue Business:')
add_data_en('티켓 판매, 비즈니스 마켓 참가비, 야영 참가비, K-컬처 팝업 스토어 임대 수익', 'Ticket sales, business market entry fees, camping fees, K-Culture popup store rental')

# ══════════════════════════════════════════════════════
# CASH FLOW
# ══════════════════════════════════════════════════════
add_data_en('"성공적인 영화제는 \'돈맥경화\'가 없어야 한다"', '"A successful festival must have no cash flow blockage"')
add_data_en('>1분기 (D-12~9)', '>Q1 (D-12~9)')
add_data_en('>추진위 단계<', '>Steering Committee Phase<')
add_data_en('>2분기 (D-8~6)', '>Q2 (D-8~6)')
add_data_en('>조직위 출범<', '>Organizing Committee Launch<')
add_data_en('>3분기 (D-5~3)', '>Q3 (D-5~3)')
add_data_en('>본격 준비<', '>Full Preparation<')
add_data_en('>4분기 (D-2~D+1)', '>Q4 (D-2~D+1)')
add_data_en('>개최 및 정산<', '>Hosting &amp; Settlement<')
add_data_en('>합계<', '>Total<')
add_data_en('>현금 유입<', '>Cash Inflow<')
add_data_en('>› 지자체/공공<', '>› Municipal/Public<')
add_data_en('>100 (씨드)<', '>100 (Seed)<')
add_data_en('>400 (보조금 1차)<', '>400 (Grant 1st)<')
add_data_en('>300 (보조금 2차)<', '>300 (Grant 2nd)<')
add_data_en('>200 (잔금)<', '>200 (Balance)<')
add_data_en('>› 민간 스폰서<', '>› Private Sponsors<')
add_data_en('>400 (1차 후원)<', '>400 (1st Sponsorship)<')
add_data_en('>500 (2차 후원)<', '>500 (2nd Sponsorship)<')
add_data_en('>› 자체 수익<', '>› Own Revenue<')
add_data_en('>50 (기부금)<', '>50 (Donations)<')
add_data_en('>200 (티켓/참가비)<', '>200 (Tickets/Fees)<')
add_data_en('>550 (티켓/마켓)<', '>550 (Tickets/Market)<')
add_data_en('>현금 유출<', '>Cash Outflow<')
add_data_en('>› 인건비/운영<', '>› Personnel/Operations<')
add_data_en('>› 초청/체류비<', '>› Invitation/Stay<')
add_data_en('>20 (계약금)<', '>20 (Deposit)<')
add_data_en('>200 (선급금)<', '>200 (Advance)<')
add_data_en('>300 (중도금)<', '>300 (Progress)<')
add_data_en('>380 (잔금)<', '>380 (Balance)<')
add_data_en('>› 마케팅비<', '>› Marketing<')
add_data_en('>› 시설/제작비<', '>› Facility/Production<')
add_data_en('>현금 잔액<', '>Cash Balance<')
add_data_en('(단위: 백만 원)', '(Unit: million KRW)')

# Cash flow tips
add_data_en('<strong>자금 운용 팁:</strong>', '<strong>Cash Management Tips:</strong>')
add_data_en('<strong>3분기 관리 중요:</strong>', '<strong>Q3 Management Critical:</strong>')
add_data_en('마케팅과 헐리우드 게스트 선급금이 대거 지출되므로, 스폰서십 2차 후원금이 제때 들어오도록 독려', 'Heavy spending on marketing and Hollywood guest advances — ensure 2nd sponsorship payments arrive on time')
add_data_en('<strong>예비비 확보:</strong>', '<strong>Reserve Fund:</strong>')
add_data_en('전체 예산의 5~10%는 예비비로 편성하여 우천, 환율 변동, 안전 사고 등 돌발 변수 대비', 'Budget 5-10% as reserves for rain, exchange rate changes, safety incidents')

# ══════════════════════════════════════════════════════
# SEED MONEY / INITIAL BUDGET
# ══════════════════════════════════════════════════════
add_data_en('추진위원회 초기 경비 (약 6개월)', 'Steering Committee Initial Expenses (~6 months)')
add_data_en('>금액 (백만 원)<', '>Amount (M KRW)<')
add_data_en('>용도<', '>Purpose<')
add_data_en('>인건비 및 운영비<', '>Personnel &amp; Operations<')
add_data_en('코어 인력(3인) 인건비, 사무실 임차', 'Core staff (3 people) salary, office lease')
add_data_en('>회의 및 네트워킹<', '>Meetings &amp; Networking<')
add_data_en('추진위/분과위 회의, 비전 발표회', 'Steering/subcommittee meetings, vision presentation')
add_data_en('>초기 네트워크 구축<', '>Initial Network Building<')
add_data_en('메소드페스타/하와이 MOU 출장, 헐리우드 접촉', 'Method Fest/Hawaii MOU trips, Hollywood contacts')
add_data_en('>홍보물 및 자료 제작<', '>Promotional Materials<')
add_data_en('비전 선포 자료, 홈페이지, 로고/디자인', 'Vision materials, website, logo/design')
add_data_en('>총계<', '>Total<')
add_data_en('(한화 2억 5천만 원)', '(KRW 250 million)')

# 50:50 matching fund
add_data_en('50:50 매칭 펀딩 전략', '50:50 Matching Fund Strategy')
add_data_en('>단계<', '>Phase<')
add_data_en('>전략<', '>Strategy<')
add_data_en('>목표 금액<', '>Target Amount<')
add_data_en('공공 시드 확보 (40%)', 'Public Seed Securing (40%)')
add_data_en('인천시 문화예술진흥기금 활용', 'Utilizing Incheon City Cultural Arts Fund')
add_data_en('>100백만 원<', '>₩100M<')
add_data_en('민간 매칭 펀드 (40%)', 'Private Matching Fund (40%)')
add_data_en('인스파이어 현금/현물 지원', 'Inspire cash/in-kind support')
add_data_en('후원회 멤버십 (20%)', 'Sponsorship Membership (20%)')
add_data_en('위원 중심 초기 모금', 'Committee-led initial fundraising')
add_data_en('>50백만 원<', '>₩50M<')

print(f"Part 3 done: {count} fixes applied")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Part 3 saved.")
