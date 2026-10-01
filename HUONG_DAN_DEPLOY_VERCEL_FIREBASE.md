# Deploy HCM202 lên Vercel + Firebase

Ứng dụng hiện dùng một frontend tĩnh duy nhất trên Vercel. Firebase Realtime Database
đồng bộ phòng chơi; không cần VPS, Render, Socket.IO hoặc Cloudflare Tunnel.

## 1. Tạo Firebase project

1. Mở Firebase Console và tạo project.
2. Chọn **Build → Realtime Database → Create Database**.
3. Nên chọn region Singapore.
4. Mở tab **Rules**, dán nội dung trong `firebase-database.rules.json` rồi Publish.

Rules đi kèm được tối giản cho trò chơi trong lớp: mọi người có link đều có thể đọc/ghi
phòng `hcmGame`. Không dùng cấu hình này cho dữ liệu riêng tư hoặc ứng dụng công cộng.

## 2. Lấy cấu hình Web App

Trong **Project settings → Your apps**, tạo Web App và lấy các giá trị:

- `apiKey`
- `authDomain`
- `databaseURL`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

## 3. Cấu hình Vercel

Import repository vào Vercel, sau đó thêm Environment Variables theo `.env.example`:

```text
FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN
FIREBASE_DATABASE_URL
FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID
FIREBASE_APP_ID
ADMIN_PASSWORD
GAME_QUESTION_SECONDS
GAME_QUESTION_COUNT
```

Redeploy sau khi thêm hoặc thay đổi biến môi trường. Lệnh build sẽ sinh
`presentation-web/config.js` tự động, không cần commit khóa Firebase vào repository.

## 4. Sử dụng

- `/` — trình chiếu.
- `/game` — màn quản trò (chiếu lên máy chiếu), cần mở trong lúc chơi để tính điểm và chuyển câu.
- `/play` — link cho sinh viên, QR trên slide và màn quản trò trỏ tới đây.

Nếu màn quản trò báo “Chưa kết nối Firebase”, kiểm tra đủ 7 biến Firebase, đặc biệt
`FIREBASE_DATABASE_URL`, rồi redeploy.

Thông số trò chơi (tùy chọn):

- `GAME_QUESTION_SECONDS=20`: số giây cho mỗi câu hỏi.
- `GAME_QUESTION_COUNT=10`: số câu mặc định mỗi ván (quản trò vẫn chọn lại được ở phòng chờ).

Sau khi đổi biến trên Vercel phải redeploy.

Chỉ nên mở một tab `/game` trong buổi chơi. Người chơi có thể mở `/play` trước;
yêu cầu tham gia sẽ được Firebase giữ lại cho tới khi màn quản trò kết nối.

## Cách chơi (giống Kahoot)

1. Quản trò mở `/game`, nhập mật khẩu; sinh viên quét QR để vào `/play` và nhập tên.
2. Quản trò bấm **Bắt đầu**. Mỗi câu hiện trên máy chiếu, sinh viên chọn đáp án màu trên điện thoại.
3. Đúng được 500–1000 điểm, trả lời càng nhanh điểm càng cao. Hết giờ hoặc khi mọi người
   đã trả lời, quản trò hiện đáp án, giải thích và top 5; bấm **Câu tiếp theo** để tiếp tục.
4. Kết thúc là bục vinh danh Top 3.

## Cách hoạt động

Toàn bộ trạng thái (người chơi, điểm, câu hiện tại) nằm trong Firebase tại `hcmGame/rooms/default`.
Quản trò chuyển câu và tính điểm; điện thoại chỉ ghi tên và đáp án của chính mình. Refresh
`/game` hoặc `/play` đều khôi phục đúng màn hình. Chỉ **Dừng trận** và **Xóa phòng** mới xóa dữ liệu.
