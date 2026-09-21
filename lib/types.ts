export type TicketStatus = 'Open' | 'In Progress' | 'Closed';

export interface Ticket {
  id?: number;
  ticket_id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  description: string;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id?: number;
  ticket_id: string;
  note_text: string;
  created_at: string;
}

export interface TicketDetail extends Ticket {
  notes: Note[];
}

export interface CreateTicketRequest {
  customer_name: string;
  customer_email: string;
  subject: string;
  description: string;
}

export interface UpdateTicketRequest {
  status?: TicketStatus;
  notes?: string;
}
