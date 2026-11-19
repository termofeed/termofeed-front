import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HostControlsSheet } from '../../components/HostControlsSheet';

describe('Componente HostControlsSheet (RF-024, RF-028, RF-033)', () => {
  it('abre a folha inferior ao clicar no menu', async () => {
    const handleExtend = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn().mockResolvedValue(undefined);

    render(
      <HostControlsSheet
        onExtend={handleExtend}
        onCloseRoom={handleClose}
      />
    );

    const menuButton = screen.getByRole('button', { name: /Gerenciar sala/i });
    fireEvent.click(menuButton);

    expect(screen.getByText('Controles do Criador')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+15 min' })).toBeInTheDocument();
  });

  it('exige confirmação em duas etapas para encerrar a sala (RF-028)', async () => {
    const handleExtend = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn().mockResolvedValue(undefined);

    render(
      <HostControlsSheet
        onExtend={handleExtend}
        onCloseRoom={handleClose}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Gerenciar sala/i }));

    const closeBtn = screen.getByRole('button', { name: /Encerrar sala agora/i });
    fireEvent.click(closeBtn);

    // Etapa 2: botão muda para confirmar
    const confirmBtn = screen.getByRole('button', {
      name: /Tem certeza\? Clique para confirmar encerramento/i,
    });
    expect(confirmBtn).toBeInTheDocument();

    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
