/**
 * Tipos do contrato REST derivados de openapi.yaml
 */

export interface EmojiCount {
  emoji: string;
  count: number;
  percentage: number;
}

export type SummaryWindow = '30s' | '1m' | '5m' | 'all';

export interface Summary {
  window: SummaryWindow;
  from: string;
  to: string;
  totalReactions: number;
  dominantEmoji: string | null;
  ranking: EmojiCount[];
}

export interface Room {
  code: string;
  name?: string;
  status: 'active' | 'ended';
  createdAt: string;
  expiresAt: string;
  totalDurationMinutes?: number;
  reactionCooldownSeconds: number;
  allowedEmojis: string[];
  participantCount: number;
  maxParticipants?: number;
  endedAt?: string | null;
  endedReason?: 'host' | 'timeout' | null;
}

export interface CreateRoomRequest {
  name?: string;
  durationMinutes: number;
  reactionCooldownSeconds?: number;
  allowedEmojis?: string[];
  maxParticipants?: number;
}

export interface CreateRoomResponse {
  room: Room;
  hostToken: string;
  joinUrl: string;
}

export interface JoinRequest {
  nickname?: string;
}

export interface JoinResponse {
  participantId: string;
  participantToken: string;
  room: Room;
}

export interface ReactionRequest {
  emoji: string;
}

export interface ReactionAccepted {
  nextAllowedAt: string;
}

export interface ExtendRequest {
  extraMinutes: number;
}

export interface ClosedRoom {
  room: Room;
  summary: Summary;
}

export interface ProblemDetail {
  field?: string;
  issue?: string;
}

export interface Problem {
  code: string;
  message: string;
  retryAfterSeconds?: number;
  details?: ProblemDetail[];
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public problem: Problem
  ) {
    super(problem.message);
    this.name = 'ApiError';
  }
}
