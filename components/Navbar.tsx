import React from 'react';
import Link from 'next/link';
import { Headphones, Plus, LifeBuoy } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-slate-900 tracking-tight text-lg">Support CRM</span>
                  <span className="text-[10px] uppercase font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                    SQLite
                  </span>
                </div>
                <span className="text-xs text-slate-500">Datastraw Customer Operations</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links & Actions */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors"
            >
              All Tickets
            </Link>
            <Link
              href="/tickets/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Ticket</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
