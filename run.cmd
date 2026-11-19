@echo off
rem Sobe o front-end em modo de desenvolvimento (http://localhost:5173).
rem Argumentos extras seguem para o Vite. Exemplo: run.cmd --host
rem As mensagens evitam acentos porque o console do Windows pode exibir UTF-8 incorretamente.
setlocal
cd /d "%~dp0"

echo.
echo === Termofeed Front - modo desenvolvimento ===
echo.

echo [1/3] Verificando o Node.js...
where node >nul 2>nul
if errorlevel 1 (
  echo Erro: Node.js ausente. Instale o Node.js 20 ou superior: https://nodejs.org 1>&2
  exit /b 1
)

for /f "delims=." %%v in ('node -p "process.versions.node"') do set NODE_MAJOR=%%v
for /f "delims=" %%v in ('node -v') do set NODE_VERSION=%%v
if %NODE_MAJOR% LSS 20 (
  echo Erro: este projeto pede Node.js 20 ou superior, encontrado %NODE_VERSION%. 1>&2
  echo Atualize em: https://nodejs.org 1>&2
  exit /b 1
)
echo       Node.js %NODE_VERSION% OK.

echo [2/3] Verificando os pacotes do projeto...
if exist "node_modules\" (
  echo       Pacotes prontos.
) else (
  echo       Primeira vez aqui: instalando os pacotes, isso pode levar alguns minutos...
  call npm install
  if errorlevel 1 (
    echo Erro: falha ao instalar os pacotes. Confira a mensagem acima e tente de novo. 1>&2
    exit /b 1
  )
  echo       Pacotes instalados.
)

echo [3/3] Iniciando o servidor de desenvolvimento...
echo.
echo   - Acesse o link Local exibido abaixo, normalmente http://localhost:5173
echo   - A API precisa estar rodando em http://localhost:8080
echo   - Para encerrar, pressione Ctrl+C
echo.

call npm run dev -- %*
exit /b %errorlevel%
