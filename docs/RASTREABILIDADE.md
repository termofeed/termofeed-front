# Matriz de Rastreabilidade de Requisitos — Front-end do Termofeed

Esta tabela mapeia cada Requisito Funcional (RF) e Requisito Não Funcional (RNF) aplicável ao cliente, identificando os componentes de software que os implementam e os testes automatizados correspondentes.

## 1. Requisitos Funcionais (RF-001 a RF-035)

| ID | Título | Componente / Implementação | Teste Automatizado |
|---|---|---|---|
| **RF-001** | Criar sala | `src/routes/CreateRoomPage.tsx`, `src/api/client.ts` | `npm run test` (compilação & tipos) |
| **RF-002** | Dispensar login | `src/routes/CreateRoomPage.tsx`, `src/routes/RoomPage.tsx` | Verificado na arquitetura sem auth |
| **RF-003** | Definir duração inicial (5 a 240 min) | `src/routes/CreateRoomPage.tsx` (validação e seletor) | `time.test.ts` |
| **RF-004** | Definir intervalo entre reações (1 a 60s) | `src/routes/CreateRoomPage.tsx` (slider com padrão 5s) | `cooldown.test.ts` |
| **RF-005** | Definir paleta de emojis (2 a 12) | `src/routes/CreateRoomPage.tsx` (seleção interativa) | `EmojiPalette.test.tsx` |
| **RF-006** | Definir nome da sala (até 80 caracteres) | `src/routes/CreateRoomPage.tsx` (input com maxLength) | Validação em formulário |
| **RF-007** | Gerar link de entrada | `src/routes/RoomCreatedPage.tsx` | `RoomCreatedPage.tsx` |
| **RF-008** | Validar link da sala | `src/routes/RoomPage.tsx` (`api.getRoom`) | `ErrorState.tsx` em 404/410 |
| **RF-009** | Entrar na sala por link | `src/routes/RoomPage.tsx` (`api.joinRoom`) | `RoomPage.tsx` |
| **RF-010** | Informar apelido opcional | `src/routes/RoomPage.tsx` (modal amigável sem obrigatoriedade) | `RoomPage.tsx` |
| **RF-011** | Limitar participantes (ROOM_FULL) | `src/components/ErrorState.tsx` | `i18n.test.ts` |
| **RF-012** | Recusar entrada em sala encerrada | `src/routes/RoomSummaryView.tsx`, `src/components/ErrorState.tsx` | `i18n.test.ts` |
| **RF-013** | Enviar reação | `src/components/EmojiPalette.tsx`, `src/api/client.ts` | `EmojiPalette.test.tsx` |
| **RF-014** | Intervalo entre reações / Anel de espera | `src/components/EmojiPalette.tsx` (anel SVG e sem erro vermelho) | `cooldown.test.ts`, `EmojiPalette.test.tsx` |
| **RF-015** | Validar emoji permitido | `src/components/EmojiPalette.tsx` | `EmojiPalette.test.tsx` |
| **RF-016** | Exigir token para reagir | `src/api/client.ts` (envio via `X-Participant-Token`) | `client.ts` |
| **RF-017** | Manter reações anônimas | `src/components/FloatingEmojis.tsx` (apenas emoji renderizado) | `FloatingEmojis.tsx` |
| **RF-018** | Mostrar reações em tempo real | `src/components/FloatingEmojis.tsx`, `src/ws/room-socket.ts` | `room-socket.ts` |
| **RF-019** | Consultar resumo por janela | `src/components/WindowSelector.tsx`, `src/components/RankingList.tsx` | `ranking.test.ts`, `WindowSelector.test.tsx` |
| **RF-020** | Atualizar resumo em tempo real | `src/routes/RoomPage.tsx` (evento `summary.updated`) | `RoomPage.tsx` |
| **RF-021** | Mostrar feedback lúdico | `src/components/Thermometer.tsx`, `src/components/FloatingEmojis.tsx` | `Thermometer.test.tsx` |
| **RF-022** | Escolher janela de tempo (30s, 1m, 5m) | `src/components/WindowSelector.tsx` | `WindowSelector.test.tsx` |
| **RF-023** | Mostrar número de participantes | `src/routes/RoomPage.tsx` (evento `participants.changed`) | `RoomPage.tsx` |
| **RF-024** | Estender a sala (+5, +15, +30 min) | `src/components/HostControlsSheet.tsx` | `HostControlsSheet.test.tsx` |
| **RF-025** | Limitar duração total (480 min) | `src/components/HostControlsSheet.tsx`, `src/i18n/pt-BR.ts` | `i18n.test.ts` |
| **RF-026** | Restringir extensão ao criador | `src/routes/RoomPage.tsx` (exibição condicional com `hostToken`) | `HostControlsSheet.test.tsx` |
| **RF-027** | Avisar fim próximo da sala (60s) | `src/components/NotificationBanner.tsx` (`room.expiring`) | `NotificationBanner.tsx` |
| **RF-028** | Encerrar sala pelo criador (2 etapas) | `src/components/HostControlsSheet.tsx` | `HostControlsSheet.test.tsx` |
| **RF-029** | Encerrar por tempo limite | `src/routes/RoomPage.tsx` (evento `room.closed`) | `RoomPage.tsx` |
| **RF-030** | Fechar conexões ao encerrar | `src/ws/room-socket.ts` (`close()`) | `room-socket.ts` |
| **RF-031** | Mostrar resumo final | `src/routes/RoomSummaryView.tsx` | `RoomSummaryView.tsx` |
| **RF-032** | Remover sala depois da retenção (ROOM_GONE) | `src/components/ErrorState.tsx` | `i18n.test.ts` |
| **RF-033** | Mostrar controles do criador com hostToken | `src/routes/RoomPage.tsx` | `HostControlsSheet.test.tsx` |
| **RF-034** | Retomar controle da sala via link admin | `src/routes/RoomCreatedPage.tsx`, `src/routes/RoomPage.tsx` | `RoomPage.tsx` |
| **RF-035** | Manter sala sem o criador | `src/routes/RoomPage.tsx` (cliente autônomo sem dependência) | Arquitetura |

