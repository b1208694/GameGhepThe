/**
 * share-image.js — Sinh ảnh chia sẻ động theo cấp độ bằng Canvas API
 * Mỗi màn có màu sắc, emoji, bố cục riêng để tăng tính viral khi share Facebook/Zalo
 */

const SHARE_IMAGE_CONFIGS = {
    1: {
        bgColors:    ['#11998e', '#38ef7d'],
        accentColor: '#ffffff',
        badge:       '🌱',
        levelLabel:  'MÀN 1: TẬP SỰ',
        tagline:     'Bước đầu chinh phục!',
        rarity:      'Người mới bắt đầu',
        tiles:       ['🍜','🧋','🥖','🍚','🫓'],
        rarityColor: '#a8edcb',
        glow:        'rgba(56,239,125,0.4)'
    },
    2: {
        bgColors:    ['#1a6b5c', '#43b89c'],
        accentColor: '#ffffff',
        badge:       '🌿',
        levelLabel:  'MÀN 2: HỌC VIỆC',
        tagline:     'Đang vào guồng rồi!',
        rarity:      'Top 70% người chơi',
        tiles:       ['🐱','🐶','🐰','🐼','🦊'],
        rarityColor: '#a8e6cf',
        glow:        'rgba(67,184,156,0.4)'
    },
    3: {
        bgColors:    ['#1565c0', '#42a5f5'],
        accentColor: '#ffffff',
        badge:       '⭐',
        levelLabel:  'MÀN 3: CÓ KINH NGHIỆM',
        tagline:     'Tư duy sắc bén!',
        rarity:      'Top 50% người chơi',
        tiles:       ['🍉','🍇','🥭','🍍','🍋'],
        rarityColor: '#90caf9',
        glow:        'rgba(66,165,245,0.4)'
    },
    4: {
        bgColors:    ['#e65100', '#ffa726'],
        accentColor: '#ffffff',
        badge:       '🌟',
        levelLabel:  'MÀN 4: THÁCH THỨC',
        tagline:     'Chỉ 20% người vượt qua!',
        rarity:      'Top 20% người chơi',
        tiles:       ['🧁','🍰','🍩','🍪','🎂'],
        rarityColor: '#ffe082',
        glow:        'rgba(255,167,38,0.5)'
    },
    5: {
        bgColors:    ['#4a148c', '#7b1fa2'],
        accentColor: '#ffffff',
        badge:       '💎',
        levelLabel:  'MÀN 5: CHUYÊN GIA',
        tagline:     'Đẳng cấp hiếm có!',
        rarity:      'Top 10% người chơi',
        tiles:       ['🍜','🐱','🍉','🧁','🍜'],
        rarityColor: '#ce93d8',
        glow:        'rgba(123,31,162,0.5)'
    },
    6: {
        bgColors:    ['#b71c1c', '#ef5350'],
        accentColor: '#ffffff',
        badge:       '🔥',
        levelLabel:  'MÀN 6: SIÊU CẤP',
        tagline:     'Siêu đẳng! Chỉ 5% đạt được!',
        rarity:      'Top 5% người chơi',
        tiles:       ['🧋','🦊','🥭','🍩','🎂'],
        rarityColor: '#ef9a9a',
        glow:        'rgba(239,83,80,0.6)'
    },
    7: {
        bgColors:    ['#1a0533', '#6a1a8a'],
        accentColor: '#ffd700',
        badge:       '👑',
        levelLabel:  'MÀN 7: HUYỀN THOẠI',
        tagline:     'Chỉ 0.1% người làm được!!!',
        rarity:      'HUYỀN THOẠI',
        tiles:       ['👑','💎','🔥','⭐','🏆'],
        rarityColor: '#ffd700',
        glow:        'rgba(255,215,0,0.6)'
    }
};

/**
 * Vẽ văn bản có xuống dòng tự động
 */
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    words.forEach((word, n) => {
        const testLine = line + word + ' ';
        if (ctx.measureText(testLine).width > maxWidth && n > 0) {
            ctx.fillText(line.trim(), x, currentY);
            line = word + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    });
    ctx.fillText(line.trim(), x, currentY);
    return currentY;
}

/**
 * Sinh ảnh chia sẻ dạng Canvas và trả về Promise<Blob>
 * @param {number} level     — Cấp độ hiện tại (1–7)
 * @param {number} score     — Điểm số người chơi
 * @param {number} wins      — Tổng số lần thắng
 * @param {string} themeEmoji — emoji đại diện chủ đề đang chọn (tùy chọn)
 * @returns {Promise<Blob>}
 */
