"""
Final-final fix: Target specific remaining issues with precise string replacements.
"""
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

count = 0

# ══════════════════════════════════════════════════════
# 1. BUDGET LI items - need specific handling because <strong> is inside
#    The previous script failed. Let's directly replace the full <li> tags.
# ══════════════════════════════════════════════════════
replacements = [
    # Budget li with strong children  
    ('<li data-en="❶ Government/Municipal Support:"><strong data-en="❶ Government/Municipal Support:">❶ 정부/지자체 지원:</strong> 인천시, 문체부, 영화진흥위원회 등 공적 지원금 유치</li>',
     '<li data-en="&lt;strong&gt;❶ Government/Municipal Support:&lt;/strong&gt; Securing public grants from Incheon City, MCST, KOFIC"><strong>❶ 정부/지자체 지원:</strong> 인천시, 문체부, 영화진흥위원회 등 공적 지원금 유치</li>'),
    
    ('<li data-en="❷ Inspire Co-hosting:"><strong data-en="❷ Inspire Co-hosting:">❷ 인스파이어 공동 주최:</strong> 아레나, 디스커버리 파크, MICE 등 시설 사용료 대폭 감면 또는 현물 투자</li>',
     '<li data-en="&lt;strong&gt;❷ Inspire Co-hosting:&lt;/strong&gt; Arena, Discovery Park, MICE facility fee reduction or in-kind investment"><strong>❷ 인스파이어 공동 주최:</strong> 아레나, 디스커버리 파크, MICE 등 시설 사용료 대폭 감면 또는 현물 투자</li>'),
    
    ('<li data-en="❸ Corporate Sponsorship:"><strong data-en="❸ Corporate Sponsorship:">❸ 기업 스폰서십:</strong> K-컬처, IT/모바일, 항공사 등 연계 기업의 전략적 스폰서십 유치</li>',
     '<li data-en="&lt;strong&gt;❸ Corporate Sponsorship:&lt;/strong&gt; Strategic sponsorship from K-Culture, IT/mobile, airline-linked companies"><strong>❸ 기업 스폰서십:</strong> K-컬처, IT/모바일, 항공사 등 연계 기업의 전략적 스폰서십 유치</li>'),
    
    ('<li data-en="❹ Revenue Business:"><strong data-en="❹ Revenue Business:">❹ 수익 사업:</strong> 티켓 판매, 비즈니스 마켓 참가비, 야영 참가비, K-컬처 팝업 스토어 임대 수익</li>',
     '<li data-en="&lt;strong&gt;❹ Revenue Business:&lt;/strong&gt; Ticket sales, business market fees, camping fees, K-Culture popup rental"><strong>❹ 수익 사업:</strong> 티켓 판매, 비즈니스 마켓 참가비, 야영 참가비, K-컬처 팝업 스토어 임대 수익</li>'),
    
    # Cashflow remaining 씨드 and 잔금 (second occurrences)
    ('>100 (씨드)<', '>100 (Seed)<'),
    ('>200 (잔금)<', '>200 (Balance)<'),
]

for old, new in replacements:
    if old in html:
        html = html.replace(old, new, 1)
        count += 1

# ══════════════════════════════════════════════════════
# 2. CASHFLOW highlight li items - fix the ones with strong that got double data-en
# ══════════════════════════════════════════════════════
# The cashflow highlight box li items may have gotten data-en on both strong AND li
# Let's check and fix
cash_lis = [
    ('<li data-en="Q3 Management Critical:"><strong data-en="Q3 Management Critical:">3분기 관리 중요:</strong>',
     '<li data-en="&lt;strong&gt;Q3 Management Critical:&lt;/strong&gt; Heavy spending on marketing and Hollywood guest advances — ensure 2nd sponsorship payments arrive on time"><strong>3분기 관리 중요:</strong>'),
    ('<li data-en="Reserve Fund:"><strong data-en="Reserve Fund:">예비비 확보:</strong>',
     '<li data-en="&lt;strong&gt;Reserve Fund:&lt;/strong&gt; Budget 5-10% as reserves for rain, exchange rates, safety incidents"><strong>예비비 확보:</strong>'),
]
for old, new in cash_lis:
    if old in html:
        html = html.replace(old, new, 1)
        count += 1

# ══════════════════════════════════════════════════════
# 3. Add dictionary entries for 1단계-5단계 badges and remaining items
#    to translations-index.js
# ══════════════════════════════════════════════════════
# Read translations file and add missing entries
with open('translations-index.js', 'r', encoding='utf-8') as tf:
    tjs = tf.read()

# Add entries before the closing };
new_entries = """
    // ── BADGE TRANSLATIONS ──
    '1단계': 'Phase 1',
    '2단계': 'Phase 2', 
    '3단계': 'Phase 3',
    '4단계': 'Phase 4',
    '5단계': 'Phase 5',
    '1회차': '1st Edition',
    '2회차': '2nd Edition',
    '3회차': '3rd Edition',
    '민간 발족': 'Private Launch',
    '공약화': 'Pledge Phase',
    '선거 기간': 'Election Period',
    '당선자 협력': 'Winner Cooperation',
    '개최': 'Hosting',
    '100 (씨드)': '100 (Seed)',
    '200 (잔금)': '200 (Balance)',
    '400 (보조금 1차)': '400 (Grant 1st)',
    '300 (보조금 2차)': '300 (Grant 2nd)',
    '400 (1차 후원)': '400 (1st Sponsorship)',
    '500 (2차 후원)': '500 (2nd Sponsorship)',
    '50 (기부금)': '50 (Donations)',
    '200 (티켓/참가비)': '200 (Tickets/Fees)',
    '550 (티켓/마켓)': '550 (Tickets/Market)',
    '20 (계약금)': '20 (Deposit)',
    '200 (선급금)': '200 (Advance)',
    '300 (중도금)': '300 (Progress)',
    '380 (잔금)': '380 (Balance)',
    '타이틀 스폰서': 'Title Sponsor',
    '프리미엄 파트너': 'Premium Partner',
    '공식 파트너': 'Official Partner',
    '티저 영상': 'Teaser Video',
    '공식 포스터': 'Official Poster',
    '얼리버드 티켓': 'Early Bird Tickets',
    '인천 시민 우대': 'Incheon Citizen Priority',
    '명예 위원장': 'Honorary Chairman',
    '추진 위원장': 'Steering Chairman',
    '공동 위원장': 'Co-chairman',
    '총괄사업추진단장': 'General Project Director',
"""
marker = "    // ── FOOTER ──"
if marker in tjs and "'1단계': 'Phase 1'" not in tjs:
    tjs = tjs.replace(marker, new_entries + "\n" + marker)
    with open('translations-index.js', 'w', encoding='utf-8') as tf:
        tf.write(tjs)
    count += 1
    print("Added badge translations to translations-index.js")

print(f"Final-final fixes: {count} applied")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Saved.")
