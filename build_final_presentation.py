import re, random

# A4 landscape: 297mm × 210mm → at 96dpi = 1122.52 × 793.70px
A4_W = 1123
A4_H = 794

ICONS = ["🎬","🌊","🎯","💡","🏆","📊","🌐","🎭","🤝","🎞️","📣","💰","🔑","🌏","⚡","🧭","🏟️","📅","🌟","🛡️","🎪","🔮","🗺️","🏅","📽️"]

def css():
    return f"""
    *, *::before, *::after {{ margin:0; padding:0; box-sizing:border-box; }}
    html, body {{
        width:100vw; height:100vh;
        display:flex; flex-direction:row;
        background:#2a2825;
        font-family:'Inter','Noto Sans KR',sans-serif;
        overflow:hidden;
    }}

    /* ── Main area: fills space left of sidebar ────────── */
    #main {{
        flex:1; display:flex; align-items:center; justify-content:center;
        background:#2a2825; overflow:hidden; position:relative;
    }}

    /* ── Slide scene: always A4 landscape, scaled to fit ── */
    .scene {{
        width:{A4_W}px; height:{A4_H}px;
        transform-origin: center center;
        position:relative; flex-shrink:0;
    }}

    /* ── Slide canvas ─────────────────────────────────── */
    .slide {{
        display:none;
        position:absolute; inset:0;
        background:#f9f8f5;
        overflow:hidden;
        /* subtle paper texture via box-shadow */
        box-shadow:0 10px 60px rgba(0,0,0,.25);
        flex-direction:column;
        padding:36px 52px 44px;
        animation:si .4s ease both;
    }}
    .slide.active {{ display:flex; }}

    @keyframes si {{
        from {{ opacity:0; transform:scale(.985); }}
        to   {{ opacity:1; transform:scale(1); }}
    }}

    /* ── Decorative backgrounds ──────────────────────── */
    .bg-dots {{
        position:absolute; inset:0; pointer-events:none; z-index:0;
        background-image:radial-gradient(circle, rgba(180,155,90,.22) 1px, transparent 1px);
        background-size:26px 26px;
    }}
    .bg-stripe {{
        position:absolute; inset:0; pointer-events:none; z-index:0; opacity:.18;
        background:repeating-linear-gradient(-45deg,rgba(180,155,90,.3) 0, rgba(180,155,90,.3) 1px,transparent 1px,transparent 16px);
    }}
    .bg-clean {{ /* no extra bg */ }}
    .deco-circle {{
        position:absolute; border-radius:50%; pointer-events:none; z-index:0;
        border:1px solid rgba(180,155,90,.2);
    }}
    .deco-fill {{
        position:absolute; border-radius:50%; pointer-events:none; z-index:0;
        background:rgba(180,155,90,.07);
    }}

    /* ── Layer above decorations ─────────────────────── */
    .layer {{ position:relative; z-index:2; display:flex; flex-direction:column; flex:1; height:100%; }}

    /* ── COVER specific ──────────────────────────────── */
    .cover-left {{
        flex:1; display:flex; flex-direction:column; justify-content:center; gap:18px;
    }}
    .cover-eyebrow {{
        font-size:8.5px; letter-spacing:6px; text-transform:uppercase; color:#9a7b2f; font-weight:600;
    }}
    .cover-h1 {{
        font-family:'Playfair Display',Georgia,serif; font-size:82px; font-weight:700;
        color:#1a1a2e; line-height:.95;
    }}
    .cover-h1 em {{ color:#c9a84c; font-style:italic; }}
    .cover-tagline {{ font-size:12.5px; color:#5a5a7a; line-height:1.6; max-width:440px; }}
    .cover-meta {{ display:flex; gap:32px; margin-top:8px; }}
    .cover-meta-item label {{ display:block; font-size:7.5px; letter-spacing:3px; text-transform:uppercase; color:#aaa; margin-bottom:3px; }}
    .cover-meta-item span {{ font-size:11px; color:#1a1a2e; font-weight:500; }}
    .cover-right {{ display:flex; align-items:center; justify-content:center; width:340px; flex-shrink:0; }}
    .cover-row {{ display:flex; gap:0; flex:1; }}

    /* ── Slide header ────────────────────────────────── */
    .slide-head {{ margin-bottom:12px; }}
    .slide-label {{
        display:inline-flex; align-items:center; gap:8px;
        font-size:7.5px; letter-spacing:4.5px; text-transform:uppercase;
        color:#9a7b2f; font-weight:600; margin-bottom:8px;
    }}
    .slide-label::before {{ content:''; width:20px; height:1.5px; background:#c9a84c; display:block; }}
    .slide-title {{
        font-family:'Playfair Display',Georgia,serif; font-size:34px; font-weight:700;
        color:#1a1a2e; line-height:1.1;
    }}
    .slide-divider {{ width:48px; height:3px; background:linear-gradient(90deg,#c9a84c,transparent); border-radius:2px; margin-top:8px; }}

    /* ── Body area ────────────────────────────────────── */
    .body {{ flex:1; display:flex; flex-direction:column; justify-content:stretch; gap:12px; min-height:0; }}

    /* ── Cards ───────────────────────────────────────── */
    .card {{
        background:#fff; border-radius:14px; border:1px solid rgba(180,155,90,.18);
        padding:20px 24px; position:relative; overflow:hidden;
        box-shadow:0 2px 12px rgba(0,0,0,.05);
        flex:1; min-height:0; display:flex; flex-direction:column; gap:8px;
    }}
    .card::before {{
        content:''; position:absolute; top:0; left:0; width:3px; height:100%;
        background:linear-gradient(180deg,#c9a84c,#9a7b2f);
    }}
    .card h3 {{
        font-family:'Playfair Display',Georgia,serif; font-size:15px;
        color:#2c3e7a; font-weight:600; line-height:1.3;
    }}
    .card p {{ color:#4a4a6a; font-size:12px; line-height:1.65; }}
    .card-number {{ position:absolute; top:12px; right:16px; font-family:'Playfair Display',Georgia,serif;
        font-size:32px; font-weight:700; color:rgba(201,168,76,.15); line-height:1; }}
    .tag {{ display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px;
        font-size:8.5px; letter-spacing:1.5px; text-transform:uppercase;
        background:rgba(201,168,76,.12); color:#9a7b2f; font-weight:600; margin-bottom:4px; }}

    /* ── Grid layouts ─────────────────────────────────── */
    .g1  {{ display:flex; flex-direction:column; flex:1; gap:12px; min-height:0; }}
    .g2  {{ display:grid; grid-template-columns:1fr 1fr; gap:14px; flex:1; min-height:0; align-items:stretch; align-content:stretch; }}
    .g3  {{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; flex:1; min-height:0; align-items:stretch; align-content:stretch; }}
    .g4  {{ display:grid; grid-template-columns:repeat(4,1fr); gap:10px; flex:1; min-height:0; align-items:stretch; align-content:stretch; }}
    /* auto-row grid caps at 4 cols — for 5-8 items in auto 2-row */
    .gauto {{ display:grid; grid-template-columns:repeat(4,1fr); grid-auto-rows:1fr; gap:10px; flex:1; min-height:0; }}
    .gsplit {{ display:grid; grid-template-columns:3fr 2fr; gap:22px; flex:1; min-height:0; align-items:stretch; }}
    .gsplit-r {{ display:grid; grid-template-columns:2fr 3fr; gap:22px; flex:1; min-height:0; align-items:stretch; }}
    .g-col {{ display:flex; flex-direction:column; gap:12px; min-height:0; flex:1; }}
    .g-col {{ display:flex; flex-direction:column; gap:12px; min-height:0; }}

    /* ── Visual panel ─────────────────────────────────── */
    .vis {{
        border-radius:14px; background:#f0ece3; border:1px solid rgba(180,155,90,.15);
        display:flex; align-items:center; justify-content:center;
        overflow:hidden; position:relative; flex:1; min-height:0; height:100%;
    }}
    .vis svg {{ width:90%; height:90%; }}

    /* ── Table ───────────────────────────────────────── */
    .tbl-wrap {{ flex:1; overflow:auto; border-radius:13px; border:1px solid rgba(180,155,90,.18);
        background:#fff; min-height:0; height:100%; }}
    .tbl {{ width:100%; border-collapse:collapse; font-size:11.5px; }}
    .tbl th {{ padding:11px 14px; text-align:left; font-size:8.5px; letter-spacing:2px;
        text-transform:uppercase; color:#9a7b2f; border-bottom:1.5px solid rgba(180,155,90,.2);
        background:#faf8f2; font-weight:600; }}
    .tbl td {{ padding:10px 14px; border-bottom:1px solid rgba(180,155,90,.08);
        color:#4a4a6a; line-height:1.4; vertical-align:top; }}
    .tbl tr:hover td {{ background:rgba(201,168,76,.05); }}
    .tbl tr:last-child td {{ border-bottom:none; }}
    .tbl td:first-child {{ font-weight:500; color:#2c3e7a; }}

    /* ── Bar chart ────────────────────────────────────── */
    .chart-wrap {{ flex:1; display:flex; flex-direction:column; gap:6px; min-height:0; justify-content:center; }}
    .chart-title {{ font-size:7.5px; letter-spacing:3px; text-transform:uppercase; color:#aaa; margin-bottom:4px; }}
    .brow {{ display:flex; align-items:center; gap:8px; }}
    .brow .bl {{ font-size:10.5px; color:#5a5a7a; min-width:100px; text-align:right; flex-shrink:0; }}
    .brow .bt {{ flex:1; height:9px; background:#f0ece3; border-radius:5px; overflow:hidden; }}
    .brow .bf {{ height:100%; border-radius:5px; background:linear-gradient(90deg,#c9a84c,#9a7b2f); }}
    .brow .bv {{ font-size:9px; color:#9a7b2f; min-width:30px; font-weight:600; }}

    /* ── Stats row ────────────────────────────────────── */
    .stats-row {{ display:flex; gap:12px; }}
    .stat-box {{ flex:1; background:#fff; border-radius:13px; border:1px solid rgba(180,155,90,.18);
        padding:16px 14px; text-align:center; box-shadow:0 2px 12px rgba(0,0,0,.04); }}
    .stat-num {{ font-family:'Playfair Display',Georgia,serif; font-size:32px; font-weight:700;
        color:#c9a84c; line-height:1; }}
    .stat-lbl {{ font-size:8.5px; letter-spacing:2px; text-transform:uppercase; color:#9a9a9a; margin-top:6px; }}

    /* ── Quote ─────────────────────────────────────────── */
    .quote-box {{ background:#fff; border-radius:16px; border:1px solid rgba(180,155,90,.18);
        padding:28px 36px; position:relative; flex:1; display:flex; flex-direction:column;
        justify-content:center; gap:14px; box-shadow:0 2px 16px rgba(0,0,0,.05); }}
    .quote-box::before {{ content:'"'; font-family:'Playfair Display',Georgia,serif; font-size:90px;
        color:rgba(201,168,76,.15); position:absolute; top:-16px; left:20px; line-height:1; }}
    .qt {{ font-family:'Playfair Display',Georgia,serif; font-size:20px; font-style:italic;
        color:#1a1a2e; line-height:1.5; position:relative; z-index:1; }}
    .qt-src {{ font-size:10px; letter-spacing:2.5px; text-transform:uppercase; color:#9a7b2f; }}

    /* ── Icon list ─────────────────────────────────────── */
    .ilist {{ display:flex; flex-direction:column; gap:10px; flex:1; min-height:0; justify-content:space-between; }}
    .irow {{ display:flex; align-items:flex-start; gap:12px; }}
    .ibox {{ width:36px; height:36px; border-radius:10px; flex-shrink:0;
        background:rgba(201,168,76,.1); border:1px solid rgba(180,155,90,.2);
        display:flex; align-items:center; justify-content:center; font-size:16px; }}
    .irow h4 {{ font-size:12.5px; font-weight:600; color:#1a1a2e; margin-bottom:3px; }}
    .irow p  {{ font-size:11px; color:#5a5a7a; line-height:1.55; }}

    /* ── Progress meters ──────────────────────────────── */
    .plist {{ display:flex; flex-direction:column; gap:9px; flex:1; justify-content:center; }}
    .prow  {{ display:flex; align-items:center; gap:10px; }}
    .pl    {{ font-size:10px; color:#5a5a7a; min-width:110px; }}
    .pt    {{ flex:1; height:8px; background:#f0ece3; border-radius:4px; overflow:hidden; }}
    .pf    {{ height:100%; border-radius:4px; background:linear-gradient(90deg,#c9a84c,#9a7b2f); }}
    .pv    {{ font-size:9px; color:#9a7b2f; font-weight:600; min-width:32px; text-align:right; }}

    /* ── Left Sidebar ────────────────────────────────────── */
    #sidebar {{
        width:92px; height:100vh; flex-shrink:0;
        background:linear-gradient(180deg,#1c1a17 0%,#231f1b 100%);
        border-right:1px solid rgba(201,168,76,.12);
        display:flex; flex-direction:column; align-items:center;
        padding:20px 0 16px; z-index:100;
        box-shadow:4px 0 30px rgba(0,0,0,.5);
    }}
    /* Logo at top */
    .sb-logo {{ width:60px; filter:invert(1) brightness(.8); margin-bottom:20px; }}
    /* Thin divider */
    .sb-sep {{ width:36px; height:1px; background:rgba(201,168,76,.2); margin:10px 0; }}
    /* Navigation buttons */
    .sb-btn {{
        width:50px; height:50px; border-radius:15px; border:none;
        background:transparent; color:rgba(255,255,255,.45); cursor:pointer;
        display:flex; align-items:center; justify-content:center;
        font-size:18px; transition:.2s; margin:3px 0;
    }}
    .sb-btn:hover {{ background:rgba(201,168,76,.18); color:#c9a84c; }}
    /* Progress ring */
    .sb-ring {{ margin:10px 0; position:relative; width:62px; height:62px; }}
    .sb-ring svg {{ position:absolute; inset:0; transform:rotate(-90deg); }}
    .sb-ring-bg {{ fill:none; stroke:rgba(255,255,255,.06); stroke-width:5; }}
    .sb-ring-fill {{ fill:none; stroke:#c9a84c; stroke-width:5; stroke-linecap:round;
        stroke-dasharray:170; stroke-dashoffset:170; transition:stroke-dashoffset .45s ease; }}
    .sb-ring-label {{ position:absolute; inset:0; display:flex; flex-direction:column;
        align-items:center; justify-content:center; }}
    .sb-ring-cur {{ font-size:16px; font-family:'Playfair Display',serif;
        font-weight:700; color:#c9a84c; line-height:1; }}
    .sb-ring-total {{ font-size:7px; color:rgba(255,255,255,.35); letter-spacing:1px; }}
    /* Tool buttons at bottom */
    .sb-tools {{ margin-top:auto; display:flex; flex-direction:column; align-items:center; gap:2px; }}
    .sb-tool {{
        width:52px; height:42px; border-radius:12px; border:none;
        background:transparent; color:rgba(255,255,255,.3); cursor:pointer;
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        font-size:15px; transition:.2s; gap:2px;
    }}
    .sb-tool-label {{ font-size:6px; letter-spacing:.5px; text-transform:uppercase;
        color:rgba(255,255,255,.2); }}
    .sb-tool:hover {{ background:rgba(201,168,76,.12); color:rgba(201,168,76,.9); }}
    .sb-tool:hover .sb-tool-label {{ color:rgba(201,168,76,.6); }}

    /* ── Thumbnail Panel ──────────────────────────────────── */
    #thumb-panel {{
        width:0; height:100vh; overflow:hidden; flex-shrink:0;
        background:#18160f; border-right:1px solid rgba(201,168,76,.1);
        transition:width .3s ease; z-index:90;
        display:flex; flex-direction:column;
    }}
    #thumb-panel.open {{ width:160px; }}
    #thumb-list {{
        flex:1; overflow-y:auto; padding:12px 8px; display:flex;
        flex-direction:column; gap:8px;
        scrollbar-width:thin; scrollbar-color:rgba(201,168,76,.3) transparent;
    }}
    #thumb-list::-webkit-scrollbar {{ width:4px; }}
    #thumb-list::-webkit-scrollbar-thumb {{ background:rgba(201,168,76,.3); border-radius:2px; }}
    .th-item {{
        flex-shrink:0; cursor:pointer; border-radius:8px; overflow:hidden;
        border:2px solid transparent; transition:.2s;
        position:relative;
    }}
    .th-item:hover {{ border-color:rgba(201,168,76,.5); }}
    .th-item.th-active {{ border-color:#c9a84c; }}
    /* Mini slide preview: aspect ratio 297:210 = ~1.414:1 */
    .th-slide {{
        width:140px; height:99px;
        background:linear-gradient(135deg,#f9f8f5 60%,#f0ece3);
        position:relative; overflow:hidden;
        display:flex; flex-direction:column; justify-content:flex-end;
        padding:6px 6px 4px;
    }}
    .th-slide .th-num {{
        position:absolute; top:4px; left:6px;
        font-size:9px; font-weight:700; color:rgba(201,168,76,.7);
        font-family:'Playfair Display',serif;
    }}
    .th-slide .th-bar {{
        position:absolute; top:0; left:0; width:3px; height:100%;
        background:linear-gradient(180deg,#c9a84c,#9a7b2f);
    }}
    .th-slide .th-title {{
        font-size:7px; font-weight:600; color:#1a1a2e;
        line-height:1.35; word-break:keep-all;
        display:-webkit-box; -webkit-line-clamp:3;
        -webkit-box-orient:vertical; overflow:hidden;
        padding-left:6px;
    }}
    .th-label {{
        background:#111; padding:3px 6px;
        font-size:6.5px; color:rgba(255,255,255,.35); text-align:center;
        white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
    }}
    /* Thumb toggle button */
    .sb-thumb-toggle {{ margin-bottom:4px; }}

    /* ── Print (true A4) ─────────────────────────────── */
    @media print {{
        html, body {{ background:#fff !important; display:block !important; }}
        #sidebar {{ display:none !important; }}
        .scene {{
            width:{A4_W}px !important; height:{A4_H}px !important;
            transform:none !important; position:static !important;
            page-break-after:always !important;
        }}
        .slide {{ display:flex !important; opacity:1 !important; position:static !important;
            width:{A4_W}px !important; height:{A4_H}px !important; }}
    }}

    /* ── Logo usage ──────────────────────────────────── */
    .logo-cover   {{ height:100px; margin-bottom:4px; }}
    .logo-corner  {{ position:absolute; top:12px; right:18px; height:34px; opacity:.5; z-index:10; }}
    .logo-section {{ height:64px; opacity:.8; margin-bottom:12px; }}
    """