function generateShareImageBlob(level, score, wins, themeEmoji = '') {
    return new Promise((resolve) => {
        const cfg = SHARE_IMAGE_CONFIGS[level] || SHARE_IMAGE_CONFIGS[1];

        const W = 1200, H = 630;
        const canvas = document.createElement('canvas');
        canvas.width  = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');

        // ── 1. Background gradient ──────────────────────────────────────────
        const grad = ctx.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, cfg.bgColors[0]);
        grad.addColorStop(1, cfg.bgColors[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // ── 2. Overlay vân trang trí (chấm mờ) ─────────────────────────────
        ctx.save();
        ctx.globalAlpha = 0.07;
        for (let r = 0; r < H; r += 55) {
            for (let c = 0; c < W; c += 55) {
                ctx.beginPath();
                ctx.arc(c, r, 20, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
            }
        }
        ctx.restore();

        // ── 3. Khung sáng bên trái (accent strip) ──────────────────────────
        const stripGrad = ctx.createLinearGradient(0, 0, 0, H);
        stripGrad.addColorStop(0, 'rgba(255,255,255,0.18)');
        stripGrad.addColorStop(1, 'rgba(255,255,255,0.03)');
        ctx.fillStyle = stripGrad;
        ctx.fillRect(0, 0, 8, H);

        // ── 4. Hình trang trí góc phải — emoji thẻ bài ─────────────────────
        ctx.save();
        ctx.globalAlpha = 0.12;
        const tileEmojis = cfg.tiles;
        const tileFont = 90;
        ctx.font = `${tileFont}px serif`;
        const tilePositions = [
            { x: W - 160, y: 120 }, { x: W - 90,  y: 220 },
            { x: W - 200, y: 300 }, { x: W - 100, y: 420 },
            { x: W - 170, y: 530 }
        ];
        tilePositions.forEach((pos, i) => {
            ctx.fillText(tileEmojis[i % tileEmojis.length], pos.x, pos.y);
        });
        ctx.restore();

        // ── 5. Logo / Tiêu đề game ──────────────────────────────────────────
        ctx.save();
        // Vòng sáng phía sau badge
        const glowGrad = ctx.createRadialGradient(100, 100, 10, 100, 100, 90);
        glowGrad.addColorStop(0, cfg.glow);
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(10, 20, 180, 180);

        ctx.font = 'bold 100px serif';
        ctx.fillText(cfg.badge, 32, 130);
        ctx.restore();

        // Tên game
        ctx.font = 'bold 56px "Arial", sans-serif';
        ctx.fillStyle = cfg.accentColor;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur  = 12;
        ctx.fillText('SIÊU GHÉP THẺ', 170, 85);

        // Tagline nhỏ dưới tên game
        ctx.font = '28px "Arial", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.shadowBlur  = 6;
        ctx.fillText('🎮 gameghepthevui.blogspot.com', 173, 125);

        // ── 6. Thẻ cấp độ (level pill) ─────────────────────────────────────
        ctx.shadowBlur = 0;
        // Nền pill
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(44, 165, 680, 90, 20);
        ctx.fillStyle = 'rgba(0,0,0,0.30)';
        ctx.fill();
        ctx.restore();

        ctx.font = 'bold 46px "Arial", sans-serif';
        ctx.fillStyle = cfg.accentColor;
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur  = 14;
        ctx.fillText(cfg.levelLabel, 60, 224);

        // ── 7. Tagline ──────────────────────────────────────────────────────
        ctx.font = 'italic 32px "Arial", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.90)';
        ctx.shadowBlur = 8;
        ctx.fillText(cfg.tagline, 60, 285);

        // ── 8. Thống kê điểm số ─────────────────────────────────────────────
        ctx.shadowBlur = 0;
        // Panel nền
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(44, 318, 680, 160, 18);
        ctx.fillStyle = 'rgba(0,0,0,0.28)';
        ctx.fill();
        ctx.restore();

        // Nhãn + giá trị từng stat
        const stats = [
            { label: 'ĐIỂM SỐ',    value: String(score),         x: 100 },
            { label: 'CHIẾN THẮNG', value: `${wins} lần`,         x: 310 },
            { label: 'ĐỘ HIẾM',    value: cfg.rarity,            x: 530 }
        ];
        stats.forEach(s => {
            ctx.font = '20px "Arial", sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.65)';
            ctx.fillText(s.label, s.x, 358);

            ctx.font = 'bold 36px "Arial", sans-serif';
            ctx.fillStyle = s.label === 'ĐỘ HIẾM' ? cfg.rarityColor : '#ffffff';
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur  = 10;
            ctx.fillText(s.value, s.x, 404);
            ctx.shadowBlur  = 0;
        });

        // ── 9. Lời thách đấu (challenge quote) ─────────────────────────────
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(44, 500, 680, 100, 16);
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fill();
        ctx.restore();

        ctx.font = 'bold 26px "Arial", sans-serif';
        ctx.fillStyle = cfg.accentColor;
        ctx.shadowBlur = 6;
        const challengeMsg = level >= 7
            ? '👑 Bạn có dám chinh phục Huyền Thoại không?'
            : `🔥 Bạn đã đến được ${cfg.levelLabel} chưa?`;
        wrapText(ctx, challengeMsg, 64, 545, 650, 34);
        ctx.shadowBlur = 0;

        // ── 10. Dải CTA bên dưới cùng ──────────────────────────────────────
        const ctaGrad = ctx.createLinearGradient(0, 590, 0, 630);
        ctaGrad.addColorStop(0, 'rgba(0,0,0,0.0)');
        ctaGrad.addColorStop(1, 'rgba(0,0,0,0.5)');
        ctx.fillStyle = ctaGrad;
        ctx.fillRect(0, 590, W, 40);

        ctx.font = '22px "Arial", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.80)';
        ctx.fillText('👉 Chơi miễn phí tại: gameghepthevui.blogspot.com', 44, 622);

        // ── 11. Xuất Blob ────────────────────────────────────────────────────
        canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.92);
    });
}

/**
 * Tạo ObjectURL từ blob để preview hoặc tải xuống
 */
function createShareImageURL(level, score, wins) {
    return generateShareImageBlob(level, score, wins).then(blob => URL.createObjectURL(blob));
}

window.ShareImageGenerator = { generateShareImageBlob, createShareImageURL };
