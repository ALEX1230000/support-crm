import React from 'react';
import { TicketStatus } from '@/lib/types';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: TicketStatus | string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  let badgeStyles = 'bg-amber-50 text-amber-700 border-amber-200';
  let Icon = AlertCircle;

  if (status === 'In Progress') {
    badgeStyles = 'bg-blue-50 text-blue-700 border-blue-200';
    Icon = Clock;
  } else if (status === 'Closed') {
    badgeStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    Icon = CheckCircle2;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses} ${badgeStyles} transition-colors`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{status}</span>
    </span>
  );
}
