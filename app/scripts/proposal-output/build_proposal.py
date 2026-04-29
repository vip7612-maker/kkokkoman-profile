"""
강사 김춘흥 (연주하는 꼬꼬맨) 강의 제안서 — 6페이지 PDF.
ReportLab 내장 CID 한글 폰트 사용 (외부 폰트 파일 불필요).
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas

# ── 폰트 등록 (한글 CID, 외부 파일 불필요) ──
pdfmetrics.registerFont(UnicodeCIDFont("HYSMyeongJo-Medium"))   # 명조 (헤드라인)
pdfmetrics.registerFont(UnicodeCIDFont("HYGothic-Medium"))      # 고딕 (본문)
SERIF = "HYSMyeongJo-Medium"
SANS  = "HYGothic-Medium"

# ── 컬러 팔레트 (사이트와 동일) ──
WOOD       = HexColor("#3D2817")
WOOD_SOFT  = HexColor("#6B4A2B")
BEIGE      = HexColor("#D4A574")
BEIGE_DEEP = HexColor("#B8854F")
CREAM      = HexColor("#F5F0E8")
BG_PAPER   = HexColor("#FBF7F0")
BG_ALT     = HexColor("#F5EFE3")
LEAF       = HexColor("#6FA257")
INK        = HexColor("#2A1B0F")
INK_SOFT   = HexColor("#5C4B3A")
LINE       = HexColor("#E6DCC8")

W, H = A4
MARGIN_X = 56
OUT_PATH = "/Users/kj.lee/dev/꼬꼬맨 프로필페이지/app/scripts/proposal-output/proposal.pdf"


def draw_paper_bg(c):
    """페이지 전체 따뜻한 배경."""
    c.setFillColor(BG_PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    # 우측 상단 베이지 그라데이션 같은 느낌의 사각형 (단색 근사)
    c.setFillColor(Color(0.83, 0.65, 0.45, alpha=0.10))
    c.rect(W * 0.55, H * 0.65, W * 0.45, H * 0.4, stroke=0, fill=1)


def draw_page_footer(c, page_no, total):
    """모든 페이지 하단 푸터."""
    c.setFillColor(INK_SOFT)
    c.setFont(SANS, 8.5)
    c.drawString(MARGIN_X, 28, "연주하는 꼬꼬맨 | 김춘흥")
    c.drawRightString(W - MARGIN_X, 28, f"{page_no} / {total}")
    c.setStrokeColor(LINE)
    c.setLineWidth(0.5)
    c.line(MARGIN_X, 44, W - MARGIN_X, 44)


def draw_page_header(c, eyebrow: str, title: str):
    """페이지 상단 헤더 영역 (왼쪽 우드 색 사이드 바 + 타이틀)."""
    # 좌측 사이드 컬러 바
    c.setFillColor(WOOD)
    c.rect(0, H - 100, 8, 100, stroke=0, fill=1)

    # eyebrow
    c.setFillColor(BEIGE_DEEP)
    c.setFont(SANS, 9.5)
    c.drawString(MARGIN_X, H - 56, eyebrow.upper())

    # 큰 타이틀
    c.setFillColor(WOOD)
    c.setFont(SERIF, 26)
    c.drawString(MARGIN_X, H - 86, title)

    # 구분선
    c.setStrokeColor(BEIGE)
    c.setLineWidth(1.4)
    c.line(MARGIN_X, H - 100, MARGIN_X + 56, H - 100)


def draw_chip(c, x, y, text, fill=CREAM, stroke=LINE, fg=WOOD, font=SANS, size=9, padx=8, pady=4):
    """둥근 칩 박스. 반환: 칩 너비"""
    tw = pdfmetrics.stringWidth(text, font, size)
    width = tw + padx * 2
    height = size + pady * 2
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.setLineWidth(0.6)
    c.roundRect(x, y, width, height, 8, stroke=1, fill=1)
    c.setFillColor(fg)
    c.setFont(font, size)
    c.drawString(x + padx, y + pady + 1.5, text)
    return width


def wrap_text(text, font, size, max_width):
    """문자/공백 기준 단순 줄바꿈."""
    out = []
    line = ""
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
    cur_y = y
    for line in wrap_text(text, font, size, max_width):
        c.drawString(x, cur_y, line)
        cur_y -= leading
    return cur_y


# ─────────────────────────────────────────
# PAGES
# ─────────────────────────────────────────

def page_cover(c):
    # 따뜻한 베이스
    c.setFillColor(BG_PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)

    # 우상단 큰 사각 컬러 블록
    c.setFillColor(WOOD)
    c.rect(0, H * 0.62, W, H * 0.38, stroke=0, fill=1)

    # 베이지 띠
    c.setFillColor(BEIGE)
    c.rect(0, H * 0.60, W, 6, stroke=0, fill=1)

    # 아이콘 자리 (간단 도형으로 팬플룻 모티프)
    cx, cy = MARGIN_X + 12, H * 0.78
    c.setFillColor(BEIGE)
    for i, s in enumerate([26, 30, 34, 38, 42, 46, 50]):
        c.rect(cx + i * 8, cy, 5, s, stroke=0, fill=1)

    # 라벨
    c.setFillColor(BEIGE)
    c.setFont(SANS, 11)
    c.drawString(MARGIN_X, H * 0.74, "LECTURE PROPOSAL  |  2026")

    # 메인 타이틀
    c.setFillColor(CREAM)
    c.setFont(SERIF, 44)
    c.drawString(MARGIN_X, H * 0.685, "강의 제안서")

    # 하단 흰 영역 텍스트
    c.setFillColor(WOOD)
    c.setFont(SERIF, 30)
    c.drawString(MARGIN_X, H * 0.50, "연주하는 꼬꼬맨")

    c.setFillColor(INK)
    c.setFont(SANS, 16)
    c.drawString(MARGIN_X, H * 0.455, "팬플룻 연주자 | 강사  김춘흥")

    # 카피
    c.setFillColor(INK_SOFT)
    c.setFont(SERIF, 18)
    c.drawString(MARGIN_X, H * 0.38, "음악으로 마음을 잇다")
    c.setFont(SANS, 11)
    c.setFillColor(INK_SOFT)
    draw_paragraph(
        c, MARGIN_X, H * 0.34,
        "전국 팬플룻 대회 금상 30회 수상의 연주자가 전하는, "
        "학교|기업|기관|의료/교정 시설을 위한 따뜻한 음악|강연 프로그램.",
        SANS, 11, 17, INK_SOFT, W - MARGIN_X * 2,
    )

    # 하단 정보
    c.setStrokeColor(LINE)
    c.setLineWidth(0.6)
    c.line(MARGIN_X, 110, W - MARGIN_X, 110)
    c.setFillColor(INK_SOFT)
    c.setFont(SANS, 9.5)
    c.drawString(MARGIN_X, 90, "문의  jaru1125@naver.com")
    c.drawString(MARGIN_X, 76, "웹    https://kkokkoman.vercel.app")
    c.drawRightString(W - MARGIN_X, 90, "강원도 원주 외 전국 출강")
    c.drawRightString(W - MARGIN_X, 76, "© 연주하는 꼬꼬맨")

    draw_page_footer(c, 1, 6)


def page_profile(c):
    draw_paper_bg(c)
    draw_page_header(c, "01 — Profile", "강사 소개")

    y = H - 130
    # 인사
    y = draw_paragraph(
        c, MARGIN_X, y,
        "안녕하세요. 팬플룻 연주자이자 강사로 활동하고 있는 김춘흥(예명 ‘연주하는 꼬꼬맨’)입니다. "
        "전국 팬플룻 대회에서 30회 금상을 수상하며 다져온 연주력과, 음악심리|진로코칭 분야의 자격을 바탕으로 "
        "학교|기업|복지/의료|교정 시설을 두루 찾아가 음악으로 마음을 어루만지는 강의|연주 활동을 이어가고 있습니다.",
        SANS, 11, 17, INK, W - MARGIN_X * 2,
    )
    y -= 16

    # 큰 통계 박스 3개
    box_y = y - 70
    box_w = (W - MARGIN_X * 2 - 24) / 3
    stats = [
        ("30회", "전국 팬플룻 대회 금상"),
        ("9+",  "주요 활동 기관"),
        ("4종", "전문 자격 보유"),
    ]
    for i, (val, lbl) in enumerate(stats):
        x = MARGIN_X + i * (box_w + 12)
        c.setFillColor(CREAM)
        c.setStrokeColor(LINE)
        c.setLineWidth(0.6)
        c.roundRect(x, box_y, box_w, 70, 12, stroke=1, fill=1)
        c.setFillColor(WOOD)
        c.setFont(SERIF, 22)
        c.drawString(x + 16, box_y + 38, val)
        c.setFillColor(INK_SOFT)
        c.setFont(SANS, 9.5)
        c.drawString(x + 16, box_y + 18, lbl)
    y = box_y - 28

    # 섹션: 학력
    def section(label, items, y):
        c.setFillColor(WOOD)
        c.setFont(SERIF, 14)
        c.drawString(MARGIN_X, y, label)
        c.setStrokeColor(BEIGE)
        c.setLineWidth(1)
        c.line(MARGIN_X, y - 4, MARGIN_X + 30, y - 4)
        cy = y - 22
        c.setFillColor(INK)
        c.setFont(SANS, 10.5)
        for it in items:
            c.setFillColor(BEIGE_DEEP); c.drawString(MARGIN_X, cy, "•")
            c.setFillColor(INK)
            for ln in wrap_text(it, SANS, 10.5, W - MARGIN_X * 2 - 14):
                c.drawString(MARGIN_X + 12, cy, ln)
                cy -= 16
        return cy - 6

    y = section("학력", ["세종사이버대학교 졸업"], y)
    y = section("자격사항", [
        "음악심리 상담사",
        "진로코칭 지도사",
        "장애인 인식 개선 지도사",
        "팬플룻 지도사",
    ], y)
    y = section("표창 및 수상", [
        "전국 팬플룻 대회 금상 30회 수상",
        "대한민국 자원봉사 우수상",
        "원주시의회 시의장 표창 2회",
        "국회의원 표창",
    ], y)

    draw_page_footer(c, 2, 6)


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

    cards = [
        ("01", "음악으로 마음을 잇다",
         "음악심리|정서치유",
         "팬플룻 연주에 마음을 비추어, 청중 스스로의 감정을 따뜻하게 들여다보게 하는 시간. "
         "복지|의료 현장에서 가장 많이 요청되는 프로그램입니다."),
        ("02", "진로 코칭과 자존감 회복",
         "청소년|청년|재취업",
         "‘남들과 다른 길’을 걸어온 강사의 이야기와, 진로코칭 지도사로서의 도구를 함께 풀어내는 강연. "
         "음악과 함께 ‘다시 시작할 용기’를 나눕니다."),
        ("03", "장애인 인식 개선",
         "기업|학교|기관 의무교육",
         "법정 의무교육의 틀을 갖추되, 음악이라는 공통 언어로 부드럽게 풀어내는 인식 개선 강의. "
         "장애인 인식 개선 지도사 자격 기반으로 운영됩니다."),
        ("04", "팬플룻 입문 클래스",
         "워크숍|체험형",
         "‘악보를 못 읽어도 첫 곡을 불 수 있다’를 약속하는 입문 클래스. "
         "참가자가 직접 팬플룻을 들고 첫 음을 내는 경험을 함께 만듭니다."),
    ]

    col_w = (W - MARGIN_X * 2 - 18) / 2
    card_h = 150
    for idx, (no, title, sub, body) in enumerate(cards):
        col = idx % 2
        row = idx // 2
        x = MARGIN_X + col * (col_w + 18)
        cy = y - 20 - row * (card_h + 18)

        c.setFillColor(HexColor("#FFFFFF"))
        c.setStrokeColor(LINE)
        c.setLineWidth(0.6)
        c.roundRect(x, cy - card_h, col_w, card_h, 14, stroke=1, fill=1)

        c.setFillColor(BEIGE_DEEP)
        c.setFont(SERIF, 11)
        c.drawString(x + 18, cy - 24, no)

        c.setFillColor(WOOD)
        c.setFont(SERIF, 15)
        c.drawString(x + 38, cy - 24, title)

        c.setFillColor(LEAF)
        c.setFont(SANS, 9)
        c.drawString(x + 38, cy - 40, sub)

        c.setFillColor(INK_SOFT)
        c.setFont(SANS, 10)
        body_y = cy - 62
        for ln in wrap_text(body, SANS, 10, col_w - 36):
            c.drawString(x + 18, body_y, ln)
            body_y -= 15

    draw_page_footer(c, 3, 6)


def page_formats(c):
    draw_paper_bg(c)
    draw_page_header(c, "03 — Formats", "진행 형식")

    y = H - 130
    y = draw_paragraph(
        c, MARGIN_X, y,
        "현장 규모와 시간에 맞춰 네 가지 표준 포맷을 운영합니다. "
        "필요에 따라 시간|구성은 조정 가능합니다.",
        SANS, 11, 17, INK, W - MARGIN_X * 2,
    )
    y -= 16

    headers = ["포맷", "시간", "구성", "권장 대상"]
    col_x = [MARGIN_X, MARGIN_X + 150, MARGIN_X + 220, MARGIN_X + 380]
    col_w = [150, 70, 160, W - MARGIN_X - (MARGIN_X + 380)]

    rows = [
        ("강연", "60분",
         "오프닝 연주 1곡 → 메인 강연 → 클로징 연주 1곡",
         "학교|기업|기관 일반 청중"),
        ("강연 + 미니 콘서트", "90분",
         "강연 50분 + 라이브 연주 4~5곡",
         "행사|기념일|연수회"),
        ("풀 콘서트", "70분",
         "팬플룻 솔로 6~8곡 (스토리텔링 포함)",
         "지역 행사|작은 콘서트홀"),
        ("팬플룻 워크숍", "100분",
         "이론 30분 + 체험 60분 + 합주 10분",
         "동아리|청소년 캠프"),
    ]

    # 헤더
    c.setFillColor(WOOD)
    c.rect(MARGIN_X, y - 24, W - MARGIN_X * 2, 26, stroke=0, fill=1)
    c.setFillColor(CREAM)
    c.setFont(SANS, 10.5)
    for i, h in enumerate(headers):
        c.drawString(col_x[i] + 8, y - 8, h)
    y -= 26

    # 행
    for i, row in enumerate(rows):
        row_h = 38
        if i % 2 == 0:
            c.setFillColor(BG_ALT)
            c.rect(MARGIN_X, y - row_h, W - MARGIN_X * 2, row_h, stroke=0, fill=1)
        c.setFillColor(INK)
        c.setFont(SANS, 10)
        for j, cell in enumerate(row):
            wrapped = wrap_text(cell, SANS, 10, col_w[j] - 16)
            ty = y - 14
            for ln in wrapped[:2]:
                c.drawString(col_x[j] + 8, ty, ln)
                ty -= 13
        c.setStrokeColor(LINE)
        c.setLineWidth(0.4)
        c.line(MARGIN_X, y - row_h, W - MARGIN_X, y - row_h)
        y -= row_h

    y -= 24

    # 안내 박스
    c.setFillColor(CREAM)
    c.setStrokeColor(LINE)
    c.roundRect(MARGIN_X, y - 110, W - MARGIN_X * 2, 110, 12, stroke=1, fill=1)
    c.setFillColor(WOOD)
    c.setFont(SERIF, 13)
    c.drawString(MARGIN_X + 18, y - 28, "운영 안내")
    notes = [
        "• 음향(마이크 1, 무선 마이크 1, 라인 입력)과 보면대를 기관에서 준비해 주시면 좋습니다.",
        "• 워크숍의 경우 참여 인원수만큼의 입문용 팬플룻 대여가 가능합니다(별도 협의).",
        "• 출강 가능 지역: 강원도 원주를 중심으로 전국. 거리에 따라 출장비 협의.",
        "• 강연료는 청중 규모, 형식, 회차에 따라 유연하게 협의해 책정합니다.",
    ]
    ty = y - 50
    c.setFillColor(INK_SOFT)
    c.setFont(SANS, 10)
    for n in notes:
        c.drawString(MARGIN_X + 18, ty, n)
        ty -= 16

    draw_page_footer(c, 4, 6)


def page_history(c):
    draw_paper_bg(c)
    draw_page_header(c, "04 — Track Record", "강의|연주 이력")

    y = H - 130
    y = draw_paragraph(
        c, MARGIN_X, y,
        "다양한 현장에서 쌓아온 강의|연주 경험의 일부입니다. "
        "기관의 분위기와 청중의 호흡을 가장 중요하게 생각하며 매 무대를 준비합니다.",
        SANS, 11, 17, INK, W - MARGIN_X * 2,
    )
    y -= 14

    groups = [
        ("교육 기관", [
            ("상지대학교 사회복지학과", "음악심리 특강 / 학과 초청"),
            ("강의소림 밥포럼",         "지역 교양 포럼 강연"),
        ]),
        ("기업|공공기관", [
            ("현대글로비스 문막지부",   "임직원 인식개선 / 사내 행사"),
            ("산림항공본부",            "직원 대상 음악|인문 강연"),
        ]),
        ("의료|복지|교정", [
            ("내안에병원 (정신건강의학)", "정기 음악 치유 시간"),
            ("원주교도소",                "수형자 대상 음악|인문 강연"),
            ("청주여자교도소",            "음악 치유 프로그램"),
        ]),
        ("미디어|기타", [
            ("MBC 강원365",             "강원 지역 방송 출연"),
            ("지식나눔 시브아 포럼",     "강연|미니콘서트 무대"),
        ]),
    ]

    col_w = (W - MARGIN_X * 2 - 18) / 2
    cur_x = [MARGIN_X, MARGIN_X + col_w + 18]
    cur_y = [y - 18, y - 18]

    for i, (gname, items) in enumerate(groups):
        col = i % 2
        x = cur_x[col]
        gy = cur_y[col]

        # 그룹 헤더
        c.setFillColor(BEIGE_DEEP)
        c.rect(x, gy, 4, 14, stroke=0, fill=1)
        c.setFillColor(WOOD)
        c.setFont(SERIF, 13)
        c.drawString(x + 12, gy + 1, gname)
        gy -= 22

        for org, role in items:
            c.setFillColor(INK)
            c.setFont(SANS, 10.5)
            c.drawString(x, gy, org)
            c.setFillColor(INK_SOFT)
            c.setFont(SANS, 9.5)
            c.drawString(x + 4, gy - 14, "— " + role)
            gy -= 30

        cur_y[col] = gy - 6

    # 인용
    qy = min(cur_y) - 16
    c.setFillColor(CREAM)
    c.setStrokeColor(LINE)
    c.roundRect(MARGIN_X, qy - 60, W - MARGIN_X * 2, 60, 12, stroke=1, fill=1)
    c.setFillColor(BEIGE_DEEP)
    c.setFont(SERIF, 22)
    c.drawString(MARGIN_X + 18, qy - 24, "“")
    c.setFillColor(INK)
    c.setFont(SERIF, 12)
    c.drawString(MARGIN_X + 38, qy - 30, "교수님 같지 않은 강사님이 좋았어요. 진짜 사람 이야기 같았습니다.")
    c.setFillColor(INK_SOFT)
    c.setFont(SANS, 9)
    c.drawString(MARGIN_X + 38, qy - 46, "— 상지대학교 사회복지학과 학생 후기")

    draw_page_footer(c, 5, 6)


def page_contact(c):
    draw_paper_bg(c)
    draw_page_header(c, "05 — Contact", "문의 및 강의 요청")

    y = H - 140

    # 큰 문구
    y = draw_paragraph(
        c, MARGIN_X, y,
        "꼬꼬맨을 강사로 모시고 싶다면, 아래 연락처 또는 웹사이트의 강의 요청 폼으로 편하게 연락 주세요. "
        "희망 일정은 여러 개 입력 가능하며, 24시간 안에 회신드리는 것을 목표로 하고 있습니다.",
        SANS, 11.5, 18, INK, W - MARGIN_X * 2,
    )
    y -= 16

    # 연락 카드 2개 좌우
    card_w = (W - MARGIN_X * 2 - 18) / 2

    def info_card(x, y, title, lines, accent=BEIGE):
        c.setFillColor(HexColor("#FFFFFF"))
        c.setStrokeColor(LINE)
        c.setLineWidth(0.7)
        c.roundRect(x, y - 130, card_w, 130, 14, stroke=1, fill=1)
        c.setFillColor(accent)
        c.rect(x, y - 6, card_w, 6, stroke=0, fill=1)
        c.setFillColor(WOOD)
        c.setFont(SERIF, 14)
        c.drawString(x + 18, y - 32, title)
        c.setFillColor(INK)
        c.setFont(SANS, 10.5)
        ty = y - 56
        for ln in lines:
            c.drawString(x + 18, ty, ln)
            ty -= 18

    info_card(MARGIN_X, y, "직접 연락",
              ["이메일 | jaru1125@naver.com",
               "활동지역 | 강원도 원주 외 전국",
               "문의 가능 시간 | 평일 09:00 ~ 21:00"],
              accent=BEIGE)
    info_card(MARGIN_X + card_w + 18, y, "온라인",
              ["웹사이트 | kkokkoman.vercel.app",
               "강의 요청 폼 | /request",
               "강의 사례|후기 | /cases"],
              accent=LEAF)

    y -= 160

    # 강의 요청에 포함되면 좋은 정보
    c.setFillColor(WOOD)
    c.setFont(SERIF, 14)
    c.drawString(MARGIN_X, y, "강의 요청 시 함께 알려주시면 좋은 정보")
    y -= 12
    c.setStrokeColor(BEIGE); c.setLineWidth(1)
    c.line(MARGIN_X, y, MARGIN_X + 60, y); y -= 16

    items = [
        "기관 / 단체명",
        "담당자 성함과 연락처(이메일|전화)",
        "희망 일정 (가능한 후보 일정 1개 이상, 시간|장소 포함)",
        "대상 청중 (예: 사회복지학과 1~2학년, 임직원, 환우 등)",
        "예상 인원수와 행사 성격(정기 강연 / 일회성 행사 / 공연 등)",
        "원하는 주제와 분위기, 특별히 다뤄주셨으면 하는 키워드",
        "예산 범위 (협의 가능)",
    ]
    c.setFillColor(INK)
    c.setFont(SANS, 10.5)
    for it in items:
        c.setFillColor(BEIGE_DEEP); c.drawString(MARGIN_X, y, "•")
        c.setFillColor(INK)
        c.drawString(MARGIN_X + 12, y, it)
        y -= 18

    y -= 12
    # 마무리 인사
    c.setFillColor(CREAM)
    c.setStrokeColor(LINE)
    c.roundRect(MARGIN_X, y - 90, W - MARGIN_X * 2, 90, 14, stroke=1, fill=1)
    c.setFillColor(WOOD)
    c.setFont(SERIF, 14)
    c.drawString(MARGIN_X + 18, y - 26, "음악으로 마음을 잇다")
    c.setFillColor(INK_SOFT)
    c.setFont(SANS, 10.5)
    closing = ("연주는 큰 박수가 아니어도 좋습니다. 잠시 호흡을 고를 수 있는 시간을 함께 만드는 것, "
               "그것이 ‘연주하는 꼬꼬맨’이 가장 중요하게 여기는 일입니다. 좋은 자리에서 만나뵙기를 기다리겠습니다.")
    cy = y - 48
    for ln in wrap_text(closing, SANS, 10.5, W - MARGIN_X * 2 - 36):
        c.drawString(MARGIN_X + 18, cy, ln)
        cy -= 16

    draw_page_footer(c, 6, 6)


def main():
    c = canvas.Canvas(OUT_PATH, pagesize=A4)
    c.setTitle("강의 제안서 — 연주하는 꼬꼬맨 김춘흥")
    c.setAuthor("김춘흥 (꼬꼬맨)")
    c.setSubject("팬플룻 강의|연주 제안서")

    page_cover(c);     c.showPage()
    page_profile(c);   c.showPage()
    page_contents(c);  c.showPage()
    page_formats(c);   c.showPage()
    page_history(c);   c.showPage()
    page_contact(c);   c.showPage()
    c.save()
    print(f"[ok] saved: {OUT_PATH}")


if __name__ == "__main__":
    main()