# ── SVG helpers ────────────────────────────────────────────────

def svg_ring():
    return """<svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
  <circle cx="160" cy="160" r="148" fill="none" stroke="#c9a84c" stroke-width="1" opacity=".3"/>
  <circle cx="160" cy="160" r="115" fill="none" stroke="#c9a84c" stroke-width="1.5" opacity=".4"/>
  <circle cx="160" cy="160" r="78"  fill="none" stroke="#c9a84c" stroke-width="2" opacity=".5"/>
  <circle cx="160" cy="160" r="42"  fill="#c9a84c" opacity=".08"/>
  <line x1="12" y1="160" x2="308" y2="160" stroke="#c9a84c" stroke-width=".8" opacity=".25"/>
  <line x1="160" y1="12" x2="160" y2="308" stroke="#c9a84c" stroke-width=".8" opacity=".25"/>
  <line x1="64" y1="64"  x2="256" y2="256" stroke="#c9a84c" stroke-width=".8" opacity=".18"/>
  <line x1="256" y1="64" x2="64"  y2="256" stroke="#c9a84c" stroke-width=".8" opacity=".18"/>
</svg>"""

def svg_diamond():
    return """<svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
  <polygon points="160,14 306,160 160,306 14,160"  fill="none" stroke="#c9a84c" stroke-width="1.5" opacity=".4"/>
  <polygon points="160,50 270,160 160,270 50,160"  fill="none" stroke="#c9a84c" stroke-width="2" opacity=".35"/>
  <polygon points="160,88 212,160 160,232 108,160" fill="#c9a84c" opacity=".07" stroke="#c9a84c" stroke-width="1.5"/>
  <circle cx="160" cy="160" r="20" fill="#c9a84c" opacity=".18"/>
</svg>"""

