/**
 * MiniGame: Cừu & Cừu (Match-3 Layer Stacking Game)
 * Động cơ game chính: Quản lý va chạm đa tầng, Khay 7 ô, Quyền trợ giúp & Hệ thống chủ đề
 */

/**
 * CẤU HÌNH ĐỘ KHÓ TỪNG MÀN
 * Mỗi màn định nghĩa: tên hiển thị, số loại thẻ, số tầng, cấu hình layout
 * Người chơi sẽ trải qua 7 màn tăng dần từ Tutorial → Huyền Thoại
 */
const LEVEL_CONFIGS = [
    // Màn 1: Tập Sự — 3 loại, 9 thẻ, 2 tầng đơn giản (Tutorial)
    {
        name: 'Màn 1: Tập Sự', badge: '🌱', cssClass: 'level-1',
        numTypes: 3, maxLayers: 2,
        description: 'Khởi động nhẹ nhàng! Dành cho người mới bắt đầu.'
    },
    // Màn 2: Học Việc — 4 loại, 18 thẻ, 3 tầng
    {
        name: 'Màn 2: Học Việc', badge: '🌿', cssClass: 'level-2',
        numTypes: 4, maxLayers: 3,
        description: '18 thẻ 3 tầng, bắt đầu cần quan sát kỹ hơn!'
    },
    // Màn 3: Có Kinh Nghiệm — 5 loại, 27 thẻ, 3 tầng + 2 cánh
    {
        name: 'Màn 3: Có Kinh Nghiệm', badge: '⭐', cssClass: 'level-3',
        numTypes: 5, maxLayers: 3,
        description: 'Xuất hiện cánh bài phụ — tính toán cẩn thận kẻo đầy khay!'
    },
    // Màn 4: Thách Thức — 6 loại, 36 thẻ, 4 tầng + cánh
    {
        name: 'Màn 4: Thách Thức', badge: '🌟', cssClass: 'level-4',
        numTypes: 6, maxLayers: 4,
        description: 'Chỉ 20% người chơi vượt được màn này!'
    },
    // Màn 5: Chuyên Gia — 7 loại, 51 thẻ, 4 tầng dày đặc + 2 cánh đôi
    {
        name: 'Màn 5: Chuyên Gia', badge: '💎', cssClass: 'level-5',
        numTypes: 7, maxLayers: 4,
        description: 'TOP 10% Cao Thủ! Bẫy tầng sâu đòi hỏi tư duy logic cao.'
    },
    // Màn 6: Siêu Cấp — 8 loại, 66 thẻ, 5 tầng kịch tính
    {
        name: 'Màn 6: Siêu Cấp', badge: '🔥', cssClass: 'level-6',
        numTypes: 8, maxLayers: 5,
        description: 'ĐỊA NGỤC CHỈ 5% QUA ĐƯỢC! Ranh giới trước khi chạm đỉnh Huyền Thoại.'
    },
    // Màn 7: Huyền Thoại — MAX LEVEL 5 tầng full + cánh bên
    {
        name: 'Màn 7: Huyền Thoại', badge: '👑', cssClass: 'level-7',
        numTypes: 8, maxLayers: 5,
        description: 'Chỉ 0.1% người chơi chinh phục được Huyền Thoại!'
    }
];

const MAX_LEVEL = LEVEL_CONFIGS.length; // 7

/**
 * URL trang chia sẻ riêng cho từng màn trên Blogger.
 * Mỗi trang có og:image riêng → Facebook/Zalo hiển thị ảnh đúng cấp độ.
 * ★ Điền URL thực tế sau khi tạo trang Blogger xong ★
 */
const LEVEL_PAGE_URLS = {
    1: 'https://gameghepthevui.blogspot.com/p/man-1-tap-su.html',
    2: 'https://gameghepthevui.blogspot.com/p/man-2-hoc-viec.html',
    3: 'https://gameghepthevui.blogspot.com/p/man-3-co-kinh-nghiem.html',
    4: 'https://gameghepthevui.blogspot.com/p/man-4-thach-thuc.html',
    5: 'https://gameghepthevui.blogspot.com/p/man-5-chuyen-gia.html',
    6: 'https://gameghepthevui.blogspot.com/p/man-6-sieu-cap.html',
    7: 'https://gameghepthevui.blogspot.com/p/man-7-huyen-thoai.html',
};

const LEVEL_BANNER_URLS = {
    1: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiozPin2-gT6qttrUY4xcq_9Qr92M08CvJ3gbkqvI7d0UUwAV3zMiFHThwGgA-bpLYE6MwCcgVIMPbjGnUfnwoFKq3EBBwD7RpsQLanlThy3D4VD9vu2IYl4dVBxt9wwzmZvzAzrOyFlfpj8MsPDH2QkwKp7UYl7Qe-dNyKYB9vhn34gO16P3L8ENFJRhI/s1376/level1.jpg',
    2: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiGaOmtgNLadhmi9k9jakuxVN5LjSrAjrPUgdnMNyqQAzbOFgmpJgu-kpLoq9blZZ3uJG30Dq_bWzcQgFYexCvg5708NozdjSxjLVpukWGiZnp3Rcm49e9Dj9muhIc7zcbA8XBWF8Q0Bhv12Z79FS4K1Hb4mFsrYJsyEC_gmJ4-oA8CVRViSPEqBA-FSjk/s1376/level2.jpg',
    3: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhmj04s0p5EgkVIJhMLNIsSOoW8Ruk4nWSQQo4GltscTpVU_fE2HoLWBlQynEYaQP1KCHCpRZIJiOtR8dNbkRPCP-JBorO4Rjn1j8GFsS6qaQ_PpzsUmly_rfX_-LiKLoec8wrXe2xGkEDUzWTnFAyktyQaOS6J4HWqKi_uRQk4evqSkOYASaRk8QbHv8Y/s1376/level3.jpg',
    4: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjSh43hu3qgXgAjJkO_FVuowP9_p5QBVAx2BHjUSYXCpZgriMxDY2ua48dYWq4CdJHiK43hojlg26eXjMUlFWlB6dpTLYZjlBZ4B94WrzVch0d-H3xBwu82UvIJA-1euitFj7RAwTVddgjYCCn-FcDbidhIXMYDiZ1DwutHubhniZ6tRh49gKZ7CC4X6Pc/s1376/level4.jpg',
    5: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEibfwuZltplkrDR1HRDrnp1DUk2FuCh_Woaq8WdA-bqMpXkgrLGcWFaxdv1Au9oz1Bw2walAXQEwJUjno_KeaUd1t28oA02Tb7FKE9RMYgthdZKP05gEpTxMo6kUnRw_tvF13LQOuygN1LltRxLiqTsKceQKXiZDd6R9nfK64WjnAwc9a2c_LkC-i8XJYw/s1376/level5.jpg',
    6: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhcm8v5PmB7SzWGlMcJ6z-Y538SE3nd9RajiLoPurw70tI-fBYVSiJ47eFLBuWVYUYyNGwXyJ8CE2yWSFwH2jkufCjx1eUyn5q_B9tb_VUbq8vCQTSNG5Yj-Gx4q0VBvXPVc96gpqD6HQPKsdKTyWNRi94f-EvFV1CVMrHaLmimIOgGJQ1UsJQUwJxH13s/s1376/level6.jpg',
    7: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhrGfPEGMnETTyZhchaoBOsXs5rnGsSBHvXQkIqI-0tTy0u3spTR7OuSfr2cZI6Vut0PWmYMVtIOaZGac9qgBHC5_MMXaCgyOWP9WJmQbpOsdwvI_CIXneOq5wGQltaf1JkM3XXgjtcnWnpKNZYRZSlqL6lKj7qhGnRLdtXhfc0FDNhoPte1q4v1Jr-2T0/s1200/level7.jpg',
};

