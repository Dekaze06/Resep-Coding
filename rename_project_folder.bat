@echo off
echo ===================================================
echo Mengubah nama folder ke '2.SATU SITE'...
echo ===================================================
echo Pastikan VS Code / Antigravity IDE telah ditutup terlebih dahulu agar folder tidak terkunci oleh Windows.
echo.
pause

cd /d "%~dp0\.."
if exist "2.Web Task Development" (
    rename "2.Web Task Development" "2.SATU SITE"
    echo.
    echo [SUKSES] Berhasil mengubah nama folder menjadi '2.SATU SITE'!
    echo Anda sekarang dapat membuka folder '2.SATU SITE' di IDE Anda.
) else (
    echo [INFO] Folder '2.Web Task Development' tidak ditemukan atau sudah bernama '2.SATU SITE'.
)
echo.
pause
