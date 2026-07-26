"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import { Eye, PlayCircle, Radio } from "lucide-react";

type Status = {
  status: "offline" | "live" | "paused" | "error";
  title: string;
  description: string | null;
  hlsUrl: string | null;
  recordingUrl: string | null;
  currentViewers: number;
  peakViewers: number;
  obsConnected: boolean;
};

const VIEWER_COOKIE_KEY = "kubera_live_vid";
const HEARTBEAT_INTERVAL_MS = 20_000;
const STATUS_REFRESH_MS = 15_000;

function getOrCreateViewerId(): string {
  if (typeof document === "undefined") return "ssr";
  const existing = readCookie(VIEWER_COOKIE_KEY);
  if (existing) return existing;
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  document.cookie = `${VIEWER_COOKIE_KEY}=${id}; path=/; max-age=86400; SameSite=Lax`;
  return id;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}

export default function LivePlayer({
  hlsUrl,
}: {
  hlsUrl: string | null;
  description?: string | null;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check HLS support once at render time so we don't call setState inside
  // the HLS-attach effect. `true` on Safari / iOS, `false` elsewhere unless
  // hls.js's MediaSource is available.
  const hlsSupport = useMemo(() => {
    if (typeof document === "undefined") return true;
    const v = document.createElement("video");
    if (v.canPlayType("application/vnd.apple.mpegurl")) return true;
    if (typeof Hls !== "undefined" && Hls.isSupported()) return true;
    return false;
  }, []);

  // Heartbeat: report this viewer every 20 s while the tab is open.
  useEffect(() => {
    const viewerId = getOrCreateViewerId();
    const beat = () => {
      fetch("/api/live/heartbeat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ viewerId }),
        keepalive: true,
      }).catch(() => undefined);
    };
    beat();
    const id = setInterval(beat, HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // Status polling.
  useEffect(() => {
    let cancelled = false;
    const pull = async () => {
      try {
        const res = await fetch("/api/live/status", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as Status;
        if (!cancelled) setStatus(data);
      } catch {
        /* ignore */
      }
    };
    pull();
    const id = setInterval(pull, STATUS_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // HLS attach.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hlsUrl || !hlsSupport) return;
    let hls: Hls | null = null;

    const native = video.canPlayType("application/vnd.apple.mpegurl");
    if (native) {
      video.src = hlsUrl;
    } else {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (data.fatal) {
          setError(
            data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR
              ? "Stream is not available yet. Please check back shortly."
              : "Playback error. Please refresh.",
          );
        }
      });
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [hlsUrl, hlsSupport]);

  const live = status?.status === "live" && !!hlsUrl;

  return (
    <div className="bg-black">
      <div className="relative aspect-video w-full">
        {live && hlsSupport ? (
          <video
            ref={videoRef}
            className="h-full w-full bg-black"
            controls
            autoPlay
            muted
            playsInline
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-900 px-6 text-center text-slate-200">
            <Radio className="size-12 text-slate-500" />
            <p className="mt-4 text-lg font-semibold">
              {status?.status === "paused" ? "Stream paused" : "We're not live right now"}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {status?.status === "offline"
                ? "Check back soon. The next broadcast will appear here automatically."
                : "Please stand by — the stream will resume shortly."}
            </p>
          </div>
        )}

        {error && (
          <div className="absolute inset-x-0 bottom-0 bg-red-600/90 px-4 py-2 text-center text-sm text-white">
            {error}
          </div>
        )}

        {/* Render a fallback error overlay when the browser truly cannot
            play HLS — this is computed at render time, not in an effect. */}
        {live && !hlsSupport && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 text-center text-slate-200">
            <div className="max-w-sm">
              <p className="text-lg font-semibold">Your browser doesn&apos;t support HLS playback.</p>
              <p className="mt-1 text-sm text-slate-400">
                Please try the latest Chrome, Firefox, Safari, or Edge.
              </p>
            </div>
          </div>
        )}

        {/* Floating "LIVE" + viewer count badge */}
        {live && (
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
              <span className="inline-block size-1.5 animate-pulse rounded-full bg-white" />
              LIVE
            </span>
          </div>
        )}
        {status && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white">
            <Eye className="size-3.5" />
            {status.currentViewers.toLocaleString()} watching
          </div>
        )}
      </div>

      {/* Footer: status + peak + REC indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-slate-900 px-4 py-3 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <PlayCircle className="size-4" />
            {status?.title ?? "KuberaNow Live"}
          </span>
          {status?.obsConnected && (
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400" /> OBS connected
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span>Peak: {(status?.peakViewers ?? 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
