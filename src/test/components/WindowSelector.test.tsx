import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WindowSelector } from '../../components/WindowSelector';

describe('Componente WindowSelector (RF-022)', () => {
  it('renderiza as opções 30s, 1 min, 5 min e permite seleção', () => {
    const handleChange = vi.fn();
    render(
      <WindowSelector
        currentWindow="1m"
        onChangeWindow={handleChange}
      />
    );

    const btn30s = screen.getByRole('button', { name: '30s' });
    const btn1m = screen.getByRole('button', { name: '1 min' });

    expect(btn1m).toHaveAttribute('aria-pressed', 'true');
    expect(btn30s).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(btn30s);
    expect(handleChange).toHaveBeenCalledWith('30s');
  });
});
