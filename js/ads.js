/**
 * Trình Quản Lý Quảng Cáo (Google AdSense & H5 Games Ads Manager)
 * Tự động chuyển đổi thông minh giữa "Quà Tiếp Sức" (khi chờ duyệt) và "Quảng Cáo Thật" (khi đã duyệt)
 */
class AdManager {
    constructor() {
        // ID Google AdSense chính thức của bạn
        this.publisherId = 'ca-pub-7959926217130088';
        this.isRealAds = true;

        // Trạng thái duyệt AdSense: 
        // Đặt false trong thời gian chờ duyệt để hiện "Quà tiếp sức" cực kỳ tự nhiên, không bị kì!
        // Đặt true khi Google duyệt xong để kích hoạt quảng cáo video nhận thưởng thật.
        this.isAdsApproved = true;

        this.onRewardSuccess = null;
        this.rewardTimer = null;
        this.isAdFinished = false;
    }

    init() {
        if (this.isRealAds && this.publisherId && this.publisherId !== 'ca-pub-SIMULATED_MODE') {
            this.loadGoogleAdSenseScript();
        }
        this.bindEvents();
    }

    loadGoogleAdSenseScript() {
        // Tải script Google AdSense chuẩn
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
        // Nút Hủy / Bỏ qua ở góc trên modal
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
     * Kích hoạt Nhận thưởng (Hồi sinh, Undo, Xáo trộn, Bốc 3 thẻ)
     */
    showRewardedAd(rewardName, onRewardGranted) {
        this.onRewardSuccess = onRewardGranted;

        // 1. Khi đã được duyệt AdSense thật và có H5 Ads API của Google
        if (this.isAdsApproved && typeof window.adBreak === 'function') {
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
                        this.showToast(`🎉 Đã nhận: ${rewardName}!`);
                    }
                }
            });
            return;
        }

        // 2. GIAI ĐOẠN CHỜ DUYỆT:
        // Chuyển thành "Hộp Quà Tiếp Sức" hoàn toàn tự nhiên, nhận ngay không cần chờ, cực kỳ tâm lý!
        this.showGiftRewardModal(rewardName);
    }

    /**
     * Hiển thị Hộp Quà Tiếp Sức (Thân thiện, không bị kì)
     */
    showGiftRewardModal(rewardName) {
        const modal = document.getElementById('rewarded-ad-modal');
        const timerEl = document.getElementById('ad-timer');
        const progressBar = document.getElementById('ad-progress-bar');
        const claimBtn = document.getElementById('ad-claim-btn');
        const rewardTitle = document.getElementById('ad-reward-title');
        const adBadge = modal ? modal.querySelector('.ad-label') : null;
        const videoMock = modal ? modal.querySelector('.ad-video-mock') : null;

        if (!modal) return;

        this.isAdFinished = true;
        if (rewardTitle) rewardTitle.textContent = `🎁 Quà Tặng: ${rewardName}`;
        if (adBadge) {
            adBadge.textContent = 'Quà Tặng';
            adBadge.style.background = '#2ed573';
            adBadge.style.color = '#fff';
        }

        if (videoMock) {
            videoMock.innerHTML = `
                <div style="font-size: 50px; margin-bottom: 8px; animation: bounce-trophy 1.5s infinite;">🎁</div>
                <p style="font-size: 15px; font-weight: 700; color: #f1c40f;">Tiếp Sức Phá Đảo Màn 2!</p>
                <p style="font-size: 12px; opacity: 0.9; margin-top: 6px; padding: 0 16px; line-height: 1.4;">
                    Chặng đường rất gay cấn! Tặng bạn <strong>${rewardName}</strong> để giải cứu bàn cờ!
                </p>
            `;
        }

        if (progressBar) progressBar.style.width = '100%';
        if (timerEl) timerEl.textContent = 'Sẵn sàng!';

        if (claimBtn) {
            claimBtn.disabled = false;
            claimBtn.textContent = 'Nhận Quà Tiếp Sức Ngay 🎁';
            claimBtn.classList.add('pulse');
        }

        modal.classList.remove('hidden');
    }

    closeRewardedModal(isSuccess) {
        clearInterval(this.rewardTimer);
        const modal = document.getElementById('rewarded-ad-modal');
        if (modal) modal.classList.add('hidden');

        const claimBtn = document.getElementById('ad-claim-btn');
        if (claimBtn) {
            claimBtn.classList.remove('pulse');
            claimBtn.disabled = true;
        }

        if (isSuccess && typeof this.onRewardSuccess === 'function') {
            const cb = this.onRewardSuccess;
            this.onRewardSuccess = null;
            cb();
        } else {
            this.onRewardSuccess = null;
        }
    }

    /**
     * Quảng cáo xen kẽ (Interstitial) giữa các ván chơi
     */
    showInterstitial(onComplete) {
        if (this.isAdsApproved && typeof window.adBreak === 'function') {
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
