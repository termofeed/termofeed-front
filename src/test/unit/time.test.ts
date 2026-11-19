import { describe, it, expect } from 'vitest';

export function formatTimeLeft(expiresAt: string, now: number = Date.now()): string {
  const diffSec = Math.max(0, Math.floor((new Date(expiresAt).getTime() - now) / 1000));
  if (diffSec <= 0) return '00:00';
  const minutes = Math.floor(diffSec / 60);
  const seconds = diffSec % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

describe('Formatação de tempo restante da sala', () => {
  it('formata corretamente minutos e segundos', () => {
    const now = 1000000;
    const expiresAt = new Date(now + 65 * 1000).toISOString(); // 1m 05s
    expect(formatTimeLeft(expiresAt, now)).toBe('01:05');
  });

  it('retorna 00:00 quando o tempo expira', () => {
    const now = 1000000;
    const expiresAt = new Date(now - 1000).toISOString();
    expect(formatTimeLeft(expiresAt, now)).toBe('00:00');
  });

  it('formata durações longas em mm:ss', () => {
    const now = 1000000;
    const expiresAt = new Date(now + 3600 * 1000).toISOString(); // 60 min
    expect(formatTimeLeft(expiresAt, now)).toBe('60:00');
  });
});
