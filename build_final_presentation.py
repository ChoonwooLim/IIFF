import re
import os
import random

def generate_css():
    return """
        :root {
            /* Ultra Premium Agency Theme */
            --bg-base: #030305;
            --bg-elevated: #0a0a10;
            
            --glass-bg: rgba(22, 22, 32, 0.4);
            --glass-border: rgba(255, 255, 255, 0.05);
            
            --text-main: #ffffff;
            --text-dim: #8a8d91;
            
            --accent-gold: #D4AF37;
            --accent-gold-light: #F9E596;
            --accent-gradient: linear-gradient(135deg, white 0%, var(--accent-gold) 100%);
            
            --font-display: 'Playfair Display', serif;
            --font-body: 'Inter', sans-serif;
            
            --shadow-card: 0 30px 60px rgba(0, 0, 0, 0.6);
            --shadow-glow: 0 0 50px rgba(212, 175, 55, 0.1);
            
            --radius-xl: 32px;
            --radius-lg: 20px;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body, html {
            width: 100vw; height: 100vh;
            background: var(--bg-base);
            color: var(--text-main);
            font-family: var(--font-body);
            overflow: hidden;
            font-size: 16px;
        }

        /* Noise Texture Overlay */
        .noise-bg {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
            pointer-events: none; z-index: 99; mix-blend-mode: overlay;
        }

        .slides-wrapper { width: 100%; height: 100%; position: relative; }

        .slide {
            position: absolute; top:0; left:0; width:100%; height:100%;
            display: none; flex-direction: column;
            padding: 8vh 6vw 10vh 6vw;
            opacity: 0; transition: opacity 0.8s cubic-bezier(0.8, 0, 0.2, 1);
            overflow-y: auto;
            background: radial-gradient(circle at top right, #11111a 0%, var(--bg-base) 100%);
        }
        
        .slide::-webkit-scrollbar { width: 4px; }
        .slide::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); }

        .slide.active { display: flex; opacity: 1; z-index: 10; animation: fadeUp 0.8s ease backwards; }
        
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Abstract Premium Geometric Shapes */
        .shape { position: absolute; pointer-events: none; z-index: 0; opacity: 0.8; }
        .shape-ring {
            width: 60vw; height: 60vw; border: 1px solid rgba(212, 175, 55, 0.05);
            border-radius: 50%; top: -20%; right: -20%;
        }
        .shape-glow {
            width: 50vw; height: 50vw; right: -10vw; bottom: -10vw;
            background: radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%);
        }
        .shape-lines {
            width: 100%; height: 100%; top: 0; left: 0;
            background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
            background-size: 100px 100px; opacity: 0.3;
        }

        .content-layer {
            position: relative; z-index: 10;
            display: flex; flex-direction: column;
            height: 100%; width: 100%;
            max-width: 1600px; margin: 0 auto;
        }

        /* Header Elements */
        .slide-header { display: flex; flex-direction: column; margin-bottom: 5vh; gap: 1rem; }
        
        .slide-label {
            font-size: 0.75rem; font-weight: 500;
            letter-spacing: 5px; text-transform: uppercase;
            color: var(--accent-gold); 
            display: flex; align-items: center; gap: 1.5rem;
        }
        .slide-label::before { content:''; width: 30px; height: 1px; background: var(--accent-gold); }

        .slide-title {
            font-family: var(--font-display);
            font-size: clamp(3rem, 5vw, 5rem);
            font-weight: 400; line-height: 1.1;
            color: #fff;
        }

        /* Content Areas */
        .content-body { flex: 1; display: flex; align-items: center; justify-content: center; width: 100%; }

        /* Premium Agency Cards */
        .card {
            background: var(--glass-bg);
            backdrop-filter: blur(16px);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg);
            padding: 2.5rem;
            box-shadow: var(--shadow-card);
            transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
            position: relative;
            display: flex; flex-direction: column; gap: 1rem;
        }
        
        .card::before {
            content: ''; position: absolute; inset: 0;
            border-radius: inherit; padding: 1px;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            pointer-events: none;
        }
        
        .card:hover { transform: translateY(-8px); background: rgba(30, 30, 45, 0.6); }

        .card-number {
            font-family: var(--font-display); font-size: 2.5rem;
            color: rgba(212, 175, 55, 0.2); position: absolute; top: 1.5rem; right: 2rem;
        }

        .card h3 {
            font-family: var(--font-display); font-size: 1.6rem;
            color: var(--accent-gold-light); font-weight: 400;
            line-height: 1.3;
        }

        .card p { color: var(--text-dim); font-size: 1rem; line-height: 1.6; }

        /* Modern Grid System */
        .layout-1 { width:100%; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
        .layout-2 { width:100%; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
        .layout-3 { width:100%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; align-items: stretch; }
        .layout-4 { width:100%; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        
        /* Typography Variations */
        .big-quote {
            font-family: var(--font-display); font-size: clamp(2rem, 3.5vw, 3.5rem);
            font-style: italic; color: #fff; line-height: 1.3; text-align: center;
            max-width: 1100px; margin: 0 auto;
        }
        .big-quote .author { display:block; font-size: 1rem; font-style: normal; font-family: var(--font-body); color: var(--accent-gold); margin-top: 2rem; letter-spacing: 2px; }

        /* Elegant Table structure */
        .data-table-container { width: 100%; overflow-x: auto; }
        .data-table { width: 100%; border-collapse: separate; border-spacing: 0; }
        .data-table th { text-align: left; padding: 1.5rem; font-family: var(--font-body); font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase; color: var(--text-dim); border-bottom: 1px solid rgba(255,255,255,0.1); }
        .data-table td { padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.03); color: #fff; vertical-align: middle; font-size: 1.05rem; }
        .data-table tr { transition: background 0.3s; }
        .data-table tr:hover { background: rgba(255,255,255,0.02); }
        .data-table tr td:first-child { font-weight: 500; color: var(--accent-gold-light); }

        /* Visual Imagery Block Placeholder */
        .media-block {
            width: 100%; height: 100%; min-height: 400px; border-radius: var(--radius-lg);
            background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
            display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;
        }
        
        /* Graph / Charts */
        .bar-chart { display: flex; align-items: flex-end; gap: 1rem; height: 300px; padding: 2rem 0; width: 100%; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .bar { flex: 1; background: linear-gradient(180deg, var(--accent-gold) 0%, rgba(212,175,55,0) 100%); border-radius: 8px 8px 0 0; position: relative; transition: height 1s ease; opacity: 0.8; }
        .bar:hover { opacity: 1; filter: brightness(1.2); }
        .bar span { position: absolute; top: -30px; left: 50%; transform: translateX(-50%); font-size: 0.85rem; color: var(--accent-gold-light); font-family: var(--font-body); }
        
        /* Cover Details */
        .cover-master { justify-content: center; align-items: center; text-align: center; }
        .cover-title {
            font-family: var(--font-display); font-size: clamp(5rem, 10vw, 9rem);
            font-weight: 400; line-height: 1; margin: 3rem 0;
            background: linear-gradient(to bottom, #ffffff 0%, #cccccc 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .cover-subtitle { font-size: 1rem; letter-spacing: 12px; color: var(--accent-gold); text-transform: uppercase; }
        .cover-date { font-size: 0.9rem; color: var(--text-dim); margin-top: 4rem; letter-spacing: 4px; }

        /* UI Controls */
        .controls-layer {
            position: fixed; bottom: 2rem; right: 2rem; z-index: 100;
            display: flex; align-items: center; gap: 1rem;
            background: rgba(0,0,0,0.5); backdrop-filter: blur(10px);
            padding: 0.5rem 1rem; border-radius: 30px; border: 1px solid rgba(255,255,255,0.05);
        }
        .btn-icon {
            width: 36px; height: 36px; border-radius: 50%; border: none;
            background: rgba(255,255,255,0.05); color: #fff;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: 0.3s;
        }
        .btn-icon:hover { background: var(--accent-gold); color: #000; }
        .counter { font-size: 0.85rem; font-weight: 500; font-family: var(--font-body); color: var(--text-dim); width: 60px; text-align: center; }
        
        .progress-bar { position: fixed; bottom: 0; left: 0; height: 3px; background: rgba(255,255,255,0.05); width: 100%; z-index: 90; }
        .progress-fill { height: 100%; background: var(--accent-gold); width: 0%; transition: width 0.3s ease; }
        
        #esc-hint { position: fixed; top: 2rem; right: 2rem; font-size: 0.75rem; letter-spacing: 2px; color: rgba(255,255,255,0.3); z-index: 100; pointer-events:none; }
        
    """

