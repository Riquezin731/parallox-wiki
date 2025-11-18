import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, BookOpen, Layers, PlusCircle, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function Sidebar({ categories, currentPath }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigation = [
    { name: 'Início', path: 'Home', icon: Home },
    { name: 'Todos os Artigos', path: 'AllArticles', icon: BookOpen },
    { name: 'Novo Artigo', path: 'ArticleEditor', icon: PlusCircle },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <Link to={createPageUrl('Home')} className="block mb-8" onClick={() => setMobileMenuOpen(false)}>
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691cb214a0f27946017101f3/7be8a0202_image-removebg-preview22.png"
          alt="Parallox Cyraegnum"
          className="w-full h-auto hover:scale-105 transition-transform"
        />
      </Link>

      {/* Main Navigation */}
      <nav className="space-y-1 mb-8">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={createPageUrl(item.path)}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20 border border-emerald-500/30" 
                  : "text-emerald-300/60 hover:bg-emerald-500/10 hover:text-emerald-400 border border-transparent hover:border-emerald-500/20"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Categories */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-3 px-4">
          Categorias
        </h3>
        <div className="space-y-1">
          {categories?.map((category) => (
            <Link
              key={category.id}
              to={createPageUrl(`Category?id=${category.id}`)}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-emerald-300/60 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-200 border border-transparent hover:border-emerald-500/20"
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-slate-900/90 backdrop-blur-sm border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-opacity duration-300",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <aside
          className={cn(
            "absolute left-0 top-0 bottom-0 w-72 bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white overflow-y-auto border-r border-emerald-500/20 transition-transform duration-300",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 pt-20">
            <SidebarContent />
          </div>
        </aside>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white min-h-screen sticky top-0 overflow-y-auto border-r border-emerald-500/20">
        <div className="p-6">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}
