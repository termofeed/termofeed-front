/**
 * Tipos de eventos WebSocket baseados estritamente em asyncapi.yaml
 */
import { Summary } from './types';

export interface ReactionCreatedEvent {
  type: 'reaction.created';
  emoji: string;
  at: string;
}

export interface SummaryUpdatedEvent {
  type: 'summary.updated';
  windows: {
    '30s': Summary;
    '1m': Summary;
    '5m': Summary;
    [window: string]: Summary;
  };
}

export interface ParticipantsChangedEvent {
  type: 'participants.changed';
  participantCount: number;
}

export interface RoomExpiringEvent {
  type: 'room.expiring';
  expiresAt: string;
  secondsLeft: number;
}

export interface RoomExtendedEvent {
  type: 'room.extended';
  expiresAt: string;
  extraMinutes: number;
}

export interface RoomClosedEvent {
  type: 'room.closed';
  reason: 'host' | 'timeout';
  endedAt: string;
  summary: Summary;
}

export type RoomWebSocketEvent =
  | ReactionCreatedEvent
  | SummaryUpdatedEvent
  | ParticipantsChangedEvent
  | RoomExpiringEvent
  | RoomExtendedEvent
  | RoomClosedEvent;
