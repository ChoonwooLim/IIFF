"""
Final fix: Handle the last 21 remaining untranslated elements.
These need specific HTML-level fixes for elements with complex structures.
"""
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

count = 0

def replace_exact(old, new):
    global html, count
    if old in html:
        html = html.replace(old, new, 1)
        count += 1

# ══════════════════════════════════════════════════════
# 1. ROADMAP h4 edition suffixes: "— 1회", "— 2회", "— 3회"
# The h4 data-en already has "Phase X... Foundation — 1회" 
# We need to change "1회" to "Ed. 1" etc in data-en values
# ══════════════════════════════════════════════════════
replace_exact('Foundation — 1회"', 'Foundation — Ed. 1"')
replace_exact('Expansion — 2회"', 'Expansion — Ed. 2"')
replace_exact('Globalization — 3회"', 'Globalization — Ed. 3"')

# ══════════════════════════════════════════════════════
# 2. CORE STRATEGY ROW 1 - The td still doesn't have data-en
#    The previous script may have failed due to line break mismatch
# ══════════════════════════════════════════════════════
# Try with just the opening of the text
old = '>개막식 및 레드카펫: 인스파이어 아레나 및 오로라 활용'
if old in html:
    idx = html.find(old)
    tag_start = html.rfind('<td', 0, idx)
    tag_end = html.find('>', tag_start)
    tag_content = html[tag_start:tag_end+1]
    if 'data-en' not in tag_content:
        new_tag = tag_content[:-1] + ' data-en="Opening ceremony &amp; red carpet: Inspire Arena and Aurora, global-Asian star joint red carpet. Business &amp; Forum: Co-production &amp; investment forum at MICE facility.">'
        html = html[:tag_start] + new_tag + html[tag_end+1:]
        count += 1

# ══════════════════════════════════════════════════════
# 3. BUDGET li items with <strong> children - these need data-en on the li
#    The add_data_en approach matched <strong> instead of <li>
# ══════════════════════════════════════════════════════
# Fix each budget li
budget_lis = [
    ('<li><strong>❶ 정부/지자체 지원:</strong> 인천시, 문체부, 영화진흥위원회 등 공적 지원금 유치</li>',
     '<li data-en="&lt;strong&gt;❶ Government/Municipal Support:&lt;/strong&gt; Securing public grants from Incheon City, MCST, KOFIC">'),
    ('<li><strong>❷ 인스파이어 공동 주최:</strong> 아레나, 디스커버리 파크, MICE 등 시설 사용료 대폭 감면 또는 현물 투자</li>',
     '<li data-en="&lt;strong&gt;❷ Inspire Co-hosting:&lt;/strong&gt; Arena, Discovery Park, MICE facility fee reduction or in-kind investment">'),
    ('<li><strong>❸ 기업 스폰서십:</strong> K-컬처, IT/모바일, 항공사 등 연계 기업의 전략적 스폰서십 유치</li>',
     '<li data-en="&lt;strong&gt;❸ Corporate Sponsorship:&lt;/strong&gt; Strategic sponsorship from K-Culture, IT/mobile, airline companies">'),
    ('<li><strong>❹ 수익 사업:</strong> 티켓 판매, 비즈니스 마켓 참가비, 야영 참가비, K-컬처 팝업 스토어 임대 수익</li>',
     '<li data-en="&lt;strong&gt;❹ Revenue Business:&lt;/strong&gt; Ticket sales, business market fees, camping fees, K-Culture popup store rental">'),
]
for old_li, new_li_open in budget_lis:
    if old_li in html:
        html = html.replace(old_li, new_li_open + old_li[4:], 1)  # Insert data-en into existing <li>
        count += 1

# ══════════════════════════════════════════════════════
# 4. CASHFLOW - remaining seed/balance labels in parentheses
# ══════════════════════════════════════════════════════
# These are td cells with just "(씨드)" "(잔금)" etc inside numbers
# The second occurrence of 100 (씨드) in private sponsors
replace_exact('>100 (씨드)<', '>100 (Seed)<')  # for second occurrence
# remaining 잔금
replace_exact('>200 (잔금)<', '>200 (Balance)<')  # second occurrence in private sponsors

# ══════════════════════════════════════════════════════  
# 5. MARKETING D-day labels
# ══════════════════════════════════════════════════════
replace_exact('>D-120일<', '>D-120 days<')
replace_exact('>D-90일<', '>D-90 days<')
replace_exact('>D-60일<', '>D-60 days<')
replace_exact('>D-30일<', '>D-30 days<')

