import re
import os

with open(r'C:\WORK\IIFF\presentation_full.html', 'r', encoding='utf-8') as f:
    full_html = f.read()

# Extract CSS
css_match = re.search(r'<style>(.*?)</style>', full_html, re.DOTALL)
css = css_match.group(1) if css_match else ''

with open(r'C:\WORK\IIFF\Sorces\show_content.txt', 'r', encoding='utf-8') as f:
    text = f.read()

slides_raw = text.split('========== SLIDE ')
slides = []
for SR in slides_raw[1:]:
    lines = SR.split('\n')
    slide_num = lines[0].strip('=').strip()
    layout = ''
    shapes = []
    current_shape = None
    for line in lines[1:]:
        if line.startswith('  Layout:'):
            layout = line.replace('  Layout:', '').strip()
        elif line.startswith('  --- Shape:'):
            current_shape = {'name': line.strip(), 'texts': [], 'table': None}
            shapes.append(current_shape)
        elif line.startswith('      P'):
            # Text line
            parts = line.split(': ', 1)
            if len(parts) > 1:
                raw_text = parts[1]
                # Some are separated by '|' because of multiple chunks with styles
                chunks = raw_text.split(' | ')
                clean_text = ''
                for chunk in chunks:
                    clean_text += re.sub(r'\[.*?\]', '', chunk)
                if clean_text.strip() and current_shape is not None:
                    current_shape['texts'].append(clean_text.strip())
        elif line.startswith('      TABLE:'):
            if current_shape is not None:
                current_shape['table'] = []
        elif line.startswith('        R'):
            parts = line.split(': ', 1)
            if len(parts) > 1:
                row_raw = parts[1]
                cols = [c.strip() for c in row_raw.split('|')]
                if current_shape is not None and current_shape.get('table') is not None:
                    current_shape['table'].append(cols)
    slides.append({'num': slide_num, 'layout': layout, 'shapes': shapes})

html_slides = []

for s in slides:
    shape_htmls = []
    # Identify title vs content
    title_text = ''
    for shape in s['shapes']:
        is_title = '제목' in shape['name'] and '부제목' not in shape['name']
        if is_title and shape['texts']:
            title_text = shape['texts'][0]

    # Content shapes
    for shape in s['shapes']:
        is_title = '제목' in shape['name'] and '부제목' not in shape['name']
        if is_title:
            continue
        
        if shape['table']:
            t_html = '<div class="table-wrap"><table class="s-table">'
            for i, row in enumerate(shape['table']):
                if i == 0:
                    t_html += '<thead><tr>'
                    for col in row: t_html += f'<th>{col}</th>'
                    t_html += '</tr></thead><tbody>'
                else:
                    t_html += '<tr>'
                    for col in row: t_html += f'<td>{col}</td>'
                    t_html += '</tr>'
            t_html += '</tbody></table></div>'
            shape_htmls.append(t_html)
        elif shape['texts']:
            # Normal text block
            text_html = '<div class="s-card" style="margin-bottom:1rem;">'
            for idx, text_para in enumerate(shape['texts']):
                if idx == 0 and len(shape['texts']) > 1:
                    text_html += f'<h3 style="color:var(--accent)">{text_para}</h3>'
                else:
                    text_html += f'<p style="margin-bottom:0.5rem">{text_para}</p>'
            text_html += '</div>'
            shape_htmls.append(text_html)

    slide_html = f"""
<div class="slide slide-warm">
    <div class="print-inner">
    <div class="slide-part">IIFF 2026 NEXT WAVE</div>
    <div class="slide-title" style="font-size:clamp(1.8rem,3.5vw,2.8rem)">{title_text if title_text else 'IIFF'}</div>
    {''.join(shape_htmls)}
    <div class="watermark">IIFF NEXT WAVE</div>
    </div>
</div>
"""
    # Special layouts mapping
    if s['layout'] == '제목 슬라이드' or int(s['num']) == 1:
        # Cover slide
        slide_html = f"""
<div class="slide slide-cover">
    <div class="cover-sub">Incheon International Film Festival</div>
    <h1>{'<br>'.join([sh['texts'][0] for sh in s['shapes'] if sh['texts']]) if not title_text else title_text}</h1>
</div>
"""
    html_slides.append(slide_html)

html_output = f'''<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IIFF NextWave — Final Presentation</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
{css}
    </style>
</head>
<body>
    <div class="progress" id="progress"></div>
    <div class="slides-wrapper">
{''.join(html_slides)}
    </div>

    <!-- BOTTOM NAV -->
    <div class="nav-bar">
        <div class="brand">IIFF NEXT WAVE — FINAL</div>
        <div class="controls">
            <button onclick="prevSlide()" title="이전">◀</button>
            <span class="counter" id="counter">1 / {len(html_slides)}</span>
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

with open(r'c:\WORK\IIFF\presentation_Final.html', 'w', encoding='utf-8') as f:
    f.write(html_output)