def svg_wave():
    return """<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
  <path d="M0,90 Q80,30 160,90 Q240,150 320,90"  fill="none" stroke="#c9a84c" stroke-width="2.5" opacity=".5"/>
  <path d="M0,90 Q80,55 160,90 Q240,125 320,90" fill="none" stroke="#c9a84c" stroke-width="1" opacity=".3"/>
  <path d="M0,108 Q120,55 240,108 Q280,130 320,108" fill="none" stroke="#c9a84c" stroke-width="1" opacity=".2"/>
  <circle cx="160" cy="90" r="12" fill="#c9a84c" opacity=".2"/>
</svg>"""

def svg_network():
    nodes = [(160,50),(70,150),(250,150),(50,70),(270,70),(160,200)]
    edges = [(0,1),(0,2),(0,3),(0,4),(1,5),(2,5),(1,2),(3,0),(4,0)]
    paths = "".join(f'<line x1="{nodes[a][0]}" y1="{nodes[a][1]}" x2="{nodes[b][0]}" y2="{nodes[b][1]}" stroke="#c9a84c" stroke-width="1.5" opacity=".3"/>' for a,b in edges)
    cirs  = "".join(f'<circle cx="{x}" cy="{y}" r="{22 if i==0 else 14}" fill="#c9a84c" opacity="{.25 if i==0 else .1}" stroke="#c9a84c" stroke-width="1.5" opacity=".5"/>' for i,(x,y) in enumerate(nodes))
    return f'<svg viewBox="0 0 320 260" xmlns="http://www.w3.org/2000/svg">{paths}{cirs}</svg>'

