/**
 * Dicionário de textos em Português do Brasil (RNF-022)
 * Fonte única de verdade para textos da interface e códigos de erro.
 */
export const i18n = {
  app: {
    title: 'Termofeed',
    slogan: 'O humor da sala, em tempo real',
    description: 'Termômetro de humor coletivo para reuniões e eventos sem vídeo.',
  },
  home: {
    createCardTitle: 'Criar sala',
    roomNameLabel: 'Nome da sala (opcional)',
    roomNamePlaceholder: 'Ex: Retrospectiva da Sprint 42',
    durationLabel: 'Duração',
    customDurationLabel: 'Outro valor (minutos)',
    reactionCooldownLabel: 'Intervalo entre reações: {seconds}s',
    paletteLabel: 'Paleta de emojis ({count} selecionados)',
    paletteHelp: 'Escolha de 2 a 12 emojis para a sala',
    advancedOptions: 'Opções avançadas',
    createButton: 'Criar sala',
    creating: 'Criando sala...',
    hasLinkPrompt: 'Já tem um link? Cole aqui:',
    pasteLinkPlaceholder: 'https://... ou código da sala',
    enterRoom: 'Entrar',
  },
  created: {
    title: 'Sala criada com sucesso! 🎉',
    shareLinkTitle: 'Link de entrada',
    shareLinkHelp: 'Compartilhe este link com os participantes.',
    copyLink: 'Copiar link',
    copiedSuccess: 'Link copiado!',
    adminLinkTitle: 'Link de administração',
    adminLinkHelp: 'Guarde este link. Ele devolve o controle da sala se você trocar de dispositivo.',
    copyAdminLink: 'Copiar link de administração',
    adminCopiedSuccess: 'Link de administração copiado!',
    enterRoomButton: 'Entrar na sala',
  },
  room: {
    participantsCount: '{count} participante',
    participantsCountPlural: '{count} participantes',
    timeLeft: 'Tempo restante',
    expired: 'Tempo esgotado',
    cooldownWaiting: 'Aguarde {seconds}s para reagir novamente',
    reactAriaLabel: 'Enviar reação {emoji}',
    dominantNow: 'Humor dominante',
    noReactionsYet: 'Nenhuma reação ainda',
    thermometerAriaLabel: 'Humor da sala na janela de {window}: {dominant} domina com {percentage}% das {total} reações',
    thermometerEmptyAriaLabel: 'Humor da sala na janela de {window}: sem reações no momento',
    windowSelectorLabel: 'Janela de tempo do resumo',
    windows: {
      '30s': '30s',
      '1m': '1 min',
      '5m': '5 min',
      all: 'Tudo',
    },
    topEmojisTitle: 'Mais usados agora',
    nicknamePromptTitle: 'Entrar na sala',
    nicknamePromptSubtitle: 'Como quer ser chamado? (opcional)',
    nicknamePlaceholder: 'Seu apelido (opcional)',
    nicknameSubmit: 'Entrar na sala',
    connecting: 'Conectando à sala...',
    reconnecting: 'Reconectando ao servidor...',
    notifications: {
      expiringSoon: 'A sala termina em 1 minuto!',
      extended: 'Mais {minutes} minutos adicionados à sala!',
      roomClosed: 'A sala foi encerrada.',
    },
  },
  host: {
    menuButton: 'Gerenciar sala',
    menuTitle: 'Controles do Criador',
    extendTitle: 'Estender duração',
    extendOption5: '+5 minutos',
    extendOption15: '+15 minutos',
    extendOption30: '+30 minutos',
    extending: 'Estendendo...',
    closeTitle: 'Encerrar sala',
    closeWarning: 'Isso encerrará a sala para todos os participantes imediatamente.',
    closeButton: 'Encerrar sala agora',
    closeConfirmButton: 'Tem certeza? Clique para confirmar encerramento',
    closing: 'Encerrando...',
    closeCancel: 'Cancelar',
  },
  summary: {
    title: 'A sala terminou',
    championTitle: 'Emoji campeão',
    noChampion: 'Nenhuma reação registrada durante a sala',
    totalReactions: 'Total de {total} reações',
    fullRankingTitle: 'Ranking completo da sala',
    createNewRoom: 'Criar nova sala',
    reasonHost: 'Encerrada pelo criador',
    reasonTimeout: 'Encerrada pelo tempo limite',
  },
  errors: {
    generic: 'Algo deu errado. Tente novamente.',
    network: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
    ROOM_NOT_FOUND: 'Sala não encontrada. Verifique se o link ou código está correto.',
    ROOM_GONE: 'Esta sala não existe mais. Ela foi removida após o período de retenção de 24h.',
    ROOM_ENDED: 'Esta sala já está encerrada.',
    ROOM_FULL: 'A sala atingiu a capacidade máxima de 200 participantes.',
    COOLDOWN_ACTIVE: 'Aguarde o intervalo antes de enviar outra reação.',
    EMOJI_NOT_ALLOWED: 'Este emoji não é permitido nesta sala.',
    UNAUTHORIZED: 'Você não tem permissão para realizar esta ação.',
    DURATION_LIMIT_EXCEEDED: 'A duração total da sala não pode ultrapassar 480 minutos (8 horas).',
    VALIDATION_ERROR: 'Verifique os dados informados.',
    backToHome: 'Voltar ao início',
    tryAgain: 'Tentar novamente',
  },
  validation: {
    durationRange: 'A duração deve estar entre 5 e 240 minutos.',
    nameMaxLength: 'O nome da sala deve ter no máximo 80 caracteres.',
    nicknameMaxLength: 'O apelido deve ter no máximo 30 caracteres.',
    cooldownRange: 'O intervalo deve ser de 1 a 60 segundos.',
    paletteRange: 'A paleta deve conter entre 2 e 12 emojis.',
    invalidRoomCode: 'Código da sala inválido. Formato esperado: abc-defg-hij',
  },
};

/**
 * Traduz o código de erro retornado pela API para uma mensagem amigável em pt-BR.
 */
export function getErrorMessage(code?: string): string {
  if (!code) return i18n.errors.generic;
  const mapped = (i18n.errors as Record<string, string>)[code];
  return mapped || i18n.errors.generic;
}

/**
 * Paleta padrão de 8 emojis recomendada pela especificação
 */
export const DEFAULT_EMOJIS = ['😀', '😂', '😍', '👏', '😮', '😢', '😡', '🤔'];

/**
 * Catálogo expandido de emojis disponíveis para personalização da sala
 */
export const AVAILABLE_EMOJIS = [
  '😀', '😂', '😍', '👏', '😮', '😢', '😡', '🤔',
  '🎉', '🔥', '🚀', '❤️', '👍', '👎', '🥳', '😴',
  '💡', '🤯', '🙌', '👀', '💯', '💩', '🤝', '💪',
];
