"""
강사 김춘흥 (연주하는 꼬꼬맨) 강의 제안서 — 7페이지 PDF (사진 포함).
ReportLab 내장 CID 한글 폰트 사용 (외부 폰트 파일 불필요).
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, Color, white, black
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

pdfmetrics.registerFont(UnicodeCIDFont("HYSMyeongJo-Medium"))
pdfmetrics.registerFont(UnicodeCIDFont("HYGothic-Medium"))
SERIF = "HYSMyeongJo-Medium"
SANS = "HYGothic-Medium"

WOOD = HexColor("#3D2817")
WOOD_SOFT = HexColor("#6B4A2B")
BEIGE = HexColor("#D4A574")
BEIGE_DEEP = HexColor("#B8854F")
CREAM = HexColor("#F5F0E8")
BG_PAPER = HexColor("#FBF7F0")
BG_ALT = HexColor("#F5EFE3")
LEAF = HexColor("#6FA257")
INK = HexColor("#2A1B0F")
INK_SOFT = HexColor("#5C4B3A")
LINE = HexColor("#E6DCC8")

W, H = A4
MARGIN_X = 56
TOTAL_PAGES = 7
OUT_PATH = "/Users/kj.lee/dev/꼬꼬맨 프로필페이지/app/scripts/proposal-output/proposal.pdf"

IMG_DIR = "/Users/kj.lee/dev/꼬꼬맨 프로필페이지/app/public/uploads"
IMG = {
    "hero":      f"{IMG_DIR}/profile-hero.jpg",
    "portrait":  f"{IMG_DIR}/profile-portrait.jpg",
    "sangji":    f"{IMG_DIR}/case-sangji.jpg",
    "cafe":      f"{IMG_DIR}/case-cafe.jpg",
    "dome":      f"{IMG_DIR}/case-dome-guitar.jpg",
    "forum":     f"{IMG_DIR}/case-forum.jpg",
    "forum_talk": f"{IMG_DIR}/case-forum-talk.jpg",
}


def draw_paper_bg(c):
    c.setFillColor(BG_PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(Color(0.83, 0.65, 0.45, alpha=0.10))
    c.rect(W * 0.55, H * 0.65, W * 0.45, H * 0.4, stroke=0, fill=1)


def draw_page_footer(c, page_no):
    c.setFillColor(INK_SOFT)
    c.setFont(SANS, 8.5)
    c.drawString(MARGIN_X, 28, "연주하는 꼬꼬맨 | 김춘흥")
    c.drawRightString(W - MARGIN_X, 28, f"{page_no} / {TOTAL_PAGES}")
    c.setStrokeColor(LINE)
    c.setLineWidth(0.5)
    c.line(MARGIN_X, 44, W - MARGIN_X, 44)


def draw_page_header(c, eyebrow: str, title: str):
    c.setFillColor(WOOD)
    c.rect(0, H - 100, 8, 100, stroke=0, fill=1)
    c.setFillColor(BEIGE_DEEP)
    c.setFont(SANS, 9.5)
    c.drawString(MARGIN_X, H - 56, eyebrow.upper())
    c.setFillColor(WOOD)
    c.setFont(SERIF, 26)
    c.drawString(MARGIN_X, H - 86, title)
    c.setStrokeColor(BEIGE)
    c.setLineWidth(1.4)
    c.line(MARGIN_X, H - 100, MARGIN_X + 56, H - 100)


def img_cover(c, key, x, y, w, h, radius=10):
    """사진을 cover 방식(영역 채움 + 비율 유지)으로 그리고 모서리 라운드(클립 시뮬레이션)."""
    img = ImageReader(IMG[key])
    iw, ih = img.getSize()
    # cover 비율 계산
    ratio = max(w / iw, h / ih)
    dw = iw * ratio
    dh = ih * ratio
    dx = x - (dw - w) / 2
    dy = y - (dh - h) / 2
    # 클립
    c.saveState()
    p = c.beginPath()
    p.roundRect(x, y, w, h, radius)
    c.clipPath(p, stroke=0, fill=0)
    c.drawImage(IMG[key], dx, dy, dw, dh, preserveAspectRatio=False, mask="auto")
    c.restoreState()
    # 라운드 보더 살짝
    c.setStrokeColor(LINE)
    c.setLineWidth(0.6)
    c.roundRect(x, y, w, h, radius, stroke=1, fill=0)


def wrap_text(text, font, size, max_width):
    out, line = [], ""
    for ch in text:
        cand = line + ch
        if pdfmetrics.stringWidth(cand, font, size) > max_width and line:
            out.append(line)
            line = ch
        else:
            line = cand
        if ch == "\n":
            out.append(line.rstrip("\n"))
            line = ""
    if line:
        out.append(line)
    return out


def draw_paragraph(c, x, y, text, font, size, leading, color, max_width):
    c.setFillColor(color)
    c.setFont(font, size)
    cy = y
    for ln in wrap_text(text, font, size, max_width):
        c.drawString(x, cy, ln)
        cy -= leading
    return cy


# ─────────────────────────────────────────
# PAGES
# ─────────────────────────────────────────

def page_cover(c):
    c.setFillColor(BG_PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)

    # 우상단 큰 사진 (인물)
    img_cover(c, "hero", W * 0.50, H * 0.45, W * 0.50, H * 0.55, radius=0)

    # 좌상단 짙은 우드 사이드
    c.setFillColor(WOOD)
    c.rect(0, H * 0.45, W * 0.50, H * 0.55, stroke=0, fill=1)

    # 베이지 띠 (사진 아래 가로선)
    c.setFillColor(BEIGE)
    c.rect(0, H * 0.43, W, 6, stroke=0, fill=1)

    # 좌상 영역 텍스트
    c.setFillColor(BEIGE)
    c.setFont(SANS, 11)
    c.drawString(MARGIN_X, H * 0.92, "LECTURE PROPOSAL  |  2026")

    c.setFillColor(CREAM)
    c.setFont(SERIF, 40)
    c.drawString(MARGIN_X, H * 0.83, "강의 제안서")

    c.setFillColor(BEIGE)
    c.setFont(SERIF, 22)
    c.drawString(MARGIN_X, H * 0.76, "연주하는 꼬꼬맨")

    c.setFillColor(CREAM)
    c.setFont(SANS, 12)
    c.drawString(MARGIN_X, H * 0.72, "팬플룻 연주자 | 강사  김춘흥")

    # 작은 점 3개 (장식)
    for i, dx in enumerate([0, 14, 28]):
        c.setFillColor(BEIGE if i < 2 else LEAF)
        c.circle(MARGIN_X + dx, H * 0.66, 3, stroke=0, fill=1)

    c.setFillColor(CREAM)
    c.setFont(SERIF, 14)
    c.drawString(MARGIN_X, H * 0.62, "음악으로 마음을 잇다")

    c.setFillColor(BEIGE)
    c.setFont(SANS, 10)
    draw_paragraph(
        c, MARGIN_X, H * 0.575,
        "전국 팬플룻 대회 금상 30회 수상의 연주자가 전하는 따뜻한 음악·강연 프로그램.",
        SANS, 10, 15, BEIGE, W * 0.5 - MARGIN_X * 1.5,
    )

    # 하단 흰 영역 — 작은 사진 3장 + 카피
    # 좌측 카피
    c.setFillColor(WOOD)
    c.setFont(SERIF, 16)
    c.drawString(MARGIN_X, H * 0.36, "어디서든, 누구에게든.")
    c.setFillColor(INK_SOFT)
    c.setFont(SANS, 10)
    draw_paragraph(
        c, MARGIN_X, H * 0.33,
        "학교 · 기업 · 의료/복지 · 교정시설 — 음악과 이야기가 필요한 곳이라면.",
        SANS, 10, 14, INK_SOFT, W * 0.55,
    )

    # 작은 사진 3장
    sm_y = 130
    sm_h = 90
    sm_w = (W - MARGIN_X * 2 - 20) / 3
    keys = ["sangji", "forum", "cafe"]
    for i, k in enumerate(keys):
        x = MARGIN_X + i * (sm_w + 10)
        img_cover(c, k, x, sm_y, sm_w, sm_h, radius=8)

    # 푸터 정보
    c.setFillColor(INK_SOFT)
    c.setFont(SANS, 9)
    c.drawString(MARGIN_X, 88, "문의  jaru1125@naver.com")
    c.drawString(MARGIN_X, 75, "웹    https://kkokkoman.vercel.app")
    c.drawRightString(W - MARGIN_X, 88, "강원도 원주 외 전국 출강")
    c.drawRightString(W - MARGIN_X, 75, "© 연주하는 꼬꼬맨")
    draw_page_footer(c, 1)


def page_profile(c):
    draw_paper_bg(c)
    draw_page_header(c, "01 — Profile", "강사 소개")

    # 우측 portrait (세로 사진)
    portrait_w = 170
    portrait_h = 220
    portrait_x = W - MARGIN_X - portrait_w
    portrait_y = H - 130 - portrait_h
    img_cover(c, "portrait", portrait_x, portrait_y, portrait_w, portrait_h, radius=12)
    # 캡션
    c.setFillColor(INK_SOFT)
    c.setFont(SANS, 8.5)
    c.drawCentredString(portrait_x + portrait_w / 2, portrait_y - 12, "치악산 자락에서 — 김춘흥")

    # 좌측 본문
    text_x = MARGIN_X
    text_w = portrait_x - MARGIN_X - 20
    y = H - 130

    y = draw_paragraph(
        c, text_x, y,
        "안녕하세요. 팬플룻 연주자이자 강사로 활동하고 있는 김춘흥(예명 ‘연주하는 꼬꼬맨’)입니다. "
        "전국 팬플룻 대회에서 30회 금상을 수상하며 다져온 연주력과, 음악심리·진로코칭 분야의 자격을 바탕으로 "
        "학교·기업·복지/의료·교정 시설을 두루 찾아가 음악으로 마음을 어루만지는 활동을 이어가고 있습니다.",
        SANS, 11, 17, INK, text_w,
    )

    # 통계 박스 (text 영역 아래로)
    y -= 14
    box_y = y - 60
    box_w = (text_w - 16) / 3
    stats = [("30회", "전국 금상"), ("9+", "활동 기관"), ("4종", "전문 자격")]
    for i, (val, lbl) in enumerate(stats):
        x = text_x + i * (box_w + 8)
        c.setFillColor(CREAM)
        c.setStrokeColor(LINE); c.setLineWidth(0.6)
        c.roundRect(x, box_y, box_w, 60, 10, stroke=1, fill=1)
        c.setFillColor(WOOD); c.setFont(SERIF, 18)
        c.drawString(x + 12, box_y + 33, val)
        c.setFillColor(INK_SOFT); c.setFont(SANS, 8.5)
        c.drawString(x + 12, box_y + 16, lbl)

    # 학력 / 자격 / 표창 — 좌측 영역 아래쪽
    y_section = portrait_y - 20

    def section(label, items, y):
        c.setFillColor(WOOD); c.setFont(SERIF, 13)
        c.drawString(MARGIN_X, y, label)
        c.setStrokeColor(BEIGE); c.setLineWidth(1)
        c.line(MARGIN_X, y - 4, MARGIN_X + 26, y - 4)
        cy = y - 18
        c.setFont(SANS, 10)
        for it in items:
            c.setFillColor(BEIGE_DEEP); c.drawString(MARGIN_X, cy, "•")
            c.setFillColor(INK)
            c.drawString(MARGIN_X + 12, cy, it)
            cy -= 14
        return cy - 6

    y = y_section
    y = section("학력", ["세종사이버대학교 졸업"], y)
    y = section("자격사항", [
        "음악심리 상담사", "진로코칭 지도사",
        "장애인 인식 개선 지도사", "팬플룻 지도사",
    ], y)
    y = section("표창 및 수상", [
        "전국 팬플룻 대회 금상 30회 수상",
        "대한민국 자원봉사 우수상",
        "원주시의회 시의장 표창 2회",
        "국회의원 표창",
    ], y)

    draw_page_footer(c, 2)


def page_contents(c):
    draw_paper_bg(c)
    draw_page_header(c, "02 — Programs", "강의 콘텐츠")

    y = H - 130
    y = draw_paragraph(
        c, MARGIN_X, y,
        "현장의 분위기와 청중의 호흡에 맞춰 네 가지 주제를 유연하게 조합해 진행합니다. "
        "모든 프로그램은 짧은 라이브 연주와 함께 흘러갑니다.",
        SANS, 11, 17, INK, W - MARGIN_X * 2,
    )
    y -= 8

    # 카드 + 작은 사진 4개
    cards = [
        ("01", "음악으로 마음을 잇다", "음악심리 | 정서치유",
         "팬플룻 연주에 마음을 비추어, 청중 스스로의 감정을 따뜻하게 들여다보게 하는 시간.",
         "sangji"),
        ("02", "진로 코칭과 자존감 회복", "청소년 | 청년 | 재취업",
         "‘남들과 다른 길’을 걸어온 강사의 이야기와, 진로코칭 도구를 함께 풀어내는 강연.",
         "forum_talk"),
        ("03", "장애인 인식 개선", "기업 | 학교 | 의무교육",
         "법정 의무교육의 틀을 갖추되, 음악이라는 공통 언어로 부드럽게 풀어내는 인식 개선 강의.",
         "forum"),
        ("04", "팬플룻 입문 클래스", "워크숍 | 체험형",
         "‘악보를 못 읽어도 첫 곡을 불 수 있다’를 약속하는 입문 클래스. 첫 음을 함께 만듭니다.",
         "cafe"),
    ]

    col_w = (W - MARGIN_X * 2 - 18) / 2
    card_h = 188
    img_h = 80
    for idx, (no, title, sub, body, img_key) in enumerate(cards):
        col = idx % 2
        row = idx // 2
        x = MARGIN_X + col * (col_w + 18)
        cy = y - 18 - row * (card_h + 16)

        # 카드 배경
        c.setFillColor(white)
        c.setStrokeColor(LINE); c.setLineWidth(0.6)
        c.roundRect(x, cy - card_h, col_w, card_h, 14, stroke=1, fill=1)

        # 사진 (카드 상단)
        img_cover(c, img_key, x + 12, cy - 12 - img_h, col_w - 24, img_h, radius=8)

        # 텍스트
        ty = cy - 12 - img_h - 18
        c.setFillColor(BEIGE_DEEP); c.setFont(SERIF, 10)
        c.drawString(x + 14, ty, no)
        c.setFillColor(WOOD); c.setFont(SERIF, 13)
        c.drawString(x + 32, ty, title)

        ty -= 14
        c.setFillColor(LEAF); c.setFont(SANS, 8.5)
        c.drawString(x + 14, ty, sub)

        ty -= 14
        c.setFillColor(INK_SOFT); c.setFont(SANS, 9.5)
        for ln in wrap_text(body, SANS, 9.5, col_w - 28):
            c.drawString(x + 14, ty, ln)
            ty -= 13

    draw_page_footer(c, 3)


def page_formats(c):
    draw_paper_bg(c)
    draw_page_header(c, "03 — Formats", "진행 형식")

    y = H - 130
    y = draw_paragraph(
        c, MARGIN_X, y,
        "현장 규모와 시간에 맞춰 네 가지 표준 포맷을 운영합니다. 필요에 따라 시간·구성은 조정 가능합니다.",
        SANS, 11, 17, INK, W - MARGIN_X * 2,
    )
    y -= 16

    headers = ["포맷", "시간", "구성", "권장 대상"]
    col_x = [MARGIN_X, MARGIN_X + 150, MARGIN_X + 220, MARGIN_X + 380]
    col_w = [150, 70, 160, W - MARGIN_X - (MARGIN_X + 380)]

    rows = [
        ("강연", "60분", "오프닝 연주 1곡 → 메인 강연 → 클로징 연주 1곡", "학교·기업·기관 일반 청중"),
        ("강연 + 미니 콘서트", "90분", "강연 50분 + 라이브 연주 4~5곡", "행사·기념일·연수회"),
        ("풀 콘서트", "70분", "팬플룻 솔로 6~8곡 (스토리텔링 포함)", "지역 행사·작은 콘서트홀"),
        ("팬플룻 워크숍", "100분", "이론 30분 + 체험 60분 + 합주 10분", "동아리·청소년 캠프"),
    ]

    c.setFillColor(WOOD)
    c.rect(MARGIN_X, y - 26, W - MARGIN_X * 2, 26, stroke=0, fill=1)
    c.setFillColor(CREAM); c.setFont(SANS, 10.5)
    for i, h in enumerate(headers):
        c.drawString(col_x[i] + 8, y - 9, h)
    y -= 26

    for i, row in enumerate(rows):
        row_h = 36
        if i % 2 == 0:
            c.setFillColor(BG_ALT)
            c.rect(MARGIN_X, y - row_h, W - MARGIN_X * 2, row_h, stroke=0, fill=1)
        c.setFillColor(INK); c.setFont(SANS, 10)
        for j, cell_text in enumerate(row):
            wrapped = wrap_text(cell_text, SANS, 10, col_w[j] - 16)
            ty = y - 14
            for ln in wrapped[:2]:
                c.drawString(col_x[j] + 8, ty, ln)
                ty -= 12
        c.setStrokeColor(LINE); c.setLineWidth(0.4)
        c.line(MARGIN_X, y - row_h, W - MARGIN_X, y - row_h)
        y -= row_h

    y -= 18
    # 좌측 안내 박스 + 우측 사진
    box_w = (W - MARGIN_X * 2) * 0.62
    img_w = (W - MARGIN_X * 2) * 0.36
    box_h = 130
    c.setFillColor(CREAM); c.setStrokeColor(LINE)
    c.roundRect(MARGIN_X, y - box_h, box_w, box_h, 12, stroke=1, fill=1)
    c.setFillColor(WOOD); c.setFont(SERIF, 13)
    c.drawString(MARGIN_X + 16, y - 22, "운영 안내")
    notes = [
        "• 음향(마이크 1, 무선 마이크 1, 라인 입력)과 보면대를 기관에서 준비.",
        "• 워크숍의 경우 입문용 팬플룻 대여 가능 (별도 협의).",
        "• 출강 가능 지역: 강원도 원주 중심으로 전국. 거리에 따라 출장비 협의.",
        "• 강연료는 청중 규모, 형식, 회차에 따라 유연하게 협의.",
    ]
    ty = y - 44
    c.setFillColor(INK_SOFT); c.setFont(SANS, 9.5)
    for n in notes:
        c.drawString(MARGIN_X + 16, ty, n)
        ty -= 14

    # 우측 사진
    img_cover(c, "dome", MARGIN_X + box_w + 12, y - box_h, img_w - 12, box_h, radius=12)
    c.setFillColor(INK_SOFT); c.setFont(SANS, 8.5)
    c.drawCentredString(MARGIN_X + box_w + 12 + (img_w - 12) / 2, y - box_h - 12,
                        "글램핑 돔 어쿠스틱 무대")

    draw_page_footer(c, 4)


def page_gallery(c):
    """NEW: 현장 갤러리 페이지 — 사진 6장."""
    draw_paper_bg(c)
    draw_page_header(c, "04 — Gallery", "현장 갤러리")

    y = H - 130
    y = draw_paragraph(
        c, MARGIN_X, y,
        "지난 무대와 강의 현장의 한 장면들. 사진을 통해 강의의 결과 분위기를 전합니다.",
        SANS, 11, 17, INK, W - MARGIN_X * 2,
    )
    y -= 12

    # 6장 그리드 3x2
    cols = 3
    rows = 2
    gap = 10
    avail_w = W - MARGIN_X * 2
    cell_w = (avail_w - gap * (cols - 1)) / cols
    cell_h = cell_w * 0.72  # 약간 가로형

    layout = [
        ("hero", "비닐온실 — 베이지 조끼"),
        ("sangji", "상지대 사회복지학과"),
        ("forum", "지식나눔 시브아 포럼"),
        ("forum_talk", "포럼 — 음악과 이야기"),
        ("cafe", "카페 코리안 봄날의 콘서트"),
        ("dome", "글램핑 돔 어쿠스틱"),
    ]
    grid_top = y - 20
    for i, (k, cap) in enumerate(layout):
        col = i % cols
        row = i // cols
        x = MARGIN_X + col * (cell_w + gap)
        cy = grid_top - row * (cell_h + 32)
        img_cover(c, k, x, cy - cell_h, cell_w, cell_h, radius=10)
        c.setFillColor(INK_SOFT); c.setFont(SANS, 8.5)
        c.drawCentredString(x + cell_w / 2, cy - cell_h - 12, cap)

    draw_page_footer(c, 5)


def page_history(c):
    draw_paper_bg(c)
    draw_page_header(c, "05 — Track Record", "강의·연주 이력")

    y = H - 130
    y = draw_paragraph(
        c, MARGIN_X, y,
        "다양한 현장에서 쌓아온 강의·연주 경험의 일부입니다. "
        "기관의 분위기와 청중의 호흡을 가장 중요하게 생각하며 매 무대를 준비합니다.",
        SANS, 11, 17, INK, W - MARGIN_X * 2,
    )
    y -= 12

    # 좌측 그룹 텍스트, 우측 작은 사진
    groups = [
        ("교육 기관", [
            ("상지대학교 사회복지학과", "음악심리 특강 / 학과 초청"),
            ("강의소림 밥포럼", "지역 교양 포럼 강연"),
        ], "sangji"),
        ("기업·공공기관", [
            ("현대글로비스 문막지부", "임직원 인식개선 / 사내 행사"),
            ("산림항공본부", "직원 대상 음악·인문 강연"),
        ], "forum_talk"),
        ("의료·복지·교정", [
            ("내안에병원 (정신건강의학)", "정기 음악 치유 시간"),
            ("원주교도소 / 청주여자교도소", "수형자 대상 음악·인문 강연"),
        ], "hero"),
        ("미디어·기타", [
            ("MBC 강원365", "강원 지역 방송 출연"),
            ("지식나눔 시브아 포럼", "강연·미니콘서트 무대"),
        ], "forum"),
    ]

    text_w = (W - MARGIN_X * 2) * 0.62
    img_w = (W - MARGIN_X * 2) * 0.34
    block_h = 84
    cur_y = y - 16
    for gname, items, img_key in groups:
        # 좌측 그룹 헤더
        c.setFillColor(BEIGE_DEEP)
        c.rect(MARGIN_X, cur_y - 14, 4, 14, stroke=0, fill=1)
        c.setFillColor(WOOD); c.setFont(SERIF, 13)
        c.drawString(MARGIN_X + 12, cur_y - 12, gname)
        ty = cur_y - 30
        for org, role in items:
            c.setFillColor(INK); c.setFont(SANS, 10.5)
            c.drawString(MARGIN_X, ty, org)
            c.setFillColor(INK_SOFT); c.setFont(SANS, 9)
            c.drawString(MARGIN_X + 6, ty - 12, "— " + role)
            ty -= 26

        # 우측 사진
        img_cover(c, img_key, MARGIN_X + text_w + 12, cur_y - block_h, img_w - 12, block_h, radius=10)

        # 구분선
        c.setStrokeColor(LINE); c.setLineWidth(0.5)
        c.line(MARGIN_X, cur_y - block_h - 8, W - MARGIN_X, cur_y - block_h - 8)
        cur_y -= block_h + 18

    # 인용
    c.setFillColor(CREAM); c.setStrokeColor(LINE)
    c.roundRect(MARGIN_X, cur_y - 60, W - MARGIN_X * 2, 60, 12, stroke=1, fill=1)
    c.setFillColor(BEIGE_DEEP); c.setFont(SERIF, 22)
    c.drawString(MARGIN_X + 18, cur_y - 28, "“")
    c.setFillColor(INK); c.setFont(SERIF, 12)
    c.drawString(MARGIN_X + 38, cur_y - 30,
                 "교수님 같지 않은 강사님이 좋았어요. 진짜 사람 이야기 같았습니다.")
    c.setFillColor(INK_SOFT); c.setFont(SANS, 9)
    c.drawString(MARGIN_X + 38, cur_y - 46, "— 상지대학교 사회복지학과 학생 후기")

    draw_page_footer(c, 6)


def page_contact(c):
    draw_paper_bg(c)
    draw_page_header(c, "06 — Contact", "문의 및 강의 요청")

    y = H - 140
    y = draw_paragraph(
        c, MARGIN_X, y,
        "꼬꼬맨을 강사로 모시고 싶다면, 아래 연락처 또는 웹사이트의 강의 요청 폼으로 편하게 연락 주세요. "
        "희망 일정은 여러 개 입력 가능하며, 24시간 안에 회신드리는 것을 목표로 하고 있습니다.",
        SANS, 11.5, 18, INK, W - MARGIN_X * 2,
    )
    y -= 16

    # 연락 카드 2개
    card_w = (W - MARGIN_X * 2 - 18) / 2

    def info_card(x, y, title, lines, accent=BEIGE):
        c.setFillColor(white)
        c.setStrokeColor(LINE); c.setLineWidth(0.7)
        c.roundRect(x, y - 130, card_w, 130, 14, stroke=1, fill=1)
        c.setFillColor(accent)
        c.rect(x, y - 6, card_w, 6, stroke=0, fill=1)
        c.setFillColor(WOOD); c.setFont(SERIF, 14)
        c.drawString(x + 18, y - 32, title)
        c.setFillColor(INK); c.setFont(SANS, 10.5)
        ty = y - 56
        for ln in lines:
            c.drawString(x + 18, ty, ln)
            ty -= 18

    info_card(MARGIN_X, y, "직접 연락",
              ["이메일 · jaru1125@naver.com",
               "활동지역 · 강원도 원주 외 전국",
               "문의 가능 시간 · 평일 09:00 ~ 21:00"], BEIGE)
    info_card(MARGIN_X + card_w + 18, y, "온라인",
              ["웹사이트 · kkokkoman.vercel.app",
               "강의 요청 폼 · /request",
               "강의 사례·후기 · /cases"], LEAF)

    y -= 156

    # 강의 요청에 함께 있으면 좋은 정보
    c.setFillColor(WOOD); c.setFont(SERIF, 14)
    c.drawString(MARGIN_X, y, "강의 요청 시 함께 알려주시면 좋은 정보")
    y -= 8
    c.setStrokeColor(BEIGE); c.setLineWidth(1)
    c.line(MARGIN_X, y, MARGIN_X + 60, y); y -= 16

    items = [
        "기관 / 단체명",
        "담당자 성함과 연락처(이메일·전화)",
        "희망 일정 (가능한 후보 일정 1개 이상, 시간·장소 포함)",
        "대상 청중 (예: 사회복지학과 1~2학년, 임직원, 환우 등)",
        "예상 인원수와 행사 성격(정기 강연 / 일회성 행사 / 공연 등)",
        "원하는 주제와 분위기, 특별히 다뤄주셨으면 하는 키워드",
        "예산 범위 (협의 가능)",
    ]
    c.setFillColor(INK); c.setFont(SANS, 10.5)
    for it in items:
        c.setFillColor(BEIGE_DEEP); c.drawString(MARGIN_X, y, "•")
        c.setFillColor(INK)
        c.drawString(MARGIN_X + 12, y, it)
        y -= 17

    y -= 8
    # 마무리 인사 카드 + 작은 사진
    closing_h = 90
    closing_w = (W - MARGIN_X * 2) * 0.66
    cimg_w = (W - MARGIN_X * 2) * 0.30
    c.setFillColor(CREAM); c.setStrokeColor(LINE)
    c.roundRect(MARGIN_X, y - closing_h, closing_w, closing_h, 14, stroke=1, fill=1)
    c.setFillColor(WOOD); c.setFont(SERIF, 14)
    c.drawString(MARGIN_X + 18, y - 26, "음악으로 마음을 잇다")
    c.setFillColor(INK_SOFT); c.setFont(SANS, 10.5)
    closing = ("연주는 큰 박수가 아니어도 좋습니다. 잠시 호흡을 고를 수 있는 시간을 함께 만드는 것, "
               "그것이 ‘연주하는 꼬꼬맨’이 가장 중요하게 여기는 일입니다. 좋은 자리에서 만나뵙기를 기다리겠습니다.")
    cy = y - 48
    for ln in wrap_text(closing, SANS, 10.5, closing_w - 36):
        c.drawString(MARGIN_X + 18, cy, ln)
        cy -= 14

    img_cover(c, "portrait", MARGIN_X + closing_w + 12, y - closing_h, cimg_w - 12, closing_h, radius=12)

    draw_page_footer(c, 7)


def main():
    c = canvas.Canvas(OUT_PATH, pagesize=A4)
    c.setTitle("강의 제안서 — 연주하는 꼬꼬맨 김춘흥")
    c.setAuthor("김춘흥 (꼬꼬맨)")
    c.setSubject("팬플룻 강의·연주 제안서 (사진 포함, 7페이지)")

    page_cover(c);     c.showPage()
    page_profile(c);   c.showPage()
    page_contents(c);  c.showPage()
    page_formats(c);   c.showPage()
    page_gallery(c);   c.showPage()
    page_history(c);   c.showPage()
    page_contact(c);   c.showPage()
    c.save()
    print(f"[ok] saved: {OUT_PATH}")


if __name__ == "__main__":
    main()
