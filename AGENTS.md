# Quy tắc phát triển HCM202

## Trạng thái game và refresh

- Trạng thái phòng chơi là dữ liệu bền vững trong Firebase Realtime Database, không
  được coi bộ nhớ JavaScript hoặc DOM là nguồn dữ liệu chính.
- Refresh `/game` hoặc `/play` không được xóa người chơi, điểm hay câu hỏi đang diễn ra.
- Client phải nhận lại người chơi bằng `hcm_client_id` được lưu trong `sessionStorage`
  và khôi phục đúng màn hình từ `state` trong Firebase.
- Không tự động gọi reset khi trang khởi động hoặc khi Firebase kết nối lại.
- Chỉ các thao tác rõ ràng của quản trò như Dừng trận, Reset hoặc Xóa phòng mới được
  phép thay đổi/xóa trạng thái đã lưu.
- Khi thay đổi schema state, phải hỗ trợ giá trị mặc định cho phòng cũ và không làm
  mất dữ liệu chỉ vì thiếu field mới.

## Gameplay

- Trò chơi là quiz kiểu Kahoot: quản trò chiếu từng câu, người chơi chọn một trong tối đa 4
  đáp án (▲ ◆ ● ■), đúng được 500–1000 điểm tùy tốc độ, xếp hạng cá nhân, kết thúc bằng Top 3.
- Không có đội, Leader, Nội lực/Ngoại lực hay Thẻ Thời Cơ nữa; không thêm lại các cơ chế này
  khi chưa được yêu cầu.
- Số giây mỗi câu lấy từ `GAME_QUESTION_SECONDS`, số câu mặc định lấy từ `GAME_QUESTION_COUNT`
  (qua `HCM_CONFIG.GAME_CONFIG`). Không hard-code trong game engine.
- Quản trò là bên chuyển câu và tính điểm; điện thoại chỉ ghi tên và đáp án của chính mình.
  Chỉ mở một tab `/game` trong một buổi chơi.
- Seed data câu hỏi (`data/questions.json`) có thể thay độc lập với game engine.

## Kiểm tra tối thiểu

- Trước khi hoàn tất thay đổi game, kiểm tra cú pháp `firebase-game.js`, JavaScript
  nhúng trong `play.html` và `game-host.html`, sau đó chạy `git diff --check`.
- Luồng kiểm thử refresh tối thiểu: vào phòng → bắt đầu → ghi điểm → refresh người
  chơi → refresh quản trò → xác nhận tên, điểm, câu hiện tại và bảng xếp hạng vẫn giữ nguyên.
