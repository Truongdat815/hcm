# 🌐 HƯỚNG DẪN KẾT HỢP: FRONTEND VERCEL + BACKEND VPS (CLOUDFLARE)

Kiến trúc này là chuẩn doanh nghiệp:
* **Frontend:** Chạy trên **Vercel** (`https://hcm-iota-five.vercel.app`) siêu nhanh.
* **Backend:** Chạy trên **VPS** qua **Cloudflare** (cố định vĩnh viễn, hỗ trợ 100% WebSockets cho game nhiều người chơi).

---

## 🖥️ BƯỚC 1: CÀI ĐẶT BACKEND TRÊN VPS

Mở terminal SSH vào VPS của bạn và chạy các lệnh sau:

```bash
# 1. Cài đặt Node.js (nếu chưa có)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Clone mã nguồn dự án từ GitHub
git clone https://github.com/Truongdat815/hcm.git
cd hcm/presentation-web

# 3. Cài đặt các thư viện cần thiết
npm install

# 4. Cài đặt PM2 để server chạy ngầm 24/7 vĩnh viễn
sudo npm install -g pm2
pm2 start server.js --name "hcm-game"
pm2 save
pm2 startup
```

Server lúc này đang chạy ổn định tại port `4000` trên VPS.

---

## ☁️ BƯỚC 2: CẤU HÌNH DOMAIN CỐ ĐỊNH QUA CLOUDFLARE

Bạn chọn 1 trong 2 cách sau:

### 🌟 Cách A: Dùng Cloudflare Tunnel (Khuyên Dùng — Không cần cài Nginx, Không cần mở Port)
1. Cài `cloudflared` trên VPS:
   ```bash
   curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared.deb
   ```
2. Đăng nhập và tạo tunnel gán với domain của bạn:
   ```bash
   cloudflared tunnel login
   cloudflared tunnel create hcm-backend
   ```
3. Trỏ tunnel về port `4000`:
   ```bash
   cloudflared tunnel route dns hcm-backend api.yourdomain.com
   cloudflared tunnel run --url http://localhost:4000 hcm-backend
   ```
👉 Bạn đã có ngay link cố định chuẩn HTTPS: **`https://api.yourdomain.com`**.

---

### 🌐 Cách B: Dùng Nginx + DNS Cloudflare (Đám mây cam ☁️)
1. Trên Cloudflare DNS: Thêm record **A** trỏ tên miền (ví dụ: `api.yourdomain.com`) về IP VPS của bạn. Bật **Proxied (Đám mây cam ☁️)**.
2. Trên VPS: Cấu hình Nginx reverse proxy với WebSocket:
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:4000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
3. Cài SSL certbot miễn phí hoặc để Cloudflare SSL chế độ **Flexible / Full**.

---

## 🔗 BƯỚC 3: KẾT NỐI VERCEL VỚI BACKEND VPS

Bạn chỉ cần thực hiện 1 trong 2 cách sau (cách nào cũng được):

### 👉 Cách 1: Bấm nút trên giao diện (Nhanh nhất - Không cần sửa code)
1. Mở màn hình Quản trò trên Vercel:  
   👉 **`https://hcm-iota-five.vercel.app/game`**
2. Bấm vào nút **`⚙️ Server VPS`** trên thanh Header.
3. Nhập URL Cloudflare của bạn (ví dụ: `https://api.yourdomain.com`) -> Bấm **OK**.
4. Xong! Hệ thống tự lưu vào trình duyệt. Mã QR trên máy chiếu sẽ tự động tạo kèm link kết nối tới VPS Cloudflare của bạn!

### 👉 Cách 2: Điền sẵn vào file cấu hình
1. Mở file [`presentation-web/public/config.js`](file:///d:/01_Du_an_nhom/hcm/presentation-web/public/config.js).
2. Điền URL Cloudflare vào dòng:
   ```javascript
   window.HCM_CONFIG = {
     BACKEND_URL: 'https://api.yourdomain.com'
   };
   ```
3. Push lên GitHub (`git add . && git commit -m "config backend" && git push`). Vercel sẽ tự động cập nhật ngay lập tức!