def svg_bar(data):
    max_v = max(v for _,v in data) if data else 1
    W = 285/len(data)
    out = ""
    for i,(lbl,v) in enumerate(data):
        x=10+i*W; h=int(v/max_v*150)
        op=0.4+0.55*v/max_v
        out += f'<rect x="{x+3}" y="{170-h}" width="{W-7}" height="{h}" rx="4" fill="#c9a84c" opacity="{op:.2f}"/>'
        out += f'<text x="{x+W/2}" y="182" text-anchor="middle" font-size="9" fill="#8a8a9a">{lbl}</text>'
        out += f'<text x="{x+W/2}" y="{170-h-5}" text-anchor="middle" font-size="9" font-weight="600" fill="#9a7b2f">{v}</text>'
    return f'<svg viewBox="0 0 300 190" xmlns="http://www.w3.org/2000/svg"><line x1="10" y1="20" x2="10" y2="170" stroke="#e0d8c8" stroke-width="1"/><line x1="10" y1="170" x2="295" y2="170" stroke="#e0d8c8" stroke-width="1"/>{out}</svg>'

SVG_POOL = [svg_ring, svg_diamond, svg_wave, svg_network]

CHART_SETS = [
    [("한국",82),("미국",95),("일본",76),("유럽",71)],
    [("1년차",40),("2년차",62),("3년차",88)],
    [("스폰서",75),("입장료",60),("MD",45)],
    [("온라인",70),("오프라인",85),("방송",55)],
    [("기획",90),("운영",72),("홍보",65),("재무",58)],
]

