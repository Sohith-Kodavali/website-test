@echo off
REM ==========================================
REM RRK Food Court - Hostinger Deploy Packager
REM Creates rrk-deploy.zip for cPanel upload
REM ==========================================

echo Building RRK deployment package...

if exist rrk-final.zip del rrk-final.zip

if exist rrk-deploy rmdir /s /q rrk-deploy
mkdir rrk-deploy

xcopy *.html rrk-deploy\ /Y /Q
xcopy *.jpeg rrk-deploy\ /Y /Q
xcopy *.svg rrk-deploy\ /Y /Q
xcopy manifest.json rrk-deploy\ /Y /Q
xcopy .htaccess rrk-deploy\ /Y /Q
xcopy sw.js rrk-deploy\ /Y /Q

mkdir rrk-deploy\css
xcopy css\* rrk-deploy\css\ /Y /Q

mkdir rrk-deploy\js
xcopy js\*.js rrk-deploy\js\ /Y /Q
del rrk-deploy\js\core.js 2>nul

:: Strip out non-production files
del rrk-deploy\vercel.json 2>nul
del rrk-deploy\package.json 2>nul
del rrk-deploy\package-lock.json 2>nul
del rrk-deploy\rrk-firestore-export.json 2>nul
del rrk-deploy\firestore.indexes.json 2>nul
del rrk-deploy\commit_msg.txt 2>nul

echo Zipping...

powershell -Command "Compress-Archive -Path 'rrk-deploy\*' -DestinationPath 'rrk-final.zip' -Force"

rmdir /s /q rrk-deploy

echo Done! rrk-final.zip is ready.