import re
import random

# ─────────────────────────────────────────────
#  PREMIUM WHITE THEME CSS
# ─────────────────────────────────────────────
def generate_css():
    return """
        :root {
            --bg:          #f8f7f4;
            --bg2:         #ffffff;
            --bg3:         #f0ece3;
            --gold:        #9a7b2f;
            --gold-light:  #c9a84c;
            --gold-soft:   rgba(201, 168, 76, 0.12);
            --text:        #1a1a2e;
            --text-mid:    #4a4a6a;
            --text-dim:    #8a8a9a;
            --accent:      #2c3e7a;
            --accent2:     #6b5b2e;
            --border:      rgba(180, 160, 110, 0.18);
            --shadow:      rgba(0,0,0,0.06);
            --font-h:      'Playfair Display', Georgia, serif;
            --font-b:      'Inter', 'Noto Sans KR', sans-serif;
        }

        * { margin:0; padding:0; box-sizing:border-box; }
        html, body { width:100vw; height:100vh; overflow:hidden;
            background:var(--bg); color:var(--text); font-family:var(--font-b); font-size:16px; }

        /* ─── SLIDE SHELL ─────────────────────── */
        .slide {
            position:absolute; inset:0;
            display:none; flex-direction:column;
            padding:5vh 5vw 10vh;
            background:var(--bg);
            animation:slideIn .5s ease both;
        }
        .slide.active { display:flex; }

        @keyframes slideIn {
            from { opacity:0; transform:translateY(14px); }
            to   { opacity:1; transform:translateY(0); }
        }

        /* ─── DECORATIVE BG SHAPES ─────────────── */
        .deco-ring {
            position:absolute; border-radius:50%; border:1px solid var(--border);
            pointer-events:none; z-index:0;
        }
        .deco-stripe {
            position:absolute; pointer-events:none; z-index:0; opacity:.25;
            background:repeating-linear-gradient(
                -45deg, var(--border) 0px, var(--border) 1px, transparent 1px, transparent 12px);
        }
        .deco-dot-grid {
            position:absolute; pointer-events:none; z-index:0; opacity:.3;
            background-image:radial-gradient(circle, var(--gold-light) 1px, transparent 1px);
            background-size:28px 28px;
        }
        .deco-line {
            position:absolute; pointer-events:none; z-index:0; height:1px;
            background:linear-gradient(90deg, transparent, var(--gold-light), transparent);
            opacity:.3;
        }

        /* ─── SLIDE HEADER ─────────────────────── */
        .slide-head { position:relative; z-index:10; margin-bottom:3.5vh; }

        .slide-label {
            display:inline-flex; align-items:center; gap:.7rem;
            font-size:.75rem; letter-spacing:4px; text-transform:uppercase;
            color:var(--gold); font-weight:600; margin-bottom:1rem;
        }
        .slide-label .dot { width:6px; height:6px; border-radius:50%; background:var(--gold); }

        .slide-title {
            font-family:var(--font-h); font-weight:700;
            font-size:clamp(2.2rem, 4vw, 3.8rem);
            color:var(--text); line-height:1.15;
        }
        .slide-title .accent-word { color:var(--gold-light); font-style:italic; }

        .slide-divider {
            margin-top:1.2rem; height:3px; width:60px;
            background:linear-gradient(90deg, var(--gold-light), transparent);
            border-radius:2px;
        }

        /* ─── BODY AREA ─────────────────────────── */
        .slide-body { position:relative; z-index:10; flex:1; display:flex;
            flex-direction:column; justify-content:center; gap:2rem; }

        /* ─── CARD COMPONENTS ───────────────────── */
        .card {
            background:var(--bg2); border-radius:20px;
            border:1px solid var(--border); padding:2rem 2.5rem;
            box-shadow:0 4px 24px var(--shadow);
            position:relative; overflow:hidden;
            transition:box-shadow .3s, transform .3s;
        }
        .card:hover { box-shadow:0 8px 40px rgba(0,0,0,.09); transform:translateY(-3px); }
        .card::before {
            content:''; position:absolute; top:0; left:0; width:4px; height:100%;
            background:linear-gradient(180deg, var(--gold-light), var(--gold));
        }
        .card h3 { font-family:var(--font-h); font-size:1.3rem; color:var(--accent);
            margin-bottom:.8rem; font-weight:600; }
        .card p { color:var(--text-mid); line-height:1.7; font-size:1rem; }

        .card-num {
            position:absolute; top:1.2rem; right:1.6rem;
            font-family:var(--font-h); font-size:3rem; font-weight:700;
            color:var(--gold-soft); line-height:1;
        }
        .tag { display:inline-block; padding:.25rem .8rem; border-radius:30px;
            font-size:.75rem; letter-spacing:2px; text-transform:uppercase;
            background:var(--gold-soft); color:var(--gold); font-weight:600; margin-bottom:.8rem; }

        /* ─── GRID LAYOUTS ──────────────────────── */
        .g1  { display:grid; grid-template-columns:1fr; gap:1.5rem; }
        .g2  { display:grid; grid-template-columns:1fr 1fr; gap:2rem; align-items:start; }
        .g3  { display:grid; grid-template-columns:repeat(3,1fr); gap:1.6rem; }
        .g4  { display:grid; grid-template-columns:repeat(4,1fr); gap:1.2rem; }
        .gl  { display:grid; grid-template-columns:3fr 2fr; gap:3rem; align-items:center; }
        .gr  { display:grid; grid-template-columns:2fr 3fr; gap:3rem; align-items:center; }

        /* ─── TEXT SIZE CLASSES ─────────────────── */
        .t-xl  { font-size:clamp(3.5rem,6vw,6rem); font-family:var(--font-h); font-weight:700;
                 color:var(--text); line-height:1.05; }
        .t-lg  { font-size:1.5rem; line-height:1.5; color:var(--text-mid); }
        .t-md  { font-size:1.1rem; line-height:1.7; color:var(--text-mid); }
        .t-sm  { font-size:.9rem; line-height:1.6; color:var(--text-dim); }
        .t-gold { color:var(--gold); }
        .t-serif { font-family:var(--font-h); font-style:italic; }

        /* ─── STAT / BIG NUMBER ─────────────────── */
        .stat-box { text-align:center; padding:2rem 1rem; }
        .stat-num { font-family:var(--font-h); font-size:4rem; font-weight:700;
            color:var(--gold-light); line-height:1; }
        .stat-label { font-size:.85rem; letter-spacing:2px; text-transform:uppercase;
            color:var(--text-dim); margin-top:.6rem; }

        /* ─── SVG VISUAL BLOCK ──────────────────── */
        .visual-panel {
            border-radius:20px; background:var(--bg3);
            border:1px solid var(--border);
            display:flex; align-items:center; justify-content:center;
            min-height:280px; overflow:hidden; position:relative;
        }
        .visual-panel svg { width:80%; height:80%; }

        /* ─── BAR CHART ─────────────────────────── */
        .chart-wrap { width:100%; }
        .chart-title { font-size:.8rem; letter-spacing:2px; text-transform:uppercase;
            color:var(--text-dim); margin-bottom:1.4rem; }
        .bar-row { display:flex; align-items:center; gap:1rem; margin-bottom:1rem; }
        .bar-row .lbl { font-size:.85rem; color:var(--text-mid); min-width:80px; text-align:right; }
        .bar-track { flex:1; height:10px; background:var(--bg3); border-radius:5px; overflow:hidden; }
        .bar-fill { height:100%; border-radius:5px;
            background:linear-gradient(90deg, var(--gold-light), var(--gold)); }
        .bar-val { font-size:.8rem; color:var(--gold); font-weight:600; min-width:40px; }

        /* Pie / Donut Chart (CSS only) */
        .donut-wrap { position:relative; width:200px; height:200px;
            border-radius:50%; margin:0 auto; }
        .donut-wrap svg { width:100%; height:100%; transform:rotate(-90deg); }
        .donut-center { position:absolute; inset:0; display:flex; flex-direction:column;
            align-items:center; justify-content:center; }
        .donut-center .num { font-family:var(--font-h); font-size:2rem; font-weight:700;
            color:var(--text); }
        .donut-center .lbl { font-size:.75rem; color:var(--text-dim); }

        /* Legend */
        .legend { display:flex; flex-wrap:wrap; gap:.8rem 1.5rem; margin-top:1.5rem; }
        .legend-item { display:flex; align-items:center; gap:.5rem; font-size:.85rem; color:var(--text-mid); }
        .legend-dot { width:10px; height:10px; border-radius:50%; }

        /* ─── TIMELINE ──────────────────────────── */
        .timeline { display:flex; flex-direction:column; gap:0; position:relative; padding-left:2.4rem; }
        .timeline::before { content:''; position:absolute; left:.75rem; top:0; bottom:0;
            width:2px; background:linear-gradient(180deg, var(--gold-light), transparent); }
        .tl-item { position:relative; padding-bottom:1.6rem; padding-left:1.2rem; }
        .tl-item::before { content:''; position:absolute; left:-1.65rem; top:.4rem;
            width:12px; height:12px; border-radius:50%; background:var(--gold-light);
            border:2px solid var(--bg2); box-shadow:0 0 0 3px var(--gold-soft); }
        .tl-item .tl-year { font-size:.75rem; letter-spacing:3px; color:var(--gold); text-transform:uppercase; }
        .tl-item .tl-title { font-family:var(--font-h); font-size:1.1rem; color:var(--text);
            margin:.2rem 0 .4rem; font-weight:600; }
        .tl-item .tl-desc { font-size:.9rem; color:var(--text-mid); line-height:1.6; }

        /* ─── QUOTE BLOCK ───────────────────────── */
        .quote-block { border-radius:20px; background:var(--bg3); padding:3rem 3.5rem;
            position:relative; border:1px solid var(--border); }
        .quote-block::before { content:'"'; font-family:var(--font-h); font-size:8rem;
            color:var(--border); position:absolute; top:-.5rem; left:1rem; line-height:1; }
        .quote-block .qt { font-family:var(--font-h); font-size:1.8rem; font-style:italic;
            color:var(--text); line-height:1.4; position:relative; z-index:1; }
        .quote-block .qt-src { margin-top:1.4rem; font-size:.85rem; letter-spacing:2px;
            text-transform:uppercase; color:var(--gold); }

        /* ─── TABLE ─────────────────────────────── */
        .tbl-wrap { width:100%; overflow-x:auto; border-radius:16px;
            border:1px solid var(--border); background:var(--bg2); }
        .tbl { width:100%; border-collapse:collapse; }
        .tbl th { padding:1.1rem 1.4rem; text-align:left; font-size:.8rem;
            letter-spacing:2px; text-transform:uppercase; color:var(--gold);
            border-bottom:2px solid var(--border); background:var(--bg3); font-weight:600; }
        .tbl td { padding:1rem 1.4rem; border-bottom:1px solid var(--border);
            color:var(--text-mid); font-size:.95rem; line-height:1.4; }
        .tbl tr:hover td { background:var(--gold-soft); }
        .tbl tr:last-child td { border-bottom:none; }

        /* ─── ICON ITEM LIST ────────────────────── */
        .icon-list { display:flex; flex-direction:column; gap:1.2rem; }
        .icon-item { display:flex; align-items:flex-start; gap:1.2rem; }
        .icon-box { width:42px; height:42px; border-radius:12px; flex-shrink:0;
            background:var(--gold-soft); border:1px solid var(--border);
            display:flex; align-items:center; justify-content:center;
            font-size:1.2rem; }
        .icon-item h4 { font-size:1rem; font-weight:600; color:var(--text); margin-bottom:.3rem; }
        .icon-item p { font-size:.9rem; color:var(--text-mid); line-height:1.6; }

        /* ─── PROGRESS METER ─────────────────────── */
        .progress-meter { display:flex; flex-direction:column; gap:1rem; }
        .pm-row { display:flex; align-items:center; gap:1.2rem; }
        .pm-lbl { font-size:.9rem; color:var(--text-mid); min-width:130px; }
        .pm-track { flex:1; height:8px; background:var(--bg3); border-radius:4px; overflow:hidden; }
        .pm-fill { height:100%; border-radius:4px;
            background:linear-gradient(90deg,var(--gold-light),var(--gold)); }
        .pm-num { font-size:.85rem; color:var(--gold); min-width:38px; text-align:right; }

        /* ─── COVER ─────────────────────────────── */
        .cover-shell { flex:1; display:flex; flex-direction:column;
            justify-content:center; align-items:flex-start; position:relative; z-index:10; }
        .cover-eyebrow { font-size:.8rem; letter-spacing:6px; text-transform:uppercase;
            color:var(--gold); margin-bottom:1.5rem; }
        .cover-h1 { font-family:var(--font-h); font-size:clamp(4rem,8vw,7.5rem);
            font-weight:700; color:var(--text); line-height:1.0; margin-bottom:2rem; }
        .cover-h1 em { color:var(--gold-light); font-style:italic; }
        .cover-sub { font-size:1.2rem; color:var(--text-mid); max-width:600px;
            line-height:1.6; margin-bottom:3rem; }
        .cover-meta { display:flex; gap:3rem; }
        .cover-meta-item label { display:block; font-size:.75rem; letter-spacing:3px;
            text-transform:uppercase; color:var(--text-dim); margin-bottom:.3rem; }
        .cover-meta-item span { font-size:1rem; color:var(--text); font-weight:500; }

        /* Cover right decoration */
        .cover-deco { position:absolute; right:5vw; top:50%; transform:translateY(-50%);
            width:36vw; height:36vw; z-index:0; }

        /* ─── NAV BAR ───────────────────────────── */
        .nav-bar {
            position:fixed; bottom:0; left:0; right:0; height:56px;
            background:rgba(248,247,244,0.92); backdrop-filter:blur(12px);
            border-top:1px solid var(--border);
            display:flex; align-items:center; justify-content:space-between;
            padding:0 4vw; z-index:100;
        }
        .nav-bar .brand { font-size:.7rem; letter-spacing:4px; color:var(--text-dim);
            text-transform:uppercase; font-weight:500; }
        .controls { display:flex; align-items:center; gap:1rem; }
        .controls button {
            width:36px; height:36px; border-radius:50%; border:1px solid var(--border);
            background:var(--bg2); color:var(--text); cursor:pointer; display:flex;
            align-items:center; justify-content:center; transition:.25s;
            font-size:.85rem;
        }
        .controls button:hover { background:var(--gold-light); color:#fff; border-color:var(--gold-light); }
        .counter { font-size:.85rem; font-weight:500; color:var(--text-mid); min-width:55px; text-align:center; }

        .tools { display:flex; gap:.5rem; }
        .btn-tool { padding:.4rem 1rem; border-radius:20px; border:1px solid var(--border);
            background:transparent; color:var(--text-mid); font-size:.78rem; cursor:pointer; transition:.2s; }
        .btn-tool:hover { background:var(--gold-soft); color:var(--gold); border-color:var(--gold-light); }

        /* ─── PROGRESS ──────────────────────────── */
        .prg { position:fixed; top:0; left:0; height:3px; z-index:101;
            background:linear-gradient(90deg,var(--gold-light),var(--gold));
            transition:width .4s ease; }
    """

