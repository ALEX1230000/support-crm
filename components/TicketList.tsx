import React from 'react';
import Link from 'next/link';
import { Ticket } from '@/lib/types';
import StatusBadge from './StatusBadge';
import { Calendar, ArrowRight, User, Mail, Inbox } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
}

export default function TicketList({ tickets, isLoading }: TicketListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-2 w-1/3">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
              <div className="h-6 bg-slate-200 rounded w-20"></div>
              <div className="h-4 bg-slate-200 rounded w-28"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No tickets found</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          No tickets match your current search or status filter. Try clearing filters or create a new ticket.
        </p>
        <div className="mt-5">
          <Link
            href="/tickets/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
          >
            Create New Ticket
          </Link>
        </div>
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase text-slate-500 tracking-wider">
              <th className="py-3 px-4">Ticket ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Issue / Title</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date Created</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {tickets.map((ticket) => (
              <tr
                key={ticket.ticket_id}
                className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
              >
                <td className="py-3.5 px-4 font-mono font-semibold text-indigo-600">
                  <Link href={`/tickets/${ticket.ticket_id}`} className="hover:underline">
                    {ticket.ticket_id}
                  </Link>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-medium text-slate-900">{ticket.customer_name}</div>
                  <div className="text-xs text-slate-500 truncate max-w-[180px]">
                    {ticket.customer_email}
                  </div>
                </td>
                <td className="py-3.5 px-4 max-w-xs">
                  <Link
                    href={`/tickets/${ticket.ticket_id}`}
                    className="font-medium text-slate-900 group-hover:text-indigo-600 line-clamp-1"
                  >
                    {ticket.subject}
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {ticket.description}
                  </p>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(ticket.created_at)}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <Link
                    href={`/tickets/${ticket.ticket_id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden divide-y divide-slate-100">
        {tickets.map((ticket) => (
          <Link
            key={ticket.ticket_id}
            href={`/tickets/${ticket.ticket_id}`}
            className="block p-4 hover:bg-slate-50/60 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {ticket.ticket_id}
              </span>
              <StatusBadge status={ticket.status} size="sm" />
            </div>
            <h4 className="font-medium text-slate-900 line-clamp-1">{ticket.subject}</h4>
            <p className="text-xs text-slate-500 line-clamp-2 mt-1">{ticket.description}</p>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1 truncate max-w-[180px]">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{ticket.customer_name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatDate(ticket.created_at)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
