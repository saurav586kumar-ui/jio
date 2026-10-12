import React from 'react';
import { BookOpen, Download, Bookmark, BookmarkCheck, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { Book } from '../types';
import { useLibrary } from '../context/LibraryContext';

interface BookCardProps {
  book: Book;
  onOpenDetail: (book: Book) => void;
  onReadOnline: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onOpenDetail, onReadOnline }) => {
  const { userLibrary, toggleBookmark, recordBookDownload, recordBookView } = useLibrary();

  const isBookmarked = userLibrary[book.id]?.isBookmarked || false;
  const userProgress = userLibrary[book.id]?.readingProgressPercent || 0;

  const handleReadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    recordBookView(book.id);
    onReadOnline(book);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!book.downloadPermitted) return;
    recordBookDownload(book.id);
    const link = document.createElement('a');
    link.href = book.pdfUrl;
    link.download = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(book);
  };

  const formattedSize = book.fileSizeBytes
    ? `${(book.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`
    : '4.2 MB';

  // Badge colors based on content type
  const typeBadgeColor = () => {
    switch (book.contentType) {
      case 'textbook':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
      case 'notes':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300';
      case 'sample_paper':
      case 'pyq':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
      case 'question_bank':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div
      onClick={() => onOpenDetail(book)}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer transform hover:-translate-y-1"
    >
      {/* Thumbnail and badges area */}
      <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-sm">
            {book.board}
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-200 border border-white/20">
            {book.classLevel}
          </span>
        </div>

        {/* Bookmark button */}
        <button
          onClick={handleBookmarkClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition z-10 ${
            isBookmarked
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-black/40 text-white/80 hover:text-white hover:bg-black/60'
          }`}
          title={isBookmarked ? 'Bookmarked' : 'Save to Library'}
        >
          {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
        </button>

        {/* Bottom overlay info */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white/90">
          <span className="font-semibold truncate pr-2">{book.subject}</span>
          <span className="shrink-0 font-mono text-[10px] bg-black/50 px-1.5 py-0.5 rounded">
            {book.pageCount} pgs
          </span>
        </div>

        {/* Reading progress bar if user has opened */}
        {userProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700/60">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${userProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Content Type tag & exam */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${typeBadgeColor()}`}>
              {book.contentType.replace('_', ' ')}
            </span>
            {book.exam && book.exam !== 'None' && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                {book.exam}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-1">
            {book.title}
          </h3>

          {/* Author / Publisher */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
            By {book.author}
          </p>
        </div>

        {/* Footer Meta & Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-slate-400" />
              {book.viewCount || 0} reads
            </span>
            <span>{formattedSize}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleReadClick}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Online</span>
            </button>

            {book.downloadPermitted ? (
              <button
                onClick={handleDownloadClick}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition active:scale-95"
                title="Download verified PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-[10px] font-semibold bg-slate-50 dark:bg-slate-800/50 text-slate-400 border border-slate-200/50 dark:border-slate-800 cursor-not-allowed"
                title="Digital viewing only (Publisher restriction)"
              >
                <span>Read-Only</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