ICONS = ["🎬","🌊","🎯","💡","🏆","📊","🌐","🎭","🤝","🎞️","📣","💰","🔑","🌏","⚡","🧭","🏟️","📅","🌟","🛡️"]

def sv_concentric(color1="#c9a84c", color2="#9a7b2f"):
    return f"""
    <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <circle cx="150" cy="150" r="130" fill="none" stroke="{color1}" stroke-width="1" opacity=".3"/>
      <circle cx="150" cy="150" r="100" fill="none" stroke="{color1}" stroke-width="1.5" opacity=".4"/>
      <circle cx="150" cy="150" r="70"  fill="none" stroke="{color1}" stroke-width="2" opacity=".5"/>
      <circle cx="150" cy="150" r="40"  fill="{color1}" opacity=".12"/>
      <line x1="20" y1="150" x2="280" y2="150" stroke="{color1}" stroke-width="1" opacity=".2"/>
      <line x1="150" y1="20" x2="150" y2="280" stroke="{color1}" stroke-width="1" opacity=".2"/>
      <line x1="56" y1="56" x2="244" y2="244" stroke="{color1}" stroke-width="1" opacity=".15"/>
      <line x1="244" y1="56" x2="56" y2="244" stroke="{color1}" stroke-width="1" opacity=".15"/>
    </svg>"""

