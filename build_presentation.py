#!/usr/bin/env python3
"""Build presentation_full.html from index.html content + presentation.html design."""

import re
from html.parser import HTMLParser

# Read source files
with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()
with open('presentation.html', 'r', encoding='utf-8') as f:
    pres_html = f.read()

# Extract CSS from presentation.html (lines between <style> and </style>)
css_match = re.search(r'<style>(.*?)</style>', pres_html, re.DOTALL)
pres_css = css_match.group(1) if css_match else ''

# Add extra CSS for scrollable content slides
extra_css = """
/* FIX: Override base .slide to allow scrolling and clear nav bar */
.slide {
    overflow-y: auto !important;
    justify-content: flex-start !important;
    padding-top: 4vh;
    padding-bottom: 70px; /* clear nav bar */
}
.slide::-webkit-scrollbar { width: 4px; }
.slide::-webkit-scrollbar-thumb { background: var(--accent-light); border-radius: 2px; }

/* Keep cover/section/end slides centered */
.slide-cover, .slide-section, .slide-end {
    justify-content: center !important;
    overflow: hidden !important;
    padding-bottom: 6vh;
}

/* SECTION HEADER SLIDE */
.slide-section {
    align-items: center;
    text-align: center;
    justify-content: center;
    background: linear-gradient(135deg, #faf8f5 0%, #f0ebe0 50%, #faf8f5 100%);
}
.slide-section .part-num {
    font-family: 'Playfair Display', serif;
    font-size: clamp(5rem, 10vw, 9rem);
    background: linear-gradient(135deg, var(--accent) 30%, var(--accent-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
    opacity: 0.3;
    position: relative;
    z-index: 1;
}
.slide-section .part-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 4vw, 3.5rem);
    color: var(--text);
    font-weight: 700;
    margin-top: -2vh;
    position: relative;
    z-index: 1;
}

/* ORG CHART */
.org-row { display: flex; justify-content: center; gap: 1vw; flex-wrap: wrap; position: relative; z-index:1; }
.org-box { background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 1.5vh 1.5vw; text-align: center; box-shadow: var(--shadow); min-width: 120px; }
.org-box.primary { border-color: rgba(201,168,76,0.4); background: var(--accent-bg); }
.org-box h5 { color: var(--accent); font-size: 0.8rem; margin-bottom: 0.3vh; }
.org-box p { color: var(--text-dim); font-size: 0.7rem; }
.org-connector { width: 2px; height: 2vh; background: var(--accent-light); margin: 0 auto; }

/* BADGE */
.badge { display: inline-block; padding: 0.2em 0.8em; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
.badge-gold { background: rgba(201,168,76,0.15); color: var(--accent); }
.badge-red { background: rgba(220,80,80,0.12); color: #c0392b; }
.badge-blue { background: rgba(80,130,220,0.12); color: #2980b9; }

/* FOUR COL */
.four-col { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5vw; margin-top: 2vh; position: relative; z-index:1; }

/* SPLIT */
.split-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 3vw; margin-top: 2vh; position: relative; z-index:1; }
"""

# Now extract all content sections from index.html
# We'll parse section by section and convert to slides

# Helper to extract inner HTML of section-content divs
def extract_sections(html):
    """Extract major sections from index.html."""
    # Find all <section> tags and their content
    sections = []
    pattern = r'<section\s+id="([^"]*)"[^>]*>(.*?)</section>'
    for m in re.finditer(pattern, html, re.DOTALL):
        sid = m.group(1)
        content = m.group(2)
        sections.append((sid, content))
    return sections

sections = extract_sections(index_html)

# Build slides
slides = []

