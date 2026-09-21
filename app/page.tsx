'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Ticket } from '@/lib/types';
import MetricCards from '@/components/MetricCards';
import TicketFilterSearch from '@/components/TicketFilterSearch';
import TicketList from '@/components/TicketList';
import { Plus, RefreshCw } from 'lucide-react';

export default function HomePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [allTicketsCache, setAllTicketsCache] = useState<Ticket[]>([]);

  // Fetch tickets from API
  const fetchTickets = useCallback(async (search?: string, status?: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (status && status !== 'All') {
        params.append('status', status);
      }
      if (search && search.trim() !== '') {
        params.append('search', search.trim());
      }

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`/api/tickets${queryString}`);
      if (!res.ok) throw new Error('Failed to fetch tickets');
      const data: Ticket[] = await res.json();
      setTickets(data);

      // If fetching without filters, update total metrics cache
      if (!search && (!status || status === 'All')) {
        setAllTicketsCache(data);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Debounce search as you type
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchTickets(searchQuery, statusFilter);
    }, 250);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, statusFilter, fetchTickets]);

  // Calculate metrics
  const totalCount = allTicketsCache.length;
  const openCount = allTicketsCache.filter((t) => t.status === 'Open').length;
  const inProgressCount = allTicketsCache.filter((t) => t.status === 'In Progress').length;
  const closedCount = allTicketsCache.filter((t) => t.status === 'Closed').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Support Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage incoming customer support tickets, review issues, and update ticket lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchTickets(searchQuery, statusFilter)}
            disabled={isLoading}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Refresh tickets"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/tickets/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Ticket</span>
          </Link>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <MetricCards
        total={totalCount}
        openCount={openCount}
        inProgressCount={inProgressCount}
        closedCount={closedCount}
        activeStatus={statusFilter}
        onSelectStatus={(st) => setStatusFilter(st)}
      />

      {/* Search & Filter Bar (works as you type) */}
      <TicketFilterSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        totalFilteredCount={tickets.length}
      />

      {/* Tickets List View */}
      <TicketList tickets={tickets} isLoading={isLoading} />
    </div>
  );
}