def sv_diamond(color="#c9a84c"):
    return f"""
    <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <polygon points="150,20 280,150 150,280 20,150" fill="none" stroke="{color}" stroke-width="1.5" opacity=".4"/>
      <polygon points="150,55 245,150 150,245 55,150" fill="none" stroke="{color}" stroke-width="2" opacity=".35"/>
      <polygon points="150,90 210,150 150,210 90,150" fill="{color}" opacity=".08" stroke="{color}" stroke-width="1.5"/>
      <circle cx="150" cy="150" r="18" fill="{color}" opacity=".2"/>
    </svg>"""

def sv_wave(color="#c9a84c"):
    return f"""
    <svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,80 Q50,30 100,80 Q150,130 200,80 Q250,30 300,80" fill="none" stroke="{color}" stroke-width="2.5" opacity=".5"/>
      <path d="M0,80 Q50,50 100,80 Q150,110 200,80 Q250,50 300,80" fill="none" stroke="{color}" stroke-width="1" opacity=".3"/>
      <path d="M0,100 Q75,50 150,100 Q225,150 300,100" fill="none" stroke="{color}" stroke-width="1" opacity=".2"/>
    </svg>"""

def sv_bar_chart(data, color="#c9a84c"):
    max_v = max(v for _,v in data) if data else 1
    bars = ""
    W = 280 // len(data) if data else 40
    for i, (lbl, v) in enumerate(data):
        x = 10 + i * W
        h = int(v / max_v * 170)
        bars += f'<rect x="{x+4}" y="{185-h}" width="{W-10}" height="{h}" rx="4" fill="{color}" opacity="{0.4 + 0.5*v/max_v:.2f}"/>'
        bars += f'<text x="{x+W//2}" y="200" text-anchor="middle" font-size="11" fill="#8a8a9a">{lbl}</text>'
        bars += f'<text x="{x+W//2}" y="{185-h-6}" text-anchor="middle" font-size="10" font-weight="600" fill="{color}">{v}</text>'
    return f"""<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="15" x2="10" y2="190" stroke="#e0d8c8" stroke-width="1"/>
      <line x1="10" y1="190" x2="295" y2="190" stroke="#e0d8c8" stroke-width="1"/>
      {bars}</svg>"""