def get_beautiful_svg():
    # Premium generative structural shapes for media blocks
    svgs = [
        '''<svg viewBox="0 0 400 300" width="100%" height="100%"><defs><linearGradient id="pG" x1="0%" y1="0%" x2="100%" y2="100%"><stop stop-color="#D4AF37"/><stop stop-color="transparent" offset="100%"/></linearGradient></defs><circle cx="200" cy="150" r="100" fill="none" stroke="url(#pG)" stroke-width="1"/><circle cx="200" cy="150" r="140" fill="none" stroke="url(#pG)" stroke-width="0.5" stroke-dasharray="4 4"/><line x1="0" y1="150" x2="400" y2="150" stroke="url(#pG)" stroke-width="0.5" opacity="0.3"/></svg>''',
        '''<svg viewBox="0 0 400 300" width="100%" height="100%"><g stroke="#D4AF37" stroke-width="0.5" fill="none" opacity="0.4"><rect x="100" y="50" width="200" height="200" transform="rotate(45 200 150)"/><rect x="120" y="70" width="160" height="160" transform="rotate(45 200 150)"/><rect x="140" y="90" width="120" height="120" transform="rotate(45 200 150)"/></g></svg>''',
        '''<svg viewBox="0 0 400 300" width="100%" height="100%"><path d="M 0 300 Q 200 100 400 300" fill="none" stroke="#D4AF37" stroke-width="2" opacity="0.3"/><path d="M 0 300 Q 200 150 400 300" fill="none" stroke="#D4AF37" stroke-width="1" opacity="0.2"/><circle cx="200" cy="100" r="40" fill="rgba(212,175,55,0.1)" stroke="#D4AF37" stroke-width="0.5"/></svg>'''
    ]
    return random.choice(svgs)

