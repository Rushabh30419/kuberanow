-- CreateTable
CREATE TABLE "LiveStream" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "title" TEXT NOT NULL DEFAULT 'KuberaNow Live',
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'offline',
    "startedAt" DATETIME,
    "endedAt" DATETIME,
    "obsHost" TEXT,
    "obsPort" INTEGER,
    "obsPassword" TEXT,
    "obsConnected" BOOLEAN NOT NULL DEFAULT false,
    "obsScene" TEXT,
    "rtmpUrl" TEXT,
    "rtmpKey" TEXT,
    "hlsUrl" TEXT,
    "peakViewers" INTEGER NOT NULL DEFAULT 0,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "recordingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "recordingUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LiveStreamSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    "title" TEXT NOT NULL,
    "peakViewers" INTEGER NOT NULL DEFAULT 0,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "recordingUrl" TEXT
);

-- CreateTable
CREATE TABLE "LiveStreamViewer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "lastSeen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT
);

-- CreateIndex
CREATE INDEX "LiveStreamViewer_lastSeen_idx" ON "LiveStreamViewer"("lastSeen");