def sv_donut(filled_pct, color="#c9a84c"):
    r = 70; cx = 100; cy = 100; stroke_w = 18
    circumference = 2 * 3.14159 * r
    dash = circumference * filled_pct / 100
    return f"""
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#e8e4da" stroke-width="{stroke_w}"/>
      <circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{color}" stroke-width="{stroke_w}"
        stroke-dasharray="{dash:.1f} {circumference:.1f}" stroke-linecap="round" transform="rotate(-90 {cx} {cy})" opacity=".85"/>
      <text x="{cx}" y="{cy+6}" text-anchor="middle" font-size="22" font-weight="700" fill="#1a1a2e">{filled_pct}%</text>
    </svg>"""

def sv_network(color="#c9a84c"):
    nodes = [(150,80),(80,160),(220,160),(60,80),(240,80),(150,200)]
    edges = [(0,1),(0,2),(0,3),(0,4),(1,5),(2,5),(1,2)]
    paths = ""
    for a,b in edges:
        paths += f'<line x1="{nodes[a][0]}" y1="{nodes[a][1]}" x2="{nodes[b][0]}" y2="{nodes[b][1]}" stroke="{color}" stroke-width="1.5" opacity=".3"/>'
    circles = ""
    for i,(x,y) in enumerate(nodes):
        r = 22 if i==0 else 14
        circles += f'<circle cx="{x}" cy="{y}" r="{r}" fill="{color}" opacity="{.18 if i>0 else .3}" stroke="{color}" stroke-width="1.5" opacity=".5"/>'
    return f'<svg viewBox="0 0 300 280" xmlns="http://www.w3.org/2000/svg">{paths}{circles}</svg>'

