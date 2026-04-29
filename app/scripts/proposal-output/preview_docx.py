"""docx → html (mammoth) → PNG (Chrome headless) 표 시각 검증."""
import mammoth, subprocess, sys, os

DOCX = "/Users/kj.lee/dev/꼬꼬맨 프로필페이지/app/scripts/proposal-output/instructor-card.docx"
HTML = "/tmp/card-preview.html"
PNG  = "/tmp/card-preview.png"

with open(DOCX, "rb") as f:
    result = mammoth.convert_to_html(f, convert_image=mammoth.images.inline(lambda i: {"src": ""}))

style = """
<meta charset='utf-8'>
<style>
  body{font-family:'AppleGothic','Apple SD Gothic Neo','Malgun Gothic',sans-serif;
       padding:32px;color:#222;width:740px;}
  table{border-collapse:collapse;margin:6px 0;}
  table, th, td{border:1px solid #444;}
  th, td{padding:6px 8px;font-size:13px;}
  h1{font-size:22px;text-align:center;text-decoration:underline;}
  p{margin:2px 0;font-size:12px;line-height:1.55;}
  img{max-width:60px;}
</style>
"""

with open(HTML, "w") as f:
    f.write(f"<!doctype html><html><head>{style}</head><body>{result.value}</body></html>")
print("html:", HTML, len(result.value), "chars")

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
subprocess.run([
    CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
    "--screenshot=" + PNG, "--window-size=900,1400",
    "file://" + HTML,
], check=True, stderr=subprocess.DEVNULL)
print("png:", PNG, os.path.getsize(PNG), "bytes")