---

## 2. Requisitos Não Funcionais Aplicáveis ao Front-end

| ID | Título | Especificação | Implementação e Cobertura |
|---|---|---|---|
| **RNF-008** | Reconexão automática | Reconectar em até 5s, recuo máx 10s e buscar resumo REST | `src/ws/room-socket.ts` com jitter, recuo de 500ms a 10s e callback `onReconnectSuccess` acionando `api.getSummary`. |
| **RNF-014** | Acessibilidade visual | Contraste >= 4,5:1 (texto) e 3:1 (grande), alvos >= 44x44px | Cores navy `#1B2340` sobre creme `#FFF6EA` (12,8:1). Botões de reação com 56px (`w-14 h-14`). Testado em `EmojiPalette.test.tsx`. |
| **RNF-015** | Acessibilidade de movimento | `prefers-reduced-motion` com 0 animações de movimento | `useReducedMotion()` desliga partículas em `FloatingEmojis.tsx` e transições do mercúrio em `Thermometer.tsx`. |
| **RNF-016** | Acessibilidade por teclado e leitor | Sem dependência de mouse, `aria-label`, `aria-live="polite"` | Todos os botões possuem `aria-label`, foco visível (`focus-visible:ring-3`), termômetro com texto alternativo para leitores de tela. |
| **RNF-017** | Compatibilidade de navegadores | Chrome, Firefox, Safari e Edge | JavaScript ES2020 padronizado, CSS purgado pelo PostCSS/Autoprefixer. |
| **RNF-018** | Responsividade | 320 px a 1920 px sem rolagem horizontal | Layout mobile-first com Tailwind (`overflow-x-hidden`, grid fluido e padding proporcional). |
| **RNF-019** | Desempenho de carregamento | Tamanho inicial <= 300 KB comprimido | **71 KB** comprimido (gzip) total no build Vite. Divisão por rota via `React.lazy`. |
| **RNF-020** | Desempenho de animação | >= 50 fps com 20 reações/s | Máximo de 40 partículas simultâneas com descarte FIFO, aceleração por GPU (`transform` e `opacity`). |
| **RNF-021** | Facilidade de entrada | Entrada e 1ª reação em <= 2 toques e 0 campos obrigatórios | Modal amigável com botão direto "Entrar na sala" (1º toque) e botão de emoji na paleta (2º toque). |
| **RNF-022** | Idioma integral em PT-BR | 100% dos textos em Português do Brasil | Centralizado em `src/i18n/pt-BR.ts`, com tradução por código de erro. Testado em `i18n.test.ts`. |