# SLIDE 1: Cover
slides.append('''
<div class="slide slide-cover active">
    <svg class="cover-deco cover-deco-left" viewBox="0 0 80 600" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="600" fill="#1a1a2e" rx="4"/>
        <rect x="5" y="10" width="20" height="14" rx="2" fill="#fff"/>
        <rect x="5" y="34" width="20" height="14" rx="2" fill="#fff"/>
        <rect x="5" y="58" width="20" height="14" rx="2" fill="#fff"/>
        <rect x="5" y="82" width="20" height="14" rx="2" fill="#fff"/>
        <rect x="55" y="10" width="20" height="14" rx="2" fill="#fff"/>
        <rect x="55" y="34" width="20" height="14" rx="2" fill="#fff"/>
        <rect x="55" y="58" width="20" height="14" rx="2" fill="#fff"/>
        <rect x="55" y="82" width="20" height="14" rx="2" fill="#fff"/>
    </svg>
    <svg class="cover-deco cover-deco-right" viewBox="0 0 80 600" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="600" fill="#1a1a2e" rx="4"/>
        <rect x="5" y="10" width="20" height="14" rx="2" fill="#fff"/>
        <rect x="5" y="34" width="20" height="14" rx="2" fill="#fff"/>
        <rect x="5" y="58" width="20" height="14" rx="2" fill="#fff"/>
        <rect x="5" y="82" width="20" height="14" rx="2" fill="#fff"/>
        <rect x="55" y="10" width="20" height="14" rx="2" fill="#fff"/>
        <rect x="55" y="34" width="20" height="14" rx="2" fill="#fff"/>
        <rect x="55" y="58" width="20" height="14" rx="2" fill="#fff"/>
        <rect x="55" y="82" width="20" height="14" rx="2" fill="#fff"/>
    </svg>
    <div class="cover-sub">Incheon International Film Festival</div>
    <h1>NEXT WAVE</h1>
    <div class="cover-tag">아시아와 헐리우드, 그리고 미래 영화계의 새로운 물결<br>인천 국제 넥스트웨이브 영화제 통합 기획서</div>
    <div class="cover-ver">IIFF NextWave — Integrated Proposal v5</div>
</div>
''')

def make_section_divider(part_num, part_label, part_title):
    return f'''
<div class="slide slide-section">
    <div class="part-num">{part_num}</div>
    <div class="slide-part">{part_label}</div>
    <div class="part-title">{part_title}</div>
    <div class="watermark">IIFF NEXT WAVE</div>
</div>
'''

def make_content_slide(part_label, title, content, warm=False, scroll=False):
    cls = "slide"
    if warm:
        cls += " slide-warm"
    return f'''
<div class="{cls}">
    <div class="slide-part">{part_label}</div>
    <div class="slide-title" style="font-size:clamp(1.8rem,3.5vw,2.8rem)">{title}</div>
    {content}
    <div class="watermark">IIFF NEXT WAVE</div>
</div>
'''

# Helper: convert index.html table to s-table
def convert_table(html_table):
    """Convert an index.html table to presentation s-table format."""
    # Replace <table> with <table class="s-table">
    result = html_table.replace('<table>', '<table class="s-table">')
    return f'<div style="overflow-x:auto;position:relative;z-index:1">{result}</div>'

# Now process each section from index.html
# We need to extract the inner content and convert it to slides

def extract_inner_content(section_html):
    """Extract the content inside section-content div, removing section-label/title/desc."""
    # Remove the section-content wrapper
    content = section_html
    # Remove section-label
    content = re.sub(r'<div class="section-label">[^<]*</div>\s*', '', content)
    # Remove section-title
    content = re.sub(r'<div class="section-title">[^<]*</div>\s*', '', content)
    return content

def get_title(section_html):
    m = re.search(r'<div class="section-title">([^<]*)</div>', section_html)
    return m.group(1).strip() if m else ''

def get_label(section_html):
    m = re.search(r'<div class="section-label">([^<]*)</div>', section_html)
    return m.group(1).strip() if m else ''

def get_desc(section_html):
    m = re.search(r'<div class="section-desc"[^>]*>(.*?)</div>', section_html, re.DOTALL)
    return m.group(1).strip() if m else ''

