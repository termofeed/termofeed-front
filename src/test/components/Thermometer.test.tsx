import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Thermometer } from '../../components/Thermometer';
import { Summary } from '../../api/types';

describe('Componente Thermometer', () => {
  it('renderiza o estado sem reações de forma acessível', () => {
    render(<Thermometer summary={null} windowLabel="1m" />);
    expect(screen.getByRole('region', { name: /termômetro de humor/i })).toBeInTheDocument();
    expect(screen.getByText(/Nenhuma reação ainda/i)).toBeInTheDocument();
  });

  it('exibe o emoji dominante e porcentagem quando há reações', () => {
    const mockSummary: Summary = {
      window: '1m',
      from: '2026-11-18T21:00:00Z',
      to: '2026-11-18T21:01:00Z',
      totalReactions: 20,
      dominantEmoji: '😂',
      ranking: [
        { emoji: '😂', count: 12, percentage: 60 },
        { emoji: '👏', count: 8, percentage: 40 },
      ],
    };

    render(<Thermometer summary={mockSummary} windowLabel="1m" />);
    expect(screen.getByText('60% na janela')).toBeInTheDocument();
    expect(screen.getByText('(20 total)')).toBeInTheDocument();
    expect(screen.getAllByText('😂').length).toBeGreaterThanOrEqual(1);
  });
});