def parse_source():
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
                parts = line.split(': ', 1)
                if len(parts) > 1:
                    raw_text = parts[1]
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
    return slides

def render_chart():
    # Renders a random premium bar chart simulating data
    bars = ""
    for _ in range(5):
        h = random.randint(30, 95)
        bars += f'<div class="bar" style="height:{h}%"><span>{h}%</span></div>'
    return f'<div class="bar-chart">{bars}</div>'

def build_html():
    slides_data = parse_source()
    html_slides = []
    
    for idx, s in enumerate(slides_data):
        title_text = ''
        content_shapes = []
        for shape in s['shapes']:
            is_title = '제목' in shape['name'] and '부제목' not in shape['name']
            if is_title and shape['texts']:
                title_text = shape['texts'][0]
            else:
                content_shapes.append(shape)
                
        has_table = any(sh['table'] is not None for sh in content_shapes)
        content_texts = [para for sh in content_shapes for para in sh['texts']]
        
        # Determine background shape class randomly for variety
        bg_shape_class = random.choice(['shape-ring', 'shape-glow', 'shape-lines'])
        
        slide_html = f'''
        <div class="slide">
            <div class="shape {bg_shape_class}"></div>
            <div class="content-layer">
        '''
        
        if s['layout'] == '제목 슬라이드' or idx == 0:
            # Full Cover
            subtitle = ' '.join(content_texts[:3]) if content_texts else 'PREMIUM PRESENTATION'
            slide_html += f'''
                <div class="content-body cover-master">
                    <div style="display:flex; flex-direction:column; align-items:center;">
                        <div class="cover-subtitle">Incheon International Film Festival</div>
                        <div class="cover-title">{title_text if title_text else "NEXT WAVE"}</div>
                        <div style="color:var(--text-dim); font-size:1.1rem; max-width:600px; line-height:1.6;">{subtitle}</div>
                        <div class="cover-date">2026. 02</div>
                    </div>
                </div>
            '''
        else:
            # Inner slide Header
            slide_html += f'''
                <div class="slide-header">
                    <div class="slide-label">{s['layout']}</div>
                    <h2 class="slide-title">{title_text if title_text else "Details"}</h2>
                </div>
                <div class="content-body">
            '''
            
            # --- Layout Engine ---
            
            # 1. TABLE Layout
            if has_table:
                slide_html += '<div class="layout-1">'
                for shape in content_shapes:
                    if shape['table']:
                        slide_html += '<div class="data-table-container"><table class="data-table">'
                        for i, row in enumerate(shape['table']):
                            if i == 0:
                                slide_html += '<thead><tr>'
                                for col in row: slide_html += f'<th>{col}</th>'
                                slide_html += '</tr></thead><tbody>'
                            else:
                                slide_html += '<tr>'
                                for col in row: slide_html += f'<td>{col}</td>'
                                slide_html += '</tr>'
                        slide_html += '</tbody></table></div>'
                    elif shape['texts']:
                        txt = " ".join(shape['texts'])
                        slide_html += f'<div class="card"><p>{txt}</p></div>'
                slide_html += '</div>'
                
            # 2. Quote Layout (Very little text, not a table)
            elif len(content_texts) == 1 and len(content_texts[0]) > 20 and len(content_shapes) == 1:
                slide_html += f'''
                    <div class="big-quote">
                        “{content_texts[0]}”
                        <span class="author">IIFF 2026 CORE VISION</span>
                    </div>
                '''

            # 3. Two Column Split (Text + Visual/Chart)
            elif len(content_shapes) <= 2 and len(content_texts) <= 5:
                slide_html += '<div class="layout-2">'
                # Left side text
                slide_html += '<div style="display:flex; flex-direction:column; gap:2rem;">'
                for shape in content_shapes:
                    if shape['texts']:
                        slide_html += '<div class="card">'
                        for p_idx, para in enumerate(shape['texts']):
                            if p_idx == 0 and len(shape['texts']) > 1:
                                slide_html += f'<h3>{para}</h3>'
                            else:
                                slide_html += f'<p>{para}</p>'
                        slide_html += '</div>'
                slide_html += '</div>'
                
                # Right side visual (Chart if finance context, else SVG)
                is_data_slide = any(w in " ".join(content_texts).lower() for w in ['예산', '비율', '통계', '규모', '금액'])
                slide_html += '<div class="media-block">'
                if is_data_slide:
                    slide_html += render_chart()
                else:
                    slide_html += get_beautiful_svg()
                slide_html += '</div></div>'

            # 4. Multi-Card Grid for everything else
            else:
                layout_class = "layout-4"
                if len(content_shapes) == 3: layout_class = "layout-3"
                if len(content_shapes) == 2: layout_class = "layout-2"

                slide_html += f'<div class="{layout_class}">'
                for c_idx, shape in enumerate(content_shapes):
                    if shape['texts']:
                        slide_html += '<div class="card">'
                        slide_html += f'<div class="card-number">0{c_idx+1}</div>'
                        for p_idx, para in enumerate(shape['texts']):
                            if p_idx == 0 and len(shape['texts']) > 1:
                                slide_html += f'<h3>{para}</h3>'
                            else:
                                slide_html += f'<p>{para}</p>'
                        slide_html += '</div>'
                slide_html += '</div>'
            
            slide_html += '</div>' # close content-body
        
        slide_html += '</div></div>' # close content-layer and slide
        html_slides.append(slide_html)
        
    return html_slides