# Process each section and create appropriate slides
for sid, content in sections:
    if sid == 'cover':
        continue  # Already handled
    
    label = get_label(content)
    title = get_title(content)
    desc = get_desc(content)
    
    # Check if this is the start of a new PART
    part_map = {
        'what-is-iiff': ('PART 1', 'INTRODUCTION', '소개 · Introduction'),
        'organization': ('PART 2', 'ORGANIZATION', '조직 · Organization'),
        'roadmap': ('PART 3', 'STRATEGY', '전략 · Strategy'),
        'budget': ('PART 4', 'FINANCE', '재무 · Finance'),
        'political': ('PART 5', 'GOVERNANCE', '거버넌스 · Governance'),
    }
    
    if sid in part_map:
        pn, pl, pt = part_map[sid]
        slides.append(make_section_divider(pn, pl, pt))
    
    # Extract all subsections
    subsections = re.findall(r'<div class="subsection">(.*?)</div>\s*(?=<div class="subsection">|$)', content, re.DOTALL)
    
    # Extract tables
    tables = re.findall(r'<div class="table-wrap">(.*?)</div>\s*</div>', content, re.DOTALL)
    
    # Extract highlight boxes
    highlights = re.findall(r'<div class="highlight-box[^"]*">(.*?)</div>', content, re.DOTALL)
    
    # Extract card grids
    card_grids = re.findall(r'<div class="card-grid"[^>]*>(.*?)</div>\s*</div>\s*</div>\s*</div>', content, re.DOTALL)
    
    # For complex sections, we extract the section-content inner HTML and adapt it
    inner = content
    # Remove the outer section-content div wrapper
    inner = re.sub(r'^\s*<div class="section-content">\s*', '', inner)
    inner = re.sub(r'\s*</div>\s*$', '', inner)
    # Remove section metadata
    inner = re.sub(r'<div class="section-label">[^<]*</div>\s*', '', inner)
    inner = re.sub(r'<div class="section-title">[^<]*</div>\s*', '', inner)
    inner = re.sub(r'<div class="section-desc"[^>]*>.*?</div>\s*', '', inner, flags=re.DOTALL)
    
    # Convert table classes
    inner = inner.replace('<table>', '<table class="s-table">')
    # Wrap table-wrap in overflow container
    inner = re.sub(r'<div class="table-wrap">', '<div class="table-wrap" style="overflow-x:auto;position:relative;z-index:1">', inner)
    
    # Convert card classes for presentation
    inner = inner.replace('class="card-grid"', 'class="three-col"')
    inner = inner.replace('class="card"', 'class="s-card"')
    inner = re.sub(r'class="card-grid"\s+style="[^"]*"', 'class="three-col"', inner)
    
    # Convert highlight-box to s-highlight
    inner = inner.replace('class="highlight-box important"', 'class="s-highlight"')
    inner = inner.replace('class="highlight-box vision"', 'class="s-highlight"')
    inner = inner.replace('class="highlight-box"', 'class="s-highlight"')
    
    # Convert styled-list to s-list
    inner = inner.replace('class="styled-list"', 'class="s-list"')
    
    # Convert split layout
    inner = inner.replace('class="split"', 'class="split-2"')
    
    # Convert timeline
    inner = inner.replace('class="timeline-item"', 'class="s-phase"')
    inner = inner.replace('class="timeline"', 'class="s-timeline" style="flex-direction:column"')
    
    # Add z-index to remaining elements
    inner = re.sub(r'class="subsection"', 'class="subsection" style="position:relative;z-index:1"', inner)
    
    # Add subtitle if desc exists
    subtitle = f'<div class="slide-subtitle">{desc}</div>' if desc else ''
    
    # Check content size - if too large, split into multiple slides
    # Simple heuristic: count subsections
    subsection_matches = list(re.finditer(r'<div class="subsection"', inner))
    
    if len(subsection_matches) > 2:
        # Split into multiple slides by subsection
        # First slide: everything before first subsection + possibly first subsection
        parts_list = re.split(r'(?=<div class="subsection")', inner)
        parts_list = [p for p in parts_list if p.strip()]
        
        # Group subsections into slides (max 2 per slide)
        intro_part = ''
        sub_parts = []
        for p in parts_list:
            if '<div class="subsection"' in p:
                sub_parts.append(p)
            else:
                intro_part += p
        
        if intro_part.strip():
            slides.append(make_content_slide(label, title, subtitle + intro_part, warm=(sid in ['roadmap','biff','space','marketing','political'])))
        
        # Group remaining subsections
        for i in range(0, len(sub_parts), 2):
            group = ''.join(sub_parts[i:i+2])
            sub_title_match = re.search(r'<h3[^>]*>(.*?)</h3>', group)
            sub_title = sub_title_match.group(1) if sub_title_match else title
            slides.append(make_content_slide(label, title, group, warm=(sid in ['roadmap','biff','space','marketing','political'])))
    else:
        slides.append(make_content_slide(label, title, subtitle + inner, warm=(sid in ['roadmap','biff','space','marketing','political'])))

