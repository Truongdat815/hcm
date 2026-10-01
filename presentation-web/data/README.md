# Schema ngân hàng câu hỏi

Trò chơi kiểu Kahoot chỉ cần danh sách câu hỏi trắc nghiệm trong `questions.json`. Nội dung có
thể thay độc lập với game engine. Mỗi câu có dạng:

```json
{
  "id": 1,
  "question": "Nội dung câu hỏi",
  "options": ["A", "B", "C", "D"],
  "answer": 0,
  "explanation": "Giải thích đáp án (hiện sau khi lộ đáp án)"
}
```

- `answer` là chỉ số (từ 0) của đáp án đúng trong `options`.
- Nên dùng 4 lựa chọn (tối đa 4 màu/biểu tượng ▲ ◆ ● ■).
- Mọi câu trong `memberQuestions` (và `leaderQuestions` nếu có) đều được đưa vào ván chơi; thứ tự được xáo ngẫu nhiên mỗi ván. Tiền tố "A. ", "B. "... trong
  `options` và ký tự "★" ở đầu câu hỏi được tự động bỏ khi hiển thị.
- Số giây mỗi câu và số câu mặc định cấu hình bằng `GAME_QUESTION_SECONDS` và `GAME_QUESTION_COUNT`.
