"""
generate_share_pages.py
Sinh 7 file HTML trang chia sẻ Blogger (một trang/màn).
Mỗi trang có og:image riêng → Facebook hiển thị ảnh đúng cấp độ.

CÁCH DÙNG:
1. Upload 7 ảnh banner lên Blogger (tạo bài đăng nháp, chèn ảnh, lấy URL CDN)
2. Điền 7 URL vào dict BANNER_URLS bên dưới
3. Chạy: python generate_share_pages.py
4. Lên Blogger → Trang → Trang mới → Chế độ HTML → Dán nội dung từng file
5. Xuất bản và lấy URL → Điền vào LEVEL_PAGE_URLS trong game.js
"""

import os

GAME_URL = "https://game-ghep-the-vui.blogspot.com/"

# ★ ĐIỀN URL ẢNH BLOGGER CDN VÀO ĐÂY sau khi upload xong ★
BANNER_URLS = {
    1: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiozPin2-gT6qttrUY4xcq_9Qr92M08CvJ3gbkqvI7d0UUwAV3zMiFHThwGgA-bpLYE6MwCcgVIMPbjGnUfnwoFKq3EBBwD7RpsQLanlThy3D4VD9vu2IYl4dVBxt9wwzmZvzAzrOyFlfpj8MsPDH2QkwKp7UYl7Qe-dNyKYB9vhn34gO16P3L8ENFJRhI/s1376/level1.jpg",
    2: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiGaOmtgNLadhmi9k9jakuxVN5LjSrAjrPUgdnMNyqQAzbOFgmpJgu-kpLoq9blZZ3uJG30Dq_bWzcQgFYexCvg5708NozdjSxjLVpukWGiZnp3Rcm49e9Dj9muhIc7zcbA8XBWF8Q0Bhv12Z79FS4K1Hb4mFsrYJsyEC_gmJ4-oA8CVRViSPEqBA-FSjk/s1376/level2.jpg",
    3: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhmj04s0p5EgkVIJhMLNIsSOoW8Ruk4nWSQQo4GltscTpVU_fE2HoLWBlQynEYaQP1KCHCpRZIJiOtR8dNbkRPCP-JBorO4Rjn1j8GFsS6qaQ_PpzsUmly_rfX_-LiKLoec8wrXe2xGkEDUzWTnFAyktyQaOS6J4HWqKi_uRQk4evqSkOYASaRk8QbHv8Y/s1376/level3.jpg",
    4: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjSh43hu3qgXgAjJkO_FVuowP9_p5QBVAx2BHjUSYXCpZgriMxDY2ua48dYWq4CdJHiK43hojlg26eXjMUlFWlB6dpTLYZjlBZ4B94WrzVch0d-H3xBwu82UvIJA-1euitFj7RAwTVddgjYCCn-FcDbidhIXMYDiZ1DwutHubhniZ6tRh49gKZ7CC4X6Pc/s1376/level4.jpg",
    5: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEibfwuZltplkrDR1HRDrnp1DUk2FuCh_Woaq8WdA-bqMpXkgrLGcWFaxdv1Au9oz1Bw2walAXQEwJUjno_KeaUd1t28oA02Tb7FKE9RMYgthdZKP05gEpTxMo6kUnRw_tvF13LQOuygN1LltRxLiqTsKceQKXiZDd6R9nfK64WjnAwc9a2c_LkC-i8XJYw/s1376/level5.jpg",
    6: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhcm8v5PmB7SzWGlMcJ6z-Y538SE3nd9RajiLoPurw70tI-fBYVSiJ47eFLBuWVYUYyNGwXyJ8CE2yWSFwH2jkufCjx1eUyn5q_B9tb_VUbq8vCQTSNG5Yj-Gx4q0VBvXPVc96gpqD6HQPKsdKTyWNRi94f-EvFV1CVMrHaLmimIOgGJQ1UsJQUwJxH13s/s1376/level6.jpg",
    7: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhrGfPEGMnETTyZhchaoBOsXs5rnGsSBHvXQkIqI-0tTy0u3spTR7OuSfr2cZI6Vut0PWmYMVtIOaZGac9qgBHC5_MMXaCgyOWP9WJmQbpOsdwvI_CIXneOq5wGQltaf1JkM3XXgjtcnWnpKNZYRZSlqL6lKj7qhGnRLdtXhfc0FDNhoPte1q4v1Jr-2T0/s1200/level7.jpg",
}