# helper ────────────────────────────
def parse_source():
    with open(r'C:\WORK\IIFF\Sorces\show_content.txt', 'r', encoding='utf-8') as f:
        text = f.read()
    slides_raw = text.split('========== SLIDE ')
    slides = []
    for SR in slides_raw[1:]:
        lines = SR.split('\n')
        slide_num = lines[0].strip('=').strip()
        layout = ''; shapes = []; cur = None
        for line in lines[1:]:
            if line.startswith('  Layout:'):
                layout = line.replace('  Layout:', '').strip()
            elif line.startswith('  --- Shape:'):
                cur = {'name': line.strip(), 'texts': [], 'table': None}
                shapes.append(cur)
            elif line.startswith('      P'):
                parts = line.split(': ', 1)
                if len(parts) > 1:
                    raw = parts[1]
                    clean = ''.join(re.sub(r'\[.*?\]', '', c) for c in raw.split(' | '))
                    if clean.strip() and cur is not None:
                        cur['texts'].append(clean.strip())
            elif line.startswith('      TABLE:'):
                if cur is not None: cur['table'] = []
            elif line.startswith('        R'):
                parts = line.split(': ', 1)
                if len(parts) > 1 and cur is not None and cur['table'] is not None:
                    cur['table'].append([c.strip() for c in parts[1].split('|')])
        slides.append({'num': slide_num, 'layout': layout, 'shapes': shapes})
    return slides