class MiniGameEngine {
    constructor() {
        this.currentThemeId = localStorage.getItem('sheep_theme') || 'vietnam_food';
        this.currentLevel = 1; // 1 → MAX_LEVEL
        this.boardTiles = []; // Các thẻ trên bàn cờ
        this.trayTiles = []; // Các thẻ đang trong khay chứa (tối đa 7)
        this.stashTiles = []; // Các thẻ đang ở bục chờ tạm thời (Trợ giúp 1)
        this.history = []; // Lịch sử các bước đi để phục vụ Undo

        this.tileWidth = 50; // px
        this.tileHeight = 56; // px

        // Quyền trợ giúp: mỗi quyền có 1 lượt miễn phí ban đầu, sau đó tặng 1 lần quà tiếp sức
        this.powerups = {
            stash: { count: 1, giftClaimed: false, name: 'Bốc 3 thẻ ra ngoài' },
            undo: { count: 1, giftClaimed: false, name: 'Hoàn tác bước đi' },
            shuffle: { count: 1, giftClaimed: false, name: 'Xáo trộn thẻ bài' }
        };
        this.reviveClaimed = false;

        this.isAnimating = false;
        this.isGameOver = false;
        this.score = 0;
        this.combo = 0;
        this.wins = parseInt(localStorage.getItem('sheep_wins') || '0', 10);

        this.initDOM();
        this.bindEvents();
        this.applyTheme(this.currentThemeId);
        const initialLevel = this.detectLevelFromUrl();
        this.startLevel(initialLevel);
    }

    detectLevelFromUrl() {
        try {
            const path = window.location.pathname.toLowerCase();
            const search = window.location.search.toLowerCase();
            const match = path.match(/man-(\d+)/) || search.match(/level=(\d+)/);
            if (match) {
                const lvl = parseInt(match[1], 10);
                if (lvl >= 1 && lvl <= MAX_LEVEL) {
                    return lvl;
                }
            }
        } catch (e) {}
        return 1;
    }

    initDOM() {
        this.boardEl = document.getElementById('game-board');
        this.trayEl = document.getElementById('game-tray');
        this.stashEl = document.getElementById('game-stash');
        this.levelBadge = document.getElementById('level-badge');
        this.scoreEl = document.getElementById('score-display');
        this.winsEl = document.getElementById('wins-display');
        this.themeNameEl = document.getElementById('current-theme-name');
        this.confettiCanvas = document.getElementById('confetti-canvas');

        if (this.winsEl) this.winsEl.textContent = this.wins;
    }

