import re

file_path = "C:\\WORK\\IIFF\\index.html"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define metadata
sections_meta = [
    # ID, Title, Group
    ('what-is-iiff', 'What is IIFF?', 'PART 1 • INTRODUCTION'),
    ('overview', 'Festival Overview', 'PART 1 • INTRODUCTION'),
    ('why-participate', 'Why Participate?', 'PART 1 • INTRODUCTION'),
    ('why-incheon', 'Why Incheon?', 'PART 1 • INTRODUCTION'),
    ('vision', 'Vision & Philosophy', 'PART 1 • INTRODUCTION'),
    
    ('programs', 'Core Programs', 'PART 2 • PROGRAMS'),
    ('stars', 'Star Invitation & Camp', 'PART 2 • PROGRAMS'),
    ('simulation', 'Daily Simulation', 'PART 2 • PROGRAMS'),
    ('volunteer', 'Civic Participation', 'PART 2 • PROGRAMS'),
    
    ('strategy', 'Core Strategy', 'PART 3 • STRATEGY'),
    ('organization', 'Organization', 'PART 3 • STRATEGY'),
    ('roadmap', '3-Year Roadmap', 'PART 3 • STRATEGY'),
    ('atoz-roadmap', 'A-to-Z Roadmap', 'PART 3 • STRATEGY'),
    ('space', 'Space & Partners', 'PART 3 • STRATEGY'),
    ('biff', 'BIFF Comparison', 'PART 3 • STRATEGY'),
    
    ('budget', 'Budget Plan', 'PART 4 • FINANCE'),
    ('cashflow', 'Cash Flow', 'PART 4 • FINANCE'),
    ('seedmoney', 'Initial Budget', 'PART 4 • FINANCE'),
    ('sponsorship', 'Sponsorship Plan', 'PART 4 • FINANCE'),
    ('marketing', 'Marketing Strategy', 'PART 4 • FINANCE'),
    
    ('political', 'Risk Management', 'PART 5 • GOVERNANCE'),
    ('personnel', 'Personnel', 'PART 5 • GOVERNANCE')
]

def make_header(num, title, group):
    return f'''<div class="section-label">{group}</div>
            <div class="section-title">{num}. {title}</div>'''

parts = re.split(r'(<section)', content)
new_content = parts[0]
section_counter = 1
current_group = ""

for i in range(1, len(parts), 2):
    tag = parts[i]
    body = parts[i+1]
    
    id_match = re.search(r'id="([^"]+)"', body)
    if not id_match:
        new_content += tag + body
        continue
    
    sid = id_match.group(1)
    meta = next((m for m in sections_meta if m[0] == sid), None)
    
    if meta:
        sid, title_text, group_label = meta
        
        # Reset counter if group changes
        if group_label != current_group:
            section_counter = 1
            current_group = group_label
            
        new_header = make_header(section_counter, title_text, group_label)
        
        # P2: label + title
        p2 = re.search(r'<div class="section-label">.*?</div>\s*<div class="section-title">.*?</div>', body, re.DOTALL)
        if p2:
            body = body[:p2.start()] + new_header + body[p2.end():]
        else:
            # P2_simple: just title
            p2_simple = re.search(r'<div class="section-title">.*?</div>', body, re.DOTALL)
            if p2_simple:
                 body = body[:p2_simple.start()] + new_header + body[p2_simple.end():]
            else:
                 # P1: subtitle + h2
                 p1 = re.search(r'<div class="subtitle">.*?</div>\s*<h2>.*?</h2>', body, re.DOTALL)
                 if p1:
                     body = body[:p1.start()] + new_header + body[p1.end():]
                 else:
                     # h2 only
                     h2 = re.search(r'<h2>.*?</h2>', body, re.DOTALL)
                     if h2:
                         body = body[:h2.start()] + new_header + body[h2.end():]
                     else:
                         # Fallback: prepend to section-content
                         sc = re.search(r'<div class="section-content">', body)
                         if sc:
                             body = body[:sc.end()] + "\n" + new_header + body[sc.end():]
        
        section_counter += 1
    
    new_content += tag + body

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)
