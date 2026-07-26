/**
 * Live streaming utilities.
 *
 * Talks to OBS Studio over its WebSocket v5 protocol (no npm dependency
 * required — Node 22+ has a global WebSocket implementation). Also exposes
 * helpers for the viewer-count heartbeat and stream-status snapshot.
 *
 * The actual video delivery happens at the CDN you point the HLS URL at
 * (Cloudflare Stream, AWS IVS, Mux, etc.). This module is only responsible
 * for:
 *   1. connecting to OBS to read its current scene and stream status;
 *   2. writing the per-viewer heartbeat into the database so the admin
 *      control panel can show a real-time viewer count;
 *   3. exposing a small status snapshot for the public /live page.
 */

import { prisma } from "./db";

// ─── OBS WebSocket (v5) client ───────────────────────────────────────────

export type ObsConfig = {
  host: string;
  port: number;
  password?: string;
};

export type ObsResult = {
  ok: boolean;
  scene?: string;
  streaming?: boolean;
  error?: string;
};

// OBS WebSocket v5 op codes
const OpCode = {
  Hello: 0,
  Identify: 1,
  Identified: 2,
  Event: 5,
  Request: 7,
  Response: 9,
} as const;

type Pending = {
  resolve: (v: unknown) => void;
  reject: (e: Error) => void;
};

let currentSocket: WebSocket | null = null;
let currentScene: string | undefined;
let currentStreaming: boolean | undefined;
const pendingRequests = new Map<string, Pending>();
let helloPayload: { authRequired: boolean; salt?: string; challenge?: string } | null = null;
let identified = false;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let lastConfig: ObsConfig | null = null;
let intendedDisconnect = false;

function base64ToBytes(b64: string): Uint8Array {
  return new Uint8Array(Buffer.from(b64, "base64"));
}

function sha256Base64(data: Uint8Array): string {
  // Use Node's crypto for a stable sync API; returns a base64 string.
  const nodeCrypto = nodeCryptoModule();
  return nodeCrypto.createHash("sha256").update(Buffer.from(data)).digest("base64");
}

function nodeCryptoModule(): typeof import("node:crypto") {
  // Lazy require so the module isn't evaluated in edge / browser contexts.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("node:crypto");
}

function buildAuth(password: string, salt: string, challenge: string): string {
  // OBS v5 auth:
  //   auth1 = base64(sha256(secret + salt))
  //   auth   = base64(sha256(auth1 + challenge))
  const enc = new TextEncoder();
  const secretBytes = enc.encode(password);
  const saltBytes = base64ToBytes(salt);
  const concat1 = new Uint8Array(secretBytes.length + saltBytes.length);
  concat1.set(secretBytes, 0);
  concat1.set(saltBytes, secretBytes.length);
  const auth1 = sha256Base64(concat1);
  const auth1Bytes = enc.encode(auth1);
  const challengeBytes = base64ToBytes(challenge);
  const concat2 = new Uint8Array(auth1Bytes.length + challengeBytes.length);
  concat2.set(auth1Bytes, 0);
  concat2.set(challengeBytes, auth1Bytes.length);
  return sha256Base64(concat2);
}

function sendIdentify(ws: WebSocket, password?: string): void {
  const payload: Record<string, unknown> = { rpcVersion: 1 };
  if (password && helloPayload?.authRequired && helloPayload.salt && helloPayload.challenge) {
    payload.auth = buildAuth(password, helloPayload.salt, helloPayload.challenge);
  }
  ws.send(JSON.stringify({ op: OpCode.Identify, d: payload }));
}

function sendRequest(ws: WebSocket, type: string, requestData?: unknown): Promise<any> {
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();
    pendingRequests.set(id, { resolve, reject });
    ws.send(JSON.stringify({ op: OpCode.Request, d: { requestType: type, requestId: id, requestData } }));
    setTimeout(() => {
      if (pendingRequests.has(id)) {
        pendingRequests.delete(id);
        reject(new Error(`OBS request ${type} timed out`));
      }
    }, 5000);
  });
}

// OBS v5 messages are deeply nested and use unstructured payloads; the
// shape is not worth typing strictly here. `any` is appropriate for an
// external protocol we don't own.
/* eslint-disable @typescript-eslint/no-explicit-any */
type ObsMessage = { op?: number; d?: any };