    bindEvents() {
        // Nút Quyền Trợ Giúp
        document.getElementById('btn-powerup-stash').addEventListener('click', () => this.useStashPowerup());
        document.getElementById('btn-powerup-undo').addEventListener('click', () => this.useUndoPowerup());
        document.getElementById('btn-powerup-shuffle').addEventListener('click', () => this.useShufflePowerup());

        // Nút Âm Thanh
        const soundBtn = document.getElementById('btn-sound-toggle');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                const isEnabled = window.soundManager.toggle();
                soundBtn.textContent = isEnabled ? '🔊' : '🔇';
                soundBtn.classList.toggle('muted', !isEnabled);
            });
        }

        // Nút Chọn Chủ Đề
        const themeBtn = document.getElementById('btn-theme-modal');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.openThemeModal());
        }

        // Nút Hướng Dẫn & Chính Sách
        const helpBtn = document.getElementById('btn-help-modal');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                document.getElementById('help-modal').classList.remove('hidden');
            });
        }

        const privacyBtn = document.getElementById('btn-privacy-modal');
        if (privacyBtn) {
            privacyBtn.addEventListener('click', () => {
                document.getElementById('privacy-modal').classList.remove('hidden');
            });
        }

        // Nút Chơi Lại / Tiếp Tục
        document.getElementById('btn-restart-game').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.add('hidden');
            window.adManager.showInterstitial(() => {
                this.startLevel(this.currentLevel);
            });
        });

        document.getElementById('btn-revive-game').addEventListener('click', () => {
            window.adManager.showRewardedAd('Hồi sinh & Xóa 3 thẻ', () => {
                this.reviveGame();
            });
        });

        // Nút Khoe Chiến Tích & Chia Sẻ Mạng Xã Hội
        const shareHeaderBtn = document.getElementById('btn-share-modal');
        if (shareHeaderBtn) {
            shareHeaderBtn.addEventListener('click', () => this.openShareModal('header'));
        }

        const shareWinBtn = document.getElementById('btn-share-win');
        if (shareWinBtn) {
            shareWinBtn.addEventListener('click', () => {
                this.openShareModal(this.currentLevel >= MAX_LEVEL ? 'win_level_2' : 'win_level_1');
            });
        }

        const shareGameOverBtn = document.getElementById('btn-share-gameover');
        if (shareGameOverBtn) {
            shareGameOverBtn.addEventListener('click', () => this.openShareModal('game_over'));
        }

        // Các nút trong Modal Chia Sẻ
        document.getElementById('btn-native-share')?.addEventListener('click', () => this.shareNative());
        document.getElementById('btn-share-facebook')?.addEventListener('click', () => this.shareFacebook());
        document.getElementById('btn-share-zalo')?.addEventListener('click', () => this.shareZalo());
        document.getElementById('btn-copy-link')?.addEventListener('click', () => this.copyShareLink());
        document.getElementById('btn-download-share-img')?.addEventListener('click', () => this.downloadShareImage());

        document.getElementById('btn-next-level').addEventListener('click', () => {
            document.getElementById('win-modal').classList.add('hidden');
            this.startLevel(this.currentLevel + 1);
        });

        document.getElementById('btn-replay-win').addEventListener('click', () => {
            document.getElementById('win-modal').classList.add('hidden');
            this.startLevel(1);
        });

        // Xử lý các nút đóng Modal chung
        document.querySelectorAll('.modal-close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-backdrop');
                if (modal) modal.classList.add('hidden');
            });
        });
    }

    /**
     * Chuyển đổi và áp dụng chủ đề mới
     */
    applyTheme(themeId) {
        const theme = window.GAME_THEMES[themeId];
        if (!theme) return;

        this.currentThemeId = themeId;
        localStorage.setItem('sheep_theme', themeId);

        if (this.themeNameEl) {
            this.themeNameEl.textContent = `${theme.badge} ${theme.name}`;
        }

        document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
        document.documentElement.style.setProperty('--accent-color', theme.accentColor);
        document.body.style.background = theme.bgGradient;

        // Cập nhật lại các thẻ đang hiển thị nếu có
        this.boardTiles.forEach(tile => {
            const item = theme.items.find(i => i.id === tile.itemId) || theme.items[0];
            tile.icon = item.icon;
            tile.name = item.name;
            if (tile.el) {
                const iconEl = tile.el.querySelector('.tile-icon');
                if (iconEl) iconEl.textContent = item.icon;
            }
        });

        this.trayTiles.forEach(tile => {
            const item = theme.items.find(i => i.id === tile.itemId) || theme.items[0];
            tile.icon = item.icon;
            if (tile.el) {
                const iconEl = tile.el.querySelector('.tile-icon');
                if (iconEl) iconEl.textContent = item.icon;
            }
        });
    }

    openThemeModal() {
        const modal = document.getElementById('theme-modal');
        const listEl = document.getElementById('theme-options-list');
        listEl.innerHTML = '';

        Object.values(window.GAME_THEMES).forEach(theme => {
            const card = document.createElement('div');
            card.className = `theme-option-card ${theme.id === this.currentThemeId ? 'active' : ''}`;
            card.innerHTML = `
                <div class="theme-card-icon">${theme.badge}</div>
                <div class="theme-card-info">
                    <h4>${theme.name}</h4>
                    <p>${theme.description}</p>
                    <div class="theme-card-preview">
                        ${theme.items.slice(0, 5).map(i => `<span>${i.icon}</span>`).join(' ')}
                    </div>
                </div>
            `;
            card.onclick = () => {
                this.applyTheme(theme.id);
                modal.classList.add('hidden');
                window.soundManager.playClick();
            };
            listEl.appendChild(card);
        });

        modal.classList.remove('hidden');
    }

    /**
     * Bắt đầu một màn chơi mới (hỗ trợ 7 màn tăng dần)
     */
    startLevel(levelNumber) {
        this.currentLevel = Math.min(Math.max(1, levelNumber), MAX_LEVEL);
        this.isGameOver = false;
        this.isAnimating = false;
        this.boardTiles = [];
        this.trayTiles = [];
        this.stashTiles = [];
        this.history = [];
        this.combo = 0;

        // Đặt lại quyền trợ giúp cho ván chơi mới
        this.powerups = {
            stash: { count: 1, giftClaimed: false, name: 'Bốc 3 thẻ ra ngoài' },
            undo: { count: 1, giftClaimed: false, name: 'Hoàn tác bước đi' },
            shuffle: { count: 1, giftClaimed: false, name: 'Xáo trộn thẻ bài' }
        };
        this.reviveClaimed = false;

        const cfg = LEVEL_CONFIGS[this.currentLevel - 1];
        if (this.levelBadge) {
            this.levelBadge.textContent = `${cfg.badge} ${cfg.name.replace('Màn ' + this.currentLevel + ': ', '')}`;
            this.levelBadge.className = `level-badge ${cfg.cssClass}`;
        }

        this.updatePowerupButtonsUI();
        this.renderTray();
        this.renderStash();

        const theme = window.GAME_THEMES[this.currentThemeId];
        this.generateLevel(this.currentLevel, theme, cfg);

        this.renderBoard();
        this.updateOverlaps();
    }

    /**
     * Sinh bàn cờ theo cấu hình màn — tăng dần từ màn 1 đến màn 7
     */
    generateLevel(levelNumber, theme, cfg) {
        const boardWidth  = (this.boardEl && this.boardEl.clientWidth  > 250) ? this.boardEl.clientWidth  : 360;
        const boardHeight = (this.boardEl && this.boardEl.clientHeight > 250) ? this.boardEl.clientHeight : 380;
        const cx = boardWidth  / 2 - this.tileWidth  / 2;
        const cy = boardHeight / 2 - this.tileHeight / 2 - 15;

        const positions = [];

        if (levelNumber === 1) {
            // ── Màn 1: Kim tự tháp 2 tầng cực nhỏ, 9 thẻ ──────────────────
            // Tầng 0: 6 thẻ hình vòng cung
            const ring = [
                { x: cx - 60, y: cy - 50 }, { x: cx + 60, y: cy - 50 },
                { x: cx - 60, y: cy + 50 }, { x: cx + 60, y: cy + 50 },
                { x: cx,      y: cy - 70 }, { x: cx,      y: cy + 70 }
            ];
            ring.forEach(p => positions.push({ ...p, layer: 0 }));
            // Tầng 1: 2 thẻ giữa
            positions.push({ x: cx - 28, y: cy, layer: 1 });
            positions.push({ x: cx + 28, y: cy, layer: 1 });
            // Tầng 2: đỉnh
            positions.push({ x: cx, y: cy, layer: 2 });

        } else if (levelNumber === 2) {
            // ── Màn 2: Hoa sen 3 tầng, 18 thẻ (4 loại thẻ) ─────────────────
            // Tầng 0: 10 thẻ
            for (let r of [-1, 0, 1]) {
                for (let c of [-1, 0, 1]) {
                    if (r !== 0 || c !== 0) {
                        positions.push({ x: cx + c * 48, y: cy + r * 50, layer: 0 });
                    }
                }
            }
            positions.push({ x: cx - 96, y: cy, layer: 0 });
            positions.push({ x: cx + 96, y: cy, layer: 0 });
            // Tầng 1: 6 thẻ đè lên
            positions.push({ x: cx, y: cy - 36, layer: 1 });
            positions.push({ x: cx, y: cy + 36, layer: 1 });
            positions.push({ x: cx - 36, y: cy, layer: 1 });
            positions.push({ x: cx + 36, y: cy, layer: 1 });
            positions.push({ x: cx - 24, y: cy - 24, layer: 1 });
            positions.push({ x: cx + 24, y: cy + 24, layer: 1 });
            // Tầng 2: 2 thẻ ở đỉnh giữa
            positions.push({ x: cx - 14, y: cy, layer: 2 });
            positions.push({ x: cx + 14, y: cy, layer: 2 });

        } else if (levelNumber === 3) {
            // ── Màn 3: Tháp trung tâm 3 tầng + 2 cánh bên, 27 thẻ (5 loại) ──
            // Tầng 0: Lưới 3x3 = 9 thẻ
            for (let r = -1; r <= 1; r++) {
                for (let c = -1; c <= 1; c++) {
                    positions.push({ x: cx + c * 44, y: cy + r * 46, layer: 0 });
                }
            }
            // Tầng 1: Lưới 2x2 = 4 thẻ
            for (let r of [-0.5, 0.5]) {
                for (let c of [-0.5, 0.5]) {
                    positions.push({ x: cx + c * 44, y: cy + r * 46, layer: 1 });
                }
            }
            // Tầng 2: 3 thẻ tam giác
            positions.push({ x: cx, y: cy - 20, layer: 2 });
            positions.push({ x: cx - 20, y: cy + 20, layer: 2 });
            positions.push({ x: cx + 20, y: cy + 20, layer: 2 });
            // Tầng 3: 1 thẻ đỉnh chóp
            positions.push({ x: cx, y: cy, layer: 3 });
            // Cánh trái: 5 thẻ xếp bậc
            for (let i = 0; i < 5; i++) {
                positions.push({ x: 18 + (i % 2) * 6, y: cy - 50 + i * 24, layer: i });
            }
            // Cánh phải: 5 thẻ xếp bậc
            for (let i = 0; i < 5; i++) {
                positions.push({ x: boardWidth - this.tileWidth - 18 - (i % 2) * 6, y: cy - 50 + i * 24, layer: i });
            }

        } else if (levelNumber === 4) {
            // ── Màn 4: Tháp 4 tầng + 2 cánh, 36 thẻ (6 loại thẻ) ───────────
            // Tầng 0: 14 thẻ
            for (let r = -1; r <= 1; r++) {
                for (let c = -1; c <= 1; c++) {
                    positions.push({ x: cx + c * 42, y: cy + r * 44, layer: 0 });
                }
            }
            for (let [r, c] of [[-2, 0], [2, 0], [0, -2], [0, 2], [-1.5, -1.5]]) {
                positions.push({ x: cx + c * 42, y: cy + r * 44, layer: 0 });
            }
            // Tầng 1: 9 thẻ
            for (let [r, c] of [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0, -1], [0, 1], [-1, 0], [1, 0], [0, 0]]) {
                positions.push({ x: cx + c * 38, y: cy + r * 40, layer: 1 });
            }
            // Tầng 2: 4 thẻ
            for (let [r, c] of [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]]) {
                positions.push({ x: cx + c * 34, y: cy + r * 36, layer: 2 });
            }
            // Tầng 3: 1 thẻ
            positions.push({ x: cx, y: cy, layer: 3 });
            // Cánh trái: 4 thẻ
            for (let i = 0; i < 4; i++) {
                positions.push({ x: 16 + i * 4, y: cy - 40 + i * 26, layer: i });
            }
            // Cánh phải: 4 thẻ
            for (let i = 0; i < 4; i++) {
                positions.push({ x: boardWidth - this.tileWidth - 16 - i * 4, y: cy - 40 + i * 26, layer: i });
            }

        } else if (levelNumber === 5) {
            // ── Màn 5: Tháp kim tự tháp dày đặc + 2 cánh đôi, 51 thẻ (7 loại) ──
            // Tầng 0: 16 thẻ
            for (let r = -2; r <= 2; r++) {
                for (let c = -2; c <= 2; c++) {
                    if (Math.abs(r) + Math.abs(c) <= 3 && !(r === 0 && c === 0)) {
                        positions.push({ x: cx + c * 40, y: cy + r * 42, layer: 0 });
                    }
                }
            }
            // Tầng 1: 9 thẻ lệch
            for (let r of [-1, 0, 1]) {
                for (let c of [-1, 0, 1]) {
                    positions.push({ x: cx + (c - 0.5) * 36, y: cy + (r - 0.5) * 38, layer: 1 });
                }
            }
            // Tầng 2: 5 thẻ
            for (let [r, c] of [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0, 0]]) {
                positions.push({ x: cx + c * 34, y: cy + r * 36, layer: 2 });
            }
            // Tầng 3: 2 thẻ đỉnh
            positions.push({ x: cx - 16, y: cy, layer: 3 });
            positions.push({ x: cx + 16, y: cy, layer: 3 });
            // Cánh trái & phải 2 cột
            for (let i = 0; i < 4; i++) {
                positions.push({ x: 16 + i * 3, y: cy - 55 + i * 6, layer: i });
                positions.push({ x: 16 + i * 3, y: cy + 35 - i * 6, layer: i });
                positions.push({ x: boardWidth - this.tileWidth - 16 - i * 3, y: cy - 55 + i * 6, layer: i });
                positions.push({ x: boardWidth - this.tileWidth - 16 - i * 3, y: cy + 35 - i * 6, layer: i });
            }

        } else if (levelNumber === 6) {
            // ── Màn 6: Tháp 5 tầng kịch tính + 4 cột cánh bên, 66 thẻ (8 loại) ──
            // Tầng 0: 18 thẻ
            for (let r = -2; r <= 2; r++) {
                for (let c = -2; c <= 2; c++) {
                    if (Math.abs(r) + Math.abs(c) <= 3) {
                        positions.push({ x: cx + c * 38, y: cy + r * 40, layer: 0 });
                    }
                }
            }
            positions.push({ x: cx, y: cy - 110, layer: 0 });
            positions.push({ x: cx, y: cy + 110, layer: 0 });
            positions.push({ x: cx - 110, y: cy, layer: 0 });
            positions.push({ x: cx + 110, y: cy, layer: 0 });
            // Tầng 1: 12 thẻ
            for (let r of [-1.5, -0.5, 0.5, 1.5]) {
                for (let c of [-1, 0, 1]) {
                    positions.push({ x: cx + c * 38, y: cy + r * 38, layer: 1 });
                }
            }
            // Tầng 2: 8 thẻ
            for (let [r, c] of [[-1, -1], [1, -1], [-1, 1], [1, 1], [-0.5, 0], [0.5, 0], [0, -0.5], [0, 0.5]]) {
                positions.push({ x: cx + c * 34, y: cy + r * 34, layer: 2 });
            }
            // Tầng 3: 4 thẻ
            for (let [r, c] of [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]]) {
                positions.push({ x: cx + c * 30, y: cy + r * 30, layer: 3 });
            }
            // Tầng 4: 1 thẻ đỉnh cao nhất
            positions.push({ x: cx, y: cy, layer: 4 });
            // Cánh trái & phải 4 cột bài
            for (let i = 0; i < 4; i++) {
                positions.push({ x: 16 + i * 3, y: cy - 60 + i * 6, layer: i });
                positions.push({ x: 16 + i * 3, y: cy + 40 - i * 6, layer: i });
                positions.push({ x: boardWidth - this.tileWidth - 16 - i * 3, y: cy - 60 + i * 6, layer: i });
                positions.push({ x: boardWidth - this.tileWidth - 16 - i * 3, y: cy + 40 - i * 6, layer: i });
            }

        } else {
            // ── Màn 7: Huyền Thoại — tháp 5 tầng full + cánh bên lớn ───────
            const sp = 38;
            // Tầng 0: diamond 5×5 bầu dục lớn
            for (let r = -2; r <= 2; r++)
                for (let c = -2; c <= 2; c++)
                    if (Math.abs(r) + Math.abs(c) <= 3)
                        positions.push({ x: cx + c * sp, y: cy + r * sp, layer: 0 });
            // Tầng 1: 4×4 lệch
            for (let r = -1.5; r <= 1.5; r++)
                for (let c = -1.5; c <= 1.5; c++)
                    positions.push({ x: cx + c * sp, y: cy + r * sp, layer: 1 });
            // Tầng 2: 3×3
            for (let r = -1; r <= 1; r++)
                for (let c = -1; c <= 1; c++)
                    positions.push({ x: cx + c * sp, y: cy + r * sp, layer: 2 });
            // Tầng 3: 2×2
            [[-0.5,-0.5],[0.5,-0.5],[-0.5,0.5],[0.5,0.5]].forEach(([r,c]) =>
                positions.push({ x: cx + c * sp, y: cy + r * sp, layer: 3 }));
            // Tầng 4: đỉnh
            positions.push({ x: cx, y: cy, layer: 4 });
            // Cánh trái
            for (let i = 0; i < 4; i++) {
                positions.push({ x: 16 + i * 4, y: cy + 60 + i * 4, layer: i });
                positions.push({ x: 16 + i * 4, y: cy - 60 - i * 4, layer: i });
            }
            // Cánh phải
            for (let i = 0; i < 4; i++) {
                positions.push({ x: boardWidth - this.tileWidth - 16 - i * 4, y: cy + 60 + i * 4, layer: i });
                positions.push({ x: boardWidth - this.tileWidth - 16 - i * 4, y: cy - 60 - i * 4, layer: i });
            }
        }

        // Trim/pad để tổng số thẻ là bội số của 3
        const remainder = positions.length % 3;
        if (remainder !== 0) positions.splice(positions.length - remainder, remainder);

        const totalTiles = positions.length;
        const totalSets  = totalTiles / 3;

        // Lấy numTypes loại thẻ từ chủ đề (đủ để lấp hết)
        const availableItems = [...theme.items];
        this.shuffleArray(availableItems);
        const numTypes = Math.min(cfg.numTypes, availableItems.length);

        const pool = [];
        let itemIndex = 0;
        for (let s = 0; s < totalSets; s++) {
            const item = availableItems[itemIndex % numTypes];
            for (let k = 0; k < 3; k++)
                pool.push({ itemId: item.id, icon: item.icon, name: item.name });
            itemIndex++;
        }
        this.shuffleArray(pool);

        this.boardTiles = positions.map((pos, idx) => ({
            id: `tile_${levelNumber}_${idx}`,
            itemId: pool[idx].itemId,
            icon:   pool[idx].icon,
            name:   pool[idx].name,
            x: Math.round(pos.x),
            y: Math.round(pos.y),
            layer: pos.layer,
            isBlocked: false,
            el: null
        }));
    }

    /**
     * Thuật toán kiểm tra che khuất tầng (Overlap Collision)
     * Thẻ A bị chặn nếu có thẻ B ở tầng cao hơn (layer_B > layer_A) và đè lên A
     */
    updateOverlaps() {
        for (let i = 0; i < this.boardTiles.length; i++) {
            const tileA = this.boardTiles[i];
            let isCovered = false;

            for (let j = 0; j < this.boardTiles.length; j++) {
                if (i === j) continue;
                const tileB = this.boardTiles[j];

                if (tileB.layer > tileA.layer) {
                    const dx = Math.abs(tileB.x - tileA.x);
                    const dy = Math.abs(tileB.y - tileA.y);

                    // Khoảng cách an toàn để tính là đè lên nhau
                    if (dx < this.tileWidth - 6 && dy < this.tileHeight - 6) {
                        isCovered = true;
                        break;
                    }
                }
            }

            tileA.isBlocked = isCovered;
            if (tileA.el) {
                if (isCovered) {
                    tileA.el.classList.add('blocked');
                    tileA.el.classList.remove('free');
                } else {
                    tileA.el.classList.remove('blocked');
                    tileA.el.classList.add('free');
                }
            }
        }
    }

    renderBoard() {
        this.boardEl.innerHTML = '';
        this.boardTiles.forEach(tile => {
            const el = document.createElement('div');
            el.className = 'game-tile free';
            el.style.left = `${tile.x}px`;
            el.style.top = `${tile.y}px`;
            el.style.zIndex = tile.layer * 10 + 2;
            el.innerHTML = `
                <div class="tile-inner">
                    <span class="tile-icon">${tile.icon}</span>
                </div>
            `;

            el.addEventListener('click', (e) => {
                e.stopPropagation();
                this.onTileClick(tile);
            });

            tile.el = el;
            this.boardEl.appendChild(el);
        });
    }

    /**
     * Xử lý khi người chơi bấm vào 1 thẻ bài
     */
    onTileClick(tile) {
        if (this.isAnimating || this.isGameOver) return;
        if (tile.isBlocked) {
            // Hiệu ứng rung nhẹ khi bấm nhầm thẻ bị khóa
            if (tile.el) {
                tile.el.classList.add('shake');
                setTimeout(() => {
                    if (tile.el) tile.el.classList.remove('shake');
                }, 300);
            }
            return;
        }

        if (this.trayTiles.length >= 7) return;

        window.soundManager.playClick();

        // Ghi lại lịch sử để hỗ trợ tính năng Hoàn Tác (Undo)
        this.history.push({
            type: 'move_to_tray',
            tile: { ...tile }
        });

        // Xóa thẻ khỏi danh sách bàn cờ
        const boardIndex = this.boardTiles.findIndex(t => t.id === tile.id);
        if (boardIndex !== -1) {
            this.boardTiles.splice(boardIndex, 1);
        }

        // Xóa phần tử DOM trên bàn cờ
        if (tile.el && tile.el.parentNode) {
            tile.el.parentNode.removeChild(tile.el);
        }

        // Đưa thẻ vào khay chứa & cập nhật trạng thái các thẻ bên dưới
        this.addTileToTray(tile);
        this.updateOverlaps();
        window.soundManager.playDrop();

        this.isAnimating = true;
        setTimeout(() => {
            this.checkTrayMatches();
            this.isAnimating = false;
        }, 150);
    }

    /**
     * Thêm thẻ vào khay chứa và tự động gom nhóm các thẻ giống nhau đứng cạnh nhau
     */
    addTileToTray(tile) {
        // Tìm xem trong khay đã có thẻ cùng loại chưa để xếp cạnh nhau
        let insertIndex = -1;
        for (let i = this.trayTiles.length - 1; i >= 0; i--) {
            if (this.trayTiles[i].itemId === tile.itemId) {
                insertIndex = i + 1;
                break;
            }
        }

        if (insertIndex !== -1) {
            this.trayTiles.splice(insertIndex, 0, tile);
        } else {
            this.trayTiles.push(tile);
        }

        this.renderTray();
    }

    renderTray() {
        this.trayEl.innerHTML = '';
        for (let i = 0; i < 7; i++) {
            const slot = document.createElement('div');
            slot.className = 'tray-slot';

            if (this.trayTiles[i]) {
                const tile = this.trayTiles[i];
                const tileEl = document.createElement('div');
                tileEl.className = 'game-tile in-tray';
                tileEl.innerHTML = `
                    <div class="tile-inner">
                        <span class="tile-icon">${tile.icon}</span>
                    </div>
                `;
                slot.appendChild(tileEl);
            }

            this.trayEl.appendChild(slot);
        }
    }

    /**
     * Kiểm tra điều kiện Ghép 3 (Match-3) trong khay chứa
     */
    checkTrayMatches() {
        const counts = {};
        this.trayTiles.forEach(tile => {
            counts[tile.itemId] = (counts[tile.itemId] || 0) + 1;
        });

        // Tìm loại thẻ đã đủ 3
        let matchedItemId = null;
        for (const itemId in counts) {
            if (counts[itemId] >= 3) {
                matchedItemId = itemId;
                break;
            }
        }

        if (matchedItemId) {
            window.soundManager.playMatch();
            this.combo++;
            this.score += 30 * this.combo;
            if (this.scoreEl) this.scoreEl.textContent = this.score;

            // Hiệu ứng nổ thẻ
            const matchSlots = [];
            const newTray = [];
            this.trayTiles.forEach((tile, index) => {
                if (tile.itemId === matchedItemId) {
                    matchSlots.push(index);
                } else {
                    newTray.push(tile);
                }
            });

            // Gắn class hiệu ứng nổ cho các ô
            const slots = this.trayEl.querySelectorAll('.tray-slot');
            matchSlots.forEach(idx => {
                if (slots[idx] && slots[idx].firstChild) {
                    slots[idx].firstChild.classList.add('match-explode');
                }
            });

            setTimeout(() => {
                this.trayTiles = newTray;
                this.renderTray();
                this.checkGameStatus();
            }, 220);
        } else {
            this.combo = 0;
            this.checkGameStatus();
        }
    }

    /**
     * Kiểm tra Thắng hoặc Thua ván chơi
     */
    checkGameStatus() {
        // Điều kiện Thắng: Hết sạch thẻ trên bàn cờ VÀ khay trống VÀ bục chờ trống
        if (this.boardTiles.length === 0 && this.trayTiles.length === 0 && this.stashTiles.length === 0) {
            this.triggerVictory();
            return;
        }

        // Điều kiện Thua: Đầy cả 7 ô trong khay
        if (this.trayTiles.length >= 7) {
            this.triggerGameOver();
        }
    }

    triggerVictory() {
        this.isGameOver = true;
        window.soundManager.playWin();

        const cfg     = LEVEL_CONFIGS[this.currentLevel - 1];
        const nextCfg = LEVEL_CONFIGS[this.currentLevel]; // undefined nếu là màn cuối

        const modal   = document.getElementById('win-modal');
        const title   = document.getElementById('win-title');
        const desc    = document.getElementById('win-desc');
        const nextBtn = document.getElementById('btn-next-level');

        if (nextCfg) {
            // Còn màn tiếp theo
            const progressMap = { 1:'🌟', 2:'⭐⭐', 3:'💪', 4:'🔥', 5:'💎', 6:'👑' };
            const emojiProg   = progressMap[this.currentLevel] || '🎉';
            title.textContent = `${emojiProg} VƯỢT QUA ${cfg.name.toUpperCase()}!`;
            desc.textContent  = `Tuyệt vời! Tiếp theo: ${nextCfg.badge} ${nextCfg.name} — ${nextCfg.description}`;
            nextBtn.textContent = `Chơi ${nextCfg.badge} ${nextCfg.name} →`;
            nextBtn.classList.remove('hidden');
        } else {
            // Màn 7 — Huyền Thoại
            this.wins++;
            localStorage.setItem('sheep_wins', this.wins);
            if (this.winsEl) this.winsEl.textContent = this.wins;

            title.textContent = '👑 HUYỀN THOẠI CHIẾN THẮNG!';
            desc.textContent  = `Bạn đã chinh phục cả 7 màn! Chỉ 0.1% người chơi làm được điều này. Tổng chiến thắng: ${this.wins}`;
            nextBtn.classList.add('hidden');
            this.launchConfetti();
        }

        modal.classList.remove('hidden');
        this.launchConfetti();
    }

    triggerGameOver() {
        this.isGameOver = true;
        window.soundManager.playGameOver();
        const modal = document.getElementById('game-over-modal');
        const reviveBtn = document.getElementById('btn-revive-game');

        // Mỗi ván chỉ được hồi sinh đúng 1 lần duy nhất
        if (reviveBtn) {
            if (this.reviveClaimed) {
                reviveBtn.style.display = 'none';
            } else {
                reviveBtn.style.display = 'block';
            }
        }

        if (modal) modal.classList.remove('hidden');
    }

    /**
     * Hồi sinh người chơi (Mỗi ván tối đa 1 lần)
     */
    reviveGame() {
        document.getElementById('game-over-modal').classList.add('hidden');
        this.isGameOver = false;
        this.reviveClaimed = true; // Đánh dấu đã dùng lượt hồi sinh ván này

        // Bốc 3 thẻ từ khay chuyển lên bục chờ tạm thời để giải phóng khay
        if (this.trayTiles.length >= 3) {
            const rescued = this.trayTiles.splice(0, 3);
            this.stashTiles.push(...rescued);
        } else {
            this.stashTiles.push(...this.trayTiles);
            this.trayTiles = [];
        }

        this.renderTray();
        this.renderStash();
        window.soundManager.playPowerup();
    }

    // ==========================================
    // CÁC QUYỀN TRỢ GIÚP (POWER-UPS)
    // ==========================================

    /**
     * Trợ giúp 1: Rút 3 thẻ từ khay lên bục chờ (Stash)
     */
    useStashPowerup() {
        if (this.isGameOver) return;

        const moveTilesToStash = () => {
            const countToMove = Math.min(3, this.trayTiles.length);
            if (countToMove > 0) {
                const moved = this.trayTiles.splice(0, countToMove);
                this.stashTiles.push(...moved);
                this.renderTray();
                this.renderStash();
                window.soundManager.playPowerup();
            }
            this.updatePowerupButtonsUI();
        };

        // Nếu người chơi còn lượt miễn phí
        if (this.powerups.stash.count > 0) {
            if (this.trayTiles.length === 0) {
                window.adManager.showToast('Khay đang trống, hãy dùng khi khay có thẻ nhé!');
                return;
            }
            this.powerups.stash.count--;
            moveTilesToStash();
            window.adManager.showToast('📦 Đã bốc 3 thẻ lên bục chờ!');
            return;
        }

        // Nếu hết lượt miễn phí ban đầu
        const isAds = window.adManager && window.adManager.isAdsApproved;
        if (!isAds && this.powerups.stash.giftClaimed) {
            window.adManager.showToast('Bạn đã dùng hết quà tiếp sức bốc thẻ ván này rồi! 💪');
            return;
        }

        const onClaimSuccess = () => {
            this.powerups.stash.giftClaimed = true;
            this.updatePowerupButtonsUI();
        };

        if (this.trayTiles.length > 0) {
            // Khi khay đang có thẻ: Nhận quà tiếp sức sẽ bốc 3 thẻ NGAY LẬP TỨC
            window.adManager.showRewardedAd('Bốc 3 thẻ ra ngoài', () => {
                moveTilesToStash();
                onClaimSuccess();
                window.adManager.showToast('🎉 Đã giải cứu khay: Bốc 3 thẻ thành công!');
            });
        } else {
            // Khi khay đang trống: Nhận quà tiếp sức để tích lũy +1 lượt dự trữ
            window.adManager.showRewardedAd('Nhận 1 lượt Bốc 3 thẻ dự trữ', () => {
                this.powerups.stash.count++;
                onClaimSuccess();
                window.soundManager.playPowerup();
                window.adManager.showToast('🎁 Đã nhận thêm 1 lượt Bốc 3 thẻ dự trữ!');
            });
        }
    }

    renderStash() {
        if (!this.stashEl) return;
        this.stashEl.innerHTML = '';

        const wrapper = document.getElementById('stash-wrapper');
        const countEl = document.getElementById('stash-count');
        const hintEl = document.getElementById('stash-scroll-hint');

        // Nếu bục chờ trống -> Ẩn toàn bộ để giải phóng không gian cho bàn cờ
        if (this.stashTiles.length === 0) {
            if (wrapper) wrapper.style.display = 'none';
            return;
        }

        // Khi có thẻ trên bục chờ -> Hiện khung bục chờ
        if (wrapper) wrapper.style.display = 'flex';
        if (countEl) countEl.textContent = this.stashTiles.length;
        if (hintEl) {
            hintEl.style.display = this.stashTiles.length > 5 ? 'inline' : 'none';
        }

        this.stashTiles.forEach((tile, index) => {
            const tileEl = document.createElement('div');
            tileEl.className = 'game-tile in-stash';
            tileEl.innerHTML = `
                <div class="tile-inner">
                    <span class="tile-icon">${tile.icon}</span>
                </div>
            `;
            // Người chơi có thể bấm lại vào thẻ ở bục chờ để đưa vào khay
            tileEl.addEventListener('click', () => {
                if (this.trayTiles.length < 7) {
                    this.stashTiles.splice(index, 1);
                    this.renderStash();
                    this.addTileToTray(tile);
                    this.checkTrayMatches();
                    window.soundManager.playClick();
                }
            });
            this.stashEl.appendChild(tileEl);
        });

        // Tự động cuộn sang phải để người chơi nhìn thấy thẻ mới nhất vừa bốc ra
        setTimeout(() => {
            if (this.stashEl) {
                this.stashEl.scrollLeft = this.stashEl.scrollWidth;
            }
        }, 50);
    }

    /**
     * Trợ giúp 2: Hoàn tác 1 bước đi gần nhất (Undo)
     */
    useUndoPowerup() {
        if (this.isGameOver) return;

        const performUndo = () => {
            const lastAction = this.history.pop();
            if (lastAction && lastAction.type === 'move_to_tray') {
                const tileData = lastAction.tile;

                // Tìm và bỏ thẻ đó khỏi khay
                const trayIdx = this.trayTiles.findIndex(t => t.id === tileData.id);
                if (trayIdx !== -1) {
                    this.trayTiles.splice(trayIdx, 1);
                }

                // Đưa thẻ trở lại bàn cờ
                this.boardTiles.push(tileData);
                this.renderBoard();
                this.renderTray();
                this.updateOverlaps();
                window.soundManager.playPowerup();
            }
            this.updatePowerupButtonsUI();
        };

        // Nếu còn lượt miễn phí
        if (this.powerups.undo.count > 0) {
            if (this.history.length === 0) {
                window.adManager.showToast('Chưa có bước đi nào để hoàn tác!');
                return;
            }
            this.powerups.undo.count--;
            performUndo();
            window.adManager.showToast('↩️ Đã hoàn tác 1 bước!');
            return;
        }

        // Nếu hết lượt -> Nhận quà tiếp sức (tối đa 1 lần mỗi ván)
        const isAds = window.adManager && window.adManager.isAdsApproved;
        if (!isAds && this.powerups.undo.giftClaimed) {
            window.adManager.showToast('Bạn đã dùng hết quà tiếp sức hoàn tác ván này rồi! 💪');
            return;
        }

        const onClaimSuccess = () => {
            this.powerups.undo.giftClaimed = true;
            this.updatePowerupButtonsUI();
        };

        if (this.history.length > 0) {
            window.adManager.showRewardedAd('Hoàn tác bước đi gần nhất', () => {
                performUndo();
                onClaimSuccess();
                window.adManager.showToast('🎉 Hoàn tác bước đi thành công!');
            });
        } else {
            window.adManager.showRewardedAd('Nhận 1 lượt Hoàn tác dự trữ', () => {
                this.powerups.undo.count++;
                onClaimSuccess();
                window.soundManager.playPowerup();
                window.adManager.showToast('🎁 Đã nhận thêm 1 lượt Hoàn tác dự trữ!');
            });
        }
    }

    /**
     * Trợ giúp 3: Xáo trộn toàn bộ thẻ còn lại trên bàn (Shuffle)
     */
    useShufflePowerup() {
        if (this.isGameOver) return;

        const performShuffle = () => {
            const items = this.boardTiles.map(t => ({
                itemId: t.itemId,
                icon: t.icon,
                name: t.name
            }));
            this.shuffleArray(items);

            this.boardTiles.forEach((tile, idx) => {
                tile.itemId = items[idx].itemId;
                tile.icon = items[idx].icon;
                tile.name = items[idx].name;
            });

            this.renderBoard();
            this.updateOverlaps();
            window.soundManager.playPowerup();
            this.updatePowerupButtonsUI();
        };

        // Nếu còn lượt miễn phí
        if (this.powerups.shuffle.count > 0) {
            if (this.boardTiles.length <= 1) {
                window.adManager.showToast('Không đủ thẻ trên bàn để xáo trộn!');
                return;
            }
            this.powerups.shuffle.count--;
            performShuffle();
            window.adManager.showToast('🔀 Đã xáo trộn thẻ!');
            return;
        }

        // Nếu hết lượt -> Nhận quà tiếp sức (tối đa 1 lần mỗi ván)
        const isAds = window.adManager && window.adManager.isAdsApproved;
        if (!isAds && this.powerups.shuffle.giftClaimed) {
            window.adManager.showToast('Bạn đã dùng hết quà tiếp sức xáo trộn ván này rồi! 💪');
            return;
        }

        const onClaimSuccess = () => {
            this.powerups.shuffle.giftClaimed = true;
            this.updatePowerupButtonsUI();
        };

        if (this.boardTiles.length > 1) {
            window.adManager.showRewardedAd('Xáo trộn toàn bộ thẻ', () => {
                performShuffle();
                onClaimSuccess();
                window.adManager.showToast('🎉 Đã xáo trộn thẻ thành công!');
            });
        } else {
            window.adManager.showRewardedAd('Nhận 1 lượt Xáo trộn dự trữ', () => {
                this.powerups.shuffle.count++;
                onClaimSuccess();
                window.soundManager.playPowerup();
                window.adManager.showToast('🎁 Đã nhận thêm 1 lượt Xáo trộn dự trữ!');
            });
        }
    }

    updatePowerupButtonsUI() {
        const updateBadge = (id, powerup) => {
            const el = document.getElementById(id);
            if (el) {
                if (powerup.count > 0) {
                    el.textContent = powerup.count;
                    el.className = 'powerup-badge free-badge';
                } else {
                    const isAds = window.adManager && window.adManager.isAdsApproved;
                    if (isAds) {
                        el.textContent = '📺 Ads';
                        el.className = 'powerup-badge ad-badge';
                    } else if (!powerup.giftClaimed) {
                        el.textContent = '🎁 +1';
                        el.className = 'powerup-badge gift-badge';
                    } else {
                        el.textContent = '🔒 Hết';
                        el.className = 'powerup-badge lock-badge';
                    }
                }
            }
        };

        updateBadge('badge-stash', this.powerups.stash);
        updateBadge('badge-undo', this.powerups.undo);
        updateBadge('badge-shuffle', this.powerups.shuffle);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Hiệu ứng pháo hoa chúc mừng chiến thắng (Confetti Animation)
     */
    launchConfetti() {
        if (!this.confettiCanvas) return;
        const canvas = this.confettiCanvas;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#f39c12', '#e74c3c', '#2ecc71', '#3498db', '#9b59b6', '#fd79a8'];

        for (let i = 0; i < 120; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                r: Math.random() * 6 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 14,
                vy: (Math.random() - 0.7) * 16,
                gravity: 0.28,
                rotation: Math.random() * 360,
                vRot: (Math.random() - 0.5) * 10
            });
        }

        let animationFrame;
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.rotation += p.vRot;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
                ctx.restore();
            });

            if (particles.some(p => p.y < canvas.height)) {
                animationFrame = requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                cancelAnimationFrame(animationFrame);
            }
        };

        render();
    }

    // ==========================================
    // TÍNH NĂNG KHOE CHIẾN TÍCH & CHIA SẺ MẠNG XÃ HỘI
    // ==========================================

    openShareModal(context = 'general') {
        const modal = document.getElementById('share-modal');
        if (!modal) return;

        const cfg = LEVEL_CONFIGS[this.currentLevel - 1];
        const levelText = cfg ? `${cfg.badge} ${cfg.name}` : `Màn ${this.currentLevel}`;
        const levelEl = document.getElementById('share-stat-level');
        const scoreEl = document.getElementById('share-stat-score');
        const winsEl = document.getElementById('share-stat-wins');

        if (levelEl) levelEl.textContent = levelText;
        if (scoreEl) scoreEl.textContent = this.score;
        if (winsEl) winsEl.textContent = this.wins;

        const iconEl  = document.getElementById('share-trophy-icon');
        const titleEl = document.getElementById('share-card-title');
        const quoteEl = document.getElementById('share-quote-text');

        let challengeText = '';

        if (context === 'win_level_2') {
            // Màn cuối (Huyền Thoại)
            if (iconEl) iconEl.textContent = '👑';
            if (titleEl) titleEl.textContent = 'HUYỀN THOẠI CHIẾN THẮNG!';
            challengeText = `👑 Tôi vừa chinh phục Màn 7: Huyền Thoại của Siêu Ghép Thẻ! ${this.score} điểm — Chỉ 0.1% người chơi làm được. Bạn có dám thử không? 🎮`;
        } else if (context === 'game_over') {
            if (iconEl) iconEl.textContent = '🔥';
            if (titleEl) titleEl.textContent = 'THÁCH ĐẤU GIẢI CỨU!';
            challengeText = `😱 Tôi bị thua ở ${levelText} với ${this.score} điểm! Bàn cờ này quá hiểm hóc — có ai vào giải cứu giùm tôi không? 🎮`;
        } else if (context === 'win_level_1') {
            // Thắng màn trung gian (1–6)
            const nextCfg = LEVEL_CONFIGS[this.currentLevel]; // màn tiếp theo
            if (iconEl) iconEl.textContent = cfg ? cfg.badge : '🎉';
            if (titleEl) titleEl.textContent = `VƯỢT QUA ${cfg ? cfg.name.toUpperCase() : 'MÀN NÀY'}!`;
            const nextHint = nextCfg ? ` Tiếp theo: ${nextCfg.badge} ${nextCfg.name}.` : '';
            challengeText = `🚀 Tôi vừa vượt qua ${levelText} cực mượt với ${this.score} điểm!${nextHint} Vào chơi đọ điểm với tôi nhé! 🎮`;
        } else {
            if (iconEl) iconEl.textContent = '🎮';
            if (titleEl) titleEl.textContent = 'SIÊU THỬ THÁCH GHÉP THẺ';
            challengeText = `🔥 Trò chơi Siêu Ghép Thẻ cực kỳ gây nghiện! Kỷ lục hiện tại của tôi: ${this.score} điểm (${this.wins} trận thắng). Cùng vào so tài nhé! 🚀`;
        }

        if (quoteEl) quoteEl.textContent = `"${challengeText}"`;
        this.currentShareText = challengeText;

        modal.classList.remove('hidden');
        window.soundManager.playPowerup();

        // Sinh ảnh theo cấp độ bất đồng bộ
        this._generateShareImagePreview();
    }

    /**
     * Sinh ảnh preview trong share modal theo cấp độ hiện tại
     * @private
     */
    _generateShareImagePreview() {
        const loadingEl = document.getElementById('share-image-loading');
        const previewEl = document.getElementById('share-image-preview');
        if (!loadingEl || !previewEl) return;

        // Nếu có link banner CDN thật của màn này -> hiển thị ngay lập tức!
        const cdnBanner = LEVEL_BANNER_URLS[this.currentLevel];
        if (cdnBanner) {
            previewEl.src = cdnBanner;
            previewEl.style.display = 'block';
            loadingEl.style.display = 'none';
            return;
        }

        // Fallback tạo ảnh động Canvas nếu chưa có CDN banner
        if (!window.ShareImageGenerator) return;

        if (this._shareImageURL) {
            URL.revokeObjectURL(this._shareImageURL);
            this._shareImageURL = null;
        }

        loadingEl.style.display = 'block';
        previewEl.style.display = 'none';

        window.ShareImageGenerator.generateShareImageBlob(
            this.currentLevel, this.score, this.wins
        ).then(blob => {
            this._shareImageBlob = blob;
            const url = URL.createObjectURL(blob);
            this._shareImageURL = url;

            previewEl.src = url;
            previewEl.style.display = 'block';
            loadingEl.style.display = 'none';
        }).catch(() => {
            loadingEl.textContent = '(Không thể tạo ảnh preview)';
        });
    }

    getShareUrl() {
        // Trả về URL trang chia sẻ riêng của màn hiện tại
        // → Facebook sẽ đọc og:image từ trang đó → hiển thị ảnh đúng cấp độ
        return LEVEL_PAGE_URLS[this.currentLevel] || 'https://gameghepthevui.blogspot.com/';
    }

    shareNative() {
        const text = this.currentShareText || 'Chơi game ghép thẻ cực cuốn cùng tôi nhé!';
        const url  = this.getShareUrl();

        // Thử share kèm file ảnh trước (iOS Safari / Android Chrome hỗ trợ)
        const tryShareWithImage = () => {
            if (this._shareImageBlob && navigator.canShare) {
                const file = new File([this._shareImageBlob], `sieu-ghep-the-man${this.currentLevel}.jpg`, { type: 'image/jpeg' });
                if (navigator.canShare({ files: [file] })) {
                    return navigator.share({ files: [file], title: 'Siêu Ghép Thẻ', text, url });
                }
            }
            return null;
        };

        if (navigator.share) {
            const withImageShare = tryShareWithImage();
            if (withImageShare) {
                withImageShare.catch(() => {
                    // Fallback: share text + link nếu share ảnh thất bại
                    navigator.share({ title: 'Siêu Ghép Thẻ', text, url }).catch(() => {});
                });
            } else {
                navigator.share({ title: 'Siêu Ghép Thẻ', text, url }).catch(() => {});
            }
        } else {
            this.copyShareLink();
        }
    }

    shareFacebook() {
        const url = encodeURIComponent(this.getShareUrl());
        const quote = encodeURIComponent(this.currentShareText || '');
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`;
        window.open(fbUrl, '_blank', 'width=600,height=500');
    }

    downloadShareImage() {
        const cdnBanner = LEVEL_BANNER_URLS[this.currentLevel];
        if (cdnBanner) {
            window.open(cdnBanner, '_blank');
            window.adManager.showToast('🖼️ Đang mở ảnh chất lượng cao! Bạn có thể lưu ảnh và đăng bài nhé!');
            return;
        }

        if (!this._shareImageBlob) {
            window.adManager.showToast('⏳ Ảnh đang tạo, vui lòng thử lại sau giây lát!');
            return;
        }
        this._downloadShareImageFile();
        window.adManager.showToast('📥 Đã tải ảnh về! Mở Facebook và đính kèm ảnh vừa tải để đăng nhé!');
    }

    /** @private */
    _downloadShareImageFile() {
        const a = document.createElement('a');
        a.href = this._shareImageURL || URL.createObjectURL(this._shareImageBlob);
        a.download = `sieu-ghep-the-man${this.currentLevel}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    shareZalo() {
        this.copyShareLink(true);
    }

    copyShareLink(isForZalo = false) {
        const text = `${this.currentShareText || 'Chơi game ghép thẻ cực cuốn!'}\n👉 Chơi ngay tại: ${this.getShareUrl()}`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                if (isForZalo) {
                    window.adManager.showToast('💬 Đã sao chép! Hãy dán vào Zalo gửi cho bạn bè nhé!');
                    setTimeout(() => {
                        window.open('https://chat.zalo.me/', '_blank');
                    }, 500);
                } else {
                    window.adManager.showToast('📋 Đã sao chép lời thách đấu và link game!');
                }
            }).catch(() => {
                this.fallbackCopy(text);
            });
        } else {
            this.fallbackCopy(text);
        }
    }

    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            window.adManager.showToast('📋 Đã sao chép lời thách đấu và link!');
        } catch (e) {
            window.adManager.showToast('Không thể tự động sao chép, hãy chọn thủ công!');
        }
        document.body.removeChild(textarea);
    }
}

// Khởi tạo Game khi trang tải xong
window.addEventListener('DOMContentLoaded', () => {
    window.gameEngine = new MiniGameEngine();
    window.adManager.init();
});
