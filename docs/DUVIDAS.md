# Registro de Dúvidas e Decisões de Contrato — Front-end do Termofeed

Este documento registra lacunas, ambiguidades identificadas nos contratos e a opção adotada pela equipe de front-end.

---

### D-01: Formato do link de administração (RF-034)
- **Questão:** A especificação exige exibir um "link de administração" para que o criador retome o controle caso troque de dispositivo ou limpe o cache, porém o OpenAPI não especifica um endpoint ou rota separada.
- **Opção adotada:** O link de administração utiliza a URL padrão da sala com o parâmetro de busca `?adminToken=<hostToken>` (ex: `https://meudominio.com/r/abc-defg-hij?adminToken=...`). Ao carregar a página `/r/:code`, a aplicação lê o parâmetro, grava-o no `localStorage` sob a chave `termofeed_host_<code_>` e remove o parâmetro visualmente da URL para segurança.

---

### D-02: Obtenção de `retryAfterSeconds` em respostas HTTP 429
- **Questão:** O OpenAPI descreve `retryAfterSeconds` tanto no payload de erro `Problem` quanto no cabeçalho de resposta HTTP `Retry-After`.
- **Opção adotada:** O cliente REST lê prioritariamente o campo no payload JSON. Se ausente, realiza o parsing do cabeçalho `Retry-After`. Se ambos estiverem ausentes, adota o valor configurado na sala (`reactionCooldownSeconds`, padrão 5 s).

---

### D-03: Apelido em branco no momento do Join (RF-010)
- **Questão:** O usuário pode enviar espaços em branco no campo de apelido opcional.
- **Opção adotada:** A aplicação aplica `.trim()`. Se o resultado for string vazia, omite o campo no payload JSON do `POST /rooms/{code}/join`.

---

### D-04: Sincronização de relógio entre cliente e servidor para o Cooldown
- **Questão:** O relógio do computador do usuário pode apresentar pequeno desvio (skew) em relação ao horário UTC do servidor.
- **Opção adotada:** O cliente calcula o tempo restante a partir do `nextAllowedAt` recebido na resposta do servidor. Se o relógio do cliente estiver adiantado, o cooldown mínimo padrão de 1 segundo é respeitado para evitar cliques imediatos que resultem em erro `429`.

---

### D-05: Exibição de resumo final quando a sala é encerrada via WebSocket
- **Questão:** Quando o evento `room.closed` chega via WebSocket, o payload já contém o objeto `summary` com a contagem total da sala (`window = all`).
- **Opção adotada:** A aplicação transiciona imediatamente para a tela final utilizando o resumo contido no payload do evento WebSocket, sem necessidade de efetuar nova requisição HTTP, garantindo resposta instantânea.
