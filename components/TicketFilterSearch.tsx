import React from 'react';
import { Search, X, Filter } from 'lucide-react';

interface TicketFilterSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  totalFilteredCount: number;
}

export default function TicketFilterSearch({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  totalFilteredCount,
}: TicketFilterSearchProps) {
  const statuses = ['All', 'Open', 'In Progress', 'Closed'];

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Search Input (As-you-type search across names, IDs, emails, descriptions) */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by ticket ID, customer name, email, or subject..."
          className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs by Status */}
      <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto pb-1 md:pb-0 w-full md:w-auto">
        <div className="hidden sm:flex items-center text-xs font-semibold uppercase text-slate-400 mr-1">
          <Filter className="w-3.5 h-3.5 mr-1" />
          Status:
        </div>
        {statuses.map((status) => {
          const isActive = statusFilter === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => onStatusChange(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>
    </div>
  );
}
