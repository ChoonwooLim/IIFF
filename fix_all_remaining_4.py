"""
Apply ALL missing content from PPTX to presentation_full.html
"""
import re

with open(r'C:\WORK\IIFF\presentation_full.html', 'r', encoding='utf-8') as f:
    html = f.read()

changes_made = []

# ===== A. What is IIFF? slide — add missing text =====
# After "IIFF는 바로 그 '만약에'를 시작하게 하는 영화제입니다."
old = "바로 그 <strong>'만약에'</strong>를 시작하게 하는 영화제입니다.</p>"
new = """바로 그 <strong>'만약에'</strong>를 시작하게 하는 영화제입니다.</p>
                        <p style="margin-top:0.5rem;font-size:0.9rem;color:var(--text-dim)">if는 일어날수 있는 모든 우연 즉 모든 가능성입니다. 끝없는 상상입니다.</p>"""
if old in html:
    html = html.replace(old, new, 1)
    changes_made.append("A1: Added 'if는 일어날수 있는 모든 우연' text")

# After OUR VISION section — add "Unlimited imagination" and "if, 그 단어에서..."
old_vision = """<p data-en="Not a festival only for those already recognized. It is a stage for EVERYONE who has a story.">
                            이미 인정받은 이들만을 위한 축제가 아닙니다. 이야기를 가진 '모든 사람'을 위한 무대입니다.</p>"""
new_vision = """<p data-en="Not a festival only for those already recognized. It is a stage for EVERYONE who has a story.">
                            이미 인정받은 이들만을 위한 축제가 아닙니다. 이야기를 가진 '모든 사람'을 위한 무대입니다.</p>
                        <p style="margin-top:1rem;font-style:italic;color:var(--accent-light);font-size:0.95rem"
                            data-en="Unlimited imagination and free creation">Unlimited imagination and free creation</p>
                        <p style="font-size:0.9rem;color:var(--text-dim);margin-top:0.5rem"
                            data-en="From the word 'if', IIFF begins.">if, 그 단어에서, IIFF는 시작됩니다.</p>"""
if old_vision in html:
    html = html.replace(old_vision, new_vision, 1)
    changes_made.append("A2: Added 'Unlimited imagination' and 'if, 그 단어에서' text")

# ===== B. English 4-point slide (PPTX Slide 6) =====
# Insert after the What is IIFF? slide (after its closing </div>)
# Find the slide that contains "OUR VISION" and ends with watermark, then insert after it
marker = """<div class="watermark">IIFF NEXT WAVE</div>
    </div>
</div>

<div class="slide">
    <div class="print-inner">
    <div class="slide-part">PART 1 • INTRODUCTION</div>
    <div class="slide-title" style="font-size:clamp(1.8rem,3.5vw,2.8rem)">2. Festival Overview</div>"""
new_slide6 = """<div class="watermark">IIFF NEXT WAVE</div>
    </div>
</div>

<div class="slide slide-cover" style="background:linear-gradient(135deg,#0d1117 0%,#161b22 50%,#0d1117 100%)">
    <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:2rem;padding:2rem;position:relative;z-index:1">
        <div class="s-card" style="background:rgba(201,168,76,0.08);border-color:rgba(201,168,76,0.3);padding:2rem">
            <p style="color:rgba(255,255,255,0.9);font-size:1rem;line-height:1.7">See, enjoy, create, evaluate each other, and spread it.</p>
            <p style="color:var(--text-dim);font-size:0.8rem;margin-top:0.5rem">보고, 즐기고, 만들고, 서로 평가하고, 퍼뜨린다.</p>
        </div>
        <div class="s-card" style="background:rgba(201,168,76,0.08);border-color:rgba(201,168,76,0.3);padding:2rem">
            <p style="color:rgba(255,255,255,0.9);font-size:1rem;line-height:1.7">We meet across borders, dream together, and act together.</p>
            <p style="color:var(--text-dim);font-size:0.8rem;margin-top:0.5rem">국경을 넘어 만나고, 함께 꿈꾸고, 함께 행동한다.</p>
        </div>
        <div class="s-card" style="background:rgba(201,168,76,0.08);border-color:rgba(201,168,76,0.3);padding:2rem">
            <p style="color:rgba(255,255,255,0.9);font-size:1rem;line-height:1.7">The one and only film festival in the universe that opens a new era</p>
            <p style="color:var(--text-dim);font-size:0.8rem;margin-top:0.5rem">새로운 시대를 여는 세상에서 단 하나뿐인 영화제</p>
        </div>
        <div class="s-card" style="background:rgba(201,168,76,0.08);border-color:rgba(201,168,76,0.3);padding:2rem">
            <p style="color:rgba(255,255,255,0.9);font-size:1rem;line-height:1.7">Incheon will now become the gateway to a new era, breaking down old boundaries.</p>
            <p style="color:var(--text-dim);font-size:0.8rem;margin-top:0.5rem">인천은 이제 낡은 경계를 허물고 새로운 시대의 관문이 됩니다.</p>
        </div>
    </div>
</div>

<div class="slide">
    <div class="print-inner">
    <div class="slide-part">PART 1 • INTRODUCTION</div>
    <div class="slide-title" style="font-size:clamp(1.8rem,3.5vw,2.8rem)">2. Festival Overview</div>"""
if marker in html:
    html = html.replace(marker, new_slide6, 1)
    changes_made.append("B: Added English 4-point slide (PPTX Slide 6)")