BG_CLASSES = ["bg-dots","bg-stripe","bg-clean","bg-dots","bg-clean","bg-stripe"]

# ── Parser ─────────────────────────────────────────────────────
def parse():
    with open(r'C:\WORK\IIFF\Sorces\show_content.txt', 'r', encoding='utf-8') as f:
        text = f.read()
    raw = text.split('========== SLIDE ')
    result = []
    for SR in raw[1:]:
        lines = SR.split('\n')
        num = lines[0].strip('=').strip()
        layout=''; shapes=[]; cur=None
        for line in lines[1:]:
            if line.startswith('  Layout:'):
                layout = line.replace('  Layout:','').strip()
            elif line.startswith('  --- Shape:'):
                cur={'name':line.strip(),'texts':[],'table':None}; shapes.append(cur)
            elif line.startswith('      P'):
                parts = line.split(': ',1)
                if len(parts)>1 and cur is not None:
                    clean = ''.join(re.sub(r'\[.*?\]','',c) for c in parts[1].split(' | '))
                    if clean.strip(): cur['texts'].append(clean.strip())
            elif line.startswith('      TABLE:'):
                if cur is not None: cur['table']=[]
            elif line.startswith('        R'):
                parts = line.split(': ',1)
                if len(parts)>1 and cur is not None and cur['table'] is not None:
                    cur['table'].append([c.strip() for c in parts[1].split('|')])
        result.append({'num':num,'layout':layout,'shapes':shapes})
    return result

# ── Builders ───────────────────────────────────────────────────
def bar_html(pairs):
    rows=''.join(f'<div class="brow"><span class="bl">{l}</span><div class="bt"><div class="bf" style="width:{p}%"></div></div><span class="bv">{p}%</span></div>' for l,p in pairs)
    return f'<div class="chart-wrap"><div class="chart-title">DATA OVERVIEW</div>{rows}</div>'

def stat_html(nums):
    boxes=''.join(f'<div class="stat-box"><div class="stat-num">{n}</div><div class="stat-lbl">{l}</div></div>' for n,l in nums)
    return f'<div class="stats-row">{boxes}</div>'

def ilist_html(items):
    icons=ICONS[:]
    rows=''
    for i,(h,p) in enumerate(items):
        rows+=f'<div class="irow"><div class="ibox">{icons[i%len(icons)]}</div><div>{"<h4>"+h+"</h4>" if h else ""}<p>{p}</p></div></div>'
    return f'<div class="ilist">{rows}</div>'

def plist_html(items):
    rows=''.join(f'<div class="prow"><span class="pl">{l}</span><div class="pt"><div class="pf" style="width:{p}%"></div></div><span class="pv">{p}%</span></div>' for l,p in items)
    return f'<div class="plist">{rows}</div>'

def deco(variant=0):
    # background decorations
    bgs = [
        # A: dot grid + large faint ring top-right
        '<div class="bg-dots"></div><div class="deco-circle" style="width:420px;height:420px;top:-160px;right:-120px;"></div>',
        # B: stripe + ring bottom-left
        '<div class="bg-stripe"></div><div class="deco-circle" style="width:300px;height:300px;bottom:-100px;left:-80px;"></div>',
        # C: just dots
        '<div class="bg-dots"></div>',
        # D: fill circle top-right + dots
        '<div class="bg-dots"></div><div class="deco-fill" style="width:350px;height:350px;top:-140px;right:-100px;"></div>',
    ]
    return bgs[variant % len(bgs)]

