import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ArticleCard from '../components/wiki/ArticleCard';
import SearchBar from '../components/wiki/SearchBar';
import { Sparkles, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: articles = [] } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.filter({ published: true }, '-created_date', 50),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list('order'),
  });

  const featuredArticles = articles.filter(a => a.featured).slice(0, 3);
  const recentArticles = articles.slice(0, 8);

  const filteredArticles = searchQuery 
    ? articles.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.summary?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentArticles;

  const getCategoryById = (id) => categories.find(c => c.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white border-b border-emerald-500/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 px-2">
                Parallox Cyraegnum Wiki
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-emerald-200/80 mb-6 sm:mb-8 px-4">
                Sua enciclopédia completa sobre o universo do jogo
              </p>
            </div>

          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={setSearchQuery} />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
            <div className="bg-emerald-500/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 text-center border border-emerald-500/20">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400">{articles.length}</div>
              <div className="text-emerald-300/70 text-xs sm:text-sm">Artigos</div>
            </div>
            <div className="bg-emerald-500/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 text-center border border-emerald-500/20">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400">{categories.length}</div>
              <div className="text-emerald-300/70 text-xs sm:text-sm">Categorias</div>
            </div>
            <div className="bg-emerald-500/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 text-center border border-emerald-500/20">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400">
                {articles.reduce((sum, a) => sum + (a.views || 0), 0)}
              </div>
              <div className="text-emerald-300/70 text-xs sm:text-sm">Visualizações</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Featured Articles */}
        {!searchQuery && featuredArticles.length > 0 && (
          <section className="mb-12 sm:mb-16">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Artigos em Destaque</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredArticles.map(article => (
                <ArticleCard 
                  key={article.id} 
                  article={article}
                  category={getCategoryById(article.category_id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Recent/Search Results */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6 px-2">
            <div className="flex items-center gap-2 sm:gap-3">
              {searchQuery ? (
                <>
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    Resultados da Busca
                  </h2>
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    Artigos Recentes
                  </h2>
                </>
              )}
            </div>
            <Link to={createPageUrl('AllArticles')}>
              <Button variant="outline" className="rounded-xl border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-sm">
                Ver Todos
              </Button>
            </Link>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredArticles.map(article => (
                <ArticleCard 
                  key={article.id} 
                  article={article}
                  category={getCategoryById(article.category_id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg">
                {searchQuery 
                  ? 'Nenhum artigo encontrado. Tente outra busca.'
                  : 'Nenhum artigo publicado ainda.'}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