def bar_html(pairs):
    out = '<div class="chart-wrap"><div class="chart-title">DATA OVERVIEW</div>'
    for lbl, pct in pairs:
        out += f'''<div class="bar-row">
          <span class="lbl">{lbl}</span>
          <div class="bar-track"><div class="bar-fill" style="width:{pct}%"></div></div>
          <span class="bar-val">{pct}%</span></div>'''
    return out + '</div>'

def icon_list_html(items):
    icons = ICONS[:]
    random.shuffle(icons)
    out = '<div class="icon-list">'
    for i, (h, p) in enumerate(items):
        icon = icons[i % len(icons)]
        out += f'''<div class="icon-item">
          <div class="icon-box">{icon}</div>
          <div>{'<h4>'+h+'</h4>' if h else ''}<p>{p}</p></div></div>'''
    return out + '</div>'

def progress_html(items):
    out = '<div class="progress-meter">'
    for lbl, pct in items:
        out += f'''<div class="pm-row">
          <span class="pm-lbl">{lbl}</span>
          <div class="pm-track"><div class="pm-fill" style="width:{pct}%"></div></div>
          <span class="pm-num">{pct}%</span></div>'''
    return out + '</div>'

def deco_bg(variant=0):
    opts = [
        # ring top-right + dots bottom-left
        '<div class="deco-ring" style="width:45vw;height:45vw;top:-18%;right:-10%;"></div>'
        '<div class="deco-dot-grid" style="width:200px;height:200px;bottom:14%;left:4%;border-radius:16px;"></div>',
        # stripe bottom-right + thin ring
        '<div class="deco-stripe" style="width:300px;height:300px;bottom:5%;right:3%;border-radius:20px;"></div>'
        '<div class="deco-ring" style="width:30vw;height:30vw;top:10%;left:-8%;"></div>',
        # large faint dot-grid full slide
        '<div class="deco-dot-grid" style="width:100%;height:100%;top:0;left:0;"></div>',
        # diagonal lines
        '<div class="deco-stripe" style="width:100%;height:100%;top:0;left:0;"></div>',
    ]
    return opts[variant % len(opts)]