# ── Main build ─────────────────────────────────────────────────
def build():
    data = parse()
    slides_html = []
    ci = 0

    for idx, s in enumerate(data):
        title=''; cshapes=[]
        for sh in s['shapes']:
            is_t = '제목' in sh['name'] and '부제목' not in sh['name']
            if is_t and sh['texts']: title=sh['texts'][0]
            else: cshapes.append(sh)

        has_tbl = any(sh['table'] for sh in cshapes)
        all_txts = [t for sh in cshapes for t in sh['texts']]
        dv = idx % 4

        # ── COVER ──────────────────────────────────────────────
        if s['layout']=='제목 슬라이드' or idx==0:
            holes = ''.join(
                f'<rect x="6" y="{16+i*34}" width="18" height="20" rx="3" fill="#e8e4da"/>'
                for i in range(22)
            )
            film = (
                f'<svg width="36" height="{A4_H}" viewBox="0 0 36 {A4_H}" xmlns="http://www.w3.org/2000/svg">'
                f'<rect width="36" height="{A4_H}" fill="#e0dbd0"/>'
                f'{holes}'
                f'<rect x="34" y="0" width="2" height="{A4_H}" fill="rgba(0,0,0,.06)"/>'
                f'</svg>'
            )
            title_div = (
                '<div style="font-size:17px;letter-spacing:8px;text-transform:uppercase;'
                'color:#9a7b2f;font-weight:700;font-family:\'Inter\',sans-serif;margin-bottom:28px;">'
                'INCHEON INTERNATIONAL FILM FESTIVAL</div>'
            )
            sep = '<div style="width:80px;height:1px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);margin:0 auto 36px;"></div>'
            logo = '<img src="Sorces/IIFF dark.png" style="height:180px;margin-bottom:48px;" alt="IIFF">'
            line1 = '<p style="font-size:14px;color:#3a3a3a;letter-spacing:1.5px;margin-bottom:14px;">인첬국제영화제 IIFF 추진위원회</p>'
            line2 = '<p style="font-size:12px;color:#8a8070;letter-spacing:1px;">2026.02. — Insights from INSPIRE</p>'
            h = (
                f'<div class="slide" id="s{idx}">'
                f'<div style="position:absolute;inset:0;background:linear-gradient(160deg,#fdfcf8 60%,#f5efe0);z-index:0"></div>'
                f'<div style="position:absolute;top:0;left:0;bottom:0;z-index:1;opacity:.9">{film}</div>'
                f'<div style="position:absolute;top:0;right:0;bottom:0;z-index:1;opacity:.9;transform:scaleX(-1)">{film}</div>'
                f'<div class="layer" style="align-items:center;justify-content:center;text-align:center;gap:0;padding:40px 90px;">'
                f'{title_div}{sep}{logo}{line1}{line2}'
                f'</div></div>'
            )
            slides_html.append(h); continue


        # ── SLIDE 2 ── exact reference match ───────────────────────────────────
        if idx == 1:
            _c1 = "헐리우드와 공동제작, 투자, 배급 실전협업 영화제"
            _c2 = "상업영화와 독립영화가 공존하는 영화제"
            _c3 = "참여하고 공동창작하고 즐기는 잠보리형 영화제"
            _c4 = "온라인 오프라인 365일 영화제"
            _cs = "background:#fff;border-radius:18px;border:1px solid rgba(180,155,90,.15);padding:28px 22px;flex:1;display:flex;align-items:center;justify-content:center;text-align:center;font-size:13.5px;color:#1a1a2e;font-weight:500;line-height:1.6;box-shadow:0 2px 16px rgba(0,0,0,.05);"
            _logo    = '<img src="Sorces/IIFF dark.png" style="height:90px;margin-bottom:10px;" alt="IIFF">'
            _nw      = ('<div style="font-size:11px;letter-spacing:10px;text-transform:uppercase;'
                         'color:#c9a84c;font-weight:600;font-family:\'Inter\',sans-serif;margin-bottom:20px;">'
                        '[ N E X T  W A V E ]</div>')
            _sub     = ('<p style="font-size:15px;color:#2a2a2a;letter-spacing:0.5px;margin-bottom:32px;">'
                        '아시아와 헐리우드, 그리고 미래 영화계의 새로운 물결</p>')
            _cards   = (
                f'<div style="display:flex;gap:16px;width:100%;margin-bottom:28px;">'
                f'<div style="{_cs}">{_c1}</div>'
                f'<div style="{_cs}">{_c2}</div>'
                f'<div style="{_cs}">{_c3}</div>'
                f'<div style="{_cs}">{_c4}</div>'
                '</div>'
            )
            _gold    = ('<p style="font-size:14px;color:#c9a84c;font-weight:600;letter-spacing:0.5px;margin-bottom:18px;">'
                        '영화 · 음악 · 테크놀로지 · K-컴쳐가 융합된 영화 플랫폼</p>')
            _foot    = '<p style="font-size:11px;color:#b0a898;letter-spacing:1.5px;">Cinematic Insights from INSPIRE Resort</p>'
            h = (
                f'<div class="slide" id="s{idx}">'
                '<div style="position:absolute;inset:0;background:linear-gradient(150deg,#fdfcfa 55%,#f6f0e4);z-index:0"></div>'
                f'<div class="layer" style="align-items:center;justify-content:center;text-align:center;gap:0;padding:32px 60px 28px;">'
                f'{_logo}{_nw}{_sub}{_cards}{_gold}{_foot}'
                '</div></div>'
            )
            slides_html.append(h); continue

        # ── Build inner slide ─────────────────────────────────
        head = f"""<div class="slide-head">
          <img src="Sorces/IIFF dark.png" class="logo-corner" alt="IIFF">
          <div class="slide-label">{s['layout']}</div>
          <h2 class="slide-title">{title if title else 'Overview'}</h2>
          <div class="slide-divider"></div>
        </div>"""

        # --- ZERO or very-sparse shapes → big statement slide
        if not cshapes or (len(all_txts)==1 and len(all_txts[0])<30):
            # Section-divider slide with logo + SVG visual
            text = all_txts[0] if all_txts else title
            vis_svg = SVG_POOL[idx % len(SVG_POOL)]()
            body=f'''<div class="gsplit">
              <div style="display:flex;flex-direction:column;justify-content:center;gap:24px;">
                <img src="Sorces/IIFF dark.png" class="logo-section" alt="IIFF">
                <div style="font-size:90px;font-family:Playfair Display,serif;font-weight:700;color:rgba(201,168,76,.15);line-height:1">{(idx):02d}</div>
                <div style="font-family:Playfair Display,serif;font-size:28px;font-weight:700;color:#1a1a2e;line-height:1.3">{text}</div>
                <div style="width:50px;height:3px;background:linear-gradient(90deg,#c9a84c,transparent);border-radius:2px"></div>
              </div>
              <div class="vis">{vis_svg}</div>
            </div>'''

        # --- TABLE
        if has_tbl:
            rows=[]
            for sh in cshapes:
                if sh['table']:
                    trs=''
                    for i,row in enumerate(sh['table']):
                        if i==0:
                            trs+='<thead><tr>'+''.join(f'<th>{c}</th>' for c in row)+'</tr></thead><tbody>'
                        else:
                            trs+='<tr>'+''.join(f'<td>{c}</td>' for c in row)+'</tr>'
                    trs+='</tbody>'
                    rows.append(f'<div class="tbl-wrap"><table class="tbl">{trs}</table></div>')
                elif sh['texts']:
                    rows.append(f'<div class="card"><p>{"<br>".join(sh["texts"])}</p></div>')
            body=f'<div class="g1">{"".join(rows)}</div>'

        # --- SINGLE TEXT → quote
        elif not has_tbl and len(cshapes)==1 and len(all_txts)==1 and len(all_txts[0])>25:
            vis_svg = SVG_POOL[idx % len(SVG_POOL)]()
            body=f'''<div class="gsplit">
              <div class="vis">{vis_svg}</div>
              <div class="quote-box"><p class="qt">{all_txts[0]}</p><p class="qt-src">IIFF 2026 KEY VISION</p></div>
            </div>'''

        # --- 2 shapes → split with visual or chart
        elif not has_tbl and len(cshapes)<=2:
            is_data = any(k in " ".join(all_txts).lower() for k in ['예산','비율','수익','통계','규모','퍼센트','억','만원'])
            if is_data:
                cd=CHART_SETS[ci%len(CHART_SETS)]; ci+=1
                right=f'<div class="vis">{svg_bar(cd)}</div>'
            else:
                right=f'<div class="vis">{SVG_POOL[idx%len(SVG_POOL)]()}</div>'
            cards=''
            for sh in cshapes:
                if sh['texts']:
                    h3=f'<h3>{sh["texts"][0]}</h3>' if len(sh["texts"])>1 else ''
                    rest=''.join(f'<p style="font-size:13px;line-height:1.7">{t}</p>' for t in (sh['texts'][1:] if h3 else sh['texts']))
                    cards+=f'<div class="card">{h3}{rest}</div>'
            body=f'<div class="gsplit-r"><div class="g-col">{cards}</div>{right}</div>'

        # --- 3-4 items → clean full-height card grid
        elif not has_tbl and len(cshapes)<=4:
            grid="g3" if len(cshapes)==3 else "g4" if len(cshapes)==4 else "g2"
            cards=''
            for ci2,sh in enumerate(cshapes):
                if sh['texts']:
                    h3=f'<h3>{sh["texts"][0]}</h3>' if len(sh["texts"])>1 else ''
                    rest=''.join(f'<p style="font-size:12.5px;line-height:1.7">{t}</p>' for t in (sh['texts'][1:] if h3 else sh['texts']))
                    nb=f'<div class="card-number">0{ci2+1}</div>'
                    tag=f'<div class="tag">{ICONS[ci2%len(ICONS)]} 핵심</div>'
                    cards+=f'<div class="card">{nb}{tag}{h3}{rest}</div>'
            body=f'<div class="{grid}">{cards}</div>'

        # --- 5-8 items → 4-column, 2-row auto grid
        else:
            items = cshapes[:8]  # clamp to 8 max
            cards=''
            for ci2,sh in enumerate(items):
                if sh['texts']:
                    h3=f'<h3>{sh["texts"][0]}</h3>' if len(sh["texts"])>1 else ''
                    rest=''.join(f'<p>{t}</p>' for t in (sh['texts'][1:] if h3 else sh['texts']))
                    nb=f'<div class="card-number">{ci2+1:02d}</div>'
                    tag=f'<div class="tag">{ICONS[ci2%len(ICONS)]} 핵심</div>'
                    cards+=f'<div class="card">{nb}{tag}{h3}{rest}</div>'
            body=f'<div class="gauto">{cards}</div>'

        slides_html.append(f"""
<div class="slide" id="s{idx}">
  {deco(dv)}
  <div class="layer">
    {head}
    <div class="body">
      {body}
    </div>
  </div>
</div>""")

    return slides_html

