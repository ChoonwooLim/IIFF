import re

file_path = "C:\\WORK\\IIFF\\index.html"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Split header and the rest
first_section_match = re.search(r'<section', content)
if not first_section_match:
    print("No sections found")
    exit()

start_idx = first_section_match.start()
header = content[:start_idx]
rest = content[start_idx:]

# Split by <section
parts = re.split(r'(<section)', rest)
# parts[0] is empty or text before first section
# parts[1] is <section, parts[2] is body...

sections = {}

# Process pairs
current_footer = ""

for i in range(1, len(parts), 2):
    tag = parts[i]
    body = parts[i+1]
    
    # Extract ID
    id_match = re.search(r'id="([^"]+)"', body)
    if not id_match:
        print(f"Error: Section without ID at index {i}")
        continue
    
    sec_id = id_match.group(1)
    full_html = tag + body
    
    # Check if this is the last one (contains footer)
    # The last chunk will contain </section> then footer then </body>
    # We define footer as everything after the LAST </section> in the chunk
    if i == len(parts) - 2:
        last_close = full_html.rfind('</section>')
        if last_close != -1:
            current_footer = full_html[last_close+10:] # +10 for len('</section>')
            full_html = full_html[:last_close+10]
        else:
            print(f"Warning: Last section {sec_id} has no closing tag")
            
    sections[sec_id] = full_html.strip() # Strip whitespace

# Remove Part 2 divider and comments
for sid in sections:
    sections[sid] = re.sub(r'<div id="part2".*?</div>', '', sections[sid], flags=re.DOTALL)
header = re.sub(r'<!--.*?PART.*?-->', '', header) # Remove part comments

# Define new order
new_order = [
    'cover', 'what-is-iiff', 'overview', 'why-participate', 'why-incheon', 'vision',
    'programs', 'stars', 'simulation', 'volunteer',
    'strategy', 'organization', 'roadmap', 'atoz-roadmap', 'space', 'biff',
    'budget', 'cashflow', 'seedmoney', 'sponsorship', 'marketing',
    'political', 'personnel'
]

# Verify IDs
missing = [nid for nid in new_order if nid not in sections]
if missing:
    print(f"Missing IDs: {missing}")
    # Handle missing IDs gracefully by skipping? Or checking if they are named differently.
    # seedmoney checks:
    if 'seedmoney' in missing and 'initial-budget' in sections:
        print("Found initial-budget instead of seedmoney")
        new_order[new_order.index('seedmoney')] = 'initial-budget'

# Reconstruct
new_content = header
for nid in new_order:
    if nid in sections:
         new_content += sections[nid] + "\n\n"
    else:
        print(f"Skipping missing section: {nid}")

new_content += "\n" + current_footer.strip()

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Reordering complete.")
