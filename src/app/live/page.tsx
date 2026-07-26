import { prisma } from "@/lib/db";
import { PageShell } from "@/components/company/PageShell";
import LivePlayer from "./LivePlayer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Live | KuberaNow",
  description: "Watch KuberaNow live — markets, analysis, and breaking news in real time.",
};

export default async function PublicLivePage() {
  const stream = await prisma.liveStream.findUnique({ where: { id: "singleton" } });
  const isLive = stream?.status === "live" && !!stream?.hlsUrl;
  const hlsUrl = isLive ? stream!.hlsUrl! : null;
  const title = stream?.title ?? "KuberaNow Live";
  const description = stream?.description ?? null;

  return (
    <PageShell>
      <div className="w-full max-w-5xl min-w-0">
        <div className="border-border-soft bg-surface shadow-content-panel overflow-hidden rounded-lg border">
          <div className="border-career-stroke relative flex h-8.25 items-center justify-between border-b-2 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="bg-primary shadow-[2px_0px_0px_0px_var(--color-career-accent)] absolute top-1/2 left-0 h-5.5 w-1 -translate-y-1/2 rounded-xs" />
              <h3 className="text-career-heading pl-3 text-base leading-7 font-bold md:text-xl">
                {title}
              </h3>
              {isLive && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                  <span className="inline-block size-1.5 animate-pulse rounded-full bg-red-600" />
                  LIVE
                </span>
              )}
            </div>
          </div>

          <LivePlayer hlsUrl={hlsUrl} description={description ?? null} />
        </div>

        {description && (
          <p className="mt-4 text-sm leading-6 text-slate-700">{description}</p>
        )}
      </div>
    </PageShell>
  );
}
