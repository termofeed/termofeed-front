/**
 * This file was generated from openapi.yaml
 * Do not make direct changes to the file.
 */

export interface paths {
  "/rooms": {
    post: operations["createRoom"];
  };
  "/rooms/{code}": {
    get: operations["getRoom"];
  };
  "/rooms/{code}/join": {
    post: operations["joinRoom"];
  };
  "/rooms/{code}/reactions": {
    post: operations["sendReaction"];
  };
  "/rooms/{code}/summary": {
    get: operations["getSummary"];
  };
  "/rooms/{code}/extend": {
    post: operations["extendRoom"];
  };
  "/rooms/{code}/close": {
    post: operations["closeRoom"];
  };
  "/rooms/{code}/ws": {
    get: operations["connectWebSocket"];
  };
}

export interface components {
  schemas: {
    CreateRoomRequest: {
      name?: string;
      durationMinutes: number;
      reactionCooldownSeconds?: number;
      allowedEmojis?: string[];
      maxParticipants?: number;
    };
    CreateRoomResponse: {
      room: components["schemas"]["Room"];
      hostToken: string;
      joinUrl: string;
    };
    Room: {
      code: string;
      name?: string;
      status: "active" | "ended";
      createdAt: string;
      expiresAt: string;
      totalDurationMinutes?: number;
      reactionCooldownSeconds: number;
      allowedEmojis: string[];
      participantCount: number;
      maxParticipants?: number;
      endedAt?: string | null;
      endedReason?: "host" | "timeout" | null;
    };
    JoinRequest: {
      nickname?: string;
    };
    JoinResponse: {
      participantId: string;
      participantToken: string;
      room: components["schemas"]["Room"];
    };
    ReactionRequest: {
      emoji: string;
    };
    ReactionAccepted: {
      nextAllowedAt: string;
    };
    ExtendRequest: {
      extraMinutes: number;
    };
    EmojiCount: {
      emoji: string;
      count: number;
      percentage: number;
    };
    Summary: {
      window: "30s" | "1m" | "5m" | "all";
      from: string;
      to: string;
      totalReactions: number;
      dominantEmoji: string | null;
      ranking: components["schemas"]["EmojiCount"][];
    };
    ClosedRoom: {
      room: components["schemas"]["Room"];
      summary: components["schemas"]["Summary"];
    };
    Problem: {
      code: string;
      message: string;
      retryAfterSeconds?: number;
      details?: {
        field?: string;
        issue?: string;
      }[];
    };
  };
  responses: {
    ValidationError: {
      content: {
        "application/json": components["schemas"]["Problem"];
      };
    };
    Unauthorized: {
      content: {
        "application/json": components["schemas"]["Problem"];
      };
    };
    NotFound: {
      content: {
        "application/json": components["schemas"]["Problem"];
      };
    };
    Gone: {
      content: {
        "application/json": components["schemas"]["Problem"];
      };
    };
  };
  parameters: {
    RoomCode: string;
  };
}

export interface operations {
  createRoom: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateRoomRequest"];
      };
    };
    responses: {
      201: {
        content: {
          "application/json": components["schemas"]["CreateRoomResponse"];
        };
      };
      400: components["responses"]["ValidationError"];
    };
  };
  getRoom: {
    parameters: {
      path: {
        code: components["parameters"]["RoomCode"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["Room"];
        };
      };
      404: components["responses"]["NotFound"];
      410: components["responses"]["Gone"];
    };
  };
  joinRoom: {
    parameters: {
      path: {
        code: components["parameters"]["RoomCode"];
      };
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["JoinRequest"];
      };
    };
    responses: {
      201: {
        content: {
          "application/json": components["schemas"]["JoinResponse"];
        };
      };
      404: components["responses"]["NotFound"];
      409: {
        content: {
          "application/json": components["schemas"]["Problem"];
        };
      };
      410: components["responses"]["Gone"];
    };
  };
  sendReaction: {
    parameters: {
      path: {
        code: components["parameters"]["RoomCode"];
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ReactionRequest"];
      };
    };
    responses: {
      202: {
        content: {
          "application/json": components["schemas"]["ReactionAccepted"];
        };
      };
      400: {
        content: {
          "application/json": components["schemas"]["Problem"];
        };
      };
      401: components["responses"]["Unauthorized"];
      409: {
        content: {
          "application/json": components["schemas"]["Problem"];
        };
      };
      429: {
        headers: {
          "Retry-After"?: number;
        };
        content: {
          "application/json": components["schemas"]["Problem"];
        };
      };
    };
  };
  getSummary: {
    parameters: {
      query?: {
        window?: "30s" | "1m" | "5m" | "all";
      };
      path: {
        code: components["parameters"]["RoomCode"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["Summary"];
        };
      };
      404: components["responses"]["NotFound"];
      410: components["responses"]["Gone"];
    };
  };
  extendRoom: {
    parameters: {
      path: {
        code: components["parameters"]["RoomCode"];
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ExtendRequest"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["Room"];
        };
      };
      401: components["responses"]["Unauthorized"];
      409: {
        content: {
          "application/json": components["schemas"]["Problem"];
        };
      };
    };
  };
  closeRoom: {
    parameters: {
      path: {
        code: components["parameters"]["RoomCode"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["ClosedRoom"];
        };
      };
      401: components["responses"]["Unauthorized"];
    };
  };
  connectWebSocket: {
    parameters: {
      query: {
        token: string;
      };
      path: {
        code: components["parameters"]["RoomCode"];
      };
    };
    responses: {
      101: never;
      401: components["responses"]["Unauthorized"];
      404: components["responses"]["NotFound"];
    };
  };
}
