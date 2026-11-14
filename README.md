# 🎮 Web Game: Siêu Thử Thách Ghép Thẻ (Cừu & Cừu Match-3)

Tựa web game giải đố nhiều tầng cực kỳ cuốn hút, được tối ưu hoàn hảo cho cả thiết bị di động (Mobile) lẫn máy tính (Desktop), tích hợp sẵn hệ thống đổi chủ đề và khung vị trí kiếm tiền với **Google AdSense**.

---

## 🌟 Điểm nổi bật của trò chơi

1. **Cơ chế gây nghiện đỉnh cao:**
   - **Xếp tầng 3D (Layered overlap):** Thẻ bài nằm đè lên nhau, chỉ thẻ lớp trên cùng không bị che khuất mới được phép chọn.
   - **Khay 7 ô thần thánh:** Ghép 3 thẻ giống nhau để triệt tiêu và giải phóng ô trống. Đầy cả 7 ô mà không ghép được bộ 3 là Thua cuộc!
   - **Màn 1 (Dễ ợt):** Giúp người chơi làm quen nhanh trong 10-15 giây.
   - **Màn 2 (Thử thách cực đại):** Tháp thẻ đa tầng, độ khó cao kích thích ham muốn chinh phục và chơi lại nhiều lần.
2. **Hệ thống Chủ đề (Themes) tùy chọn:**
   - 🍜 **Ẩm thực Việt Nam:** Phở Bò, Bánh Mì, Trà Sữa, Cà Phê Phin, Gỏi Cuốn, Bánh Bao...
   - 🐶 **Thú cưng đáng yêu:** Cún Cưng, Mèo Lười, Gấu Trúc, Thỏ Trắng, Hamster...
   - 🍉 **Trái cây nhiệt đới:** Dưa Hấu, Dâu Tây, Quả Bơ, Dứa Mật, Chuối Vàng...
   - 🧁 **Tiệm bánh ngọt:** Donut, Cupcake, Bánh Kem, Waffle, Pudding...
3. **Bộ 3 quyền trợ giúp (Power-ups):**
   - 📦 **Bốc 3 thẻ:** Đưa 3 thẻ từ khay lên bục chờ tạm thời để giải cứu khay đầy.
   - ↩️ **Hoàn tác (Undo):** Rút lại thẻ vừa bấm nhầm về bàn cờ.
   - 🔀 **Xáo trộn (Shuffle):** Đảo ngẫu nhiên toàn bộ thẻ còn lại trên bàn.
   - 💖 **Hồi sinh (Revive):** Xem quảng cáo để cứu ván chơi đang dang dở.
4. **Âm thanh tổng hợp Web Audio API:**
   - Nhẹ tuyệt đối, không cần tải bất kỳ file MP3 nào, không sợ trễ tiếng, hỗ trợ nút Bật/Tắt âm thanh.

---

## 🚀 Cách mở và chạy thử game ngay lập tức

Bạn có thể mở game bằng bất kỳ cách nào dưới đây:

### Cách 1: Mở trực tiếp (Nhanh nhất)
Nhấp đúp chuột trực tiếp vào file **`index.html`** trong thư mục dự án để mở trên trình duyệt (Chrome, Cốc Cốc, Edge, Firefox).

### Cách 2: Mở bằng Live Server (Khuyên dùng để test trên điện thoại)
Nếu bạn dùng Visual Studio Code hoặc terminal PowerShell:
```powershell
# Chạy máy chủ tĩnh cục bộ bằng Python:
python -m http.server 8080
```
Sau đó mở trình duyệt truy cập: `http://localhost:8080`.

---

## 🌐 Hướng dẫn đưa Web Game lên mạng miễn phí (Để có link chia sẻ)

Để người khác có thể bấm vào link chơi ngay trên Facebook, Zalo, TikTok mà không cần cài đặt, bạn có thể đưa game lên các dịch vụ hosting miễn phí vĩnh viễn:

### Lựa chọn 1: GitHub Pages (Đơn giản, miễn phí 100%)
1. Đăng tải toàn bộ thư mục này lên một repository trên GitHub.
2. Vào **Settings** của repository -> mục **Pages**.
3. Tại **Branch**, chọn nhánh `main` và thư mục `/ (root)`, nhấn **Save**.
4. Sau 1 phút, bạn sẽ có link game dạng: `https://ten-cua-ban.github.io/MiniGame/`.

### Lựa chọn 2: Vercel hoặc Netlify
- Chỉ cần kéo thả toàn bộ thư mục `MiniGame` vào [netlify.com](https://www.netlify.com/) hoặc kết nối qua GitHub trên [vercel.com](https://vercel.com/), bạn sẽ nhận ngay một tên miền miễn phí có hỗ trợ HTTPS cực nhanh.

---

## 💰 Hướng dẫn cấu hình Google AdSense để kiếm tiền

Game đã được thiết kế sẵn 3 vị trí quảng cáo chiến lược chuẩn quy định của Google:
1. **Banner chân trang (320x50):** Hiển thị cố định dưới màn hình điện thoại mà không làm ảnh hưởng đến trải nghiệm bấm thẻ.
2. **Banner dọc 2 bên (160x600):** Tự động hiển thị khi người chơi truy cập bằng màn hình máy tính (Desktop/Laptop).
3. **Quảng cáo nhận thưởng (Rewarded Ads):** Xuất hiện khi người chơi dùng hết lượt trợ giúp hoặc muốn Hồi sinh khi thua cuộc.

### Các bước kết nối tài khoản Google AdSense của bạn:

1. **Chuẩn bị điều kiện duyệt AdSense:**
   - Gắn tên miền riêng cho trang web (ví dụ: `ghepthe.com`, `minigame.vn`).
   - Giữ nguyên nút **Chính sách bảo mật (Privacy Policy)** và **Hướng dẫn chơi** ở góc trên bên phải (đây là điều kiện bắt buộc của Google).
2. **Khai báo mã Publisher ID:**
   - Mở file `js/ads.js`:
     ```javascript
     this.publisherId = 'ca-pub-XXXXXXXXXXXXX'; // Thay ID AdSense của bạn vào đây
     this.isRealAds = true; // Đổi thành true để chuyển từ chế độ mô phỏng sang quảng cáo thật
     ```
   - Mở file `index.html`: Bỏ comment dòng mã script AdSense ở thẻ `<head>` và các thẻ `<ins class="adsbygoogle" ...>` ở các vị trí Banner quảng cáo.
3. **Google H5 Games Ads API:**
   - Khi trang web của bạn có lượng truy cập cao, bạn có thể kích hoạt chương trình **AdSense for Games (H5 Games Ads)** trực tiếp trong tài khoản AdSense để bật quảng cáo video nhận thưởng toàn màn hình có doanh thu (eCPM) cao gấp 5-10 lần banner thông thường.

---

*Chúc bạn phát triển tựa game thành công và thu hút được hàng triệu lượt chơi!*
