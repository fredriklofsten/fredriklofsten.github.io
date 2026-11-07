#!/usr/bin/env python3
"""Bygger Rymdakademin från src/.

  python3 build.py            -> out/web  (en fil som laddar 3D och typsnitt från nätet)
                                 out/www  (helt fristående: webbappen på GitHub Pages och i Android-appen)
"""
import hashlib, json, os, re, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'src')
OUT = os.path.join(HERE, sys.argv[1] if len(sys.argv) > 1 else 'out')
VER = os.environ.get('RYMD_VERSION', '')

ORDER = ['data.js', 'topics.js', 'engine.js', 'app.js', 'skymap.js', 'features.js', 'profile.js',
         'family.js', 'space3d.js', 'space3dfx.js', 'terms.js', 'init.js']


def read(p):
    with open(os.path.join(SRC, p), encoding='utf-8') as f:
        return f.read()


def bundle():
    credits = json.load(open(os.path.join(SRC, 'img', 'credits.json'), encoding='utf-8'))
    parts = []
    for name in ORDER:
        js = read(name)
        if name == 'topics.js':
            js = js.replace('/*PHOTOS*/{}', json.dumps(credits, ensure_ascii=False))
        if name == 'family.js' and VER:
            js = re.sub(r"const APPVER='[^']*'", f"const APPVER='{VER}'", js)
        parts.append(js)
    return read('head.html') + '<script>\n' + '\n'.join(parts) + '\n</script>\n</body>\n</html>\n'


def copy_imgs(dst):
    os.makedirs(os.path.join(dst, 'img'), exist_ok=True)
    for f in os.listdir(os.path.join(SRC, 'img')):
        if f.endswith('.jpg'):
            shutil.copy(os.path.join(SRC, 'img', f), os.path.join(dst, 'img', f))


def build_web(html):
    d = os.path.join(OUT, 'web')
    shutil.rmtree(d, ignore_errors=True)
    os.makedirs(d)
    open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(html)
    shutil.copy(os.path.join(HERE, 'vendor', 'tts.js'), d)
    copy_imgs(d)


FONTS = [('Fredoka', 'fredoka', [500, 600, 700]), ('Nunito', 'nunito', [400, 600, 800]),
         ('Atkinson Hyperlegible', 'atkinson-hyperlegible', [400, 700])]


def build_www(html):
    W = os.path.join(OUT, 'www')
    shutil.rmtree(W, ignore_errors=True)
    for sub in ('lib', 'fonts', 'icons'):
        os.makedirs(os.path.join(W, sub))
    for f in os.listdir(os.path.join(HERE, 'vendor', 'three')):
        shutil.copy(os.path.join(HERE, 'vendor', 'three', f), os.path.join(W, 'lib', f))
    shutil.copy(os.path.join(HERE, 'vendor', 'tts.js'), W)
    for f in os.listdir(os.path.join(HERE, 'icons')):
        shutil.copy(os.path.join(HERE, 'icons', f), os.path.join(W, 'icons', f))
    copy_imgs(W)
    ff = []
    for fam, slug, ws in FONTS:
        for w in ws:
            fn = f'{slug}-latin-{w}-normal.woff2'
            shutil.copy(os.path.join(HERE, 'vendor', 'fonts', fn), os.path.join(W, 'fonts', fn))
            ff.append(f"@font-face{{font-family:'{fam}';font-style:normal;font-weight:{w};font-display:swap;src:url(fonts/{fn}) format('woff2')}}")
    s = html
    s = s.replace("'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'", "'lib/three.min.js'")
    s = s.replace("'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js'", "'lib/OrbitControls.js'")
    s = s.replace("'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/'+p+'.js'", "'lib/'+p.split('/').pop()+'.js'")
    assert 'cdn.jsdelivr' not in s and 'cdnjs' not in s, 'CDN-adress kvar'
    s = re.sub(r'<link rel="preconnect"[^>]*>\n?', '', s)
    s = re.sub(r'<link href="https://fonts.googleapis.com[^>]*>\n?', '', s)
    assert 'googleapis' not in s
    head_add = '''<meta name="theme-color" content="#0a0d2b">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="Rymdakademin">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/icon-180.png">
<style>''' + ''.join(ff) + '''
.top{padding-top:env(safe-area-inset-top)}</style>
'''
    s = s.replace('<title>Rymdakademin</title>', '<title>Rymdakademin</title>\n' + head_add, 1)
    s = s.replace('<meta name="viewport" content="width=device-width, initial-scale=1">',
                  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">', 1)
    s = s.replace('</body>', '<script>if("serviceWorker" in navigator&&location.protocol==="https:"){navigator.serviceWorker.register("sw.js").catch(function(){});}</script>\n</body>', 1)
    open(os.path.join(W, 'index.html'), 'w', encoding='utf-8').write(s)
    json.dump({"name": "Rymdakademin", "short_name": "Rymdakademin", "description": "Lär dig om rymden med planeter, quiz, stjärnkarta och 3D-rymdresa.",
               "lang": "sv", "start_url": "./index.html", "scope": "./", "display": "standalone", "orientation": "portrait",
               "background_color": "#0a0d2b", "theme_color": "#0a0d2b",
               "icons": [{"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
                         {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png"},
                         {"src": "icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]},
              open(os.path.join(W, 'manifest.webmanifest'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    files, h = [], hashlib.sha1()
    for root, _, fs in os.walk(W):
        for f in sorted(fs):
            rel = os.path.relpath(os.path.join(root, f), W).replace(os.sep, '/')
            files.append('./' + rel)
            h.update(open(os.path.join(root, f), 'rb').read())
    files = ['./'] + sorted(files)
    cache = 'rymdakademin-' + h.hexdigest()[:10]
    sw = f'''const CACHE='{cache}';const FILES={json.dumps(files)};
self.addEventListener('install',e=>{{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));}});
self.addEventListener('activate',e=>{{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));}});
self.addEventListener('fetch',e=>{{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request,{{ignoreSearch:true}}).then(r=>r||fetch(e.request)));}});
'''
    open(os.path.join(W, 'sw.js'), 'w').write(sw)
    return cache


if __name__ == '__main__':
    html = bundle()
    build_web(html)
    print('web klar, cache:', build_www(html))
