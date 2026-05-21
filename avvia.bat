@echo off
chcp 65001 >nul
title LB Motors - Avvio Progetto

echo.
echo  +----------------------------------------------+
echo  ^|          LB MOTORS - AVVIO PROGETTO          ^|
echo  +----------------------------------------------+
echo.

cd /d "%~dp0"

:: 1. VERIFICA NODE.JS
echo  [1/3] Verifica Node.js...
node --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo  [ERRORE] Node.js non trovato!
    echo  Scaricalo da: https://nodejs.org/  (versione 18+)
    echo.
    pause
    exit /b 1
)
FOR /F "tokens=*" %%i IN ('node --version') DO SET NODE_VER=%%i
echo  [OK] Node.js: %NODE_VER%

:: 2. VERIFICA NPM
echo  [2/3] Verifica npm...
npm --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo  [ERRORE] npm non trovato!
    pause
    exit /b 1
)
FOR /F "tokens=*" %%i IN ('npm --version') DO SET NPM_VER=%%i
echo  [OK] npm: v%NPM_VER%

:: 3. DIPENDENZE
echo  [3/3] Verifica dipendenze...
IF NOT EXIST "node_modules" (
    echo  [INFO] Installazione dipendenze in corso...
    echo  [INFO] Include: Next.js, MongoDB, React e altro (circa 1-2 minuti)
    echo.
    npm install
    IF %ERRORLEVEL% NEQ 0 (
        echo  [ERRORE] npm install fallito!
        pause
        exit /b 1
    )
    echo  [OK] Dipendenze installate!
) ELSE (
    echo  [OK] Dipendenze presenti.
)

:: Verifica .env.local
IF NOT EXIST ".env.local" (
    echo.
    echo  +----------------------------------------------+
    echo  ^| ATTENZIONE: file .env.local non trovato!     ^|
    echo  ^| Copia .env.example in .env.local e compila  ^|
    echo  ^| almeno MONGODB_URI prima di continuare.      ^|
    echo  +----------------------------------------------+
    echo.
    echo  Vuoi continuare comunque? (il sito usa dati mock)
    echo    1 - Si, continua
    echo    2 - No, esci e configuro prima
    set /p ENVCHECK="  Scegli [1 o 2]: "
    IF "%ENVCHECK%"=="2" exit /b 0
)

echo.
echo  +----------------------------------------------+
echo.
echo  Come vuoi avviare il progetto?
echo.
echo    1 - DEV   (sviluppo, hot reload)
echo    2 - BUILD + START  (simula produzione)
echo.
set /p MODE="  Scegli [1 o 2]: "

IF "%MODE%"=="1" goto :SCEGLI_IDE
IF "%MODE%"=="2" goto :BUILD
echo  [ERRORE] Scelta non valida.
pause
exit /b 1

:BUILD
echo.
echo  [INFO] Build in corso...
npm run build
IF %ERRORLEVEL% NEQ 0 (
    echo  [ERRORE] Build fallita!
    pause
    exit /b 1
)
echo  [OK] Build completata!

:SCEGLI_IDE
echo.
echo  +----------------------------------------------+
echo.
echo  Vuoi aprire il progetto con Atom?
echo.
echo    1 - Si, apri con Atom
echo    2 - No, avvia solo il server
echo.
set /p ATOM_CHOICE="  Scegli [1 o 2]: "

IF "%ATOM_CHOICE%"=="1" (
    echo.
    IF EXIST "%LOCALAPPDATA%\atom\atom.exe" (
        start "" "%LOCALAPPDATA%\atom\atom.exe" "."
        echo  [OK] Atom aperto.
    ) ELSE IF EXIST "%PROGRAMFILES%\Atom\atom.exe" (
        start "" "%PROGRAMFILES%\Atom\atom.exe" "."
        echo  [OK] Atom aperto.
    ) ELSE IF EXIST "%PROGRAMFILES(X86)%\Atom\atom.exe" (
        start "" "%PROGRAMFILES(X86)%\Atom\atom.exe" "."
        echo  [OK] Atom aperto.
    ) ELSE (
        where atom >nul 2>&1
        IF %ERRORLEVEL% EQU 0 (
            start "" atom "."
            echo  [OK] Atom aperto.
        ) ELSE (
            echo  [WARN] Atom non trovato. Scaricalo da: https://atom.io
        )
    )
)

echo.
echo  +----------------------------------------------+
echo  Il sito aprira' su: http://localhost:3000
echo  Admin panel:        http://localhost:3000/admin
echo  Premi Ctrl+C per fermare il server.
echo  +----------------------------------------------+
echo.

timeout /t 3 /nobreak >nul
start http://localhost:3000

IF "%MODE%"=="1" (
    npm run dev
) ELSE (
    npm run start
)

pause