function handleMessage(raw: string): void {
  let msg: ObsMessage;
  try {
    msg = JSON.parse(raw) as ObsMessage;
  } catch {
    return;
  }
  switch (msg.op) {
    case OpCode.Hello:
      helloPayload = {
        authRequired: !!msg.d?.authentication,
        salt: msg.d?.authentication?.salt,
        challenge: msg.d?.authentication?.challenge,
      };
      identified = false;
      if (currentSocket) {
        sendIdentify(currentSocket, lastConfig?.password);
      }
      break;
    case OpCode.Identified:
      identified = true;
      break;
    case OpCode.Response: {
      const id = msg.d?.requestId;
      const pending = pendingRequests.get(id);
      if (pending) {
        pendingRequests.delete(id);
        if (msg.d?.requestStatus?.result) {
          pending.resolve(msg.d?.responseData ?? {});
        } else {
          pending.reject(new Error(msg.d?.requestStatus?.comment ?? "OBS request failed"));
        }
      }
      break;
    }
    case OpCode.Event: {
      if (msg.d?.eventType === "CurrentProgramSceneChanged") {
        const eventData = msg.d.eventData as { sceneName?: string } | undefined;
        currentScene = eventData?.sceneName;
      } else if (msg.d?.eventType === "StreamStateChanged") {
        const eventData = msg.d.eventData as { outputActive?: boolean } | undefined;
        currentStreaming = !!eventData?.outputActive;
      }
      break;
    }
  }
}

export async function connectObs(cfg: ObsConfig): Promise<ObsResult> {
  intendedDisconnect = false;
  lastConfig = cfg;
  await disconnectObs();
  const url = `ws://${cfg.host}:${cfg.port}`;
  return new Promise((resolve) => {
    let resolved = false;
    const finish = (r: ObsResult) => {
      if (resolved) return;
      resolved = true;
      resolve(r);
    };
    try {
      const ws = new WebSocket(url);
      currentSocket = ws;
      ws.onopen = () => {
        // Hello arrives next; identify is sent from handleMessage.
      };
      ws.onmessage = (e) => handleMessage(String(e.data));
      ws.onerror = () => {
        finish({
          ok: false,
          error:
            "Could not connect to OBS WebSocket. Is OBS running and the WebSocket server enabled?",
        });
      };
      ws.onclose = () => {
        currentSocket = null;
        identified = false;
        if (!intendedDisconnect && lastConfig) {
          if (reconnectTimer) clearTimeout(reconnectTimer);
          reconnectTimer = setTimeout(() => {
            if (lastConfig && !intendedDisconnect) {
              connectObs(lastConfig).catch(() => undefined);
            }
          }, 5000);
        }
      };

      const checkTimer = setInterval(async () => {
        if (!identified || resolved) return;
        clearInterval(checkTimer);
        try {
          const sceneRes = await sendRequest(ws, "GetCurrentProgramScene");
          currentScene = sceneRes?.currentProgramSceneName;
          try {
            const statusRes = await sendRequest(ws, "GetStreamStatus");
            currentStreaming = !!statusRes?.outputActive;
          } catch {
            currentStreaming = false;
          }
          finish({ ok: true, scene: currentScene, streaming: currentStreaming });
        } catch (e) {
          finish({ ok: false, error: (e as Error).message });
        }
      }, 100);
    } catch (e) {
      finish({ ok: false, error: (e as Error).message });
    }
  });
}

export async function disconnectObs(): Promise<void> {
  intendedDisconnect = true;
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (currentSocket) {
    try {
      currentSocket.close();
    } catch {
      /* ignore */
    }
    currentSocket = null;
  }
  identified = false;
  currentScene = undefined;
  currentStreaming = undefined;
}

export async function getObsStatus(): Promise<{ connected: boolean; scene?: string; streaming?: boolean }> {
  return {
    connected: !!currentSocket && identified,
    scene: currentScene,
    streaming: currentStreaming,
  };
}

// ─── Viewer count helpers ─────────────────────────────────────────────────

const VIEWER_TIMEOUT_MS = 60_000; // consider a viewer gone after 60 s of silence