LEVELS = [
    {
        "num": 1, "badge": "🌱", "name": "Tập Sự",
        "color": "#11998e", "color2": "#38ef7d",
        "text_color": "#064e3b",
        "rarity": "Dành cho người mới!",
        "taunt": "Màn 1 dễ lắm đấy, bạn đã thử chưa? 😏",
        "cta": "Thử ngay Màn 1!",
        "desc": "Màn khởi động nhẹ nhàng — ghép 3 thẻ giống nhau để vượt qua!"
    },
    {
        "num": 2, "badge": "🌿", "name": "Học Việc",
        "color": "#1a6b5c", "color2": "#43b89c",
        "text_color": "#064e3b",
        "rarity": "Top 70% người chơi vượt qua",
        "taunt": "Mới ghép được Màn 2 thôi? Thử lên Màn 3 xem! 🤔",
        "cta": "Vượt Màn 2 cùng tôi!",
        "desc": "Thêm loại thẻ, bắt đầu căng não — bạn có theo kịp không?"
    },
    {
        "num": 3, "badge": "⭐", "name": "Có Kinh Nghiệm",
        "color": "#1565c0", "color2": "#42a5f5",
        "text_color": "#1a237e",
        "rarity": "Top 50% người chơi — bắt đầu khó!",
        "taunt": "Màn 3 đã làm khó tôi mà tôi vẫn vượt qua! Bạn thì sao? ⭐",
        "cta": "Thách thức Màn 3!",
        "desc": "3 tầng thẻ chồng lên nhau — tư duy cẩn thận kẻo thua nhé!"
    },
    {
        "num": 4, "badge": "🌟", "name": "Thách Thức",
        "color": "#e65100", "color2": "#ffa726",
        "text_color": "#7f3700",
        "rarity": "Chỉ 20% người chơi vượt được!",
        "taunt": "20% người chơi không qua được Màn 4... bạn có nằm trong số đó không? 😤",
        "cta": "Dám thách Màn 4?",
        "desc": "Màn thách thức thực sự! Mỗi nước đi phải tính toán kỹ hoặc thua ngay!"
    },
    {
        "num": 5, "badge": "💎", "name": "Chuyên Gia",
        "color": "#4a148c", "color2": "#9c27b0",
        "text_color": "#1a0033",
        "rarity": "TOP 10% — Đẳng cấp hiếm có!",
        "taunt": "Vượt qua Màn 5 chứng tỏ tôi thuộc TOP 10%! Bạn có làm được không? 💎",
        "cta": "Lên TOP 10% cùng tôi!",
        "desc": "4 tầng + cánh bài hai bên — bẫy từ mọi hướng! Đủ dũng cảm chưa?"
    },
    {
        "num": 6, "badge": "🔥", "name": "Siêu Cấp",
        "color": "#b71c1c", "color2": "#ef5350",
        "text_color": "#7f0000",
        "rarity": "TOP 5% — Chỉ người gan dạ!",
        "taunt": "Màn 6 đã lấy đi hàng giờ của tôi nhưng tôi VƯỢT QUA RỒI! 🔥",
        "cta": "Thử sức Màn 6!",
        "desc": "Siêu khó! Chỉ 5% người chơi đặt chân đến đây. Bạn có gan thử không?"
    },
    {
        "num": 7, "badge": "👑", "name": "Huyền Thoại",
        "color": "#1a0533", "color2": "#6a1a8a",
        "text_color": "#1a0533",
        "rarity": "0.1% — HUYỀN THOẠI THỰC SỰ",
        "taunt": "👑 Tôi đã chinh phục Màn 7 Huyền Thoại — 0.1% người làm được! Bạn có tin không???",
        "cta": "Đủ bản lĩnh chinh phục Huyền Thoại?",
        "desc": "5 tầng thẻ + cánh hai bên + 7 loại thẻ. Huyền thoại chờ người xứng đáng!"
    }
]

