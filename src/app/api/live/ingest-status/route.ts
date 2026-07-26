/**
 * GET /api/live/ingest-status
 *
 * Returns whether the local MediaMTX RTMP ingester is running and whether
 * OBS is currently pushing the configured stream. Used by the admin
 * control panel to render a live status pill.
 */

import { NextResponse } from "next/server";
import { checkIngestServer } from "@/lib/live";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = await checkIngestServer();
  return NextResponse.json(status, {
    headers: { "Cache-Control": "no-store" },
  });
}
