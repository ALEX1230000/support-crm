'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function CreateTicketPage() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerName.trim() || !customerEmail.trim() || !subject.trim() || !description.trim()) {
      setErrorMessage('All fields are required. Please complete the form.');
      return;
    }

    if (!customerEmail.includes('@') || !customerEmail.includes('.')) {
      setErrorMessage('Please enter a valid customer email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          subject,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create ticket');
      }

      setCreatedTicketId(data.ticket_id);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tickets</span>
        </Link>
      </div>

      {createdTicketId ? (
        /* Success State */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Ticket Created Successfully!</h2>
          <p className="text-slate-500 text-sm mt-1.5">
            Your support ticket has been logged with an auto-generated identifier:
          </p>
          <div className="my-5 inline-block bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl">
            <span className="font-mono text-xl font-bold text-indigo-600">
              {createdTicketId}
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 mt-4">
            <Link
              href={`/tickets/${createdTicketId}`}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
            >
              View Ticket Details
            </Link>
            <button
              type="button"
              onClick={() => {
                setCreatedTicketId(null);
                setCustomerName('');
                setCustomerEmail('');
                setSubject('');
                setDescription('');
                setIsSubmitting(false);
              }}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-all"
            >
              Create Another
            </button>
          </div>
        </div>
      ) : (
        /* Create Form */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Create Support Ticket</h1>
            <p className="text-sm text-slate-500 mt-1">
              Log customer complaints, requests, or bugs with an auto-generated ticket ID.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Customer Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Customer Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Issue Subject / Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Brief summary of the issue..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                placeholder="Describe the issue reported by the customer in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-y"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Ticket ID auto-assigned upon creation
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Create Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
