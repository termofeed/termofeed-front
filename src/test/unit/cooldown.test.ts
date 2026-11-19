import { describe, it, expect } from 'vitest';

export function calculateCooldownProgress(
  nextAllowedAt: number | null,
  totalSeconds: number,
  now: number = Date.now()
): { isInCooldown: boolean; fraction: number; secondsLeft: number } {
  if (!nextAllowedAt) return { isInCooldown: false, fraction: 1, secondsLeft: 0 };
  const diff = nextAllowedAt - now;
  if (diff <= 0) return { isInCooldown: false, fraction: 1, secondsLeft: 0 };
  const secondsLeft = Math.ceil(diff / 1000);
  const fraction = Math.min(1, Math.max(0, 1 - diff / (totalSeconds * 1000)));
  return { isInCooldown: true, fraction, secondsLeft };
}

describe('Lógica do anel de espera e cooldown (RF-014)', () => {
  it('identifica quando o usuário não está em cooldown', () => {
    const res = calculateCooldownProgress(null, 5);
    expect(res.isInCooldown).toBe(false);
    expect(res.fraction).toBe(1);
    expect(res.secondsLeft).toBe(0);
  });

  it('calcula a fração preenchida do anel durante o cooldown', () => {
    const now = 10000;
    const nextAllowedAt = 15000; // faltam 5s de 10s totais (metade)
    const res = calculateCooldownProgress(nextAllowedAt, 10, now);
    expect(res.isInCooldown).toBe(true);
    expect(res.fraction).toBe(0.5);
    expect(res.secondsLeft).toBe(5);
  });

  it('zera o cooldown quando o tempo é ultrapassado', () => {
    const now = 20000;
    const nextAllowedAt = 19000;
    const res = calculateCooldownProgress(nextAllowedAt, 5, now);
    expect(res.isInCooldown).toBe(false);
    expect(res.secondsLeft).toBe(0);
  });
});
