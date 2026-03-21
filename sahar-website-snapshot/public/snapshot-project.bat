@echo off

echo Creating Sa7arRepair snapshot...

set SNAPSHOT=sahar-website-snapshot

rmdir /s /q %SNAPSHOT% 2>nul
mkdir %SNAPSHOT%

xcopy app %SNAPSHOT%\app /E /I
xcopy components %SNAPSHOT%\components /E /I
xcopy lib %SNAPSHOT%\lib /E /I
xcopy prisma %SNAPSHOT%\prisma /E /I
xcopy public %SNAPSHOT%\public /E /I
xcopy styles %SNAPSHOT%\styles /E /I

copy package.json %SNAPSHOT%
copy package-lock.json %SNAPSHOT%
copy tsconfig.json %SNAPSHOT%
copy next.config.ts %SNAPSHOT%

echo Snapshot created successfully.
pause