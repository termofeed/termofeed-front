#!/usr/bin/env sh
# Sobe o front-end em modo de desenvolvimento (http://localhost:5173).
# Argumentos extras vão para o Vite. Exemplo: ./run.sh --host
# As mensagens evitam acentos para sair iguais às do run.cmd em qualquer terminal.
set -e

cd "$(dirname "$0")"

echo
echo "=== Termofeed Front - modo desenvolvimento ==="
echo

echo "[1/3] Verificando o Node.js..."
if ! command -v node >/dev/null 2>&1; then
  echo "Erro: Node.js ausente. Instale o Node.js 20 ou superior: https://nodejs.org" >&2
  exit 1
fi

node_major=$(node -p "process.versions.node.split('.')[0]")
if [ "$node_major" -lt 20 ]; then
  echo "Erro: este projeto pede Node.js 20 ou superior, encontrado $(node -v)." >&2
  echo "Atualize em: https://nodejs.org" >&2
  exit 1
fi
echo "      Node.js $(node -v) OK."

echo "[2/3] Verificando os pacotes do projeto..."
if [ -d node_modules ]; then
  echo "      Pacotes prontos."
else
  echo "      Primeira vez aqui: instalando os pacotes, isso pode levar alguns minutos..."
  if ! npm install; then
    echo "Erro: falha ao instalar os pacotes. Confira a mensagem acima e tente de novo." >&2
    exit 1
  fi
  echo "      Pacotes instalados."
fi

echo "[3/3] Iniciando o servidor de desenvolvimento..."
echo
echo "  - Acesse o link Local exibido abaixo, normalmente http://localhost:5173"
echo "  - A API precisa estar rodando em http://localhost:8080"
echo "  - Para encerrar, pressione Ctrl+C"
echo

exec npm run dev -- "$@"
