import os
import re

base_dir = r"D:\TuanNH\MyApp\MiniGame\GameGhepThe"

with open(os.path.join(base_dir, "css", "style.css"), "r", encoding="utf-8") as f:
    css = f.read()

with open(os.path.join(base_dir, "js", "audio.js"), "r", encoding="utf-8") as f:
    js_audio = f.read()

with open(os.path.join(base_dir, "js", "themes.js"), "r", encoding="utf-8") as f:
    js_themes = f.read()

with open(os.path.join(base_dir, "js", "ads.js"), "r", encoding="utf-8") as f:
    js_ads = f.read()

js_share_image = ""
share_img_path = os.path.join(base_dir, "js", "share-image.js")
if os.path.exists(share_img_path):
    with open(share_img_path, "r", encoding="utf-8") as f:
        js_share_image = f.read()

with open(os.path.join(base_dir, "js", "game.js"), "r", encoding="utf-8") as f:
    js_game = f.read()

with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
    html = f.read()

# Extract body content
body_match = re.search(r"<body>(.*?)<script", html, re.DOTALL)
if body_match:
    body_content = body_match.group(1).strip()
else:
    raise Exception("Could not find body content in index.html")

# Replace HTML entities not defined in default XML
body_content = body_content.replace("&times;", "×")
# Thay thế tất cả các ký tự & trần trong HTML thành &amp; để Blogger XML không báo lỗi
body_content = re.sub(r"&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)", "&amp;", body_content)
# Chuyển đổi thuộc tính boolean trong HTML (như disabled) thành cú pháp XML hợp lệ (disabled="disabled")
body_content = re.sub(r"\bdisabled\b(?!\s*=)", 'disabled="disabled"', body_content)

# Combined JS
combined_js = f"{js_audio}\n\n{js_themes}\n\n{js_ads}\n\n{js_share_image}\n\n{js_game}"

# Cấu hình 7 ảnh banner theo từng màn (Khi bạn upload lên Blogger bài viết nháp, dán URL ảnh vào đây)
# Mặc định đang trỏ tạm về banner chung, sau khi dán link mới vào đây chỉ cần chạy lại python build_blogger.py
DEFAULT_BANNER = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi66tdzxS9PXFvCIiTTRB6-gNzjz157diEFLBBxl06YMmNZTiEYXQ2I_fCBx5eFCu1nvx6yxoG1-lSePVLfFZ9Isit0p0uUh2Hz15xAojLMKpLEdYvNHyGV21tQNaGyJzCNwpei7h6_q2JlTwcsJ-xM87QSoFMmawRQ7eVAjyfEWfuFstHpwDzXTDKsEMs/s1376/banner_facebook.jpg"

