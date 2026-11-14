import os
import re
import xml.etree.ElementTree as ET

base_dir = r"D:\TuanNH\MyApp\MiniGame\GhepThe"

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
