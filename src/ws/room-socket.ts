/**
 * Cliente WebSocket com reconexão automática e recuo exponencial (RNF-008).
 */
import { RoomWebSocketEvent } from '../api/ws-types';
import { API_BASE_URL } from '../api/client';

export type SocketStatus = 'connecting' | 'connected' | 'reconnecting' | 'closed';

export interface RoomSocketOptions {
  code: string;
  token: string;
  onEvent: (event: RoomWebSocketEvent) => void;
  onStatusChange: (status: SocketStatus) => void;
  onReconnectSuccess?: () => void;
}

export class RoomSocket {
  private ws: WebSocket | null = null;
  private isDisposed = false;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private hasConnectedBefore = false;

  private readonly code: string;
  private readonly token: string;
  private readonly onEvent: (event: RoomWebSocketEvent) => void;
  private readonly onStatusChange: (status: SocketStatus) => void;
  private readonly onReconnectSuccess?: () => void;

  constructor(options: RoomSocketOptions) {
    this.code = options.code;
    this.token = options.token;
    this.onEvent = options.onEvent;
    this.onStatusChange = options.onStatusChange;
    this.onReconnectSuccess = options.onReconnectSuccess;
  }

  public connect(): void {
    if (this.isDisposed) return;

    this.onStatusChange(this.hasConnectedBefore ? 'reconnecting' : 'connecting');

    try {
      const url = this.buildWebSocketUrl();
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        const wasReconnecting = this.hasConnectedBefore;
        this.hasConnectedBefore = true;
        this.reconnectAttempts = 0;
        this.onStatusChange('connected');

        if (wasReconnecting && this.onReconnectSuccess) {
          this.onReconnectSuccess();
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data: RoomWebSocketEvent = JSON.parse(event.data);
          this.onEvent(data);
        } catch (err) {
          console.error('[WebSocket] Erro ao decodificar mensagem:', err);
        }
      };

      this.ws.onclose = (event) => {
        this.ws = null;
        if (this.isDisposed) {
          this.onStatusChange('closed');
          return;
        }

        // Se o fechamento foi normal pelo servidor (ex: código 1000 após room.closed)
        if (event.code === 1000) {
          this.onStatusChange('closed');
          return;
        }

        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        console.warn('[WebSocket] Erro na conexão:', err);
        // O fechamento cuidará do reconnect
      };
    } catch (err) {
      console.error('[WebSocket] Falha ao abrir conexão:', err);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.isDisposed) return;

    this.onStatusChange('reconnecting');
    this.reconnectAttempts++;

    // Recuo exponencial: 500ms, 1000ms, 2000ms, 4000ms, até máx 10000ms (10s)
    const baseDelay = 500 * Math.pow(1.6, this.reconnectAttempts - 1);
    const delay = Math.min(10000, baseDelay + Math.random() * 200);

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = setTimeout(() => {
      if (!this.isDisposed) {
        this.connect();
      }
    }, delay);
  }

  public close(): void {
    this.isDisposed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close(1000, 'Client closed');
      this.ws = null;
    }
    this.onStatusChange('closed');
  }

  private buildWebSocketUrl(): string {
    let wsBase: string;

    if (API_BASE_URL.startsWith('http://')) {
      wsBase = API_BASE_URL.replace('http://', 'ws://');
    } else if (API_BASE_URL.startsWith('https://')) {
      wsBase = API_BASE_URL.replace('https://', 'wss://');
    } else {
      const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
      const host = typeof window !== 'undefined' ? window.location.host : 'localhost:8080';
      const protocol = isHttps ? 'wss:' : 'ws:';
      wsBase = `${protocol}//${host}${API_BASE_URL}`;
    }

    return `${wsBase}/rooms/${encodeURIComponent(this.code)}/ws?token=${encodeURIComponent(this.token)}`;
  }
}
