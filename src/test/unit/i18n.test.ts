import { describe, it, expect } from 'vitest';
import { getErrorMessage, i18n } from '../../i18n/pt-BR';

describe('Internacionalização e mensagens amigáveis de erro (RNF-022)', () => {
  it('traduz ROOM_NOT_FOUND para português', () => {
    expect(getErrorMessage('ROOM_NOT_FOUND')).toBe(i18n.errors.ROOM_NOT_FOUND);
  });

  it('traduz ROOM_GONE para português', () => {
    expect(getErrorMessage('ROOM_GONE')).toBe(i18n.errors.ROOM_GONE);
  });

  it('traduz ROOM_FULL para português', () => {
    expect(getErrorMessage('ROOM_FULL')).toBe(i18n.errors.ROOM_FULL);
  });

  it('traduz COOLDOWN_ACTIVE para português', () => {
    expect(getErrorMessage('COOLDOWN_ACTIVE')).toBe(i18n.errors.COOLDOWN_ACTIVE);
  });

  it('traduz UNAUTHORIZED para português', () => {
    expect(getErrorMessage('UNAUTHORIZED')).toBe(i18n.errors.UNAUTHORIZED);
  });

  it('retorna mensagem genérica para erros desconhecidos', () => {
    expect(getErrorMessage('UNKNOWN_ERROR_CODE')).toBe(i18n.errors.generic);
  });
});