def main():
    slides_html = build()
    n  = len(slides_html)

    doc = f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>IIFF NextWave — Final Presentation</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500&display=swap" rel="stylesheet">
<style>{css()}</style>
</head>
<body>
<div id="sidebar">
  <!-- Logo -->
  <img src="Sorces/IIFF dark.png" class="sb-logo" alt="IIFF">
  <div class="sb-sep"></div>

  <!-- Prev button -->
  <button class="sb-btn" onclick="prev()" title="이전 슬라이드">&#9650;</button>

  <!-- Progress ring with slide counter -->
  <div class="sb-ring">
    <svg viewBox="0 0 62 62" width="62" height="62">
      <circle class="sb-ring-bg" cx="31" cy="31" r="27"/>
      <circle class="sb-ring-fill" id="ring" cx="31" cy="31" r="27"/>
    </svg>
    <div class="sb-ring-label">
      <span class="sb-ring-cur" id="ctr">1</span>
      <span class="sb-ring-total">/ {n}</span>
    </div>
  </div>

  <!-- Next button -->
  <button class="sb-btn" onclick="next()" title="다음 슬라이드">&#9660;</button>

  <div class="sb-sep"></div>

  <!-- Tool buttons -->
  <div class="sb-tools">
    <button class="sb-tool sb-thumb-toggle" onclick="toggleThumbs()" id="thumbToggleBtn" title="슬라이드 목록">
      &#9776;<span class="sb-tool-label">목록</span>
    </button>
    <button class="sb-tool" onclick="toggleFS()" title="전체화면">
      ⛶<span class="sb-tool-label">전체화면</span>
    </button>
    <button class="sb-tool" onclick="window.print()" title="PDF 저장">
      📥<span class="sb-tool-label">PDF</span>
    </button>
    <button class="sb-tool" onclick="location.href='index.html'" title="홈으로">
      🏠<span class="sb-tool-label">HOME</span>
    </button>
  </div>
