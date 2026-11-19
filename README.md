# Termofeed — Front-end

> **O humor da sala, em tempo real.**

Front-end web do **Termofeed**, um termômetro de humor coletivo para salas virtuais sem vídeo. Construído com **React 18**, **TypeScript**, **Vite**, **Tailwind CSS** e **Caddy**.

---

## 🚀 Como rodar o projeto

### 1. Desenvolvimento local (sem Docker)

Requisitos: **Node.js LTS (>= 20)** e **npm**.

```bash
# 1. Instalar dependências
npm install

# 2. Executar o servidor de desenvolvimento
npm run dev
```

A aplicação estará acessível em `http://localhost:5173`.
O proxy do Vite encaminha as chamadas `/api/v1` e WebSockets para o back-end em `http://localhost:8080`.

Para rodar a verificação de tipos e a suíte de testes:
```bash
# Verificação de tipos TypeScript
npm run typecheck

# Execução dos testes unitários e de componentes
npm test

# Build de produção
npm run build
```

---

### 2. Desenvolvimento com Docker Compose

Você pode subir o ambiente de desenvolvimento completo (front-end e back-end) com um comando:

```bash
docker compose up -d --build
```

O front-end estará disponível em `http://localhost:5173`.

> **Dica:** Para compilar o back-end a partir do repositório irmão `../termofeed-back`, copie o arquivo de exemplo:
> ```bash
> cp docker-compose.override.yml.example docker-compose.override.yml
> ```

---

## 🌐 Hospedagem em Produção

O repositório contém a configuração completa para produção utilizando o servidor web oficial **Caddy**, que serve os arquivos estáticos compilados, provê proxy reverso para a API e WebSockets do back-end em Go e emite/renova certificados HTTPS automaticamente via Let's Encrypt / ZeroSSL.

### Variáveis de Ambiente (`.env`)

Copie o `.env.example`:
```bash
cp .env.example .env
```

| Variável | Exemplo | Descrição |
|---|---|---|
| `DOMAIN` | `termofeed.exemplo.com` | Domínio público onde a aplicação será servida. O Caddy emitirá o certificado SSL para este domínio. |
| `BACK_IMAGE` | `ghcr.io/termofeed/termofeed-back:latest` | Imagem Docker da API back-end em Go. |
| `ACME_EMAIL` | `voce@exemplo.com` | E-mail para contato e avisos do emissor de certificados HTTPS. |
| `VITE_API_URL` | `/api/v1` | URL base da API (em produção o próprio Caddy encaminha as requisições na mesma origem). |

### Comandos de Operação

```bash
# Subir ambiente de produção (compila o front e inicia os containers saudáveis)
docker compose -f docker-compose.prod.yml up -d --build

# Visualizar logs em tempo real
docker compose -f docker-compose.prod.yml logs -f

# Atualizar containers com novas versões
docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d

# Parar todos os serviços
docker compose -f docker-compose.prod.yml down
```

---

## 🛠️ Contratos e Geração de Tipos da API

Os contratos da API residem no repositório de especificações (`termofeed-specs/cnt/`).
Para atualizar os tipos TypeScript do contrato OpenAPI:

```bash
npm run generate:api
```

Os tipos dos eventos WebSocket são mantidos em `src/api/ws-types.ts` de acordo com a especificação `asyncapi.yaml`.

---

## ♿ Acessibilidade e Desempenho

- **Desempenho (RNF-019):** Tamanho do bundle inicial comprimido de **~71 KB** (gzip), inferior ao teto de 300 KB.
- **Acessibilidade Visual (RNF-014):** Contraste superior a 12:1 entre o texto navy `#1B2340` e o fundo creme `#FFF6EA`. Botões de toque com tamanho mínimo de 44×44 px (ideal 56 px).
- **Movimento Reduzido (RNF-015):** Suporte nativo a `prefers-reduced-motion` desativando animações de movimento das partículas flutuantes.
- **Teclado e Leitores de Tela (RNF-016):** Foco visível (`focus-visible`), navegação integral por Tab/Enter/Espaço e alertas com `aria-live="polite"`.

---

## 📚 Documentação Técnica

- [Decisões de Arquitetura (DECISOES.md)](file:///C:/ws/termofeed/termofeed-front/docs/DECISOES.md)
- [Dúvidas e Resoluções de Contrato (DUVIDAS.md)](file:///C:/ws/termofeed/termofeed-front/docs/DUVIDAS.md)
- [Matriz de Rastreabilidade (RASTREABILIDADE.md)](file:///C:/ws/termofeed/termofeed-front/docs/RASTREABILIDADE.md)
