import {
  CreateRoomRequest,
  CreateRoomResponse,
  Room,
  JoinRequest,
  JoinResponse,
  ReactionAccepted,
  Summary,
  SummaryWindow,
  ClosedRoom,
  Problem,
  ApiError,
} from './types';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '/api/v1';

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    if (res.status === 204) {
      return {} as T;
    }
    return res.json() as Promise<T>;
  }

  let problem: Problem;
  try {
    problem = await res.json();
  } catch {
    problem = {
      code: `HTTP_${res.status}`,
      message: res.statusText || 'Erro desconhecido na requisição',
    };
  }

  // Se o servidor retornar retryAfterSeconds no header Retry-After e não no body
  if (res.status === 429 && !problem.retryAfterSeconds) {
    const retryAfter = res.headers.get('Retry-After');
    if (retryAfter) {
      problem.retryAfterSeconds = parseInt(retryAfter, 10) || 5;
    }
  }

  throw new ApiError(res.status, problem);
}

export const api = {
  /**
   * Cria uma nova sala (RF-001)
   */
  async createRoom(data: CreateRoomRequest): Promise<CreateRoomResponse> {
    const res = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<CreateRoomResponse>(res);
  },

  /**
   * Consulta dados públicos da sala (RF-008)
   */
  async getRoom(code: string): Promise<Room> {
    const res = await fetch(`${API_BASE_URL}/rooms/${encodeURIComponent(code)}`);
    return handleResponse<Room>(res);
  },

  /**
   * Entra na sala e obtém o participantToken (RF-009, RF-010)
   */
  async joinRoom(code: string, data?: JoinRequest): Promise<JoinResponse> {
    const res = await fetch(`${API_BASE_URL}/rooms/${encodeURIComponent(code)}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data || {}),
    });
    return handleResponse<JoinResponse>(res);
  },

  /**
   * Envia uma reação usando o participantToken (RF-013, RF-014, RF-015, RF-016)
   */
  async sendReaction(
    code: string,
    emoji: string,
    participantToken: string
  ): Promise<ReactionAccepted> {
    const res = await fetch(
      `${API_BASE_URL}/rooms/${encodeURIComponent(code)}/reactions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Participant-Token': participantToken,
        },
        body: JSON.stringify({ emoji }),
      }
    );
    return handleResponse<ReactionAccepted>(res);
  },

  /**
   * Consulta o resumo de reações para uma janela específica (RF-019)
   */
  async getSummary(code: string, summaryWindow: SummaryWindow = '1m'): Promise<Summary> {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8080';
    const url = new URL(
      `${origin}${API_BASE_URL}/rooms/${encodeURIComponent(code)}/summary`
    );
    url.searchParams.set('window', summaryWindow);

    const res = await fetch(url.toString());
    return handleResponse<Summary>(res);
  },

  /**
   * Aumenta a duração da sala usando o hostToken (RF-024, RF-025, RF-026)
   */
  async extendRoom(
    code: string,
    extraMinutes: number,
    hostToken: string
  ): Promise<Room> {
    const res = await fetch(
      `${API_BASE_URL}/rooms/${encodeURIComponent(code)}/extend`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Host-Token': hostToken,
        },
        body: JSON.stringify({ extraMinutes }),
      }
    );
    return handleResponse<Room>(res);
  },

  /**
   * Encerra a sala imediatamente usando o hostToken (RF-028)
   */
  async closeRoom(code: string, hostToken: string): Promise<ClosedRoom> {
    const res = await fetch(
      `${API_BASE_URL}/rooms/${encodeURIComponent(code)}/close`,
      {
        method: 'POST',
        headers: {
          'X-Host-Token': hostToken,
        },
      }
    );
    return handleResponse<ClosedRoom>(res);
  },
};
