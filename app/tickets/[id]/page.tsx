'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { TicketDetail, TicketStatus } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import {
  ArrowLeft,
  Mail,
  User,
  Calendar,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  FileText,
  RefreshCw,
} from 'lucide-react';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Status update state
  const [newStatus, setNewStatus] = useState<TicketStatus>('Open');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [statusSuccessMsg, setStatusSuccessMsg] = useState<string | null>(null);

  // New note state
  const [noteText, setNoteText] = useState<string>('');
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);

  // Fetch ticket details
  const fetchTicket = useCallback(async () => {
    if (!ticketId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(`Ticket ${ticketId} not found`);
        }
        throw new Error('Failed to load ticket');
      }
      const data: TicketDetail = await res.json();
      setTicket(data);
      setNewStatus(data.status);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching the ticket');
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  // Handle status update
  const handleUpdateStatus = async (statusToSet: TicketStatus) => {
    if (statusToSet === ticket?.status) return;
    setIsUpdatingStatus(true);
    setStatusSuccessMsg(null);

    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusToSet }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      setNewStatus(statusToSet);
      setStatusSuccessMsg(`Status updated to "${statusToSet}"`);
      await fetchTicket();

      setTimeout(() => {
        setStatusSuccessMsg(null);
      }, 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle adding note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setIsAddingNote(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: noteText }),
      });

      if (!res.ok) throw new Error('Failed to append note');

      setNoteText('');
      await fetchTicket();
    } catch (err: any) {
      alert(err.message || 'Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-6 bg-slate-200 rounded w-32 animate-pulse"></div>
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
          <div className="h-24 bg-slate-100 rounded animate-pulse mt-4"></div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Unable to Load Ticket</h2>
        <p className="text-sm text-slate-500 mt-1">{error || 'Ticket could not be found.'}</p>
        <div className="mt-6">
          <Link
            href="/"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tickets</span>
        </Link>

        <button
          type="button"
          onClick={fetchTicket}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {statusSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusSuccessMsg}</span>
        </div>
      )}

      {/* Main Grid: Ticket Details + Update Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Ticket Subject, Description, Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Header & Description Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                  {ticket.ticket_id}
                </span>
                <StatusBadge status={ticket.status} />
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Created {formatDate(ticket.created_at)}</span>
              </div>
            </div>

            <div className="mt-5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {ticket.subject}
              </h1>

              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  <FileText className="w-3.5 h-3.5" />
                  Description
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {ticket.description}
                </p>
              </div>
            </div>
          </div>

          {/* Notes & Comments Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">Internal Notes & Activity</h3>
              </div>
              <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {ticket.notes.length} {ticket.notes.length === 1 ? 'note' : 'notes'}
              </span>
            </div>

            {/* Existing Notes List */}
            {ticket.notes.length === 0 ? (
              <div className="text-center py-6 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
                No notes or comments added yet. Add one below to track progress.
              </div>
            ) : (
              <div className="space-y-3.5 mb-6">
                {ticket.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <span className="font-semibold text-slate-700">Support Agent Note</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {formatDate(note.created_at)}
                      </span>
                    </div>
                    <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {note.note_text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="mt-4 pt-4 border-t border-slate-100">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Add New Note
              </label>
              <textarea
                rows={3}
                required
                placeholder="Type internal investigation notes, updates, or resolution details..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-y"
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isAddingNote || !noteText.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-sm transition-all"
                >
                  {isAddingNote ? (
                    <span>Posting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Note</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (1 col): Status Changer & Customer Info */}
        <div className="space-y-6">
          {/* Quick Status Updater */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">
              Ticket Status
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Click a status below to immediately update the ticket state:
            </p>

            <div className="space-y-2">
              {(['Open', 'In Progress', 'Closed'] as TicketStatus[]).map((st) => {
                const isActive = ticket.status === st;
                return (
                  <button
                    key={st}
                    type="button"
                    disabled={isUpdatingStatus || isActive}
                    onClick={() => handleUpdateStatus(st)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      isActive
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{st}</span>
                    {isActive ? (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <span className="text-xs text-slate-400">Set</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4">
              Customer Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500">Name</div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">
                    {ticket.customer_name}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-medium text-slate-500">Email Address</div>
                  <a
                    href={`mailto:${ticket.customer_email}`}
                    className="text-sm font-medium text-indigo-600 hover:underline block truncate mt-0.5"
                  >
                    {ticket.customer_email}
                  </a>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>Created:</span>
                  <span className="font-medium text-slate-700">{formatDate(ticket.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Updated:</span>
                  <span className="font-medium text-slate-700">{formatDate(ticket.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