BANNER_URLS = {
    1: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiozPin2-gT6qttrUY4xcq_9Qr92M08CvJ3gbkqvI7d0UUwAV3zMiFHThwGgA-bpLYE6MwCcgVIMPbjGnUfnwoFKq3EBBwD7RpsQLanlThy3D4VD9vu2IYl4dVBxt9wwzmZvzAzrOyFlfpj8MsPDH2QkwKp7UYl7Qe-dNyKYB9vhn34gO16P3L8ENFJRhI/s1376/level1.jpg",
    2: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiGaOmtgNLadhmi9k9jakuxVN5LjSrAjrPUgdnMNyqQAzbOFgmpJgu-kpLoq9blZZ3uJG30Dq_bWzcQgFYexCvg5708NozdjSxjLVpukWGiZnp3Rcm49e9Dj9muhIc7zcbA8XBWF8Q0Bhv12Z79FS4K1Hb4mFsrYJsyEC_gmJ4-oA8CVRViSPEqBA-FSjk/s1376/level2.jpg",
    3: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhmj04s0p5EgkVIJhMLNIsSOoW8Ruk4nWSQQo4GltscTpVU_fE2HoLWBlQynEYaQP1KCHCpRZIJiOtR8dNbkRPCP-JBorO4Rjn1j8GFsS6qaQ_PpzsUmly_rfX_-LiKLoec8wrXe2xGkEDUzWTnFAyktyQaOS6J4HWqKi_uRQk4evqSkOYASaRk8QbHv8Y/s1376/level3.jpg",
    4: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjSh43hu3qgXgAjJkO_FVuowP9_p5QBVAx2BHjUSYXCpZgriMxDY2ua48dYWq4CdJHiK43hojlg26eXjMUlFWlB6dpTLYZjlBZ4B94WrzVch0d-H3xBwu82UvIJA-1euitFj7RAwTVddgjYCCn-FcDbidhIXMYDiZ1DwutHubhniZ6tRh49gKZ7CC4X6Pc/s1376/level4.jpg",
    5: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEibfwuZltplkrDR1HRDrnp1DUk2FuCh_Woaq8WdA-bqMpXkgrLGcWFaxdv1Au9oz1Bw2walAXQEwJUjno_KeaUd1t28oA02Tb7FKE9RMYgthdZKP05gEpTxMo6kUnRw_tvF13LQOuygN1LltRxLiqTsKceQKXiZDd6R9nfK64WjnAwc9a2c_LkC-i8XJYw/s1376/level5.jpg",
    6: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhcm8v5PmB7SzWGlMcJ6z-Y538SE3nd9RajiLoPurw70tI-fBYVSiJ47eFLBuWVYUYyNGwXyJ8CE2yWSFwH2jkufCjx1eUyn5q_B9tb_VUbq8vCQTSNG5Yj-Gx4q0VBvXPVc96gpqD6HQPKsdKTyWNRi94f-EvFV1CVMrHaLmimIOgGJQ1UsJQUwJxH13s/s1376/level6.jpg",
    7: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhrGfPEGMnETTyZhchaoBOsXs5rnGsSBHvXQkIqI-0tTy0u3spTR7OuSfr2cZI6Vut0PWmYMVtIOaZGac9qgBHC5_MMXaCgyOWP9WJmQbpOsdwvI_CIXneOq5wGQltaf1JkM3XXgjtcnWnpKNZYRZSlqL6lKj7qhGnRLdtXhfc0FDNhoPte1q4v1Jr-2T0/s1200/level7.jpg",
}

