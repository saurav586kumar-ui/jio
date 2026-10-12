import React, { useState } from 'react';
import { 
  GraduationCap, 
  ArrowLeft, 
  Clock, 
  User, 
  Share2, 
  Check, 
  BookOpen, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { Article } from '../types';

interface ArticlesViewProps {
  initialSlug?: string;
  onSelectBook: (book: any) => void;
  onNavigateToLibrary: () => void;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({ initialSlug, onNavigateToLibrary }) => {
  const { articles } = useLibrary();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(() => {
    if (initialSlug) {
      return articles.find((a) => a.slug === initialSlug) || null;
    }
    return null;
  });
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* If viewing a single article */}
      {selectedArticle ? (
        <article className="space-y-6">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Study Guides</span>
          </button>

          {/* Header */}
          <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {selectedArticle.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {selectedArticle.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 pt-2">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {selectedArticle.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedArticle.readTime}
                </span>
                <span>•</span>
                <span>{selectedArticle.publishedAt}</span>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-medium transition"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Share Guide'}</span>
              </button>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed space-y-4 text-sm sm:text-base">
            {selectedArticle.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('# ')) {
                return (
                  <h2 key={idx} className="text-2xl font-bold text-slate-900 dark:text-white pt-4">
                    {paragraph.replace('# ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-lg font-bold text-slate-900 dark:text-white pt-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              return (
                <p key={idx} className="whitespace-pre-line">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Call to action at bottom */}
          <div className="p-6 rounded-3xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-800 text-center space-y-3 mt-10">
            <Sparkles className="w-8 h-8 text-blue-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Ready to Practice What You Learned?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Access official chapter-wise textbooks, formula notes, and sample question banks in the EDSU digital library.
            </p>
            <button
              onClick={onNavigateToLibrary}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition"
            >
              Browse Educational Resources
            </button>
          </div>
        </article>
      ) : (
        /* List of All Articles */
        <div className="space-y-8">
          <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Editorial Study Guides &amp; Examination Blueprints
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              In-depth academic strategies, syllabus breakdown, answer-writing tips, and revision schedules authored by state examiners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-bold text-blue-600 uppercase tracking-wider text-[10px]">
                      {art.category}
                    </span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition leading-snug mb-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 truncate">{art.author}</span>
                  <span className="text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
