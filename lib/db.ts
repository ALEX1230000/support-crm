import { createClient, Client } from '@libsql/client';

let client: Client | null = null;
let initialized = false;

export function getDbClient(): Client {
  if (!client) {
    // In Vercel serverless environment, local filesystem root is read-only, so use /tmp if not using Turso URL
    const isVercel = Boolean(process.env.VERCEL);
    const dbUrl =
      process.env.DATABASE_URL ||
      (isVercel ? 'file:/tmp/support_crm.db' : 'file:support_crm.db');

    client = createClient({
      url: dbUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

export async function ensureDbInitialized() {
  if (initialized) return;

  const db = getDbClient();

  // Create tickets table (strictly following assignment specification)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT CHECK(status IN ('Open', 'In Progress', 'Closed')) DEFAULT 'Open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create notes table (strictly following assignment specification)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id TEXT NOT NULL,
      note_text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed sample tickets if database is empty
  const countRes = await db.execute('SELECT COUNT(*) as count FROM tickets;');
  const row = countRes.rows[0];
  const count = row ? Number(row.count) : 0;

  if (count === 0) {
    const seedTickets = [
      {
        ticket_id: 'TKT-001',
        customer_name: 'Sarah Jenkins',
        customer_email: 'sarah.j@example.com',
        subject: 'Cannot access billing invoice PDF',
        description: 'Whenever I click the "Download PDF" button in the account portal, it returns a 404 error.',
        status: 'Open',
      },
      {
        ticket_id: 'TKT-002',
        customer_name: 'Marcus Chen',
        customer_email: 'marcus.chen@techcorp.io',
        subject: 'API rate limit reset timing discrepancy',
        description: 'Our team is noticing rate limit headers do not reset at midnight UTC as described in the documentation.',
        status: 'In Progress',
      },
      {
        ticket_id: 'TKT-003',
        customer_name: 'Elena Rostova',
        customer_email: 'elena.rostova@designworks.com',
        subject: 'Request to update team admin email address',
        description: 'We recently updated our domain and need to change our primary organization owner to elena@designworks.com.',
        status: 'Closed',
      },
    ];

    for (const t of seedTickets) {
      await db.execute({
        sql: `INSERT INTO tickets (ticket_id, customer_name, customer_email, subject, description, status, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-2 days'), datetime('now', '-1 days'))`,
        args: [t.ticket_id, t.customer_name, t.customer_email, t.subject, t.description, t.status],
      });
    }

    // Seed sample notes
    await db.execute({
      sql: `INSERT INTO notes (ticket_id, note_text, created_at)
            VALUES (?, ?, datetime('now', '-1 days'))`,
      args: ['TKT-002', 'Investigating rate limiter Redis key expiration config.'],
    });

    await db.execute({
      sql: `INSERT INTO notes (ticket_id, note_text, created_at)
            VALUES (?, ?, datetime('now', '-6 hours'))`,
      args: ['TKT-003', 'Admin email updated and verification confirmation sent to customer.'],
    });
  }

  initialized = true;
}
