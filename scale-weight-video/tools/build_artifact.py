"""Build artifact/index.html (Claude Artifact page) from artifact/page.src.html:
inlines the Cairo fonts as data URIs and writes the verified facts list.
  python3 tools/build_artifact.py "fact 1" "fact 2" ...
"""
import base64, json, os, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(root, 'artifact/page.src.html'), encoding='utf-8').read()
css = open(os.path.join(root, 'css/style.css'), encoding='utf-8').read().split('\n\n')[0]
for f in ('cairo-arabic-700-normal.woff2', 'cairo-latin-700-normal.woff2'):
    b64 = base64.b64encode(open(os.path.join(root, 'assets/fonts', f), 'rb').read()).decode()
    css = css.replace('url(../assets/fonts/%s)' % f, 'url(data:font/woff2;base64,%s)' % b64)
src = src.replace('/*FONTS*/', css)
src = src.replace('<!--VERIFIED-->', '<script>window.VERIFIED = %s;</script>' % json.dumps(sys.argv[1:], ensure_ascii=False))
open(os.path.join(root, 'artifact/index.html'), 'w', encoding='utf-8').write(src)
print('artifact/index.html', len(src.encode()), 'bytes')
