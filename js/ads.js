/**
 * Trình Quản Lý Quảng Cáo (Google AdSense & H5 Games Ads Manager)
 * Hỗ trợ sẵn vị trí Banner, Quảng cáo xen kẽ (Interstitial) và Quảng cáo nhận thưởng (Rewarded)
 */
class AdManager {
    constructor() {
        // ID Google AdSense chính thức từ tài khoản của bạn
        this.publisherId = 'ca-pub-7959926217130088';
        this.isRealAds = true; // Đã kích hoạt kết nối Google AdSense thật
        this.onRewardSuccess = null;
        this.rewardTimer = null;
        this.isAdFinished = false;
    }

    init() {
        if (this.isRealAds && this.publisherId !== 'ca-pub-SIMULATED_MODE') {
            this.loadGoogleAdSenseScript();
        }
        this.bindEvents();
    }

    loadGoogleAdSenseScript() {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.publisherId}`;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);

        // Hỗ trợ Google H5 Games Ads API
        const h5Script = document.createElement('script');
        h5Script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        h5Script.setAttribute("data-ad-client", this.publisherId);
        h5Script.setAttribute("data-ad-frequency-hint", "30s");
        document.head.appendChild(h5Script);
    }

    bindEvents() {
        // Nút Hủy / Bỏ qua quảng cáo ở góc trên
        const cancelBtn = document.getElementById('ad-cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.closeRewardedModal(false);
            });
        }

        // Nút Nhận thưởng dưới đáy modal
        const claimBtn = document.getElementById('ad-claim-btn');
        if (claimBtn) {
            claimBtn.addEventListener('click', () => {
                if (this.isAdFinished) {
                    this.closeRewardedModal(true);
                }
            });
        }
    }

    /**
     * Kích hoạt Quảng cáo nhận thưởng (Rewarded Ad)
     * Được dùng khi: Hồi sinh, Lấy thêm quyền trợ giúp (Undo, Xáo trộn, Rút thẻ)
     */
    showRewardedAd(rewardName, onRewardGranted) {
        this.onRewardSuccess = onRewardGranted;
        this.isAdFinished = false;

        // Nếu đã tích hợp Google H5 Game Ads API thật
        if (this.isRealAds && typeof window.adBreak === 'function') {
            window.adBreak({
                type: 'reward',
                name: rewardName,
                beforeAd: () => {
                    if (window.soundManager) window.soundManager.enabled = false;
                },
                afterAd: () => {
                    if (window.soundManager) window.soundManager.enabled = true;
                },
                beforeReward: (showAdFn) => {
                    showAdFn();
                },
                adDismissed: () => {
                    this.showToast('Bạn đã tắt quảng cáo sớm nên chưa nhận được phần thưởng!');
                    this.onRewardSuccess = null;
                },
                adViewed: () => {
                    if (typeof this.onRewardSuccess === 'function') {
                        const cb = this.onRewardSuccess;
                        this.onRewardSuccess = null;
                        cb();
                        this.showToast(`🎉 Đã nhận thưởng: ${rewardName}!`);
                    }
                }
            });
            return;
        }

        // Chế độ mô phỏng trực quan siêu đẹp (Demo Mode)
        this.showSimulatedRewardedModal(rewardName);
    }

    /**
     * Hiển thị bảng mô phỏng quảng cáo với thanh đếm ngược 5 giây
     */
    showSimulatedRewardedModal(rewardName) {
        const modal = document.getElementById('rewarded-ad-modal');
        const timerEl = document.getElementById('ad-timer');
        const progressBar = document.getElementById('ad-progress-bar');
        const claimBtn = document.getElementById('ad-claim-btn');
        const rewardTitle = document.getElementById('ad-reward-title');

        if (!modal) return;

        this.isAdFinished = false;
        rewardTitle.textContent = `Xem quảng cáo để: ${rewardName}`;
        modal.classList.remove('hidden');

        if (claimBtn) {
            claimBtn.disabled = true;
            claimBtn.textContent = 'Đang phát quảng cáo... (5s)';
            claimBtn.classList.remove('pulse');
        }

        let secondsLeft = 5;
        if (timerEl) timerEl.textContent = `${secondsLeft}s`;
        if (progressBar) progressBar.style.width = '0%';

        const totalTime = 5;
        const interval = 100;
        let elapsed = 0;

        clearInterval(this.rewardTimer);
        this.rewardTimer = setInterval(() => {
            elapsed += interval;
            const progress = (elapsed / (totalTime * 1000)) * 100;
            if (progressBar) {
                progressBar.style.width = `${Math.min(progress, 100)}%`;
            }

            const currentSec = Math.ceil(totalTime - (elapsed / 1000));
            if (currentSec > 0 && timerEl) {
                timerEl.textContent = `${currentSec}s`;
                if (claimBtn && claimBtn.disabled) {
                    claimBtn.textContent = `Đang phát quảng cáo... (${currentSec}s)`;
                }
            }

            if (elapsed >= totalTime * 1000) {
                clearInterval(this.rewardTimer);
                this.isAdFinished = true;
                if (timerEl) timerEl.textContent = 'Hoàn tất!';
                if (claimBtn) {
                    claimBtn.disabled = false;
                    claimBtn.textContent = 'Nhận Thưởng Ngay 🎁';
                    claimBtn.classList.add('pulse');
                }
            }
        }, interval);
    }

    closeRewardedModal(isSuccess) {
        clearInterval(this.rewardTimer);
        const modal = document.getElementById('rewarded-ad-modal');
        if (modal) modal.classList.add('hidden');

        const claimBtn = document.getElementById('ad-claim-btn');
        if (claimBtn) {
            claimBtn.classList.remove('pulse');
            claimBtn.disabled = true;
            claimBtn.textContent = 'Đang phát quảng cáo...';
        }

        if (isSuccess && typeof this.onRewardSuccess === 'function') {
            const cb = this.onRewardSuccess;
            this.onRewardSuccess = null;
            cb();
        } else {
            this.onRewardSuccess = null;
            if (!isSuccess) {
                this.showToast('Bạn đã bỏ qua quảng cáo nên chưa nhận được quà!');
            }
        }
    }

    /**
     * Quảng cáo xen kẽ (Interstitial) giữa các ván chơi
     */
    showInterstitial(onComplete) {
        if (this.isRealAds && typeof window.adBreak === 'function') {
            window.adBreak({
                type: 'next',
                name: 'restart_game',
                beforeAd: () => {},
                afterAd: () => {
                    if (onComplete) onComplete();
                }
            });
            return;
        }

        // Chế độ thường: Tiếp tục chơi ngay
        if (onComplete) onComplete();
    }

    showToast(message) {
        let toast = document.getElementById('game-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'game-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.className = 'toast show';
        setTimeout(() => {
            toast.className = 'toast';
        }, 2800);
    }
}

window.adManager = new AdManager();
