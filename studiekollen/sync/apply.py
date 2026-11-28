#!/usr/bin/env python3
"""Uppdaterar Studiekollens krypterade datafil (data.enc.json).

Nyckeln läses från miljövariabeln SK_KEY (base64url, 32 byte). Den finns aldrig i repot.

  SK_KEY=... python3 sync/apply.py ops ops.json     # samma ops som db_write: [{"op":"set|update|delete","path":"uppgifter/id","data":{...}}]
  SK_KEY=... python3 sync/apply.py full full.json   # ersätt allt: {"coll":{"uppgifter":[{"id":...},...],...}}
  SK_KEY=... python3 sync/apply.py show             # skriv ut innehållet (för kontroll)
"""
import base64, json, os, sys, datetime
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

HERE = os.path.dirname(os.path.abspath(__file__))
FILE = os.path.join(HERE, '..', 'data.enc.json')

def b64d(s): return base64.urlsafe_b64decode(s + '=' * (-len(s) % 4))
def b64e(b): return base64.urlsafe_b64encode(b).decode().rstrip('=')

def key():
    k = os.environ.get('SK_KEY', '')
    if not k: sys.exit('SK_KEY saknas')
    return AESGCM(b64d(k))

def load():
    if not os.path.exists(FILE): return {"app": "studiekollen", "v": 1, "coll": {}}
    e = json.load(open(FILE))
    return json.loads(key().decrypt(b64d(e['iv']), b64d(e['ct']), None))

def save(o):
    o['app'] = 'studiekollen'; o['v'] = 1
    o['exporterad'] = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds')
    iv = os.urandom(12)
    ct = key().encrypt(iv, json.dumps(o, ensure_ascii=False, separators=(',', ':')).encode(), None)
    json.dump({"v": 1, "iv": b64e(iv), "ct": b64e(ct)}, open(FILE, 'w'))

def apply_ops(o, ops):
    coll = o.setdefault('coll', {})
    n = 0
    for op in ops:
        c, _, i = op['path'].partition('/')
        rows = coll.setdefault(c, [])
        idx = next((k for k, r in enumerate(rows) if r.get('id') == i), None)
        kind = op.get('op', 'set')
        if kind == 'delete':
            if idx is not None: rows.pop(idx); n += 1
            continue
        d = dict(op.get('data') or {})
        if kind == 'update' and idx is not None:
            r = dict(rows[idx]); r.update(d); r['id'] = i; rows[idx] = r
        else:
            d['id'] = i
            if idx is None: rows.append(d)
            else: rows[idx] = d
        n += 1
    return n

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'ops':
        o = load(); ops = json.load(open(sys.argv[2]))
        if isinstance(ops, dict): ops = ops.get('ops', [])
        n = apply_ops(o, ops); save(o); print(f'{n} ändringar sparade')
    elif cmd == 'full':
        f = json.load(open(sys.argv[2])); o = load(); o['coll'] = f.get('coll', f)
        if f.get('namn'): o['namn'] = f['namn']
        save(o); print('Allt ersatt:', {c: len(v) for c, v in o['coll'].items()})
    elif cmd == 'show':
        o = load(); print(json.dumps({c: len(v) for c, v in o.get('coll', {}).items()}), o.get('exporterad'))
    else:
        print(__doc__)
