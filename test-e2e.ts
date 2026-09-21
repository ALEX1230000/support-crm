import { listTickets, createTicket, getTicketById, updateTicket } from './lib/ticket-service';

async function runTests() {
  console.log('🧪 Starting SQLite & Service Tests...\n');

  // 1. Initial list (should have auto-seeded tickets)
  const initialTickets = await listTickets();
  console.log(`✓ Initial tickets count: ${initialTickets.length}`);
  if (initialTickets.length < 3) throw new Error('Seeding failed: expected at least 3 tickets');

  // 2. Create new ticket
  console.log('\nCreating new ticket...');
  const newTicketRes = await createTicket({
    customer_name: 'Test Customer',
    customer_email: 'test@example.com',
    subject: 'Bug: Unable to reset password',
    description: 'Password reset link sent to email gives token expired error immediately.',
  });
  console.log(`✓ Created Ticket ID: ${newTicketRes.ticket_id}, at: ${newTicketRes.created_at}`);

  // 3. Retrieve single ticket with notes
  console.log('\nRetrieving created ticket...');
  const ticketDetail = await getTicketById(newTicketRes.ticket_id);
  if (!ticketDetail) throw new Error(`Could not find ${newTicketRes.ticket_id}`);
  console.log(`✓ Retrieved ticket: ${ticketDetail.ticket_id} - ${ticketDetail.subject} (Status: ${ticketDetail.status})`);
  console.log(`✓ Notes count initially: ${ticketDetail.notes.length}`);

  // 4. Update status & append note
  console.log('\nUpdating status to "In Progress" and adding internal note...');
  const updateRes = await updateTicket(newTicketRes.ticket_id, {
    status: 'In Progress',
    notes: 'Investigating token generation timestamp in auth worker.',
  });
  console.log(`✓ Update result: success=${updateRes.success}, updated_at=${updateRes.updated_at}`);

  // 5. Verify update and note persisted
  const updatedTicket = await getTicketById(newTicketRes.ticket_id);
  if (!updatedTicket || updatedTicket.status !== 'In Progress') throw new Error('Status update failed');
  if (updatedTicket.notes.length !== 1) throw new Error('Note append failed');
  console.log(`✓ Verified status: ${updatedTicket.status}`);
  console.log(`✓ Verified note: "${updatedTicket.notes[0].note_text}" (created at: ${updatedTicket.notes[0].created_at})`);

  // 6. Test search and filtering
  console.log('\nTesting search and filter queries...');
  const searchResults = await listTickets({ search: 'reset password' });
  console.log(`✓ Search "reset password" returned ${searchResults.length} ticket(s)`);
  if (searchResults.length === 0) throw new Error('Search query failed');

  const filteredByStatus = await listTickets({ status: 'In Progress' });
  console.log(`✓ Filter status "In Progress" returned ${filteredByStatus.length} ticket(s)`);

  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