def build_html():
    slides_data = parse_source()
    html_slides = []
    chart_data_sets = [
        [("한국",82),("미국",95),("일본",76),("중국",68),("유럽",71)],
        [("1년차",40),("2년차",62),("3년차",88)],
        [("스폰서",75),("입장료",60),("MD",45),("방송권",55)],
        [("컨텐츠",80),("마케팅",65),("운영",50)],
    ]
    chart_idx = 0
    donut_vals = [72, 85, 60, 78, 90]

    for idx, s in enumerate(slides_data):
        title_text = ''
        content_shapes = []
        for shape in s['shapes']:
            is_title = '제목' in shape['name'] and '부제목' not in shape['name']
            if is_title and shape['texts']:
                title_text = shape['texts'][0]
            else:
                content_shapes.append(shape)

        has_table = any(sh['table'] for sh in content_shapes)
        all_texts = [para for sh in content_shapes for para in sh['texts']]
        deco_v = idx % 4
        bg = deco_bg(deco_v)

        # ── COVER ──────────────────────────────────────────────────────────
        if s['layout'] == '제목 슬라이드' or idx == 0:
            cover_extra = " ".join(all_texts[:2]) if all_texts else "아시아와 헐리우드, 그리고 미래 영화계의 새로운 물결"
            slide_html = f"""
<div class="slide active" id="slide-{idx}">
  {bg}
  <div class="cover-deco">{sv_concentric()}</div>
  <div class="cover-shell">
    <div class="cover-eyebrow">Incheon International Film Festival • 2026</div>
    <h1 class="cover-h1">IIFF<br><em>NextWave</em></h1>
    <p class="cover-sub">{cover_extra}</p>
    <div class="cover-meta">
      <div class="cover-meta-item"><label>개최 연도</label><span>2026</span></div>
      <div class="cover-meta-item"><label>장소</label><span>인천광역시</span></div>
      <div class="cover-meta-item"><label>구성 파트너</label><span>Method Fest</span></div>
    </div>
  </div>
</div>"""
            html_slides.append(slide_html)
            continue

        # ── TABLE SLIDES ──────────────────────────────────────────────────
        if has_table:
            tbl_htmls = []
            for shape in content_shapes:
                if shape['table']:
                    tbl_htmls.append('<div class="tbl-wrap"><table class="tbl">')
                    for i, row in enumerate(shape['table']):
                        if i == 0:
                            tbl_htmls.append('<thead><tr>')
                            for col in row: tbl_htmls.append(f'<th>{col}</th>')
                            tbl_htmls.append('</tr></thead><tbody>')
                        else:
                            tbl_htmls.append('<tr>')
                            for col in row: tbl_htmls.append(f'<td>{col}</td>')
                            tbl_htmls.append('</tr>')
                    tbl_htmls.append('</tbody></table></div>')
                elif shape['texts']:
                    tbl_htmls.append(f'<p class="t-md">{" ".join(shape["texts"])}</p>')
            body_html = f'<div class="g1">{"".join(tbl_htmls)}</div>'

        # ── SINGLE LONG TEXT → quote ──────────────────────────────────────
        elif len(content_shapes) == 1 and len(all_texts) == 1 and len(all_texts[0]) > 30:
            body_html = f'''
              <div class="g2">
                <div class="visual-panel">{sv_wave()}</div>
                <div class="quote-block">
                  <p class="qt">{all_texts[0]}</p>
                  <p class="qt-src">IIFF 2026 핵심 비전</p>
                </div>
              </div>'''

        # ── 2 SHAPES → split with visual ─────────────────────────────────
        elif len(content_shapes) == 2 and len(all_texts) <= 6:
            use_chart = any(k in " ".join(all_texts).lower()
                             for k in ['예산','비율','규모','수익','통계','퍼센트','억'])
            if use_chart:
                cd = chart_data_sets[chart_idx % len(chart_data_sets)]
                chart_idx += 1
                right_panel = sv_bar_chart(cd)
                vis = f'<div class="visual-panel">{right_panel}</div>'
            else:
                vis = f'<div class="visual-panel">{sv_concentric()}</div>'

            cards = ""
            for sh in content_shapes:
                if sh['texts']:
                    h3 = f'<h3>{sh["texts"][0]}</h3>' if len(sh["texts"]) > 1 else ''
                    rest = "".join(f'<p class="t-md">{t}</p>' for t in (sh["texts"][1:] if h3 else sh["texts"]))
                    cards += f'<div class="card">{h3}{rest}</div>'
            body_html = f'<div class="gr"><div style="display:flex;flex-direction:column;gap:1.5rem;">{cards}</div>{vis}</div>'

        # ── 3+ SHAPES or many texts → grid of cards ──────────────────────
        else:
            nc = len(content_shapes)
            grid = "g4" if nc >= 4 else ("g3" if nc == 3 else "g2")
            cards = []
            for ci, sh in enumerate(content_shapes):
                if not sh['texts']: continue
                h3 = f'<h3>{sh["texts"][0]}</h3>' if len(sh["texts"]) > 1 else ''
                rest_texts = sh["texts"][1:] if h3 else sh["texts"]
                rest = "".join(f'<p class="t-md">{t}</p>' for t in rest_texts)
                num_badge = f'<div class="card-num">0{ci+1}</div>'
                icon = ICONS[ci % len(ICONS)]
                tag_html = f'<div class="tag">{icon} 핵심</div>'
                cards.append(f'<div class="card">{num_badge}{tag_html}{h3}{rest}</div>')
            body_html = f'<div class="{grid}">{"".join(cards)}</div>'

            # Inject visual richness for every 4th slide: add chart below or alongside
            if idx % 5 == 0 and nc <= 2:
                cd = chart_data_sets[chart_idx % len(chart_data_sets)]
                chart_idx += 1
                pct_items = [(lbl, pct) for lbl, pct in cd]
                body_html += f'<div style="margin-top:2rem;">{bar_html(pct_items)}</div>'

        slide_html = f"""
<div class="slide" id="slide-{idx}">
  {bg}
  <div class="slide-head">
    <div class="slide-label"><span class="dot"></span>{s['layout']}</div>
    <h2 class="slide-title">{title_text if title_text else 'Overview'}</h2>
    <div class="slide-divider"></div>
  </div>
  <div class="slide-body">
    {body_html}
  </div>
</div>"""
        html_slides.append(slide_html)

    return html_slides


