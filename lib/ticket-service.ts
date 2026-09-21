import { getDbClient, ensureDbInitialized } from './db';
import { Ticket, TicketDetail, Note, TicketStatus, CreateTicketRequest, UpdateTicketRequest } from './types';

export async function generateTicketId(): Promise<string> {
  await ensureDbInitialized();
  const db = getDbClient();
  const res = await db.execute('SELECT MAX(id) as max_id FROM tickets;');
  const maxId = res.rows[0]?.max_id ? Number(res.rows[0].max_id) : 0;
  const nextNumber = maxId + 1;
  return `TKT-${String(nextNumber).padStart(3, '0')}`;
}

export async function createTicket(data: CreateTicketRequest): Promise<{ ticket_id: string; created_at: string }> {
  await ensureDbInitialized();
  const db = getDbClient();

  const ticketId = await generateTicketId();
  const now = new Date().toISOString();

  await db.execute({
    sql: `INSERT INTO tickets (ticket_id, customer_name, customer_email, subject, description, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, 'Open', ?, ?)`,
    args: [ticketId, data.customer_name.trim(), data.customer_email.trim(), data.subject.trim(), data.description.trim(), now, now],
  });

  return {
    ticket_id: ticketId,
    created_at: now,
  };
}

export async function listTickets(filters?: { status?: string; search?: string }): Promise<Ticket[]> {
  await ensureDbInitialized();
  const db = getDbClient();

  const conditions: string[] = [];
  const args: any[] = [];

  if (filters?.status && filters.status !== 'All') {
    conditions.push('status = ?');
    args.push(filters.status);
  }

  if (filters?.search && filters.search.trim() !== '') {
    const term = `%${filters.search.trim().toLowerCase()}%`;
    conditions.push(
      '(LOWER(customer_name) LIKE ? OR LOWER(ticket_id) LIKE ? OR LOWER(customer_email) LIKE ? OR LOWER(subject) LIKE ? OR LOWER(description) LIKE ?)'
    );
    args.push(term, term, term, term, term);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `SELECT id, ticket_id, customer_name, customer_email, subject, description, status, created_at, updated_at 
               FROM tickets ${whereClause} 
               ORDER BY id DESC;`;

  const res = await db.execute({ sql, args });

  return res.rows.map((row) => ({
    id: Number(row.id),
    ticket_id: String(row.ticket_id),
    customer_name: String(row.customer_name),
    customer_email: String(row.customer_email),
    subject: String(row.subject),
    description: String(row.description),
    status: String(row.status) as TicketStatus,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  }));
}

export async function getTicketById(ticketId: string): Promise<TicketDetail | null> {
  await ensureDbInitialized();
  const db = getDbClient();

  const ticketRes = await db.execute({
    sql: `SELECT id, ticket_id, customer_name, customer_email, subject, description, status, created_at, updated_at 
          FROM tickets 
          WHERE ticket_id = ? 
          LIMIT 1;`,
    args: [ticketId],
  });

  if (ticketRes.rows.length === 0) {
    return null;
  }

  const row = ticketRes.rows[0];

  const notesRes = await db.execute({
    sql: `SELECT id, ticket_id, note_text, created_at 
          FROM notes 
          WHERE ticket_id = ? 
          ORDER BY id ASC;`,
    args: [ticketId],
  });

  const notes: Note[] = notesRes.rows.map((n) => ({
    id: Number(n.id),
    ticket_id: String(n.ticket_id),
    note_text: String(n.note_text),
    created_at: String(n.created_at),
  }));

  return {
    id: Number(row.id),
    ticket_id: String(row.ticket_id),
    customer_name: String(row.customer_name),
    customer_email: String(row.customer_email),
    subject: String(row.subject),
    description: String(row.description),
    status: String(row.status) as TicketStatus,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    notes,
  };
}

export async function updateTicket(
  ticketId: string,
  data: UpdateTicketRequest
): Promise<{ success: boolean; updated_at: string }> {
  await ensureDbInitialized();
  const db = getDbClient();

  const now = new Date().toISOString();

  // Verify ticket exists
  const check = await db.execute({
    sql: 'SELECT id FROM tickets WHERE ticket_id = ? LIMIT 1;',
    args: [ticketId],
  });

  if (check.rows.length === 0) {
    throw new Error(`Ticket with ID ${ticketId} not found`);
  }

  // Update status if provided
  if (data.status) {
    await db.execute({
      sql: 'UPDATE tickets SET status = ?, updated_at = ? WHERE ticket_id = ?;',
      args: [data.status, now, ticketId],
    });
  } else {
    await db.execute({
      sql: 'UPDATE tickets SET updated_at = ? WHERE ticket_id = ?;',
      args: [now, ticketId],
    });
  }

  // Add note if provided and not empty
  if (data.notes && data.notes.trim().length > 0) {
    await db.execute({
      sql: 'INSERT INTO notes (ticket_id, note_text, created_at) VALUES (?, ?, ?);',
      args: [ticketId, data.notes.trim(), now],
    });
  }

  return {
    success: true,
    updated_at: now,
  };
}
