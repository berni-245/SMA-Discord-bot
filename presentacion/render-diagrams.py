#!/usr/bin/env python3
"""Render Mermaid diagrams to PNG. Tries mmdc first, then mermaid.ink as fallback."""
import subprocess, sys, os, base64, urllib.request, urllib.error, zlib, json

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DIAGRAMS_DIR = os.path.join(SCRIPT_DIR, 'diagrams')
THEME_FILE = os.path.join(SCRIPT_DIR, 'mermaid-theme.json')
MMDC = os.path.join(SCRIPT_DIR, 'node_modules', '.bin', 'mmdc')

SCENARIOS = ['A', 'B', 'C', 'D', 'G']

def encode_for_mermaid_ink(code):
    """Encode mermaid code using pako-compatible raw deflate + base64url for mermaid.ink."""
    data = json.dumps({'code': code, 'mermaid': {'theme': 'dark'}}).encode('utf-8')
    compress_obj = zlib.compressobj(9, zlib.DEFLATED, -zlib.MAX_WBITS)
    compressed = compress_obj.compress(data) + compress_obj.flush()
    return base64.urlsafe_b64encode(compressed).decode().rstrip('=')

def try_mmdc(sid):
    mmd = os.path.join(DIAGRAMS_DIR, f'escenario-{sid}.mmd')
    png = os.path.join(DIAGRAMS_DIR, f'escenario-{sid}.png')
    if not os.path.exists(MMDC):
        print(f'  mmdc not found at {MMDC}')
        return False
    try:
        result = subprocess.run(
            [MMDC, '-i', mmd, '-o', png, '-c', THEME_FILE, '-b', '#2B2D31', '-w', '1400', '--quiet'],
            timeout=90, capture_output=True
        )
        if result.returncode == 0 and os.path.exists(png) and os.path.getsize(png) > 2000:
            print(f'  ✅ mmdc -> escenario-{sid}.png ({os.path.getsize(png)//1024}KB)')
            return True
        err = result.stderr.decode()[:300]
        print(f'  ⚠️  mmdc exit {result.returncode}: {err}')
        return False
    except subprocess.TimeoutExpired:
        print(f'  ⚠️  mmdc timed out')
        return False
    except Exception as e:
        print(f'  ⚠️  mmdc error: {e}')
        return False

def try_mermaid_ink(sid):
    mmd = os.path.join(DIAGRAMS_DIR, f'escenario-{sid}.mmd')
    png = os.path.join(DIAGRAMS_DIR, f'escenario-{sid}.png')
    with open(mmd, 'r', encoding='utf-8') as f:
        code = f.read()
    try:
        encoded = encode_for_mermaid_ink(code)
        url = f'https://mermaid.ink/img/pako:{encoded}?bgColor=%232B2D31&scale=2'
        print(f'  Fetching mermaid.ink...')
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
        with open(png, 'wb') as f:
            f.write(data)
        if os.path.getsize(png) > 2000:
            print(f'  ✅ mermaid.ink -> escenario-{sid}.png ({os.path.getsize(png)//1024}KB)')
            return True
        os.remove(png)
        return False
    except Exception as e:
        print(f'  ⚠️  mermaid.ink error: {e}')
        if os.path.exists(png):
            os.remove(png)
        return False

def main():
    print(f'Diagrams dir: {DIAGRAMS_DIR}')
    for sid in SCENARIOS:
        mmd = os.path.join(DIAGRAMS_DIR, f'escenario-{sid}.mmd')
        png = os.path.join(DIAGRAMS_DIR, f'escenario-{sid}.png')
        if not os.path.exists(mmd):
            print(f'\n❌ Missing: {mmd}')
            continue
        if os.path.exists(png) and os.path.getsize(png) > 2000:
            print(f'\n⏭  escenario-{sid}.png already exists, skipping')
            continue
        print(f'\nRendering escenario {sid}...')
        if try_mmdc(sid):
            continue
        if try_mermaid_ink(sid):
            continue
        print(f'  ❌ Could not render escenario {sid} — will use placeholder in deck')

if __name__ == '__main__':
    main()
