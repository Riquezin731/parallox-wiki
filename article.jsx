import React, { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Eye, Calendar, User, ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Article() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  const queryClient = useQueryClient();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', articleId],
    queryFn: () => base44.entities.Article.filter({ id: articleId }).then(res => res[0]),
    enabled: !!articleId,
  });

  const { data: category } = useQuery({
    queryKey: ['category', article?.category_id],
    queryFn: () => base44.entities.Category.filter({ id: article.category_id }).then(res => res[0]),
    enabled: !!article?.category_id,
  });

  const incrementViewsMutation = useMutation({
    mutationFn: () => base44.entities.Article.update(articleId, { 
      views: (article?.views || 0) + 1 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['article', articleId]);
    },
  });

  useEffect(() => {
    if (article) {
      incrementViewsMutation.mutate();
    }
  }, [article?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Skeleton className="h-10 sm:h-12 w-3/4 mb-3 sm:mb-4" />
          <Skeleton className="h-5 sm:h-6 w-1/2 mb-6 sm:mb-8" />
          <Skeleton className="h-64 sm:h-96 w-full mb-6 sm:mb-8" />
          <Skeleton className="h-24 sm:h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Artigo não encontrado</h1>
          <Link to={createPageUrl('Home')}>
            <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700">Voltar para Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Header Image */}
      {article.image_url && (
        <div className="h-96 relative overflow-hidden">
          <img 
            src={article.image_url} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Button */}
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" className="mb-4 sm:mb-6 rounded-xl text-emerald-400 hover:bg-emerald-500/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        {/* Article Header */}
        <div className="mb-6 sm:mb-8">
          {category && (
            <div 
              className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold text-white mb-3 sm:mb-4"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4">{article.title}</h1>

          {article.summary && (
            <p className="text-base sm:text-lg lg:text-xl text-slate-400 mb-4 sm:mb-6">{article.summary}</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-slate-400 pb-4 sm:pb-6 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(article.created_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.created_by}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{article.views || 0} visualizações</span>
            </div>
            <Link to={createPageUrl(`ArticleEditor?id=${article.id}`)} className="sm:ml-auto">
              <Button variant="outline" size="sm" className="rounded-xl border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs sm:text-sm">
                <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Editar
              </Button>
            </Link>
          </div>
        </div>

        {/* Article Content */}
        <article className="bg-slate-900 border border-emerald-500/20 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 xl:p-12">
          <div 
            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-white
              prose-h1:text-2xl sm:prose-h1:text-3xl lg:prose-h1:text-4xl 
              prose-h2:text-xl sm:prose-h2:text-2xl lg:prose-h2:text-3xl 
              prose-h3:text-lg sm:prose-h3:text-xl lg:prose-h3:text-2xl
              prose-p:text-slate-300 prose-p:leading-relaxed
              prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-strong:font-bold
              prose-ul:list-disc prose-ol:list-decimal prose-li:text-slate-300
              prose-img:rounded-xl prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </div>
    </div>
  );
}
