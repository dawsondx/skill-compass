#!/usr/bin/env python3
"""解析 IMA 开源 Skill 清单页面（资料库导出的 HTML 表格）为 JSON。
用法: python parse_ima_list.py <html> <out.json>
"""
import re
import sys
import json
import html as H

src = open(sys.argv[1], encoding='utf-8').read()
body = src[src.index('<tbody'):src.index('</tbody>')]

rows = re.split(r'<tr ', body)[1:]
out = []
for r in rows:
    cat = re.search(r'data-cat="([^"]*)"', r)
    cells = re.findall(r'<td[^>]*>(.*?)</td>', r, re.S)
    if len(cells) < 6:
        continue
    def txt(s):
        s = re.sub(r'<!--.*?-->', '', s, flags=re.S)
        s = re.sub(r'<[^>]+>', '', s)
        return H.unescape(s).strip()
    href = re.search(r'href="([^"]+)"', cells[2])
    out.append({
        'idx': txt(cells[0]),
        'name': txt(cells[1]),
        'url': href.group(1) if href else '',
        'repo': txt(cells[2]),
        'desc': txt(cells[3]),
        'cat': cat.group(1) if cat else txt(cells[4]),
        'src': txt(cells[5]),
    })

json.dump(out, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'parsed {len(out)} rows')
