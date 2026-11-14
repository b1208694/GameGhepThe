/**
 * MiniGame: Cừu & Cừu (Match-3 Layer Stacking Game)
 * Động cơ game chính: Quản lý va chạm đa tầng, Khay 7 ô, Quyền trợ giúp & Hệ thống chủ đề
 */
class MiniGameEngine {
    constructor() {
        this.currentThemeId = localStorage.getItem('sheep_theme') || 'vietnam_food';
        this.currentLevel = 1; // 1: Dễ (Tutorial), 2: Địa ngục (Hell)
        this.boardTiles = []; // Các thẻ trên bàn cờ
        this.trayTiles = []; // Các thẻ đang trong khay chứa (tối đa 7)
        this.stashTiles = []; // Các thẻ đang ở bục chờ tạm thời (Trợ giúp 1)
        this.history = []; // Lịch sử các bước đi để phục vụ Undo

        this.tileWidth = 50; // px
        this.tileHeight = 56; // px

        // Quyền trợ giúp: mỗi quyền có 1 lượt miễn phí ban đầu, sau đó xem quảng cáo
        this.powerups = {
            stash: { count: 1, name: 'Bốc 3 thẻ ra ngoài' },
            undo: { count: 1, name: 'Hoàn tác bước đi' },
            shuffle: { count: 1, name: 'Xáo trộn thẻ bài' }
        };

        this.isAnimating = false;
        this.isGameOver = false;
        this.score = 0;
        this.combo = 0;
        this.wins = parseInt(localStorage.getItem('sheep_wins') || '0', 10);

        this.initDOM();
        this.bindEvents();
        this.applyTheme(this.currentThemeId);
        this.startLevel(1);
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
                this.openShareModal(this.currentLevel === 2 ? 'win_level_2' : 'win_level_1');
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

        document.getElementById('btn-next-level').addEventListener('click', () => {
            document.getElementById('win-modal').classList.add('hidden');
            this.startLevel(2);
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
     * Bắt đầu một màn chơi mới
     */
    startLevel(levelNumber) {
        this.currentLevel = levelNumber;
        this.isGameOver = false;
        this.isAnimating = false;
        this.boardTiles = [];
        this.trayTiles = [];
        this.stashTiles = [];
        this.history = [];
        this.combo = 0;

        if (this.levelBadge) {
            this.levelBadge.textContent = levelNumber === 1 ? 'Màn 1: Tập Sự' : 'Màn 2: Thách Thức';
            this.levelBadge.className = `level-badge level-${levelNumber}`;
        }

        this.updatePowerupButtonsUI();
        this.renderTray();
        this.renderStash();

        const theme = window.GAME_THEMES[this.currentThemeId];

        if (levelNumber === 1) {
            this.generateLevel1(theme);
        } else {
            this.generateLevel2(theme);
        }

        this.renderBoard();
        this.updateOverlaps();
    }

    /**
     * Tạo dữ liệu Màn 1 (Dễ, 9 hoặc 12 thẻ, xếp 2 tầng đơn giản)
     */
    generateLevel1(theme) {
        const items = theme.items.slice(0, 3); // Chọn 3 loại
        const pool = [];
        // Mỗi loại 3 thẻ -> Tổng cộng 9 thẻ
        items.forEach(item => {
            for (let i = 0; i < 3; i++) {
                pool.push({ itemId: item.id, icon: item.icon, name: item.name });
            }
        });
        this.shuffleArray(pool);

        const boardWidth = (this.boardEl && this.boardEl.clientWidth > 250) ? this.boardEl.clientWidth : 360;
        const boardHeight = (this.boardEl && this.boardEl.clientHeight > 250) ? this.boardEl.clientHeight : 380;
        const centerX = boardWidth / 2 - this.tileWidth / 2;
        const centerY = boardHeight / 2 - this.tileHeight / 2 - 10;

        const layout = [
            // Tầng 0 (Bên dưới)
            { x: centerX - 60, y: centerY - 50, layer: 0 },
            { x: centerX + 60, y: centerY - 50, layer: 0 },
            { x: centerX - 60, y: centerY + 50, layer: 0 },
            { x: centerX + 60, y: centerY + 50, layer: 0 },
            { x: centerX, y: centerY - 70, layer: 0 },
            { x: centerX, y: centerY + 70, layer: 0 },

            // Tầng 1 (Đè nhẹ lên giữa)
            { x: centerX - 30, y: centerY, layer: 1 },
            { x: centerX + 30, y: centerY, layer: 1 },
            { x: centerX, y: centerY, layer: 2 }
        ];

        this.boardTiles = pool.map((item, idx) => ({
            id: `tile_1_${idx}`,
            itemId: item.itemId,
            icon: item.icon,
            name: item.name,
            x: layout[idx].x,
            y: layout[idx].y,
            layer: layout[idx].layer,
            isBlocked: false,
            el: null
        }));
    }

    /**
     * Tạo dữ liệu Màn 2 (Địa ngục: Nhiều tầng chồng chéo, các chồng bài phụ bên cạnh)
     * Đảm bảo TOÀN BỘ số lượng thẻ luôn là BỘI SỐ CỦA 3
     */
    generateLevel2(theme) {
        const boardWidth = (this.boardEl && this.boardEl.clientWidth > 250) ? this.boardEl.clientWidth : 360;
        const boardHeight = (this.boardEl && this.boardEl.clientHeight > 250) ? this.boardEl.clientHeight : 380;
        const centerX = boardWidth / 2 - this.tileWidth / 2;
        const centerY = boardHeight / 2 - this.tileHeight / 2 - 25;

        const positions = [];

        // 1. Tháp kim tự tháp trung tâm 5 tầng
        // Tầng 0: 5x5 ô (cách nhau 38px)
        for (let r = -2; r <= 2; r++) {
            for (let c = -2; c <= 2; c++) {
                if (Math.abs(r) + Math.abs(c) <= 3) {
                    positions.push({ x: centerX + c * 38, y: centerY + r * 40, layer: 0 });
                }
            }
        }

        // Tầng 1: 4x4 ô (lệch nửa ô 19px)
        for (let r = -1.5; r <= 1.5; r++) {
            for (let c = -1.5; c <= 1.5; c++) {
                positions.push({ x: centerX + c * 38, y: centerY + r * 40, layer: 1 });
            }
        }

        // Tầng 2: 3x3 ô
        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                positions.push({ x: centerX + c * 38, y: centerY + r * 40, layer: 2 });
            }
        }

        // Tầng 3: 2x2 ô
        for (let r = -0.5; r <= 0.5; r++) {
            for (let c = -0.5; c <= 0.5; c++) {
                positions.push({ x: centerX + c * 38, y: centerY + r * 40, layer: 3 });
            }
        }

        // Tầng 4: Đỉnh tháp
        positions.push({ x: centerX, y: centerY, layer: 4 });

        // 2. Hai cột bài dự phòng hai bên cánh (Side Stacks)
        // Cánh trái
        for (let i = 0; i < 4; i++) {
            positions.push({ x: 16 + i * 4, y: centerY + 60 + i * 4, layer: i });
            positions.push({ x: 16 + i * 4, y: centerY - 60 - i * 4, layer: i });
        }
        // Cánh phải
        for (let i = 0; i < 4; i++) {
            positions.push({ x: boardWidth - this.tileWidth - 16 - i * 4, y: centerY + 60 + i * 4, layer: i });
            positions.push({ x: boardWidth - this.tileWidth - 16 - i * 4, y: centerY - 60 - i * 4, layer: i });
        }

        // Đảm bảo tổng số vị trí là bội số của 3
        const remainder = positions.length % 3;
        if (remainder !== 0) {
            positions.splice(positions.length - remainder, remainder);
        }

        const totalTiles = positions.length;
        const totalSets = totalTiles / 3;

        // Chọn các vật phẩm từ bộ chủ đề
        const availableItems = [...theme.items];
        this.shuffleArray(availableItems);

        // Phân bổ thẻ: mỗi loại có 3 hoặc 6 hoặc 9 thẻ
        const pool = [];
        let itemIndex = 0;
        for (let s = 0; s < totalSets; s++) {
            const item = availableItems[itemIndex % availableItems.length];
            for (let k = 0; k < 3; k++) {
                pool.push({ itemId: item.id, icon: item.icon, name: item.name });
            }
            itemIndex++;
        }

        this.shuffleArray(pool);

        this.boardTiles = positions.map((pos, idx) => ({
            id: `tile_2_${idx}`,
            itemId: pool[idx].itemId,
            icon: pool[idx].icon,
            name: pool[idx].name,
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

        if (this.currentLevel === 1) {
            // Màn 1 thắng -> Chuyển màn 2
            const modal = document.getElementById('win-modal');
            const title = document.getElementById('win-title');
            const desc = document.getElementById('win-desc');
            const nextBtn = document.getElementById('btn-next-level');

            title.textContent = '🎉 VƯỢT QUA MÀN 1!';
            desc.textContent = 'Quá đỉnh! Nhưng thử thách thực sự Màn 2 (Chỉ 0.1% người thắng) mới bắt đầu!';
            nextBtn.classList.remove('hidden');
            modal.classList.remove('hidden');
        } else {
            // Màn 2 thắng -> Kỷ lục thế giới!
            this.wins++;
            localStorage.setItem('sheep_wins', this.wins);
            if (this.winsEl) this.winsEl.textContent = this.wins;

            const modal = document.getElementById('win-modal');
            const title = document.getElementById('win-title');
            const desc = document.getElementById('win-desc');
            const nextBtn = document.getElementById('btn-next-level');

            title.textContent = '🏆 HUYỀN THOẠI CHIẾN THẮNG!';
            desc.textContent = `Bạn đã xuất sắc chinh phục Màn 2 của game! Tổng số chiến thắng: ${this.wins}`;
            nextBtn.classList.add('hidden');
            modal.classList.remove('hidden');

            this.launchConfetti();
        }
    }

    triggerGameOver() {
        this.isGameOver = true;
        window.soundManager.playGameOver();
        const modal = document.getElementById('game-over-modal');
        if (modal) modal.classList.remove('hidden');
    }

    /**
     * Hồi sinh người chơi khi xem xong quảng cáo
     */
    reviveGame() {
        document.getElementById('game-over-modal').classList.add('hidden');
        this.isGameOver = false;

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

        // Nếu hết lượt miễn phí -> Xem quảng cáo nhận thưởng
        if (this.trayTiles.length > 0) {
            // Khi khay đang có thẻ: Xem xong quảng cáo sẽ bốc 3 thẻ NGAY LẬP TỨC
            window.adManager.showRewardedAd('Bốc 3 thẻ ra ngoài', () => {
                moveTilesToStash();
                window.adManager.showToast('🎉 Đã giải cứu khay: Bốc 3 thẻ thành công!');
            });
        } else {
            // Khi khay đang trống: Xem quảng cáo để tích lũy +1 lượt dự trữ
            window.adManager.showRewardedAd('Nhận 1 lượt Bốc 3 thẻ dự trữ', () => {
                this.powerups.stash.count++;
                this.updatePowerupButtonsUI();
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

        // Nếu hết lượt -> Xem quảng cáo
        if (this.history.length > 0) {
            window.adManager.showRewardedAd('Hoàn tác bước đi gần nhất', () => {
                performUndo();
                window.adManager.showToast('🎉 Hoàn tác bước đi thành công!');
            });
        } else {
            window.adManager.showRewardedAd('Nhận 1 lượt Hoàn tác dự trữ', () => {
                this.powerups.undo.count++;
                this.updatePowerupButtonsUI();
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

        // Nếu hết lượt -> Xem quảng cáo
        if (this.boardTiles.length > 1) {
            window.adManager.showRewardedAd('Xáo trộn toàn bộ thẻ', () => {
                performShuffle();
                window.adManager.showToast('🎉 Đã xáo trộn thẻ thành công!');
            });
        } else {
            window.adManager.showRewardedAd('Nhận 1 lượt Xáo trộn dự trữ', () => {
                this.powerups.shuffle.count++;
                this.updatePowerupButtonsUI();
                window.soundManager.playPowerup();
                window.adManager.showToast('🎁 Đã nhận thêm 1 lượt Xáo trộn dự trữ!');
            });
        }
    }

    updatePowerupButtonsUI() {
        const updateBadge = (id, count) => {
            const el = document.getElementById(id);
            if (el) {
                if (count > 0) {
                    el.textContent = count;
                    el.className = 'powerup-badge free-badge';
                } else {
                    el.textContent = '📺 Ads';
                    el.className = 'powerup-badge ad-badge';
                }
            }
        };

        updateBadge('badge-stash', this.powerups.stash.count);
        updateBadge('badge-undo', this.powerups.undo.count);
        updateBadge('badge-shuffle', this.powerups.shuffle.count);
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

        const levelText = this.currentLevel === 1 ? 'Màn 1' : 'Màn 2';
        const levelEl = document.getElementById('share-stat-level');
        const scoreEl = document.getElementById('share-stat-score');
        const winsEl = document.getElementById('share-stat-wins');

        if (levelEl) levelEl.textContent = levelText;
        if (scoreEl) scoreEl.textContent = this.score;
        if (winsEl) winsEl.textContent = this.wins;

        const iconEl = document.getElementById('share-trophy-icon');
        const titleEl = document.getElementById('share-card-title');
        const quoteEl = document.getElementById('share-quote-text');

        let challengeText = '';

        if (context === 'win_level_2') {
            if (iconEl) iconEl.textContent = '👑';
            if (titleEl) titleEl.textContent = 'HUYỀN THOẠI CHIẾN THẮNG!';
            challengeText = `🏆 Tôi vừa chính thức PHÁ ĐẢO Màn 2 Siêu Ghép Thẻ với ${this.score} điểm! Tỉ lệ người thắng chỉ 0.1%. Bạn có dám thách thức kỷ lục này không? 🎮`;
        } else if (context === 'game_over') {
            if (iconEl) iconEl.textContent = '🔥';
            if (titleEl) titleEl.textContent = 'THÁCH ĐẤU GIẢI CỨU!';
            challengeText = `😱 Bàn cờ Màn 2 này quá hiểm hóc! Tôi đạt ${this.score} điểm mà vẫn bị đầy khay. Có ai vào giải cứu bàn này giùm tôi không? 🎮`;
        } else if (context === 'win_level_1') {
            if (iconEl) iconEl.textContent = '🎉';
            if (titleEl) titleEl.textContent = 'VƯỢT QUA MÀN 1!';
            challengeText = `🚀 Tôi vừa vượt qua Màn 1 cực mượt! Giờ chuẩn bị chinh phục Màn 2 địa ngục. Vào chơi đọ điểm với tôi nhé! 🎮`;
        } else {
            if (iconEl) iconEl.textContent = '🎮';
            if (titleEl) titleEl.textContent = 'SIÊU THỬ THÁCH GHÉP THẺ';
            challengeText = `🔥 Trò chơi Siêu Ghép Thẻ 2026 cực kỳ gây nghiện! Kỷ lục hiện tại của tôi: ${this.score} điểm (${this.wins} trận thắng). Cùng vào so tài nhé! 🚀`;
        }

        if (quoteEl) quoteEl.textContent = `"${challengeText}"`;
        this.currentShareText = challengeText;

        modal.classList.remove('hidden');
        window.soundManager.playPowerup();
    }

    getShareUrl() {
        return window.location.href;
    }

    shareNative() {
        const shareData = {
            title: 'Siêu Thử Thách Ghép Thẻ 2026',
            text: this.currentShareText || 'Chơi game ghép thẻ cực cuốn cùng tôi nhé!',
            url: this.getShareUrl()
        };

        if (navigator.share) {
            navigator.share(shareData).catch(() => {});
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
