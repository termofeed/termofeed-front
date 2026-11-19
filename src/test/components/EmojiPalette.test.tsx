import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmojiPalette } from '../../components/EmojiPalette';

describe('Componente EmojiPalette', () => {
  const emojis = ['😀', '😂', '😍'];

  it('renderiza os botões com dimensões adequadas e aria-labels acessíveis (RNF-014, RNF-016)', () => {
    const handleReact = vi.fn();
    render(
      <EmojiPalette
        emojis={emojis}
        onReact={handleReact}
        cooldownTotalSeconds={5}
        nextAllowedAt={null}
      />
    );

    const button = screen.getByRole('button', { name: 'Enviar reação 😂' });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleReact).toHaveBeenCalledWith('😂');
  });

  it('ignora o clique sem lançar erro visual durante o cooldown (RF-014)', () => {
    const handleReact = vi.fn();
    render(
      <EmojiPalette
        emojis={emojis}
        onReact={handleReact}
        cooldownTotalSeconds={5}
        nextAllowedAt={Date.now() + 3000} // cooldown ativo
      />
    );

    const button = screen.getByRole('button', { name: 'Enviar reação 😂' });
    fireEvent.click(button);

    // O clique é silenciosamente ignorado
    expect(handleReact).not.toHaveBeenCalled();
    expect(screen.getByText(/Aguarde .*s para reagir novamente/i)).toBeInTheDocument();
  });
});
