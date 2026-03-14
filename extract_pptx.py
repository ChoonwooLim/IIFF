import zipfile
from xml.etree import ElementTree as ET
import re

NS = {
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
}

def extract_text_from_slide(z, slide_path):
    data = z.read(slide_path)
    root = ET.fromstring(data)
    texts = []
    
    for sp in root.iter('{http://schemas.openxmlformats.org/presentationml/2006/main}sp'):
        frame_texts = []
        for txBody in sp.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}txBody'):
            for p in txBody.findall('{http://schemas.openxmlformats.org/drawingml/2006/main}p'):
                para_text = ''
                for r in p.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}r'):
                    t = r.find('{http://schemas.openxmlformats.org/drawingml/2006/main}t')
                    if t is not None and t.text:
                        para_text += t.text
                for fld in p.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}fld'):
                    t = fld.find('{http://schemas.openxmlformats.org/drawingml/2006/main}t')
                    if t is not None and t.text:
                        para_text += t.text
                if para_text.strip():
                    frame_texts.append(para_text.strip())
        if frame_texts:
            texts.append('\n'.join(frame_texts))

    # Tables
    for graphicFrame in root.iter('{http://schemas.openxmlformats.org/presentationml/2006/main}graphicFrame'):
        for tbl in graphicFrame.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}tbl'):
            table_rows = []
            for tr in tbl.findall('{http://schemas.openxmlformats.org/drawingml/2006/main}tr'):
                row_texts = []
                for tc in tr.findall('{http://schemas.openxmlformats.org/drawingml/2006/main}tc'):
                    cell_text = ''
                    for p in tc.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}p'):
                        for r_elem in p.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}r'):
                            t = r_elem.find('{http://schemas.openxmlformats.org/drawingml/2006/main}t')
                            if t is not None and t.text:
                                cell_text += t.text
                    row_texts.append(cell_text.strip())
                if any(row_texts):
                    table_rows.append(' | '.join(row_texts))
            if table_rows:
                texts.append('[TABLE]\n' + '\n'.join(table_rows))

    return texts

z = zipfile.ZipFile(r'D:\GoogleDrive\인천국제영화제\20260314_ iiff기획 정리.pptx')
slides = sorted(
    [n for n in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml$', n)],
    key=lambda x: int(re.search(r'\d+', x.split('/')[-1]).group())
)

output = []
for i, slide in enumerate(slides, 1):
    texts = extract_text_from_slide(z, slide)
    slide_content = '\n---\n'.join(texts)
    output.append(f"========== SLIDE {i} ==========\n{slide_content}\n")

out_path = r'C:\WORK\IIFF\pptx_content.txt'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(output))

print(f"Extracted text from {len(slides)} slides -> {out_path}")