def generate_page_html(lvl):
    n      = lvl["num"]
    banner = BANNER_URLS[n]
    return f'''<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Siêu Ghép Thẻ — {lvl["badge"]} Màn {n}: {lvl["name"]}</title>
<meta name="description" content="{lvl["desc"]}"/>
<!-- Open Graph — Facebook đọc og:image từ đây -->
<meta property="og:type"        content="website"/>
<meta property="og:url"         content="{GAME_URL}"/>
<meta property="og:title"       content="Siêu Ghép Thẻ {lvl['badge']} Màn {n}: {lvl['name']}"/>
<meta property="og:description" content="{lvl['taunt']}"/>
<meta property="og:image"       content="{banner}"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height"content="630"/>
<meta name="twitter:card"       content="summary_large_image"/>
<meta name="twitter:image"      content="{banner}"/>
<style>
  *{{margin:0;padding:0;box-sizing:border-box}}
  body{{
    font-family:'Segoe UI',sans-serif;
    min-height:100vh;
    background:linear-gradient(135deg,{lvl["color"]},{lvl["color2"]});
    display:flex;align-items:center;justify-content:center;
    padding:20px;
  }}
  .card{{
    background:#fff;border-radius:24px;
    box-shadow:0 20px 60px rgba(0,0,0,0.3);
    max-width:480px;width:100%;overflow:hidden;
    text-align:center;
  }}
  .banner-img{{width:100%;display:block;}}
  .body{{padding:28px 24px 32px;}}
  .badge{{font-size:52px;margin-bottom:8px;}}
  h1{{font-size:22px;font-weight:800;color:{lvl["text_color"]};margin-bottom:6px;}}
  .rarity{{
    display:inline-block;
    background:linear-gradient(135deg,{lvl["color"]},{lvl["color2"]});
    color:#fff;font-size:12px;font-weight:700;
    padding:4px 14px;border-radius:20px;margin-bottom:14px;
  }}
  .taunt{{
    font-size:15px;line-height:1.6;color:#444;
    background:#fffde7;border-left:4px solid {lvl["color2"]};
    padding:12px 16px;border-radius:8px;margin-bottom:20px;
    font-style:italic;text-align:left;
  }}
  .cta-btn{{
    display:block;width:100%;
    background:linear-gradient(135deg,{lvl["color"]},{lvl["color2"]});
    color:#fff;border:none;border-radius:14px;
    padding:16px;font-size:17px;font-weight:800;
    text-decoration:none;cursor:pointer;
    box-shadow:0 6px 20px rgba(0,0,0,0.2);
    transition:transform .15s;
  }}
  .cta-btn:hover{{transform:scale(1.02)}}
  .sub{{margin-top:12px;font-size:12px;color:#999;}}
</style>
</head>
<body>
<div class="card">
  <!-- Ảnh banner — Blogger dùng ảnh đầu tiên làm og:image mặc định -->
  <img class="banner-img" src="{banner}" alt="Siêu Ghép Thẻ Màn {n}"/>
  <div class="body">
    <div class="badge">{lvl["badge"]}</div>
    <h1>Màn {n}: {lvl["name"]}</h1>
    <div class="rarity">{lvl["rarity"]}</div>
    <div class="taunt">{lvl["taunt"]}</div>
    <a class="cta-btn" href="{GAME_URL}"
       onclick="window.open('{GAME_URL}','_blank');return false;">
      🎮 {lvl["cta"]}
    </a>
    <p class="sub">Miễn phí · Không cần tải · Chơi ngay trên trình duyệt</p>
  </div>
</div>
</body>
</html>'''

os.makedirs("share_pages", exist_ok=True)
for lvl in LEVELS:
    fname = f"share_pages/level{lvl['num']}.html"
    with open(fname, "w", encoding="utf-8") as f:
        f.write(generate_page_html(lvl))
    print(f"✅ Đã tạo: {fname}")

print("\n📋 BƯỚC TIẾP THEO:")
print("1. Upload 7 ảnh banner lên Blogger, lấy URL CDN")
print("2. Điền URL vào dict BANNER_URLS ở đầu file này")
print("3. Chạy lại script để tạo lại 7 file HTML")
print("4. Lên Blogger → Trang → Tạo trang mới → Chế độ HTML → Dán nội dung")
print("5. Lấy URL 7 trang → Cập nhật LEVEL_PAGE_URLS trong game.js")
