"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Server, Container, PlayCircle, Loader2, AlertTriangle, ExternalLink } from "lucide-react";
import { Card, Badge } from "@/components/admin/ui";

type IngestStatus = {
  running: boolean;
  apiReachable: boolean;
  publishing: boolean;
  activePaths: string[];
  apiBaseUrl: string;
  error?: string;
};

type Props = {
  defaults: {
    rtmpUrl: string;
    rtmpKey: string;
    hlsUrl: string;
  };
};

export default function IngestPanel({ defaults }: Props) {
  const [status, setStatus] = useState<IngestStatus | null>(null);
  const [copied, setCopied] = useState<"server" | "key" | "hls" | "compose" | null>(null);
  const [showKey, setShowKey] = useState(false);

  // Poll the local RTMP ingester so the pill is always live.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/live/ingest-status", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as IngestStatus;
        if (!cancelled) setStatus(data);
      } catch {
        /* ignore — we'll retry on next interval */
      }
    };
    load();
    const interval = setInterval(load, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const copy = (text: string, which: "server" | "key" | "hls" | "compose") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(which);
        setTimeout(() => setCopied(null), 1500);
      });
    }
  };

  const composeCmd = "docker compose up -d mediamtx";

  return (
    <Card className="mt-6 p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-career-heading">
            <Container className="size-4 text-primary-navy" />
            OBS ingest (local RTMP server)
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Copy these into <strong>OBS Studio → Settings → Stream</strong> and click
            &quot;Start Streaming&quot;. The default server runs in Docker on this machine.
          </p>
        </div>
        <IngestStatusBadge status={status} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <CopyField
          label="Server (paste into OBS)"
          value={defaults.rtmpUrl}
          onCopy={() => copy(defaults.rtmpUrl, "server")}
          copied={copied === "server"}
          mono
        />
        <CopyField
          label="Stream key (paste into OBS)"
          value={defaults.rtmpKey}
          onCopy={() => copy(defaults.rtmpKey, "key")}
          copied={copied === "key"}
          mono
          masked={!showKey}
          onToggleMask={() => setShowKey((v) => !v)}
        />
        <CopyField
          label="HLS playback (auto-filled on /live)"
          value={defaults.hlsUrl}
          onCopy={() => copy(defaults.hlsUrl, "hls")}
          copied={copied === "hls"}
          mono
        />
      </div>

      {/* Inline setup instructions when the ingester is down */}
      {status && !status.running && (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3">
          <p className="flex items-start gap-2 text-sm font-medium text-amber-900">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            The local RTMP server is not running.
          </p>
          <p className="mt-1 text-xs text-amber-800">
            Start it with the command below, then refresh this page. The status pill
            will turn green when OBS can push to it.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 overflow-x-auto rounded bg-white px-3 py-2 font-mono text-xs text-slate-800 ring-1 ring-amber-200">
              {composeCmd}
            </code>
            <button
              onClick={() => copy(composeCmd, "compose")}
              className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-white px-2.5 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100"
              type="button"
            >
              {copied === "compose" ? (
                <Check className="size-3.5 text-emerald-600" />
              ) : (
                <Copy className="size-3.5" />
              )}
              {copied === "compose" ? "Copied" : "Copy"}
            </button>
          </div>
          {status.error && (
            <p className="mt-2 text-[11px] text-amber-700">
              Probed <code>{status.apiBaseUrl}</code> — {status.error}
            </p>
          )}
        </div>
      )}

      {status?.running && status.publishing && (
        <div className="mt-4 flex items-center justify-between gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs">
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-800">
            <span className="inline-block size-2 animate-pulse rounded-full bg-emerald-500" />
            OBS is pushing to <code>{defaults.rtmpUrl}/{defaults.rtmpKey}</code>
          </span>
          <a
            href="/live"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:underline"
          >
            <PlayCircle className="size-3.5" /> Open /live
            <ExternalLink className="size-3" />
          </a>
        </div>
      )}
    </Card>
  );
}

function IngestStatusBadge({ status }: { status: IngestStatus | null }) {
  if (!status) {
    return (
      <Badge color="slate">
        <Loader2 className="mr-1 inline size-3 animate-spin" /> Checking…
      </Badge>
    );
  }
  if (status.publishing) {
    return (
      <Badge color="green">
        <span className="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-emerald-600" />
        OBS pushing
      </Badge>
    );
  }
  if (status.running) {
    return (
      <Badge color="cyan">
        <Server className="mr-1 inline size-3" /> Server running
      </Badge>
    );
  }
  return (
    <Badge color="amber">
      <AlertTriangle className="mr-1 inline size-3" /> Server not running
    </Badge>
  );
}

function CopyField({
  label,
  value,
  onCopy,
  copied,
  mono,
  masked,
  onToggleMask,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  mono?: boolean;
  masked?: boolean;
  onToggleMask?: () => void;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
        {label}
      </span>
      <div className="mt-1 flex items-stretch gap-1">
        <input
          readOnly
          value={value}
          type={masked ? "password" : "text"}
          onFocus={(e) => e.currentTarget.select()}
          className={`flex-1 rounded-md border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs ${
            mono ? "font-mono" : ""
          } text-slate-800 focus:border-primary-navy focus:ring-1 focus:ring-primary-navy focus:outline-none`}
        />
        {onToggleMask && (
          <button
            type="button"
            onClick={onToggleMask}
            className="rounded-md border border-slate-300 bg-white px-2 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
            aria-label={masked ? "Show stream key" : "Hide stream key"}
          >
            {masked ? "Show" : "Hide"}
          </button>
        )}
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-600" />
          ) : (
            <Copy className="size-3.5 text-slate-500" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
