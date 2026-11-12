import Database from "better-sqlite3";
import path from "path";
import { randomUUID } from "crypto";

const DB_PATH =
  process.env.DATABASE_FILE ?? path.join(process.cwd(), "data", "app.db");

const globalForDb = globalThis as unknown as { db: Database.Database | undefined };

export const db = globalForDb.db ?? new Database(DB_PATH);

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS businesses (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    accountName TEXT NOT NULL,
    bankName TEXT NOT NULL DEFAULT '',
    iban TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`);

const existingColumns = db
  .prepare("PRAGMA table_info(businesses)")
  .all() as { name: string }[];
if (!existingColumns.some((col) => col.name === "bankName")) {
  db.exec("ALTER TABLE businesses ADD COLUMN bankName TEXT NOT NULL DEFAULT ''");
}

export type Business = {
  id: string;
  slug: string;
  name: string;
  accountName: string;
  bankName: string;
  iban: string;
  createdAt: string;
  updatedAt: string;
};

export function listBusinesses(): Business[] {
  return db
    .prepare("SELECT * FROM businesses ORDER BY createdAt DESC")
    .all() as Business[];
}

export function getBusinessById(id: string): Business | undefined {
  return db.prepare("SELECT * FROM businesses WHERE id = ?").get(id) as
    | Business
    | undefined;
}

export function getBusinessBySlug(slug: string): Business | undefined {
  return db.prepare("SELECT * FROM businesses WHERE slug = ?").get(slug) as
    | Business
    | undefined;
}

export function createBusiness(data: {
  slug: string;
  name: string;
  accountName: string;
  bankName: string;
  iban: string;
}): Business {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO businesses (id, slug, name, accountName, bankName, iban, createdAt, updatedAt)
     VALUES (@id, @slug, @name, @accountName, @bankName, @iban, @now, @now)`
  ).run({ id, now, ...data });
  return getBusinessById(id)!;
}

export function updateBusiness(
  id: string,
  data: {
    slug: string;
    name: string;
    accountName: string;
    bankName: string;
    iban: string;
  }
): Business | undefined {
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE businesses
     SET slug = @slug, name = @name, accountName = @accountName, bankName = @bankName, iban = @iban, updatedAt = @now
     WHERE id = @id`
  ).run({ id, now, ...data });
  return getBusinessById(id);
}

export function deleteBusiness(id: string): void {
  db.prepare("DELETE FROM businesses WHERE id = ?").run(id);
}