def main():
    css = generate_css()
    slides_html = build_html()
    n = len(slides_html)

    doc = f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>IIFF NextWave — Final Presentation</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500&display=swap" rel="stylesheet">
<style>{css}</style>
</head>
<body>
<div class="prg" id="prg"></div>

<div id="slides">
{''.join(slides_html)}
</div>

<div class="nav-bar">
  <div class="brand">IIFF NEXT WAVE — FINAL PRESENTATION</div>
  <div class="controls">
    <button onclick="prev()" title="이전">◀</button>
    <span class="counter" id="ctr">1 / {n}</span>
    <button onclick="next()" title="다음">▶</button>
  </div>
  <div class="tools">
    <button class="btn-tool" onclick="toggleFS()">⛶ 전체화면</button>
    <button class="btn-tool" onclick="window.print()">📥 PDF</button>
    <button class="btn-tool" onclick="location.href='index.html'">🏠 HOME</button>
  </div>
</div>

<script>
  const slides = document.querySelectorAll('.slide');
  const total = slides.length;
  let cur = 0;

  function go(n) {{
    if (n < 0 || n >= total) return;
    slides[cur].classList.remove('active');
    slides[n].classList.add('active');
    cur = n;
    document.getElementById('ctr').textContent = (cur+1)+' / '+total;
    document.getElementById('prg').style.width = ((cur+1)/total*100)+'%';
  }}
  function next() {{ go(cur+1); }}
  function prev() {{ go(cur-1); }}

  document.addEventListener('keydown', e => {{
    if(['ArrowRight','ArrowDown',' ','PageDown'].includes(e.key)) {{ e.preventDefault(); next(); }}
    if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)) {{ e.preventDefault(); prev(); }}
    if(e.key==='Home') {{ e.preventDefault(); go(0); }}
    if(e.key==='End')  {{ e.preventDefault(); go(total-1); }}
  }});

  let tx=0;
  document.addEventListener('touchstart', e => tx=e.changedTouches[0].screenX);
  document.addEventListener('touchend', e => {{
    const d = tx - e.changedTouches[0].screenX;
    if(Math.abs(d)>50) d>0?next():prev();
  }});

  document.addEventListener('click', e => {{
    if(e.target.closest('.nav-bar')||e.target.closest('button')||e.target.closest('a')) return;
    e.clientX > window.innerWidth/2 ? next() : prev();
  }});

  function toggleFS(){{
    if(!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  }}

  go(0);
</script>
</body>
</html>"""

    with open(r'c:\WORK\IIFF\presentation_Final.html', 'w', encoding='utf-8') as f:
        f.write(doc)
    print("Done! Generated", n, "slides.")

if __name__ == '__main__':
    main()
