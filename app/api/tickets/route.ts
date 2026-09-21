import { NextRequest, NextResponse } from 'next/server';
import { listTickets, createTicket } from '@/lib/ticket-service';

// Force dynamic execution for API routes
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const tickets = await listTickets({ status, search });

    // Format output matching API specification: [{ ticket_id, customer_name, subject, status, created_at }]
    const responsePayload = tickets.map((t) => ({
      ticket_id: t.ticket_id,
      customer_name: t.customer_name,
      customer_email: t.customer_email,
      subject: t.subject,
      description: t.description,
      status: t.status,
      created_at: t.created_at,
      updated_at: t.updated_at,
    }));

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_name, customer_email, subject, description } = body;

    // Validation
    if (!customer_name || !customer_email || !subject || !description) {
      return NextResponse.json(
        {
          error: 'Missing required fields: customer_name, customer_email, subject, and description are required',
        },
        { status: 400 }
      );
    }

    // Basic email format check
    if (!customer_email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address provided' },
        { status: 400 }
      );
    }

    const result = await createTicket({
      customer_name,
      customer_email,
      subject,
      description,
    });

    // Returns: { ticket_id, created_at } strictly matching API specs
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create ticket' },
      { status: 500 }
    );
  }
}
