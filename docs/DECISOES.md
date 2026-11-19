# Registro de Decisões de Arquitetura (ADR) — Front-end do Termofeed

Versão: 1.0  
Data: 2026-11-18  

## 1. Stack Tecnológica e Desempenho (RNF-019)
- **Decisão:** React 18 com TypeScript, Vite e Tailwind CSS.
- **Motivação:** Tempo de compilação quase instantâneo, tipagem forte baseada no contrato OpenAPI e geração de CSS atômico mínimo via Tailwind.
- **Fontes locais:** Fontes `Fredoka` e `Space Grotesk` empacotadas localmente via `@fontsource` para eliminar dependência de CDNs externas e garantir privacidade e estabilidade.
- **Tamanho do pacote:** O bundle inicial gerou ~71 KB comprimido em gzip (JS + CSS), cumprindo com folga o limite de 300 KB estipulado em RNF-019.

## 2. Roteamento e Divisão de Código (Code Splitting)
- **Decisão:** `react-router-dom` v6 com carregamento sob demanda (`React.lazy`).
- **Rotas:**
  - `/`: Criação da sala com opções dobradas e atalho para link colado.
  - `/created/:code`: Apresentação dos links de compartilhamento e administração com cópia em 1 clique.
  - `/r/:code`: Sala de humor interativa herói, termômetro e paleta com anel de espera.

## 3. Comunicação em Tempo Real e Resiliência (RNF-008)
- **Decisão:** Cliente WebSocket nativo encapsulado em `RoomSocket` com recuo exponencial (500 ms a 10 s) e jitter aleatório.
- **Reconexão:** Ao restabelecer a conexão perdida, a aplicação automaticamente efetua um `GET /rooms/{code}/summary` para sincronizar o estado sem lacunas.
- **Banner discreto:** Quando a rede cai, um banner sutil "Reconectando ao servidor..." é exibido no topo da tela, evitando alertas intrusivos que bloqueiem a tela.

## 4. Animações e Acessibilidade de Movimento (RNF-015, RNF-020)
- **Decisão:** Framer Motion com `useReducedMotion()`.
- **Comportamento lúdico:** Emojis flutuam de baixo para cima com balanço e desaparecem após 2,5 s. Há limite estrito de 40 emojis simultâneos na tela para manter a taxa de quadros acima de 50 fps (RNF-020).
- **Movimento reduzido:** Se o usuário ativar `prefers-reduced-motion`, a camada de partículas flutuantes é omitida e as transições do termômetro passam a ser instantâneas, garantindo que o feedback de humor continue acessível por texto e ranking.

## 5. Entrada Sem Atrito (RNF-021)
- **Decisão:** Nenhum campo obrigatório. O usuário que abre o link pode clicar em "Entrar na sala" imediatamente (com ou sem apelido opcional) e reagir com seu primeiro emoji em 2 cliques no total.

## 6. Recuperação de Controle pelo Criador (RF-034)
- **Decisão:** O link de administração gerado após a criação da sala inclui o parâmetro `?adminToken=<token>`. Ao abrir o link em outro navegador ou dispositivo, a aplicação persiste o token no `localStorage` sob a chave `termofeed_host_<code_>` e libera os controles administrativos (Estender e Encerrar).

## 7. Servidor Caddy e Eliminação de CORS
- **Decisão:** Uso do Caddy oficial em container multi-stage. O Caddy serve o SPA (`try_files {path} /index.html`), gerencia certificados TLS/HTTPS automáticos via Let's Encrypt com `DOMAIN`, e encaminha chamadas `/api/*` e o upgrade de WebSocket para o container Go `back:8080`. Com isso, todas as requisições ocorrem na mesma origem e CORS é eliminado.
