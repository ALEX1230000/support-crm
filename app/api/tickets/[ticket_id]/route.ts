import { NextRequest, NextResponse } from 'next/server';
import { getTicketById, updateTicket } from '@/lib/ticket-service';
import { TicketStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { ticket_id: string } }
) {
  try {
    const { ticket_id } = params;

    if (!ticket_id) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    const ticket = await getTicketById(ticket_id);

    if (!ticket) {
      return NextResponse.json(
        { error: `Ticket '${ticket_id}' not found` },
        { status: 404 }
      );
    }

    // Returns: { ticket_id, customer_name, customer_email, subject, description, status, notes }
    return NextResponse.json(ticket, { status: 200 });
  } catch (error: any) {
    console.error(`Error retrieving ticket:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve ticket' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { ticket_id: string } }
) {
  try {
    const { ticket_id } = params;

    if (!ticket_id) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { status, notes } = body;

    // Validate status if provided
    const validStatuses: TicketStatus[] = ['Open', 'In Progress', 'Closed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const result = await updateTicket(ticket_id, { status, notes });

    // Returns: { success: true, updated_at } strictly matching API specs
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error(`Error updating ticket:`, error);
    const statusCode = error.message?.includes('not found') ? 404 : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to update ticket' },
      { status: statusCode }
    );
  }
}
