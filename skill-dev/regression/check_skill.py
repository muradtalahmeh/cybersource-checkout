"""Static checks on a skill directory.
  python3 check_skill.py <skillDir> <out.json> [--make-inventory inv.json] [--inventory inv.json]
  * SKILL.md frontmatter: name + description present
  * every path mentioned in SKILL.md / references (references/…, scripts/…, template/…) exists
  * sha256 of every file under template/ and scripts/ (code identity between versions)
  * rule inventory: --make-inventory stores every instruction unit (bullet / numbered
    item / paragraph) of SKILL.md; --inventory checks each unit is still present
    verbatim (whitespace-normalised) somewhere in SKILL.md or references/**/*.md
"""
import glob, hashlib, json, os, re, sys

skill = os.path.abspath(sys.argv[1]); out = sys.argv[2]; args = sys.argv[3:]
res = {'problems': []}
md = open(os.path.join(skill, 'SKILL.md'), encoding='utf-8').read()
m = re.match(r'^---\n(.*?)\n---\n', md, re.S)
fm = m.group(1) if m else ''
res['frontmatter'] = {'name': (re.search(r'^name:\s*(.+)$', fm, re.M) or [None, None])[1], 'description_len': len((re.search(r'^description:\s*(.+)$', fm, re.M) or [None, ''])[1])}
if not res['frontmatter']['name'] or not res['frontmatter']['description_len']: res['problems'].append('frontmatter incomplete')
docs = {'SKILL.md': md}
for f in glob.glob(os.path.join(skill, 'references', '**', '*.md'), recursive=True):
    docs[os.path.relpath(f, skill)] = open(f, encoding='utf-8').read()
missing = []
for name, text in docs.items():
    for ref in set(re.findall(r'(?<![\w/.-])((?:references|scripts|template)/[\w./-]*[\w/])', text)):
        if not os.path.exists(os.path.join(skill, ref.rstrip('/'))): missing.append(f'{name}: {ref}')
res['missing_paths'] = missing
if missing: res['problems'].append(f'{len(missing)} referenced paths missing')
res['code_hashes'] = {os.path.relpath(f, skill): hashlib.sha256(open(f, 'rb').read()).hexdigest()
                      for d in ('template', 'scripts') for f in sorted(glob.glob(os.path.join(skill, d, '**', '*'), recursive=True)) if os.path.isfile(f)}
norm = lambda s: re.sub(r'\s+', ' ', s).strip()
def units(text):
    body = re.sub(r'^---\n.*?\n---\n', '', text, flags=re.S)
    body = re.sub(r'```.*?```', lambda m: '\n'.join(l for l in m.group(0).splitlines() if not l.startswith('```')), body, flags=re.S)
    out, cur = [], []
    for line in body.splitlines():
        if re.match(r'^\s*([-*]|\d+\.)\s+', line) or not line.strip() or line.startswith('#'):
            if cur: out.append(norm(' '.join(cur))); cur = []
            if line.strip() and not line.startswith('#'): cur = [re.sub(r'^\s*([-*]|\d+\.)\s+', '', line)]
        else: cur.append(line)
    if cur: out.append(norm(' '.join(cur)))
    return [u for u in out if len(u) > 25]
if '--make-inventory' in args:
    inv = args[args.index('--make-inventory') + 1]
    json.dump({'description': norm((re.search(r'^description:\s*(.+)$', fm, re.M) or [None, ''])[1]), 'units': units(md)}, open(inv, 'w'), ensure_ascii=False, indent=1)
    res['inventory_written'] = inv
if '--inventory' in args:
    inv = json.load(open(args[args.index('--inventory') + 1]))
    corpus = norm(' '.join(re.sub(r'```', ' ', t) for t in docs.values()))
    lost = [u for u in inv['units'] if u not in corpus]
    res['inventory'] = {'units': len(inv['units']), 'present_verbatim': len(inv['units']) - len(lost), 'not_verbatim': lost}
json.dump(res, open(out, 'w'), ensure_ascii=False, indent=1)
print(f"skill {res['frontmatter']['name']}: {len(res['code_hashes'])} code files, missing paths {len(missing)}" + (f", inventory {res['inventory']['present_verbatim']}/{res['inventory']['units']} verbatim" if 'inventory' in res else ''))
