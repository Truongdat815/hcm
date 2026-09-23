# 🇻🇳 HƯỚNG DẪN TỔ CHỨC GAME ONLINE CHO CẢ LỚP THI ĐẤU

Game **"Đấu Trí Ngoại Giao — Ai Là Triệu Phú"** được thiết kế **100% Online Multiplayer** dành cho toàn bộ sinh viên trong lớp tham gia cùng một lúc và đồng bộ kết quả lên màn hình máy chiếu!

---

## 🌟 PHƯƠNG ÁN A: CHƠI ONLINE QUA INTERNET (4G / BẤT KỲ ĐÂU) — TIỆN LỢI NHẤT!

> **Ưu điểm lớn nhất:** Cả lớp dùng mạng 4G khác nhau (Viettel, Vina, Mobi) hay bắt Wi-Fi nào cũng đều quét mã vào chơi cùng lúc được!

### 📌 Bước 1: Khởi động trên Laptop cắm Máy Chiếu
* **Click đúp vào file [`CHAY_GAME_ONLINE_4G.bat`](file:///d:/01_Du_an_nhom/hcm/CHAY_GAME_ONLINE_4G.bat)** ở thư mục gốc (hoặc gõ `npm run online`).
* Màn hình đen sẽ hiện thông báo đã kích hoạt đường truyền Internet công khai.

### 📌 Bước 2: Mở màn hình Quản trò trên Máy Chiếu
* Mở trình duyệt trên máy tính cắm máy chiếu:  
  👉 **`http://localhost:4000/game`**
* Nhập mật khẩu quản trò: **`2026`**
* Màn hình máy chiếu sẽ tự động xuất hiện **Mã QR trực tuyến công khai**.

### 📌 Bước 3: Cả lớp dùng điện thoại quét mã QR
* Các bạn trong lớp bật 4G hoặc Wi-Fi, mở camera quét mã QR trên màn hình máy chiếu.
* Nhập Họ và Tên -> Bấm **"Vào Thi Đấu"**.
* Tên của các bạn sẽ lập tức hiện trên danh sách phòng chờ của máy chiếu!

### 📌 Bước 4: Bắt đầu trận đấu!
* Khi lớp đã vào đông đủ, Quản trò trên máy chiếu bấm:  
  **⚡ "BẮT ĐẦU CHIA ĐỘI & THI ĐẤU"**
* Hệ thống tự động chia 2 đội: **Khối Nội Lực** 🇻🇳 vs **Khối Ngoại Lực** 🌐, chọn 2 Leader và bắt đầu phát câu hỏi ngẫu nhiên!

---

## 🎯 PHƯƠNG ÁN B: CHƠI TRONG MẠNG WI-FI NỘI BỘ (KHÔNG CẦN INTERNET)

Nếu lớp học có mạng Wi-Fi chung rất khỏe:
1. Click đúp vào file [`CHAY_GAME_TRONG_LOP.bat`](file:///d:/01_Du_an_nhom/hcm/CHAY_GAME_TRONG_LOP.bat).
2. Mở máy chiếu vào `http://localhost:4000/game` -> Mật khẩu: `2026`.
3. Cả lớp bắt chung Wi-Fi và quét mã QR mạng nội bộ.

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
