"""
Tạo banner Level 7 Huyền Thoại bằng thư viện Python thuần (không cần Pillow).
Dùng struct để ghi PNG trực tiếp với gradient + text đơn giản.
"""
import struct, zlib, math, os

W, H = 1200, 630

def make_png(pixels_rgb):
    """Tạo file PNG từ mảng pixel RGB (list of lists of (r,g,b))"""
    def pack_chunk(tag, data):
        c = zlib.crc32(tag + data) & 0xFFFFFFFF
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', c)

    # Header
    sig = b'\x89PNG\r\n\x1a\n'
    ihdr = pack_chunk(b'IHDR', struct.pack('>IIBBBBB', W, H, 8, 2, 0, 0, 0))

    # Image data
    raw = b''
    for row in pixels_rgb:
        raw += b'\x00'  # filter type None
        for r, g, b in row:
            raw += bytes([r, g, b])
    idat = pack_chunk(b'IDAT', zlib.compress(raw, 1))
    iend = pack_chunk(b'IEND', b'')

    return sig + ihdr + idat + iend

def lerp_color(c1, c2, t):
    return tuple(int(a + (b - a) * t) for a, b in zip(c1, c2))

def lerp3(c1, c2, c3, t):
    if t < 0.5:
        return lerp_color(c1, c2, t * 2)
    else:
        return lerp_color(c2, c3, (t - 0.5) * 2)

# Sinh pixels
pixels = []
# Màu nền: tím đen (#1a0533) → tím sáng (#6a1a8a) → tím vàng (#3d1060)
C1 = (26, 5, 51)
C2 = (106, 26, 138)
C3 = (58, 10, 100)

for y in range(H):
    row = []
    for x in range(W):
        # Gradient chéo
        t = (x / W * 0.6 + y / H * 0.4)
        base = lerp3(C1, C2, C3, t)

        # Hiệu ứng ngôi sao (chấm vàng nhỏ ngẫu nhiên)
        star_seed = (x * 7 + y * 13 + x * y * 3) % 1000
        if star_seed < 3:
            brightness = 180 + (star_seed * 25)
            base = (min(255, brightness + 50), min(255, brightness + 40), min(255, brightness - 20))

        # Vầng sáng trung tâm (halo vàng nhạt)
        cx, cy = W // 2, H // 2 - 60
        dist = math.sqrt((x - cx)**2 + (y - cy)**2)
        if dist < 200:
            glow = max(0, 1 - dist / 200) * 0.35
            gold = (255, 215, 0)
            base = tuple(min(255, int(base[i] + (gold[i] - base[i]) * glow)) for i in range(3))

        # Dải ngang gradient vàng (ribbon area: y 240–310)
        if 235 <= y <= 315:
            ribbon_alpha = 0.0
            if 240 <= y <= 310:
                # Core ribbon
                dist_center = abs(y - 275)
                ribbon_alpha = max(0, 1 - dist_center / 38) * 0.92
            gold_ribbon = (212, 175, 55)
            base = tuple(min(255, int(base[i] + (gold_ribbon[i] - base[i]) * ribbon_alpha)) for i in range(3))

        # Viền trái (accent strip)
        if x < 10:
            strip_alpha = (1 - x / 10) * 0.6
            strip_color = (180, 130, 20)
            base = tuple(min(255, int(base[i] + (strip_color[i] - base[i]) * strip_alpha)) for i in range(3))

        # Viền dưới (CTA area: y 480–560)
        if 480 <= y <= 560:
            dist_btn = abs(y - 520)
            btn_alpha = max(0, 1 - dist_btn / 42) * 0.85
            if 300 <= x <= 900:
                btn_color = (200, 100, 0)  # cam đậm cho CTA
                base = tuple(min(255, int(base[i] + (btn_color[i] - base[i]) * btn_alpha)) for i in range(3))

        row.append(base)
    pixels.append(row)

# Xuất PNG
out_path = r"D:\TuanNH\MyApp\MiniGame\GameGhepThe\banners\level7_base.png"
with open(out_path, 'wb') as f:
    f.write(make_png(pixels))

print(f"✅ Đã tạo gradient base: {out_path}")
print("   Kích thước:", os.path.getsize(out_path), "bytes")
