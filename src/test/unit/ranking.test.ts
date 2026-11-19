import { describe, it, expect } from 'vitest';
import { EmojiCount } from '../../api/types';

export function getTopRanking(ranking: EmojiCount[], limit: number = 3): EmojiCount[] {
  return [...ranking]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

describe('Lógica de ordenação e ranking (RF-019)', () => {
  const sampleRanking: EmojiCount[] = [
    { emoji: '👏', count: 8, percentage: 26.7 },
    { emoji: '😂', count: 15, percentage: 50 },
    { emoji: '😍', count: 5, percentage: 16.7 },
    { emoji: '😮', count: 2, percentage: 6.6 },
  ];

  it('retorna os 3 emojis mais usados em ordem decrescente', () => {
    const top3 = getTopRanking(sampleRanking, 3);
    expect(top3).toHaveLength(3);
    expect(top3[0].emoji).toBe('😂');
    expect(top3[1].emoji).toBe('👏');
    expect(top3[2].emoji).toBe('😍');
  });

  it('lida graciosamente com listas vazias', () => {
    expect(getTopRanking([])).toEqual([]);
  });
});
