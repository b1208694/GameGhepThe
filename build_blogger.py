import os
import re
import xml.etree.ElementTree as ET

base_dir = r"D:\TuanNH\MyApp\MiniGame\GameGhepThe"

with open(os.path.join(base_dir, "css", "style.css"), "r", encoding="utf-8") as f:
    css = f.read()

with open(os.path.join(base_dir, "js", "audio.js"), "r", encoding="utf-8") as f:
    js_audio = f.read()

with open(os.path.join(base_dir, "js", "themes.js"), "r", encoding="utf-8") as f:
    js_themes = f.read()

with open(os.path.join(base_dir, "js", "ads.js"), "r", encoding="utf-8") as f:
    js_ads = f.read()

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
combined_js = f"{js_audio}\n\n{js_themes}\n\n{js_ads}\n\n{js_game}"

xml_parts = [
    '<?xml version="1.0" encoding="UTF-8" ?>',
    '<!DOCTYPE html>',
    '<html b:css="false" b:defaultmessages="false" b:layoutsVersion="3" b:responsive="true" b:templateVersion="1.3.0" expr:dir="data:blog.languageDirection" xmlns="http://www.w3.org/1999/xhtml" xmlns:b="http://www.google.com/2005/gml/b" xmlns:data="http://www.google.com/2005/gml/data" xmlns:expr="http://www.google.com/2005/gml/expr">',
    '<head>',
    '  <meta charset="UTF-8"/>',
    '  <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport"/>',
    '  <title><data:blog.pageTitle/></title>',
    '  <b:include data="blog" name="all-head-content"/>',
    '  <!-- OpenGraph Meta Tags: Hiển thị hình ảnh & tiêu đề bắt mắt khi chia sẻ Facebook, Zalo -->',
    '  <meta property="og:type" content="website"/>',
    '  <meta property="og:title" content="Siêu Ghép Thẻ - Thử thách chỉ 0.1% người thắng Màn 2!"/>',
    '  <meta property="og:description" content="Trò chơi ghép thẻ 3 ô cực kỳ gây nghiện với 4 chủ đề siêu cute! Bạn có dám phá đảo Màn 2 không? Chơi ngay miễn phí!"/>',
    '  <meta property="og:url" content="https://game-ghep-the-vui.blogspot.com"/>',
    '  <meta property="og:image" content="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi66tdzxS9PXFvCIiTTRB6-gNzjz157diEFLBBxl06YMmNZTiEYXQ2I_fCBx5eFCu1nvx6yxoG1-lSePVLfFZ9Isit0p0uUh2Hz15xAojLMKpLEdYvNHyGV21tQNaGyJzCNwpei7h6_q2JlTwcsJ-xM87QSoFMmawRQ7eVAjyfEWfuFstHpwDzXTDKsEMs/s1376/banner_facebook.jpg"/>',
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
