import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ArticleCard from '../components/wiki/ArticleCard';
import SearchBar from '../components/wiki/SearchBar';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AllArticles() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: articles = [] } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.filter({ published: true }, '-created_date'),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list('order'),
  });

  const filteredArticles = articles.filter(article => {
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      article.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryById = (id) => categories.find(c => c.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white py-8 sm:py-12 lg:py-16 border-b border-emerald-500/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" className="mb-4 sm:mb-6 text-white hover:bg-emerald-500/20 rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-emerald-400" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">Todos os Artigos</h1>
          </div>

          <div className="max-w-2xl">
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Category Filter */}
        <div className="mb-6 sm:mb-8 overflow-x-auto">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="bg-slate-900/80 backdrop-blur-lg border border-emerald-500/20 w-full sm:w-auto min-w-min">
              <TabsTrigger value="all" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 text-xs sm:text-sm">Todos</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id} className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <>
            <div className="mb-4 sm:mb-6 text-slate-400 text-sm sm:text-base">
              Exibindo {filteredArticles.length} {filteredArticles.length === 1 ? 'artigo' : 'artigos'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredArticles.map(article => (
                <ArticleCard 
                  key={article.id} 
                  article={article}
                  category={getCategoryById(article.category_id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <p className="text-slate-400 text-base sm:text-lg px-4">
              {searchQuery || selectedCategory !== 'all'
                ? 'Nenhum artigo encontrado com os filtros aplicados.'
                : 'Nenhum artigo publicado ainda.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
