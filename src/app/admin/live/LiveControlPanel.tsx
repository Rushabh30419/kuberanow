"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  Power,
  PowerOff,
  Radio,
  Wifi,
  WifiOff,
  RefreshCw,
  Loader2,
  Eye,
  Copy,
  Check,
  Cpu,
  Server,
  PlayCircle,
} from "lucide-react";
import {
  Card,
  Button,
  Field,
  inputClass,
  Badge,
} from "@/components/admin/ui";
import {
  disconnectObsAction,
  endLive,
  goLive,
  refreshObsStatus,
  testObsConnection,
  updateLiveConfig,
} from "@/lib/actions";

type Stream = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  startedAt: Date | null;
  endedAt: Date | null;
  obsHost: string | null;
  obsPort: number | null;
  obsPassword: string | null;
  obsConnected: boolean;
  obsScene: string | null;
  rtmpUrl: string | null;
  rtmpKey: string | null;
  hlsUrl: string | null;
  peakViewers: number;
  totalViews: number;
  recordingEnabled: boolean;
};

export default function LiveControlPanel({ stream }: { stream: Stream }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [obsStatus, setObsStatus] = useState<"idle" | "testing" | "connected" | "error">(
    stream.obsConnected ? "connected" : "idle",
  );
  const [obsError, setObsError] = useState<string | null>(null);
  const [obsScene, setObsScene] = useState<string | null>(stream.obsScene);
  const [copied, setCopied] = useState<"rtmp" | "hls" | null>(null);

  const isLive = stream.status === "live";

  const copy = (text: string, which: "rtmp" | "hls") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(which);
        setTimeout(() => setCopied(null), 1500);
      });
    }
  };

  const onSave = (fd: FormData) => {
    setFeedback(null);
    start(async () => {
      const res = (await updateLiveConfig(fd)) as { ok: boolean; error?: string };
      if (res.ok) {
        setFeedback({ kind: "ok", text: "Settings saved." });
        router.refresh();
      } else {
        setFeedback({ kind: "err", text: res.error ?? "Save failed." });
      }
    });
  };

  const onTestObs = () => {
    setObsStatus("testing");
    setObsError(null);
    start(async () => {
      const res = (await testObsConnection()) as { ok: boolean; error?: string; scene?: string };
      if (res.ok) {
        setObsStatus("connected");
        setObsScene(res.scene ?? null);
        router.refresh();
      } else {
        setObsStatus("error");
        setObsError(res.error ?? "Could not reach OBS.");
      }
    });
  };

  const onRefreshObs = () => {
    start(async () => {
      const status = (await refreshObsStatus()) as { connected?: boolean; scene?: string };
      if (status.connected) {
        setObsStatus("connected");
        setObsScene(status.scene ?? null);
      } else {
        setObsStatus("idle");
        setObsScene(null);
      }
      router.refresh();
    });
  };

  const onDisconnectObs = () => {
    start(async () => {
      await disconnectObsAction();
      setObsStatus("idle");
      setObsScene(null);
      router.refresh();
    });
  };

  const onGoLive = () => {
    setFeedback(null);
    start(async () => {
      const res = (await goLive()) as { ok: boolean; error?: string };
      if (res.ok) {
        setFeedback({ kind: "ok", text: "You are live." });
        router.refresh();
      } else {
        setFeedback({ kind: "err", text: res.error ?? "Could not go live." });
      }
    });
  };

  const onEndLive = () => {
    if (!confirm("End the broadcast for all viewers?")) return;
    setFeedback(null);
    start(async () => {
      const res = (await endLive()) as { ok: boolean; error?: string };
      if (res.ok) {
        setFeedback({ kind: "ok", text: "Broadcast ended." });
        router.refresh();
      } else {
        setFeedback({ kind: "err", text: res.error ?? "Could not end the stream." });
      }
    });
  };

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      {/* Configuration form */}
      <div className="lg:col-span-2">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-career-heading">Stream configuration</h3>
          <p className="mt-1 text-xs text-slate-500">
            Where the broadcast goes and how it&apos;s delivered to viewers.
          </p>
          <form action={onSave} className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Stream title">
              <input
                name="title"
                defaultValue={stream.title}
                placeholder="KuberaNow Live"
                className={inputClass}
              />
            </Field>
            <Field label="Public description">
              <input
                name="description"
                defaultValue={stream.description ?? ""}
                placeholder="Weekly market wrap"
                className={inputClass}
              />
            </Field>
            <Field
              label="RTMP ingest URL"
              hint="Where OBS pushes the stream. Default: local MediaMTX container."
            >
              <input
                name="rtmpUrl"
                defaultValue={stream.rtmpUrl ?? ""}
                placeholder="rtmp://localhost:1935/live"
                className={inputClass}
              />
            </Field>
            <Field
              label="RTMP stream key"
              hint="Treated as a secret. Default stream key is 'kubera'."
            >
              <input
                name="rtmpKey"
                type="password"
                defaultValue={stream.rtmpKey ?? ""}
                placeholder="kubera"
                className={inputClass}
              />
            </Field>
            <Field
              label="HLS playback URL"
              hint="The .m3u8 manifest the public player will load. Default: local MediaMTX."
            >
              <input
                name="hlsUrl"
                defaultValue={stream.hlsUrl ?? ""}
                placeholder="http://localhost:8888/live/kubera/index.m3u8"
                className={inputClass}
              />
            </Field>
            <label className="flex items-start gap-2 self-end pb-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="recordingEnabled"
                defaultChecked={stream.recordingEnabled}
                className="mt-0.5 size-4 rounded border-slate-300 text-primary-navy focus:ring-primary-navy"
              />
              <span>
                <span className="font-semibold text-slate-800">Enable recording</span>
                <span className="block text-xs text-slate-500">
                  The CDN will store a VOD of every live session.
                </span>
              </span>
            </label>
            <div className="sm:col-span-2 flex items-center gap-2">
              <Button type="submit" icon={Save} disabled={pending}>
                {pending ? "Saving…" : "Save settings"}
              </Button>
              {feedback && (
                <span
                  role="status"
                  className={`text-xs font-semibold ${
                    feedback.kind === "ok" ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {feedback.text}
                </span>
              )}
            </div>
          </form>
        </Card>
      </div>

      {/* Right column: controls + status */}
      <div className="space-y-4">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-career-heading">Go live</h3>
          <p className="mt-1 text-xs text-slate-500">
            {isLive
              ? "The broadcast is on air. Click below to end it for everyone."
              : "When you go live, the public /live page starts streaming."}
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {isLive ? (
              <Button
                onClick={onEndLive}
                disabled={pending}
                icon={PowerOff}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                End broadcast
              </Button>
            ) : (
              <Button
                onClick={onGoLive}
                disabled={pending || !stream.hlsUrl}
                icon={Power}
              >
                {pending ? "Going live…" : "Go live"}
              </Button>
            )}
            <Badge color={isLive ? "green" : "slate"}>
              {isLive ? "Broadcasting now" : "Not broadcasting"}
            </Badge>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-career-heading">
            <Cpu className="size-4 text-primary-navy" /> OBS WebSocket
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Reads the current OBS scene and stream state.
          </p>
          <div className="mt-3 space-y-2 text-xs">
            <KV k="Host" v={stream.obsHost ?? "—"} />
            <KV k="Port" v={stream.obsPort?.toString() ?? "4455"} />
            <KV
              k="Status"
              v={
                obsStatus === "connected" ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                    <Wifi className="size-3" /> Connected
                  </span>
                ) : obsStatus === "testing" ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
                    <Loader2 className="size-3 animate-spin" /> Testing…
                  </span>
                ) : obsStatus === "error" ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-red-700">
                    <WifiOff className="size-3" /> {obsError ?? "Failed"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-500">
                    <WifiOff className="size-3" /> Disconnected
                  </span>
                )
              }
            />
            <KV k="Scene" v={obsScene ?? "—"} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onTestObs}
              disabled={pending || !stream.obsHost}
              icon={RefreshCw}
            >
              Test connection
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onRefreshObs}
              disabled={pending || obsStatus !== "connected"}
              icon={Radio}
            >
              Refresh
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onDisconnectObs}
              disabled={pending || obsStatus !== "connected"}
              icon={PowerOff}
            >
              Disconnect
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-career-heading">
            <Eye className="size-4 text-primary-navy" /> Viewer stats
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
                Current
              </p>
              <p className="mt-1 text-2xl font-bold text-career-heading">
                {stream.peakViewers.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
                Total views
              </p>
              <p className="mt-1 text-2xl font-bold text-career-heading">
                {stream.totalViews.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-500">
            The counter above tracks viewer heartbeats on the public /live page. The CDN
            handles the actual video fan-out to millions of viewers at the edge.
          </p>
        </Card>

        <Card className="p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-career-heading">
            <Server className="size-4 text-primary-navy" /> Quick links
          </h3>
          <div className="mt-3 grid gap-2 text-sm">
            {stream.rtmpUrl && (
              <button
                onClick={() => copy(stream.rtmpUrl!, "rtmp")}
                className="inline-flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs hover:bg-slate-100"
              >
                <span className="line-clamp-1 flex-1 font-mono text-slate-700">{stream.rtmpUrl}</span>
                {copied === "rtmp" ? (
                  <Check className="size-4 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5 text-slate-400" />
                )}
              </button>
            )}
            {stream.hlsUrl && (
              <button
                onClick={() => copy(stream.hlsUrl!, "hls")}
                className="inline-flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs hover:bg-slate-100"
              >
                <span className="line-clamp-1 flex-1 font-mono text-slate-700">{stream.hlsUrl}</span>
                {copied === "hls" ? (
                  <Check className="size-4 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5 text-slate-400" />
                )}
              </button>
            )}
            <Link
              href="/live"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-blue-700 hover:underline"
            >
              <PlayCircle className="size-4" /> Open public /live page
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-slate-100 pb-1 last:border-0">
      <span className="text-slate-500">{k}</span>
      <span className="text-right font-semibold text-slate-800">{v}</span>
    </div>
  );
}
