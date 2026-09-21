import React from 'react';
import { Inbox, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { TicketStatus } from '@/lib/types';

interface MetricCardsProps {
  total: number;
  openCount: number;
  inProgressCount: number;
  closedCount: number;
  activeStatus: string;
  onSelectStatus: (status: string) => void;
}

export default function MetricCards({
  total,
  openCount,
  inProgressCount,
  closedCount,
  activeStatus,
  onSelectStatus,
}: MetricCardsProps) {
  const cards = [
    {
      id: 'All',
      label: 'Total Tickets',
      count: total,
      icon: Inbox,
      iconColor: 'text-slate-600 bg-slate-100',
      activeRing: activeStatus === 'All' ? 'ring-2 ring-indigo-500 border-transparent shadow-md' : 'hover:border-slate-300',
    },
    {
      id: 'Open',
      label: 'Open',
      count: openCount,
      icon: AlertCircle,
      iconColor: 'text-amber-600 bg-amber-50',
      activeRing: activeStatus === 'Open' ? 'ring-2 ring-amber-500 border-transparent shadow-md' : 'hover:border-slate-300',
    },
    {
      id: 'In Progress',
      label: 'In Progress',
      count: inProgressCount,
      icon: Clock,
      iconColor: 'text-blue-600 bg-blue-50',
      activeRing: activeStatus === 'In Progress' ? 'ring-2 ring-blue-500 border-transparent shadow-md' : 'hover:border-slate-300',
    },
    {
      id: 'Closed',
      label: 'Closed',
      count: closedCount,
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 bg-emerald-50',
      activeRing: activeStatus === 'Closed' ? 'ring-2 ring-emerald-500 border-transparent shadow-md' : 'hover:border-slate-300',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeStatus === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectStatus(card.id)}
            className={`text-left bg-white p-4 rounded-xl border border-slate-200 transition-all cursor-pointer ${card.activeRing} ${
              isSelected ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {card.label}
              </span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{card.count}</span>
              <span className="text-xs text-slate-500">
                {total > 0 ? `${Math.round((card.count / (total || 1)) * 100)}%` : '0%'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