# FINAL SLIDE: Thank You
slides.append('''
<div class="slide slide-end slide-cover">
    <div class="cover-sub">IIFF NEXT WAVE 2026</div>
    <h1 style="font-size:clamp(3rem,7vw,6rem)">Thank You</h1>
    <div class="s-quote" style="border:none;text-align:center;max-width:70%;margin:3vh auto 0">
        "만약에, 이곳에서 내 이야기가 시작된다면?"
    </div>
    <div style="margin-top:5vh;color:var(--text-dim);font-size:0.9rem;position:relative;z-index:1">
        인천 국제 넥스트웨이브 영화제 통합 기획서 v5<br>
        <a href="index.html" style="color:var(--accent);text-decoration:none">← 전체 기획서 보기</a>
    </div>
</div>
''')

# Build final HTML
total_slides = len(slides)

html_output = f'''<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IIFF NextWave — Full Presentation</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
{pres_css}
{extra_css}
    </style>
</head>
<body>
    <div class="progress" id="progress"></div>
    <div class="slides-wrapper">
{''.join(slides)}
    </div>

    <!-- BOTTOM NAV -->
    <div class="nav-bar">
        <div class="brand">IIFF NEXT WAVE — FULL</div>
        <div class="controls">
            <button onclick="prevSlide()" title="이전">◀</button>
            <span class="counter" id="counter">1 / {total_slides}</span>
            <button onclick="nextSlide()" title="다음">▶</button>
        </div>
        <div class="tools">
            <button onclick="toggleFullscreen()" title="전체화면">⛶ 전체화면</button>
            <button onclick="window.print()" title="PDF 다운로드">📥 PDF</button>
            <button onclick="window.location.href='index.html'" title="기획서 보기">🏠 HOME</button>
        </div>
    </div>

    <script>
        const slides = document.querySelectorAll('.slide');
        const total = slides.length;
        let current = 0;

        function showSlide(n) {{
            slides.forEach((s, i) => {{
                s.classList.remove('active');
                if (i === n) s.classList.add('active');
            }});
            current = n;
            document.getElementById('counter').textContent = `${{n + 1}} / ${{total}}`;
            document.getElementById('progress').style.width = `${{((n + 1) / total) * 100}}%`;
        }}

        function nextSlide() {{ if (current < total - 1) showSlide(current + 1); }}
        function prevSlide() {{ if (current > 0) showSlide(current - 1); }}

        document.addEventListener('keydown', (e) => {{
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {{
                e.preventDefault(); nextSlide();
            }}
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {{
                e.preventDefault(); prevSlide();
            }}
            if (e.key === 'Home') {{ e.preventDefault(); showSlide(0); }}
            if (e.key === 'End') {{ e.preventDefault(); showSlide(total - 1); }}
        }});

        document.addEventListener('click', (e) => {{
            if (e.target.closest('.nav-bar') || e.target.closest('button') || e.target.closest('a')) return;
            if (e.clientX > window.innerWidth / 2) nextSlide();
            else prevSlide();
        }});

        let touchStartX = 0;
        document.addEventListener('touchstart', (e) => {{ touchStartX = e.changedTouches[0].screenX; }});
        document.addEventListener('touchend', (e) => {{
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {{ diff > 0 ? nextSlide() : prevSlide(); }}
        }});

        function toggleFullscreen() {{
            if (!document.fullscreenElement) {{
                document.documentElement.requestFullscreen().catch(e => console.log(e));
            }} else {{
                document.exitFullscreen().catch(e => console.log(e));
            }}
        }}

        showSlide(0);
    </script>
</body>
</html>'''

with open('presentation_full.html', 'w', encoding='utf-8') as f:
    f.write(html_output)

print(f"✅ presentation_full.html generated successfully!")
print(f"   Total slides: {total_slides}")
print(f"   File size: {len(html_output):,} bytes")
