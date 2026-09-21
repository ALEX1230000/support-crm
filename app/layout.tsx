import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Support CRM - Customer Support Management System',
  description: 'A full-stack customer support ticketing CRM built with Next.js, SQLite, and Tailwind CSS.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4">
            <p>Support CRM System &bull; Datastraw Assessment Submission</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