def main():
    css = generate_css()
    slides_html = build_html()
    
    doc = f'''<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IIFF NextWave — Premium Final Presentation</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>{css}</style>
</head>
<body>
    <div class="noise-bg"></div>
    <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
    <div id="esc-hint">Press ⛶ or F11 for Fullscreen</div>

    <div class="slides-wrapper">
{''.join(slides_html)}
    </div>

    <!-- UI Controls -->
    <div class="controls-layer">
        <button class="btn-icon" onclick="prevSlide()" title="이전">←</button>
        <div class="counter" id="counter">1 / {len(slides_html)}</div>
        <button class="btn-icon" onclick="nextSlide()" title="다음">→</button>
        <button class="btn-icon" onclick="toggleFullscreen()" style="margin-left:10px" title="전체화면">⛶</button>
    </div>

    <script>
        const slides = document.querySelectorAll('.slide');
        const total = slides.length;
        let current = 0;

        function showSlide(n) {{
            if (n < 0 || n >= total) return;
            slides.forEach((s) => s.classList.remove('active'));
            slides[n].classList.add('active');
            current = n;
            
            document.getElementById('counter').textContent = `${{n + 1}} / ${{total}}`;
            document.getElementById('progressFill').style.width = `${{((n + 1) / total) * 100}}%`;
        }}

        function nextSlide() {{ showSlide(current + 1); }}
        function prevSlide() {{ showSlide(current - 1); }}

        document.addEventListener('keydown', (e) => {{
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {{
                e.preventDefault(); nextSlide();
            }}
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {{
                e.preventDefault(); prevSlide();
            }}
            if (e.key === 'Home') {{ e.preventDefault(); showSlide(0); }}
            if (e.key === 'End') {{ e.preventDefault(); showSlide(total - 1); }}
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
        f.write(doc)
    print("Generation complete! Check presentation_Final.html")

if __name__ == '__main__':
    main()
