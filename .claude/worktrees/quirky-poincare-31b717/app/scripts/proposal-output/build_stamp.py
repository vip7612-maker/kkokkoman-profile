"""붉은 원형 도장 이미지 생성 — '김춘흥' 3글자 가로 배치."""
from PIL import Image, ImageDraw, ImageFont

OUT = "/Users/kj.lee/dev/꼬꼬맨 프로필페이지/app/scripts/proposal-output/stamp.png"
KOR_FONT = "/System/Library/Fonts/Supplemental/AppleGothic.ttf"

SIZE = 320  # 고해상도; 문서 삽입 시 작게 축소됨
RED = (192, 39, 35, 255)
TRANSPARENT = (255, 255, 255, 0)

img = Image.new("RGBA", (SIZE, SIZE), TRANSPARENT)
draw = ImageDraw.Draw(img)

# 외곽 원 (두꺼운 테두리)
border = 16
pad = 12
draw.ellipse((pad, pad, SIZE - pad, SIZE - pad), outline=RED, width=border)

# 안쪽 원 (얇은 보조 원)
inner_pad = pad + border + 8
draw.ellipse((inner_pad, inner_pad, SIZE - inner_pad, SIZE - inner_pad), outline=RED, width=2)

# 글자 영역
text_pad = inner_pad + 14

# 김춘흥 3글자를 정사각형 영역에 가로 배치
text = "김춘흥"
font_size = 78
font = ImageFont.truetype(KOR_FONT, font_size)

spacing = 4
total_w = 0
char_widths = []
for ch in text:
    bbox = draw.textbbox((0, 0), ch, font=font)
    cw = bbox[2] - bbox[0]
    char_widths.append(cw)
    total_w += cw
total_w += spacing * (len(text) - 1)

start_x = (SIZE - total_w) / 2
# Y는 글자 높이 기준 중앙
sample_bbox = draw.textbbox((0, 0), "김", font=font)
ch_h = sample_bbox[3] - sample_bbox[1]
start_y = (SIZE - ch_h) / 2 - sample_bbox[1]

x = start_x
for ch, cw in zip(text, char_widths):
    draw.text((x, start_y), ch, font=font, fill=RED)
    x += cw + spacing

# 약간의 거친 질감 (실제 도장 느낌) — 옵션
import random
random.seed(7)
for _ in range(180):
    px = random.randint(0, SIZE - 1)
    py = random.randint(0, SIZE - 1)
    cx, cy = SIZE / 2, SIZE / 2
    dist = ((px - cx) ** 2 + (py - cy) ** 2) ** 0.5
    if dist < SIZE / 2 - pad - 2:
        a = img.getpixel((px, py))[3]
        if a > 0:
            if random.random() < 0.25:
                img.putpixel((px, py), TRANSPARENT)

img.save(OUT, "PNG")
print("[ok] saved:", OUT)
