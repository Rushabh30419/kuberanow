// Plain-Node DB initializer: applies every migration SQL file in order,
// then runs the seed. Uses better-sqlite3 directly — no Prisma CLI needed,
// which lets us keep the runtime Docker image small.
const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dbPath = (process.env.DATABASE_URL || "file:./prisma/dev.db")
  .replace(/^file:/, "")
  .replace(/^\.\//, "");

// Ensure the directory exists (volume mount may be empty on first boot)
const dir = path.dirname(dbPath);
if (dir && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

// Apply every migration/*.sql in lexical (=chronological) order.
const migrationsDir = path.join(__dirname, "migrations");
if (fs.existsSync(migrationsDir)) {
  const folders = fs
    .readdirSync(migrationsDir)
    .filter((d) => fs.statSync(path.join(migrationsDir, d)).isDirectory())
    .sort();

  // Track applied migrations in a _migrations table (created if missing)
  db.exec(
    "CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL);"
  );
  const applied = new Set(
    db.prepare("SELECT name FROM _migrations").all().map((r) => r.name)
  );

  for (const folder of folders) {
    if (applied.has(folder)) {
      console.log(`  ✓ ${folder} (already applied)`);
      continue;
    }
    const sqlPath = path.join(migrationsDir, folder, "migration.sql");
    if (!fs.existsSync(sqlPath)) continue;
    const sql = fs.readFileSync(sqlPath, "utf8");
    console.log(`  → applying ${folder}`);
    db.exec(sql);
    db.prepare("INSERT INTO _migrations (name, applied_at) VALUES (?, ?)").run(
      folder,
      new Date().toISOString()
    );
  }
}

db.close();
console.log("✓ migrations applied");

// Only seed if the DB is empty — the seed script wipes all tables, so running
// it on every boot would destroy user data (contact submissions, applications,
// saved calculations, edited content). We treat "no users" as "fresh DB".
const db2 = new Database(dbPath, { readonly: true });
let isEmpty = true;
try {
  const row = db2.prepare("SELECT COUNT(*) AS n FROM User").get();
  isEmpty = row.n === 0;
} catch (e) {
  // User table doesn't exist yet — treat as empty
  isEmpty = true;
}
db2.close();

if (!isEmpty) {
  console.log("✓ database already has data — skipping seed");
  process.exit(0);
}

// Run the compiled seed (bundled by esbuild during docker build).
const seedPath = path.join(__dirname, "seed.compiled.js");
if (fs.existsSync(seedPath)) {
  console.log("→ running seed (fresh database)…");
  require(seedPath);
} else {
  console.log("⚠ no compiled seed found — skipping");
}
