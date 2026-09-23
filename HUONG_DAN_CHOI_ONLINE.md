# 🇻🇳 HƯỚNG DẪN TỔ CHỨC GAME ONLINE CHO CẢ LỚP THI ĐẤU

Game **"Đấu Trí Ngoại Giao — Ai Là Triệu Phú"** được thiết kế **100% Online Multiplayer** dành cho toàn bộ sinh viên trong lớp tham gia cùng một lúc và đồng bộ kết quả lên màn hình máy chiếu!

---

## 🎯 CÁCH 1: CHƠI TRỰC TIẾP TRÊN MÁY CHIẾU LỚP HỌC (KHUYÊN DÙNG - MƯỢT NHẤT)

### 📌 Bước 1: Khởi động Server trên Laptop cắm Máy Chiếu
1. Trên Laptop thuyết trình, **click đúp vào file `CHAY_GAME_TRONG_LOP.bat`** (hoặc mở Terminal gõ `npm start`).
2. Màn hình console sẽ hiện IP mạng LAN (ví dụ: `http://192.168.1.25:4000/play`).

### 📌 Bước 2: Chiếu màn hình Quản trò lên Máy Chiếu
1. Trên trình duyệt Laptop, mở:  
   👉 **`http://localhost:4000/game`**
2. Nhập mật khẩu quản trò: **`2026`**
3. Trên màn hình máy chiếu sẽ xuất hiện **Mã QR to rõ** và danh sách phòng chờ.

### 📌 Bước 3: Cả lớp dùng điện thoại quét mã QR tham gia
1. Điều kiện: Điện thoại của các bạn trong lớp kết nối cùng mạng Wi-Fi của lớp (hoặc kết nối vào Hotspot phát từ laptop/điện thoại).
2. Các bạn chỉ cần mở camera điện thoại quét mã QR trên máy chiếu.
3. Nhập Họ và Tên -> Bấm **"Vào Thi Đấu"**.
4. Tên của các bạn sẽ lập tức hiện trên màn hình máy chiếu!

### 📌 Bước 4: Bắt đầu trận đấu!
1. Khi cả lớp đã vào đông đủ, Quản trò trên máy chiếu bấm nút:  
   **⚡ "BẮT ĐẦU CHIA ĐỘI & THI ĐẤU"**
2. Hệ thống sẽ:
   - Tự động chia cả lớp thành 2 Khối: **Khối Nội Lực** 🇻🇳 vs **Khối Ngoại Lực** 🌐.
   - Bốc ngẫu nhiên 2 bạn làm **Trưởng Đoàn (Leader)** với giao diện buồng lái riêng.
   - Phát ngân hàng câu hỏi ngẫu nhiên dạng **Ai Là Triệu Phú** đến từng điện thoại.
   - Đúng: Được cộng điểm, chúc mừng pháo hoa.
   - Sai: Phạt chờ 3 giây đọc kiến thức trước khi sang câu tiếp theo.
   - Điểm số, chuỗi combo 50 câu và biến động 4 Bảo Bình hiển thị trực tiếp trên máy chiếu!

---

## 🌐 CÁCH 2: CHƠI ONLINE QUA INTERNET (DÙNG 4G BẤT KỲ ĐÂU)

Nếu ở lớp học Wi-Fi chập chờn hoặc các bạn dùng mạng 4G khác nhau:

### Dùng LocalTunnel (Chỉ 1 câu lệnh):
1. Chạy game: `npm start`
2. Mở thêm 1 cửa sổ PowerShell mới và gõ:
   ```bash
   npx localtunnel --port 4000
   ```
3. Bạn sẽ nhận được 1 link HTTPS công khai (ví dụ: `https://ten-tuy-chon.loca.lt`).
4. Gửi link này hoặc mở link đó trên máy chiếu, mã QR sẽ tự động dùng link 4G để cả lớp quét!

### Hoặc Deploy miễn phí lên Render.com (Hỗ trợ 100% WebSockets):
1. Vào [render.com](https://render.com) -> Đăng nhập bằng GitHub.
2. Chọn **New Web Service** -> Chọn repository `Truongdat815/hcm`.
3. Cấu hình:
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node presentation-web/server.js`
4. Bấm **Create Web Service** -> Bạn sẽ có 1 đường link online vĩnh viễn (ví dụ: `https://hcm-game.onrender.com`).
   - Mở máy chiếu: `https://hcm-game.onrender.com/game`
   - Cả lớp quét mã là chơi mượt mà bằng 4G!
