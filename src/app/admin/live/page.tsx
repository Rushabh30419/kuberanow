import { Radio, ExternalLink, Info, Activity, Eye, Cpu, Server, ListChecks } from "lucide-react";
import Link from "next/link";
import { requirePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { PageHeader, Card, Badge } from "@/components/admin/ui";
import { DEFAULT_INGEST } from "@/lib/live";
import LiveControlPanel from "./LiveControlPanel";
import IngestPanel from "./IngestPanel";

export const dynamic = "force-dynamic";

export default async function AdminLivePage() {
  await requirePermission("live.view");

  // Ensure the singleton row exists so the form can render existing values.
  const stream = await prisma.liveStream.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  // Pull a few recent sessions for the history list.
  const sessions = await prisma.liveStreamSession.findMany({
    orderBy: { startedAt: "desc" },
    take: 5,
  });

  const status = stream.status;
  const isLive = status === "live";

  return (
    <div>
      <PageHeader
        title="Live control panel"
        subtitle="Connect OBS Studio and stream to a global audience via a CDN."
        actions={
          <Link
            href="/live"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ExternalLink className="size-3.5" /> Open public live page
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Status"
          value={
            <span className="inline-flex items-center gap-1.5">
              <span
                className={`inline-block size-2 rounded-full ${
                  isLive ? "bg-emerald-500" : "bg-slate-400"
                } ${isLive ? "animate-pulse" : ""}`}
                aria-hidden
              />
              {isLive ? "On Air" : status === "paused" ? "Paused" : "Offline"}
            </span>
          }
          color={isLive ? "green" : "slate"}
          icon={Radio}
        />
        <Stat
          label="OBS connection"
          value={stream.obsConnected ? "Connected" : "Disconnected"}
          color={stream.obsConnected ? "green" : "slate"}
          icon={Cpu}
        />
        <Stat
          label="Current scene"
          value={stream.obsScene ?? "—"}
          color="navy"
          icon={Activity}
        />
        <Stat
          label="Peak viewers (this session)"
          value={stream.peakViewers.toLocaleString()}
          color="cyan"
          icon={Eye}
        />
      </div>

      <Card className="mt-6 p-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-career-heading">
          <Info className="size-4 text-primary-navy" />
          How this scales
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Out of the box, a local <strong>MediaMTX</strong> container accepts RTMP from
          OBS and re-packages it to HLS for the public <code>/live</code> page — fine for
          a single studio or development. For production, point the{" "}
          <strong>RTMP ingest URL</strong> at a CDN endpoint (e.g.{" "}
          <code>rtmps://live.cloudflare.com:443/live/</code>) and use the matching
          <strong> HLS playback URL</strong>{" "}
          (<code>https://customer-&lt;id&gt;.cloudflarestream.com/&lt;id&gt;/manifest/video.m3u8</code>).
          OBS pushes a single RTMP stream to the CDN; the CDN fans it out to{" "}
          <strong>10&nbsp;M+ viewers</strong> via HLS at the edge. Your origin server is
          freed from video bandwidth.
        </p>
        <ul className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
          <li>• Local default: MediaMTX in Docker, RTMP on <code>1935</code>, HLS on <code>8888</code>.</li>
          <li>• Recommended providers: Cloudflare Stream, AWS IVS, Mux, Brightcove, Wowza.</li>
          <li>• Adaptive bitrate (HLS) lets the CDN adapt per viewer bandwidth.</li>
          <li>• Edge caches mean a single origin stream serves millions of viewers.</li>
        </ul>
      </Card>

      <LiveControlPanel stream={stream} />

      <IngestPanel defaults={DEFAULT_INGEST} />

      {sessions.length > 0 && (
        <Card className="mt-6 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-career-heading">
            <ListChecks className="size-4 text-primary-navy" />
            Recent sessions
          </h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  <th className="py-2 pr-3">Title</th>
                  <th className="py-2 pr-3">Started</th>
                  <th className="py-2 pr-3">Ended</th>
                  <th className="py-2 pr-3 text-right">Peak viewers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessions.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2 pr-3 text-slate-700">{s.title}</td>
                    <td className="py-2 pr-3 text-xs text-slate-500">
                      {new Date(s.startedAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-3 text-xs text-slate-500">
                      {s.endedAt ? new Date(s.endedAt).toLocaleString() : "—"}
                    </td>
                    <td className="py-2 pr-3 text-right text-slate-700">
                      {s.peakViewers.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card className="mt-6 p-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-career-heading">
          <Server className="size-4 text-primary-navy" />
          Setup checklist
        </h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-600">
          <li>
            Start the local RTMP ingester (one-time):{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5">docker compose up -d mediamtx</code>.
            The <strong>OBS ingest</strong> card above will turn green when it is reachable.
          </li>
          <li>
            In OBS Studio, open <strong>Settings → Stream</strong>, set the service to
            &quot;Custom…&quot;, and paste the <strong>Server URL</strong> and
            <strong> Stream key</strong> from the card above.
          </li>
          <li>
            Click <strong>Start Streaming</strong> in OBS. The status pill will switch
            to <em>OBS pushing</em>.
          </li>
          <li>
            Open the public <Link href="/live" target="_blank" className="text-blue-700 underline">/live page</Link> and
            click <strong>Go live</strong> here to mark the broadcast as on air.
          </li>
          <li>
            (Optional) Enable the OBS WebSocket server (<code>Tools → WebSocket Server Settings</code>, port 4455)
            so the <strong>Test connection</strong> button can read OBS scenes.
          </li>
        </ol>
        <Badge color="amber" className="mt-3">
          <Info className="mr-1 inline size-3" /> For production, swap the local RTMP
          server for a CDN (Cloudflare Stream, AWS IVS, Mux) — just paste the CDN&apos;s
          RTMP URL, stream key, and HLS URL into the form below.
        </Badge>
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  color: "green" | "slate" | "navy" | "cyan";
  icon: typeof Radio;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
          {label}
        </span>
        <Icon className="size-4 text-slate-400" />
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <Badge color={color}>{value}</Badge>
      </div>
    </Card>
  );
}
