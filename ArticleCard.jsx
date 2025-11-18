import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Eye, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ArticleCard({ article, category }) {
  return (
    <Link 
        to={createPageUrl(`Article?id=${article.id}`)}
        className="group block bg-slate-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-emerald-500/20"
      >
        {/* Image */}
        <div className="aspect-video bg-gradient-to-br from-slate-800 to-emerald-950 overflow-hidden relative">
        {article.image_url ? (
          <img 
            src={article.image_url} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl font-bold text-emerald-500/30">
              {article.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        {/* Category Badge */}
        {category && (
          <div 
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm"
            style={{ backgroundColor: `${category.color}CC` }}
          >
            {category.name}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
          {article.title}
        </h3>

        {article.summary && (
          <p className="text-sm text-slate-400 mb-4 line-clamp-2">
            {article.summary}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{format(new Date(article.created_date), 'dd MMM yyyy', { locale: ptBR })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{article.views || 0} visualizações</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
