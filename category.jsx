import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ArticleCard from '../components/wiki/ArticleCard';
import { ArrowLeft, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Category() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get('id');

  const { data: category, isLoading: categoryLoading, error: categoryError } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const results = await base44.entities.Category.filter({ id: categoryId });
      return results[0];
    },
    enabled: !!categoryId,
  });

  const { data: articles = [], isLoading: articlesLoading, error: articlesError } = useQuery({
    queryKey: ['articles', categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const results = await base44.entities.Article.list('-created_date', 100);
      return results.filter(a => a.category_id === categoryId && a.published);
    },
    enabled: !!categoryId,
  });

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black py-12">
        <div className="max-w-6xl mx-auto px-6">
          <Skeleton className="h-12 w-1/2 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (categoryError || articlesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Erro ao carregar categoria</h1>
          <p className="text-slate-400 mb-6">{categoryError?.message || articlesError?.message}</p>
          <Link to={createPageUrl('Home')}>
            <Button className="rounded-xl">Voltar para Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Categoria não encontrada</h1>
          <Link to={createPageUrl('Home')}>
            <Button className="rounded-xl">Voltar para Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Category Header */}
      <div 
        className="text-white py-8 sm:py-12 lg:py-16"
        style={{ 
          background: `linear-gradient(135deg, ${category.color}, ${category.color}DD)` 
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" className="mb-4 sm:mb-6 text-white hover:bg-white/10 rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">{category.name}</h1>
              {category.description && (
                <p className="text-base sm:text-lg lg:text-xl text-white/90 mt-1 sm:mt-2">{category.description}</p>
              )}
            </div>
          </div>

          <div className="text-white/80 text-sm sm:text-base lg:text-lg">
            {articles.length} {articles.length === 1 ? 'artigo' : 'artigos'}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {articlesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {articles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article}
                category={category}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg mb-6">
              Nenhum artigo nesta categoria ainda.
            </p>
            <Link to={createPageUrl('ArticleEditor')}>
              <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700">Criar Primeiro Artigo</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