</div>

<!-- Thumbnail Panel -->
<div id="thumb-panel">
  <div id="thumb-list"></div>
</div>

<div id="main">
  <div class="scene" id="scene">
{''.join(slides_html)}
  </div>
</div>

<script>
const slides = document.querySelectorAll('.slide');
const total  = slides.length;
const SB_W   = 92; // sidebar width in px
const THUMB_W = 160; // thumbnail panel width in px
let cur = 0;
let thumbOpen = false;

function scale() {{
  const scene = document.getElementById('scene');
  const extra = thumbOpen ? THUMB_W : 0;
  const avW   = window.innerWidth - SB_W - extra;
  const avH   = window.innerHeight;
  const sc    = Math.min(avW / {A4_W}, avH / {A4_H}) * 0.96;
  scene.style.transform       = `scale(${{sc}})`;
  scene.style.transformOrigin = 'center center';
}}

function updateRing(idx) {{
  const progress = (idx + 1) / total;
  const circ = 2 * Math.PI * 27;
  document.getElementById('ring').style.strokeDashoffset = circ * (1 - progress);
  document.getElementById('ctr').textContent = idx + 1;
}}

function updateThumb(idx) {{
  document.querySelectorAll('.th-item').forEach((el,i) => {{
    el.classList.toggle('th-active', i === idx);
  }});
  const active = document.querySelector('.th-item.th-active');
  if(active) active.scrollIntoView({{behavior:'smooth', block:'nearest'}});
}}

function go(n) {{
  if(n < 0 || n >= total) return;
  slides[cur].classList.remove('active');
  slides[n].classList.add('active');
  cur = n;
  updateRing(cur);
  updateThumb(cur);
}}
function next(){{ go(cur+1); }} function prev(){{ go(cur-1); }}

function toggleThumbs() {{
  thumbOpen = !thumbOpen;
  const panel = document.getElementById('thumb-panel');
  const btn   = document.getElementById('thumbToggleBtn');
  panel.classList.toggle('open', thumbOpen);
  btn.style.color = thumbOpen ? '#c9a84c' : '';
  scale();
}}

// Build thumbnail cards dynamically from slide titles
(function buildThumbs() {{
  const list = document.getElementById('thumb-list');
  slides.forEach((slide, i) => {{
    const titleEl = slide.querySelector('.slide-title, .cover-h1');
    const labelEl = slide.querySelector('.slide-label, .cover-eyebrow');
    const titleTxt = titleEl ? titleEl.textContent.trim() : `Slide ${{i+1}}`;
    const labelTxt = labelEl ? labelEl.textContent.trim() : '';
    const isCover = slide.querySelector('.cover-h1') !== null;
    const bgStyle = isCover
      ? 'background:linear-gradient(135deg,#1a1a2e 40%,#2c2c4a);'
      : 'background:linear-gradient(135deg,#f9f8f5 60%,#f0ece3)';;
    const numColor = isCover ? 'rgba(201,168,76,.8)' : 'rgba(201,168,76,.7)';
    const titleColor = isCover ? '#f9f8f5' : '#1a1a2e';
    const item = document.createElement('div');
    item.className = 'th-item';
    item.dataset.idx = i;
    item.innerHTML = `
      <div class="th-slide" style="${{bgStyle}}">
        <div class="th-bar"></div>
        <div class="th-num" style="color:${{numColor}}">${{String(i+1).padStart(2,'0')}}</div>
        <div class="th-title" style="color:${{titleColor}}">${{titleTxt}}</div>
      </div>
      <div class="th-label">${{labelTxt || 'SLIDE ' + (i+1)}}</div>`;
    item.addEventListener('click', () => go(i));
    list.appendChild(item);
  }});
}})();
function next(){{ go(cur+1); }} function prev(){{ go(cur-1); }}

document.addEventListener('keydown', e=>{{
  if(['ArrowRight','ArrowDown',' ','PageDown'].includes(e.key)){{e.preventDefault();next();}}
  if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){{e.preventDefault();prev();}}
  if(e.key==='Home'){{e.preventDefault();go(0);}}
  if(e.key==='End') {{e.preventDefault();go(total-1);}}
}});
let tx=0;
document.addEventListener('touchstart',e=>tx=e.changedTouches[0].screenX);
document.addEventListener('touchend',e=>{{const d=tx-e.changedTouches[0].screenX;if(Math.abs(d)>50)d>0?next():prev();}});
document.addEventListener('click',e=>{{
  if(e.target.closest('#sidebar')||e.target.closest('button')) return;
  e.clientX > (SB_W + window.innerWidth/2) ? next() : prev();
}});
function toggleFS(){{
  if(!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}}

window.addEventListener('resize', scale);
scale();
go(0);
</script>
</body>
</html>"""

    with open(r'c:\WORK\IIFF\presentation_Final.html','w',encoding='utf-8') as f:
        f.write(doc)
    print(f"Done! {n} slides generated at A4 landscape ({A4_W}×{A4_H}px).")

if __name__ == '__main__':
    main()