xml_parts = [
    '<?xml version="1.0" encoding="UTF-8" ?>',
    '<!DOCTYPE html>',
    '<html b:css="false" b:defaultmessages="false" b:layoutsVersion="3" b:responsive="true" b:templateVersion="1.3.0" expr:dir="data:blog.languageDirection" xmlns="http://www.w3.org/1999/xhtml" xmlns:b="http://www.google.com/2005/gml/b" xmlns:data="http://www.google.com/2005/gml/data" xmlns:expr="http://www.google.com/2005/gml/expr">',
    '<head>',
    '  <meta charset="UTF-8"/>',
    '  <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport"/>',
    '  <title><data:blog.pageTitle/></title>',
    '  <b:include data="blog" name="all-head-content"/>',
    '  <!-- OpenGraph Meta Tags: Động theo từng cấp độ Màn 1 -> Màn 7 khi chia sẻ lên Facebook, Zalo -->',
    '  <meta property="og:type" content="website"/>',
    '  <meta property="og:site_name" content="Siêu Ghép Thẻ"/>',
    '  <b:if cond=\'data:view.url contains "man-1" or data:view.url contains "level=1"\'>',
    '    <meta property="og:title" content="Siêu Ghép Thẻ 🌱 Màn 1: Tập Sự - Dễ thế này bạn có qua được không?"/>',
    '    <meta property="og:description" content="Tôi vừa hoàn thành Màn 1 cực mượt! Thách bạn vào đọ điểm xem ai nhanh hơn nhé! 🎮"/>',
    f'    <meta property="og:image" content="{BANNER_URLS[1]}"/>',
    '  <b:elseif cond=\'data:view.url contains "man-2" or data:view.url contains "level=2"\'/>',
    '    <meta property="og:title" content="Siêu Ghép Thẻ 🌿 Màn 2: Học Việc - Căng não hơn rồi đấy!"/>',
    '    <meta property="og:description" content="Đã vượt Màn 2! Bắt đầu khó nhằn hơn nhiều. Bạn có dám thử sức không? 🎮"/>',
    f'    <meta property="og:image" content="{BANNER_URLS[2]}"/>',
    '  <b:elseif cond=\'data:view.url contains "man-3" or data:view.url contains "level=3"\'/>',
    '    <meta property="og:title" content="Siêu Ghép Thẻ ⭐ Màn 3: Có Kinh Nghiệm - Top 50% người chơi!"/>',
    '    <meta property="og:description" content="Màn 3 3 tầng thẻ hiểm hóc mà tôi vẫn vượt qua! Bạn có theo kịp tôi không? ⭐"/>',
    f'    <meta property="og:image" content="{BANNER_URLS[3]}"/>',
    '  <b:elseif cond=\'data:view.url contains "man-4" or data:view.url contains "level=4"\'/>',
    '    <meta property="og:title" content="Siêu Ghép Thẻ 🌟 Màn 4: Thách Thức - 80% người chơi BỎ CUỘC!"/>',
    '    <meta property="og:description" content="Chỉ 20% người vượt qua Màn 4! Bạn có đủ trình độ để giải bàn cờ hiểm này không? 🎮"/>',
    f'    <meta property="og:image" content="{BANNER_URLS[4]}"/>',
    '  <b:elseif cond=\'data:view.url contains "man-5" or data:view.url contains "level=5"\'/>',
    '    <meta property="og:title" content="Siêu Ghép Thẻ 💎 Màn 5: Chuyên Gia - TOP 10% Cao Thủ!"/>',
    '    <meta property="og:description" content="Đẳng cấp hiếm có! Tôi đã vào TOP 10% cao thủ Siêu Ghép Thẻ! Bạn có làm được không? 💎"/>',
    f'    <meta property="og:image" content="{BANNER_URLS[5]}"/>',
    '  <b:elseif cond=\'data:view.url contains "man-6" or data:view.url contains "level=6"\'/>',
    '    <meta property="og:title" content="Siêu Ghép Thẻ 🔥 Màn 6: Siêu Cấp - ĐỊA NGỤC CHỈ 5% QUA ĐƯỢC!"/>',
    '    <meta property="og:description" content="Màn chơi cực kỳ hiểm hóc! Chỉ 5% người gan dạ vượt qua. Vào giải cứu bàn này giùm tôi! 🔥"/>',
    f'    <meta property="og:image" content="{BANNER_URLS[6]}"/>',
    '  <b:elseif cond=\'data:view.url contains "man-7" or data:view.url contains "level=7"\'/>',
    '    <meta property="og:title" content="Siêu Ghép Thẻ 👑 Màn 7: HUYỀN THOẠI - 0.1% KHÔNG THỂ CHINH PHỤC!"/>',
    '    <meta property="og:description" content="🏆 TÔI ĐÃ PHÁ ĐẢO MÀN 7 HUYỀN THOẠI! Tỉ lệ thắng chỉ 0.1%. Bạn có tin không??? 👑"/>',
    f'    <meta property="og:image" content="{BANNER_URLS[7]}"/>',
    '  <b:else/>',
    '    <meta property="og:title" content="Siêu Ghép Thẻ - Thử thách 7 màn chơi cực cuốn!"/>',
    '    <meta property="og:description" content="Trò chơi ghép thẻ 3 ô cực kỳ gây nghiện với 7 cấp độ tăng dần! Bạn có dám thách thức không? Chơi ngay miễn phí!"/>',
    f'    <meta property="og:image" content="{DEFAULT_BANNER}"/>',
    '  </b:if>',
    '  <meta property="og:image:width" content="1200"/>',
    '  <meta property="og:image:height" content="630"/>',
    '  <!-- Google AdSense -->',
    '  <script async="async" crossorigin="anonymous" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7959926217130088"></script>',
    '  <b:skin><![CDATA[',
    css,
    '  ]]></b:skin>',
    '</head>',
    '<body>',
    '  <b:section id="main-game" showaddelement="false"/>',
    body_content,
    '  <script type="text/javascript">',
    '  //<![CDATA[',
    combined_js,
    '  //]]>',
    '  </script>',
    '</body>',
    '</html>'
]

full_xml = "\n".join(xml_parts)

output_file = os.path.join(base_dir, "blogger_template.xml")
with open(output_file, "w", encoding="utf-8") as f:
    f.write(full_xml)

print(f"File created: {output_file}")
print(f"Size: {os.path.getsize(output_file)} bytes")
