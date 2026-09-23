@echo off
chcp 65001 >nul
title [HCM] GAME ĐẤU TRÍ ONLINE - BÀN QUẢN TRÒ

echo =====================================================================
echo    🇻🇳 BÁO CÁO TƯ TƯỞNG HỒ CHÍ MINH - ĐẤU TRÍ NGOẠI GIAO ONLINE 🇻🇳
echo =====================================================================
echo.
echo [1] KẾT NỐI MẠNG CHO CẢ LỚP:
echo     - Cách 1: Laptop cắm máy chiếu và điện thoại cả lớp cùng bắt chung Wi-Fi.
echo     - Cách 2: Bật "Điểm phát sóng di động (Mobile Hotspot)" từ Laptop / ĐT
echo               cho cả lớp cùng kết nối.
echo.
echo [2] MÀN HÌNH MÁY CHIẾU (BÀN QUẢN TRÒ):
echo     👉 Mở trình duyệt truy cập: http://localhost:4000/game
echo     👉 Nhập mật khẩu quản trò: 2026
echo.
echo [3] CẢ LỚP THAM GIA:
echo     👉 Dùng điện thoại quét mã QR hiển thị to rõ trên màn hình máy chiếu!
echo.
echo =====================================================================
echo Đang khởi động Server...
echo =====================================================================

cd /d "%~dp0presentation-web"
node server.js
pause
