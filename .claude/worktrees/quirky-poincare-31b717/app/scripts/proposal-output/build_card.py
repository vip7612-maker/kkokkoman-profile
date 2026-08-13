"""
강사 김춘흥 (연주하는 꼬꼬맨) 강사 관리카드 — A4 1페이지.
샘플(김혜정 교육청 강사 관리카드) 양식을 그대로 재현.
- 주민번호: 환경변수 INSTRUCTOR_RRN으로 주입 (없으면 13자리 빈칸).
  민감 정보이므로 절대 코드에 하드코딩하지 말 것.
- 동의 날짜: 비움
- '강원특별자치도홍천교육지원청교육장 귀하' 라인 제외
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, black, Color
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas

pdfmetrics.registerFont(UnicodeCIDFont("HYSMyeongJo-Medium"))
pdfmetrics.registerFont(UnicodeCIDFont("HYGothic-Medium"))
SERIF = "HYSMyeongJo-Medium"
SANS = "HYGothic-Medium"

OUT = "/Users/kj.lee/dev/꼬꼬맨 프로필페이지/app/scripts/proposal-output/instructor-card.pdf"

W, H = A4
LINE_C = HexColor("#000000")
HEADER_BG = HexColor("#E6F0F4")  # 연한 청록 (샘플과 유사)
LIGHT = HexColor("#FFFFFF")

LEFT = 56
RIGHT = W - 56


# 강사 정보 (알려진 부분만 채움; 미상은 빈칸)
NAME = "김춘흥"
# 주민등록번호: 환경변수 INSTRUCTOR_RRN로만 주입. git에 절대 커밋하지 말 것.
RRN = os.environ.get("INSTRUCTOR_RRN", "______ - _______")
FIELD_AREA = "팬플룻 연주, 음악심리"
# 계좌번호: 환경변수 INSTRUCTOR_ACCOUNT로 주입. git에 커밋 금지.
ACCOUNT = os.environ.get("INSTRUCTOR_ACCOUNT", "")
MAJOR = ""                # 전공 — 본인 입력
PHONE = ""                # 휴대폰 — 본인 입력
HOMEPAGE = "https://kkokkoman.vercel.app"
EMAIL = "jaru1125@naver.com"

WORK_NAME = ""            # 직장
WORK_POSITION = ""        # 직위
WORK_DIRECT = ""          # 직통전화
WORK_ADDR = ""            # 직장 주소
WORK_ZIP = ""             # 우편번호
WORK_REP = ""             # 대표전화
HOME_ADDR = ""            # 자택 주소
HOME_ZIP = ""             # 우편번호
HOME_PHONE = ""           # 자택 전화

# 학력 (행 4개)
EDU = [
    ("세종사이버대학교", "", "졸업"),
    ("", "", ""),
    ("", "", ""),
    ("", "", ""),
]

CAREER = [
    "전국 팬플룻 대회 금상 30회 수상",
    "상지대학교 사회복지학과 음악심리 특강",
    "현대글로비스 문막지부, 산림항공본부 강연",
    "지식나눔 시브아 포럼, 강의소림 밥포럼 출강",
    "내안에병원(정신건강의학) 정기 음악 치유 시간",
    "원주교도소, 청주여자교도소 음악·인문 강연",
    "MBC 강원365 출연 외 다수",
]


def cell(c, x, y, w, h, text="", font=SANS, size=10, align="left", fill=None,
         pad_x=6, pad_y=4, bold_color=None):
    if fill is not None:
        c.setFillColor(fill)
        c.rect(x, y, w, h, stroke=0, fill=1)
    c.setStrokeColor(LINE_C)
    c.setLineWidth(0.6)
    c.rect(x, y, w, h, stroke=1, fill=0)
    if text == "":
        return
    c.setFont(font, size)
    c.setFillColor(bold_color or black)
    text_y = y + (h - size) / 2 + 1
    if align == "center":
        c.drawCentredString(x + w / 2, text_y, text)
    elif align == "right":
        c.drawRightString(x + w - pad_x, text_y, text)
    else:
        c.drawString(x + pad_x, text_y, text)


def cell_multiline(c, x, y, w, h, lines, font=SANS, size=9.5, pad_x=6, pad_y=4, leading=14):
    c.setStrokeColor(LINE_C)
    c.setLineWidth(0.6)
    c.rect(x, y, w, h, stroke=1, fill=0)
    c.setFont(font, size)
    c.setFillColor(black)
    cy = y + h - pad_y - size
    for ln in lines:
        if cy < y + pad_y:
            break
        c.drawString(x + pad_x, cy, ln)
        cy -= leading


def label(c, x, y, w, h, text):
    """헤더 라벨 셀 (연한 청록 배경, 글자 자간 띄움 효과로 양쪽 정렬 느낌)."""
    cell(c, x, y, w, h, "", fill=HEADER_BG)
    c.setFont(SANS, 10)
    c.setFillColor(black)
    c.drawCentredString(x + w / 2, y + (h - 10) / 2 + 1, text)


def main():
    c = canvas.Canvas(OUT, pagesize=A4)
    c.setTitle("강사 관리카드 — 김춘흥 (연주하는 꼬꼬맨)")
    c.setAuthor("김춘흥")

    # 제목
    c.setFont(SERIF, 24)
    c.setFillColor(black)
    c.drawCentredString(W / 2, H - 70, "강사 관리카드")
    c.setLineWidth(1.2)
    c.line(W / 2 - 95, H - 76, W / 2 + 95, H - 76)

    # 표 시작 (위에서부터 아래로)
    table_w = RIGHT - LEFT
    row_h = 26
    label_w = 60
    value_left_w = (table_w - label_w * 2) / 2  # 좌측 값 영역
    value_right_w = (table_w - label_w * 2) / 2  # 우측 값 영역

    y = H - 110

    # 1행: 성명 / 주민등록번호
    label(c, LEFT, y - row_h, label_w, row_h, "성   명")
    cell(c, LEFT + label_w, y - row_h, value_left_w, row_h, NAME, font=SANS, size=11, align="center")
    label(c, LEFT + label_w + value_left_w, y - row_h, label_w, row_h, "주민등록번호")
    cell(c, LEFT + label_w * 2 + value_left_w, y - row_h, value_right_w, row_h, RRN, font=SANS, size=11, align="center")
    y -= row_h

    # 2행: 강의분야 / 계좌번호
    label(c, LEFT, y - row_h, label_w, row_h, "강의분야")
    cell(c, LEFT + label_w, y - row_h, value_left_w, row_h, FIELD_AREA, align="center")
    label(c, LEFT + label_w + value_left_w, y - row_h, label_w, row_h, "계 좌 번 호")
    cell(c, LEFT + label_w * 2 + value_left_w, y - row_h, value_right_w, row_h, ACCOUNT, align="center")
    y -= row_h

    # 3행: 전공 / 휴대폰
    label(c, LEFT, y - row_h, label_w, row_h, "전   공")
    cell(c, LEFT + label_w, y - row_h, value_left_w, row_h, MAJOR, align="center")
    label(c, LEFT + label_w + value_left_w, y - row_h, label_w, row_h, "휴 대 폰")
    cell(c, LEFT + label_w * 2 + value_left_w, y - row_h, value_right_w, row_h, PHONE, align="center")
    y -= row_h

    # 4행: 홈페이지 / 이메일
    label(c, LEFT, y - row_h, label_w, row_h, "홈페이지")
    cell(c, LEFT + label_w, y - row_h, value_left_w, row_h, HOMEPAGE, align="center", size=9)
    label(c, LEFT + label_w + value_left_w, y - row_h, label_w, row_h, "이 메 일")
    cell(c, LEFT + label_w * 2 + value_left_w, y - row_h, value_right_w, row_h, EMAIL, align="center")
    y -= row_h

    # 근무처 블록 (3행, 좌측 라벨은 세로 병합처럼 처리)
    work_block_h = row_h * 2
    # 좌측 "근무처" 세로 라벨 (위→아래: 근, 무, 처)
    cell(c, LEFT, y - work_block_h, label_w, work_block_h, "", fill=HEADER_BG)
    c.setFont(SANS, 10)
    c.setFillColor(black)
    cy_mid = y - work_block_h / 2
    c.drawCentredString(LEFT + label_w / 2, cy_mid + 14, "근")
    c.drawCentredString(LEFT + label_w / 2, cy_mid, "무")
    c.drawCentredString(LEFT + label_w / 2, cy_mid - 14, "처")

    # 직장 행: 작은 라벨 "직장" + 값(직장명) + "직위" + 값 + "직통전화" + 값
    sub_label_w = 36
    direct_label_w = 50
    direct_w = 80
    pos_label_w = 36
    pos_w = 70
    name_w = label_w + value_left_w + value_right_w + label_w - sub_label_w - pos_label_w - pos_w - direct_label_w - direct_w
    # 4 cells in row 1: [직장 lbl][직장 val][직위 lbl][직위 val][직통전화 lbl][직통전화 val]
    cx = LEFT + label_w
    label(c, cx, y - row_h, sub_label_w, row_h, "직장"); cx += sub_label_w
    cell(c, cx, y - row_h, name_w, row_h, WORK_NAME, align="center"); cx += name_w
    label(c, cx, y - row_h, pos_label_w, row_h, "직위"); cx += pos_label_w
    cell(c, cx, y - row_h, pos_w, row_h, WORK_POSITION, align="center"); cx += pos_w
    label(c, cx, y - row_h, direct_label_w, row_h, "직통전화"); cx += direct_label_w
    cell(c, cx, y - row_h, direct_w, row_h, WORK_DIRECT, align="center", size=9.5)
    y -= row_h

    # 직장 주소 행: [주소 lbl][주소 val (가로 1)][우편번호 lbl][우편번호 val] ; 그 아래 [대표전화 lbl][대표전화 val]
    # 샘플처럼 좌측에는 "주소"와 큰 주소 칸, 우측에는 우편번호+대표전화가 2단으로 들어감
    # 단순화: 한 줄로 [주소 lbl][주소 val][우편번호 lbl][우편번호 val]만 표시, 대표전화는 다음에
    addr_label_w = 36
    zip_label_w = 50
    zip_w = 90
    addr_val_w = label_w + value_left_w + value_right_w + label_w - addr_label_w - zip_label_w - zip_w
    cx = LEFT + label_w
    label(c, cx, y - row_h, addr_label_w, row_h, "주소"); cx += addr_label_w
    cell(c, cx, y - row_h, addr_val_w, row_h, WORK_ADDR, align="left"); cx += addr_val_w
    label(c, cx, y - row_h, zip_label_w, row_h, "우편번호"); cx += zip_label_w
    cell(c, cx, y - row_h, zip_w, row_h, WORK_ZIP, align="center")
    y -= row_h

    # 대표전화 행 (좌측 라벨은 빈칸 — 근무처 셀 연속): [공백 lbl][공백 val][대표전화 lbl][대표전화 val]
    cx = LEFT
    cell(c, cx, y - row_h, label_w, row_h, "", fill=HEADER_BG); cx += label_w  # 비어있는 라벨 자리
    cell(c, cx, y - row_h, addr_label_w + addr_val_w, row_h, "")  # 공백 본문
    cx += addr_label_w + addr_val_w
    label(c, cx, y - row_h, zip_label_w, row_h, "대표전화"); cx += zip_label_w
    cell(c, cx, y - row_h, zip_w, row_h, WORK_REP, align="center")
    y -= row_h

    # 자택 블록 (2행)
    cell(c, LEFT, y - row_h * 2, label_w, row_h * 2, "", fill=HEADER_BG)
    c.setFont(SANS, 10); c.setFillColor(black)
    home_mid = y - row_h
    c.drawCentredString(LEFT + label_w / 2, home_mid + 6, "자")
    c.drawCentredString(LEFT + label_w / 2, home_mid - 8, "택")

    # 자택 주소 행
    cx = LEFT + label_w
    label(c, cx, y - row_h, addr_label_w, row_h, "주소"); cx += addr_label_w
    cell(c, cx, y - row_h, addr_val_w, row_h, HOME_ADDR, align="left"); cx += addr_val_w
    label(c, cx, y - row_h, zip_label_w, row_h, "우편번호"); cx += zip_label_w
    cell(c, cx, y - row_h, zip_w, row_h, HOME_ZIP, align="center")
    y -= row_h

    # 자택 전화 행
    cx = LEFT + label_w
    cell(c, cx, y - row_h, addr_label_w + addr_val_w, row_h, "")  # 빈 본문
    cx += addr_label_w + addr_val_w
    label(c, cx, y - row_h, zip_label_w, row_h, "전화번호"); cx += zip_label_w
    cell(c, cx, y - row_h, zip_w, row_h, HOME_PHONE, align="center")
    y -= row_h

    # 학력 및 전공 블록
    edu_rows = 4
    edu_block_h = row_h * (edu_rows + 1)  # +1 for header row
    # 좌측 라벨 (세로)
    cell(c, LEFT, y - edu_block_h, label_w, edu_block_h, "", fill=HEADER_BG)
    c.setFont(SANS, 10); c.setFillColor(black)
    c.drawCentredString(LEFT + label_w / 2, y - edu_block_h / 2 + 26, "학   력")
    c.drawCentredString(LEFT + label_w / 2, y - edu_block_h / 2 + 8, "및")
    c.drawCentredString(LEFT + label_w / 2, y - edu_block_h / 2 - 12, "전   공")

    inner_w = table_w - label_w
    school_w = inner_w * 0.45
    major_w = inner_w * 0.40
    degree_w = inner_w - school_w - major_w
    # 헤더 행
    label(c, LEFT + label_w, y - row_h, school_w, row_h, "학   교   명")
    label(c, LEFT + label_w + school_w, y - row_h, major_w, row_h, "전 공 과 목")
    label(c, LEFT + label_w + school_w + major_w, y - row_h, degree_w, row_h, "학    위")
    y -= row_h

    for school, major, degree in EDU:
        cell(c, LEFT + label_w, y - row_h, school_w, row_h, school, align="center")
        cell(c, LEFT + label_w + school_w, y - row_h, major_w, row_h, major, align="center")
        cell(c, LEFT + label_w + school_w + major_w, y - row_h, degree_w, row_h, degree, align="center")
        y -= row_h

    # 주요경력 블록
    career_h = row_h * (len(CAREER) + 1)
    cell(c, LEFT, y - career_h, label_w, career_h, "", fill=HEADER_BG)
    c.setFont(SANS, 10); c.setFillColor(black)
    c.drawCentredString(LEFT + label_w / 2, y - career_h / 2 + 4, "주요경력")
    cell_multiline(c, LEFT + label_w, y - career_h, table_w - label_w, career_h, CAREER, font=SANS, size=10, leading=18, pad_x=10, pad_y=8)
    y -= career_h

    # 동의 박스
    y -= 10
    consent_h = 130
    c.setStrokeColor(black); c.setLineWidth(0.7)
    c.rect(LEFT, y - consent_h, table_w, consent_h, stroke=1, fill=0)

    # 헤더
    c.setFont(SANS, 11); c.setFillColor(black)
    c.drawString(LEFT + 10, y - 18, "■ 개인정보 수집ㆍ이용 동의")

    bullets = [
        "◇ 개인정보 수집ㆍ이용 목적: 신청접수, 연락, 수료 관리, 강사료 지급",
        "◇ 수집항목: 성명, 주민등록번호, 직장명(직급/직위 포함), 주소, 연락처, 계좌번호, 경력 및 자격사항",
        "◇ 보유 및 이용기간: 보존기한 내 또는 정보제공자 철회 요청까지",
        "◇ 본 개인정보 수집에 대한 동의를 거부하실 수 있으며, 이 경우 강사 등록 및 강사료 지급이 제한될 수 있음",
    ]
    by = y - 36
    c.setFont(SANS, 9)
    for b in bullets:
        # 단순 줄바꿈 (한 줄에 너무 길면 자르기)
        max_w = table_w - 24
        # crude wrap by char width
        def wrap(s):
            out = []; line = ""
            for ch in s:
                cand = line + ch
                if pdfmetrics.stringWidth(cand, SANS, 9) > max_w and line:
                    out.append(line); line = ch
                else:
                    line = cand
            if line: out.append(line)
            return out
        for ln in wrap(b):
            c.drawString(LEFT + 14, by, ln)
            by -= 13

    # 동의 박스 (하단 흰박스)
    box_y = y - consent_h + 56
    box_w = 240
    box_h = 22
    box_x = LEFT + (table_w - box_w) / 2
    c.setStrokeColor(black); c.setLineWidth(0.6)
    c.rect(box_x, box_y, box_w, box_h, stroke=1, fill=0)
    c.setFont(SANS, 10)
    c.drawString(box_x + 10, box_y + 7, "개인정보 수집ㆍ이용 동의")
    c.drawString(box_x + 130, box_y + 7, "■ 동의")
    c.drawString(box_x + 180, box_y + 7, "□ 동의하지 않음")

    # 날짜 (비움)
    c.setFont(SANS, 10)
    c.drawCentredString(W / 2, box_y - 16, "          년       월       일")

    # 성명
    c.setFont(SANS, 10)
    c.drawCentredString(W / 2, box_y - 32, f"성명          {NAME}        (서명 또는 인)")

    # 안내 (작은 글씨)
    c.setFont(SANS, 8.5); c.setFillColor(HexColor("#222222"))
    msg = ("※ 수집한 개인정보는 정보주체의 동의 없이 수집한 목적 외로 사용하거나 제3자에게 제공되지 않으며 "
           "보유 및 이용기간 만료 이후에는 파기합니다.")
    # 한 줄로 자동 줄바꿈
    max_w = table_w - 30
    line = ""; lines = []
    for ch in msg:
        cand = line + ch
        if pdfmetrics.stringWidth(cand, SANS, 8.5) > max_w and line:
            lines.append(line); line = ch
        else:
            line = cand
    if line: lines.append(line)
    ly = box_y - 50
    for ln in lines:
        c.drawString(LEFT + 14, ly, ln)
        ly -= 11

    c.save()
    print("[ok] saved:", OUT)


if __name__ == "__main__":
    main()