# ===== C. English subtitles =====
subtitles = [
    # (existing text to find, subtitle to add before/after)
    ("2. Festival Overview</div>", 
     '2. Festival Overview</div>\n    <div class="slide-subtitle" style="font-size:0.75rem;color:var(--accent);letter-spacing:1px;font-weight:400;text-transform:uppercase">00. complex platform — music, technology, and K-culture.</div>'),
    
    # Core Diffs - These are inside subsection h3 tags, add as subtitle
]

for old_text, new_text in subtitles:
    count = html.count(old_text)
    if count > 0:
        html = html.replace(old_text, new_text, 1)
        changes_made.append(f"C: Added subtitle near '{old_text[:40]}'")

# Add numbered English labels to Core Differentiation cards
core_diff_labels = [
    ('인천 × 헐리우드', '01. INCHEON × HOLLYWOOD', '인천 × 헐리우드'),
    ('이중 구조', '02. DUAL STRUCTURE', '이중 구조'),
    ('참여형 페스티벌', '03. PARTICIPATORY FESTIVAL', '참여형 페스티벌'),
    ('상시 영화제', '04. BEYOND THE FESTIVAL', '상시 영화제'),
]

# Add english subtitles to specific content slides
slide_subtitles = {
    '3. 참여 메리트': 'Together Platform',
    '4. 인천의 중요성': 'The center of K - content',
    '5. 인스파이어 리조트': 'Amazing Inspire Resort',
    '6. K-Culture Convergence': 'Attractive K-pop, K-food, and K-beauty',
    '7. 모바일 영화제': 'Mobile Short Film Competition + Camping Festival Viral Engine',
    '8. 365일 영화제': '365 days a year, offline and online',
    '9. IIFF 파트너 네트워크': 'networking - IIFF Partner Circle',
    '10. 장기 비전': 'long-term partnership & IIFF Lab / IIFF Campus',
}

for title_kr, subtitle_en in slide_subtitles.items():
    pattern = f'>{title_kr}</div>'
    replacement = f'>{title_kr}</div>\n    <div class="slide-subtitle" style="font-size:0.75rem;color:var(--accent);letter-spacing:1px;font-weight:400;text-transform:uppercase">{subtitle_en}</div>'
    if pattern in html:
        html = html.replace(pattern, replacement, 1)
        changes_made.append(f"C: Added '{subtitle_en}' subtitle")

# ===== D. Part section divider labels =====
# Part 2: ORGANIZATION → PROGRAMS
old_part2 = """<div class="slide slide-section">
    <div class="part-num">PART 2</div>
    <div class="slide-part">ORGANIZATION</div>
    <div class="part-title">조직 · Organization</div>"""
new_part2 = """<div class="slide slide-section">
    <div class="part-num">PART 2</div>
    <div class="slide-part">PROGRAMS</div>
    <div class="part-title">프로그램 · programs</div>"""
if old_part2 in html:
    html = html.replace(old_part2, new_part2, 1)
    changes_made.append("D1: Part 2 ORGANIZATION → PROGRAMS")

# Part 3: 전략 → 실행전략
old_part3 = """<div class="slide slide-section">
    <div class="part-num">PART 3</div>
    <div class="slide-part">STRATEGY</div>
    <div class="part-title">전략 · Strategy</div>"""
new_part3 = """<div class="slide slide-section">
    <div class="part-num">PART 3</div>
    <div class="slide-part">STRATEGY</div>
    <div class="part-title">실행전략 · strategy</div>"""
if old_part3 in html:
    html = html.replace(old_part3, new_part3, 1)
    changes_made.append("D2: Part 3 전략 → 실행전략")

# ===== E. Core Strategy table text fixes =====
# 비전 → 비젼
html = html.replace('영화제 비전', '영화제 비젼')
changes_made.append("E1: 영화제 비전 → 영화제 비젼")

# 구현 전략 → 실현 전략
html = html.replace('구체적 구현 전략', '구체적 실현 전략')
# Also check for "구현 전략" without 구체적
old_header = 'data-en="Specific Implementation Strategy">구체적 구현 전략'
new_header = 'data-en="Specific Implementation Strategy">구체적 실현 전략'
if old_header in html:
    html = html.replace(old_header, new_header)

changes_made.append("E2: 구체적 구현 전략 → 구체적 실현 전략")

# ===== F. Personnel subtitle =====
old_personnel = '>2. Personnel</div>'
new_personnel = """>2. Personnel</div>
    <div class="slide-subtitle" style="font-size:0.8rem;color:var(--text-dim)">BIFF 노하우를 가진 '영화계 원로'를 전면에, '실무 전문가'가 허리가 되어 현장을 뛰는 구조</div>"""
html = html.replace(old_personnel, new_personnel)
changes_made.append("F: Added Personnel subtitle (BIFF 노하우...)")

# ===== G. A-to-Z Roadmap subtitle =====
old_atoz = '>4. A-to-Z Roadmap</div>'
new_atoz = """>4. A-to-Z Roadmap</div>
    <div class="slide-subtitle" style="font-size:0.8rem;color:var(--text-dim)">전체 예산 30억 원 기준, 단계별 자금의 고려한 동시 사업 계획</div>"""
# Only replace first occurrence (the first A-to-Z Roadmap slide)
if old_atoz in html:
    html = html.replace(old_atoz, new_atoz, 1)
    changes_made.append("G: Added A-to-Z Roadmap subtitle")

# ===== Write result =====
with open(r'C:\WORK\IIFF\presentation_full.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Total changes: {len(changes_made)}")
for c in changes_made:
    print(f"  ✅ {c}")
