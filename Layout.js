import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import Sidebar from './components/wiki/Sidebar';

export default function Layout({ children, currentPageName }) {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list('order'),
  });

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar categories={categories} currentPath={currentPageName} />
      <main className="flex-1 w-full lg:w-auto">
        {children}
      </main>
    </div>
  );
}