# ══════════════════════════════════════════════════════
# 6. POLITICAL TABLE - badge+text combos in td cells
#    e.g., <td><span class="badge badge-gold">1단계</span><br>민간 발족</td>
# ══════════════════════════════════════════════════════
replace_exact(
    '<span class="badge badge-gold">1단계</span><br>민간 발족</td>',
    '<span class="badge badge-gold">1단계</span><br>민간 발족</td>'.replace(
        '<td>', '<td data-en="&lt;span class=&quot;badge badge-gold&quot;&gt;Phase 1&lt;/span&gt;&lt;br&gt;Private Launch">')
)
# Actually let me do this more carefully - add data-en to the td
political_cells = [
    ('<td><span class="badge badge-gold">1단계</span><br>민간 발족</td>',
     '<td data-en="&lt;span class=&quot;badge badge-gold&quot;&gt;Phase 1&lt;/span&gt;&lt;br&gt;Private Launch"><span class="badge badge-gold">1단계</span><br>민간 발족</td>'),
    ('<td><span class="badge badge-gold">2단계</span><br>공약화</td>',
     '<td data-en="&lt;span class=&quot;badge badge-gold&quot;&gt;Phase 2&lt;/span&gt;&lt;br&gt;Pledge Phase"><span class="badge badge-gold">2단계</span><br>공약화</td>'),
    ('<td><span class="badge badge-red">3단계</span><br>선거 기간</td>',
     '<td data-en="&lt;span class=&quot;badge badge-red&quot;&gt;Phase 3&lt;/span&gt;&lt;br&gt;Election Period"><span class="badge badge-red">3단계</span><br>선거 기간</td>'),
    ('<td><span class="badge badge-blue">4단계</span><br>당선자 협력</td>',
     '<td data-en="&lt;span class=&quot;badge badge-blue&quot;&gt;Phase 4&lt;/span&gt;&lt;br&gt;Winner Cooperation"><span class="badge badge-blue">4단계</span><br>당선자 협력</td>'),
    ('<td><span class="badge badge-blue">5단계</span><br>개최</td>',
     '<td data-en="&lt;span class=&quot;badge badge-blue&quot;&gt;Phase 5&lt;/span&gt;&lt;br&gt;Hosting"><span class="badge badge-blue">5단계</span><br>개최</td>'),
]
for old_cell, new_cell in political_cells:
    replace_exact(old_cell, new_cell)

# ══════════════════════════════════════════════════════
# 7. SEED MONEY TABLE - badge cells for 1단계/2단계/3단계
# ══════════════════════════════════════════════════════
# These are <td><span class="badge badge-gold">1단계</span></td> etc.
# Already have badge-gold/red/blue but the span has Korean text
# The initTranslations Strategy 6 should handle these if in the dictionary
# Let's add data-en to the td containing badge
seed_badges = [
    ('<td><span class="badge badge-gold">1단계</span></td>\r\n                                    <td>공공 시드 확보',
     '<td data-en="&lt;span class=&quot;badge badge-gold&quot;&gt;Phase 1&lt;/span&gt;"><span class="badge badge-gold">1단계</span></td>\r\n                                    <td data-en="Public Seed Securing (40%)&lt;br&gt;Utilizing Incheon City Cultural Arts Fund">공공 시드 확보'),
    ('<td><span class="badge badge-red">2단계</span></td>\r\n                                    <td>민간 매칭 펀드',
     '<td data-en="&lt;span class=&quot;badge badge-red&quot;&gt;Phase 2&lt;/span&gt;"><span class="badge badge-red">2단계</span></td>\r\n                                    <td data-en="Private Matching Fund (40%)&lt;br&gt;Inspire cash/in-kind support">민간 매칭 펀드'),
    ('<td><span class="badge badge-blue">3단계</span></td>\r\n                                    <td>후원회 멤버십',
     '<td data-en="&lt;span class=&quot;badge badge-blue&quot;&gt;Phase 3&lt;/span&gt;"><span class="badge badge-blue">3단계</span></td>\r\n                                    <td data-en="Sponsorship Membership (20%)&lt;br&gt;Committee-led initial fundraising">후원회 멤버십'),
]
for old_s, new_s in seed_badges:
    replace_exact(old_s, new_s)

# ══════════════════════════════════════════════════════
# 8. CASHFLOW highlight box - li items with <strong> children
# ══════════════════════════════════════════════════════
cashflow_lis = [
    ('<li><strong>3분기 관리 중요:</strong>',
     '<li data-en="&lt;strong&gt;Q3 Management Critical:&lt;/strong&gt; Heavy spending on marketing and Hollywood guest advances — ensure 2nd sponsorship payments arrive on time"><strong>3분기 관리 중요:</strong>'),
    ('<li><strong>예비비 확보:</strong>',
     '<li data-en="&lt;strong&gt;Reserve Fund:&lt;/strong&gt; Budget 5-10% as reserves for rain, exchange rate changes, safety incidents"><strong>예비비 확보:</strong>'),
]
for old_cl, new_cl in cashflow_lis:
    replace_exact(old_cl, new_cl)

print(f"Final fixes: {count} applied")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Final fixes saved.")