export async function recordViewerHeartbeat(viewerId: string, userAgent?: string) {
  await prisma.liveStreamViewer.upsert({
    where: { id: viewerId },
    create: { id: viewerId, sessionId: viewerId, userAgent: userAgent ?? null, lastSeen: new Date() },
    update: { lastSeen: new Date() },
  });
  const cutoff = new Date(Date.now() - VIEWER_TIMEOUT_MS);
  await prisma.liveStreamViewer.deleteMany({ where: { lastSeen: { lt: cutoff } } });
}

export async function getLiveViewerStats() {
  const cutoff = new Date(Date.now() - VIEWER_TIMEOUT_MS);
  const [current, stream] = await Promise.all([
    prisma.liveStreamViewer.count({ where: { lastSeen: { gte: cutoff } } }),
    prisma.liveStream.findUnique({ where: { id: "singleton" } }),
  ]);
  if (stream && current > stream.peakViewers) {
    await prisma.liveStream.update({
      where: { id: "singleton" },
      data: { peakViewers: current },
    });
  }
  return {
    status: stream?.status ?? "offline",
    title: stream?.title ?? "KuberaNow Live",
    description: stream?.description ?? null,
    hlsUrl: stream?.hlsUrl ?? null,
    recordingUrl: stream?.recordingUrl ?? null,
    currentViewers: current,
    peakViewers: Math.max(stream?.peakViewers ?? 0, current),
    obsConnected: stream?.obsConnected ?? false,
    obsScene: stream?.obsScene ?? null,
  };
}

// ─── Local RTMP ingester (MediaMTX) ──────────────────────────────────────

/**
 * Default values for the local Docker-hosted RTMP ingester.
 *
 * These are what the control panel renders as one-click copy buttons, and
 * what OBS Studio needs to start streaming to KuberaNow without a CDN.
 * They can be overridden via the form or via the LIVE_RTMP_URL / LIVE_RTMP_KEY /
 * LIVE_HLS_URL environment variables.
 */
export const DEFAULT_INGEST = {
  rtmpUrl: process.env.LIVE_RTMP_URL ?? "rtmp://localhost:1935/live",
  rtmpKey: process.env.LIVE_RTMP_KEY ?? "kubera",
  hlsUrl: process.env.LIVE_HLS_URL ?? "http://localhost:8888/live/kubera/index.m3u8",
} as const;

export type IngestStatus = {
  /** Whether the MediaMTX Docker container is reachable on its API port. */
  running: boolean;
  /** Whether the API call succeeded. */
  apiReachable: boolean;
  /** True if the configured stream key is currently being published. */
  publishing: boolean;
  /** Active paths reported by the ingester (e.g. "live/kubera"). */
  activePaths: string[];
  /** Where the API was probed. */
  apiBaseUrl: string;
  /** Plain-text error message if probing failed. */
  error?: string;
};

/**
 * Probes the local MediaMTX container's API to see whether the ingester is
 * running and whether OBS is currently pushing the configured stream key.
 *
 * The Next.js app never proxies the video — this is just a TCP-style ping
 * against the management API (`http://localhost:9997`).
 */
export async function checkIngestServer(): Promise<IngestStatus> {
  const apiBase =
    process.env.LIVE_INGEST_API_URL ?? "http://localhost:9997";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1500);
  try {
    const res = await fetch(`${apiBase}/v3/paths/list`, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    if (!res.ok) {
      return {
        running: false,
        apiReachable: false,
        publishing: false,
        activePaths: [],
        apiBaseUrl: apiBase,
        error: `MediaMTX API returned HTTP ${res.status}.`,
      };
    }
    const json = (await res.json()) as {
      items?: Array<{ name: string; ready?: boolean }>;
    };
    const items = json.items ?? [];
    const activePaths = items.filter((p) => p.ready).map((p) => p.name);
    const publishing = activePaths.some((p) => p.endsWith(`/${DEFAULT_INGEST.rtmpKey}`));
    return {
      running: true,
      apiReachable: true,
      publishing,
      activePaths,
      apiBaseUrl: apiBase,
    };
  } catch (e) {
    clearTimeout(timer);
    const err = e as Error;
    const reachable = !err.message.includes("fetch failed");
    return {
      running: false,
      apiReachable: reachable,
      publishing: false,
      activePaths: [],
      apiBaseUrl: apiBase,
      error: err.name === "AbortError" ? "MediaMTX API timed out" : err.message,
    };
  }
}
