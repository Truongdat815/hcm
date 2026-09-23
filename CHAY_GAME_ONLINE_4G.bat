@echo off
chcp 65001 >nul
title [HCM] GAME ĐẤU TRÍ ONLINE QUA INTERNET (4G / WI-FI)

echo =====================================================================
echo    🇻🇳 BÁO CÁO TƯ TƯỞNG HỒ CHÍ MINH - ĐẤU TRÍ NGOẠI GIAO ONLINE 🇻🇳
echo                     PHƯƠNG ÁN A: TUNNEL INTERNET (4G)
echo =====================================================================
echo.
echo  ✅ Ưu điểm:
echo     - Các bạn trong lớp dùng 4G của bất kỳ nhà mạng nào (Viettel, Vina, Mobi)
echo       hoặc Wi-Fi khác nhau đều vào chơi cùng nhau được!
echo     - Mã QR trên máy chiếu sẽ tự động cập nhật đường link Internet 4G.
echo.
echo  🔐 Mật khẩu Quản trò: 2026
echo.
echo =====================================================================
echo Đang kết nối mạng và khởi tạo đường truyền Online...
echo =====================================================================

cd /d "%~dp0presentation-web"
node server.js --online
pause
