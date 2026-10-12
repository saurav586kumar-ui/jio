import React, { useState } from 'react';
import { 
  ChevronRight, 
  BookOpen, 
  Download, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  FileText, 
  ShieldCheck, 
  Check, 
  Eye, 
  Layers, 
  ExternalLink,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { Book } from '../types';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from '../components/BookCard';

interface BookDetailViewProps {
  book: Book;
  onBack: () => void;
  onReadOnline: (book: Book) => void;
  onSelectBook: (book: Book) => void;
  onNavigate: (view: string, subParam?: string) => void;
}

export const BookDetailView: React.FC<BookDetailViewProps> = ({
  book,
  onBack,
  onReadOnline,
  onSelectBook,
  onNavigate,
}) => {
  const { books, affiliates, userLibrary, toggleBookmark, recordBookDownload, recordBookView, recordAffiliateClick } = useLibrary();
  
  const [copiedLink, setCopiedLink] = useState(false);
  const isBookmarked = userLibrary[book.id]?.isBookmarked || false;
  const userProgress = userLibrary[book.id]?.readingProgressPercent || 0;
  const lastReadPage = userLibrary[book.id]?.lastReadPage || 1;

  // Related books with matching subject, board, or class
  const relatedBooks = books
    .filter((b) => b.id !== book.id && (b.subject === book.subject || b.classLevel === book.classLevel))
    .slice(0, 3);

  // Contextual affiliate recommendation matching this subject/exam
  const contextualAffiliate = affiliates.find(
    (a) => a.isActive && (a.targetSubject === book.subject || a.targetExam === book.exam)
  ) || affiliates.find((a) => a.isActive);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleDownload = () => {
    if (!book.downloadPermitted) return;
    recordBookDownload(book.id);
    const link = document.createElement('a');
    link.href = book.pdfUrl;
    link.download = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRead = () => {
    recordBookView(book.id);
    onReadOnline(book);
  };

  const formattedSize = book.fileSizeBytes
    ? `${(book.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`
    : '4.2 MB';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={onBack} className="hover:text-blue-600 flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Library
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <button onClick={() => onNavigate('library')} className="hover:text-blue-600">
          {book.classLevel}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-400">{book.board}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-xs">
          {book.title}
        </span>
      </nav>

      {/* Main Book Hero Block */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cover Image & Quick Action */}
          <div className="md:col-span-4 lg:col-span-3 space-y-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 group">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow">
                  {book.board}
                </span>
              </div>
            </div>

            {/* Reading progress banner if started */}
            {userProgress > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-slate-800/80 rounded-xl border border-blue-200/60 dark:border-slate-700 text-xs">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Reading Progress</span>
                  <span>{userProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${userProgress}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Last read on Page {lastReadPage} of {book.pageCount}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Title, Metadata, Actions */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 uppercase tracking-wider">
                {book.contentType.replace('_', ' ')}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {book.classLevel}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                {book.subject}
              </span>
              {book.exam && book.exam !== 'None' && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                  {book.exam}
                </span>
              )}
            </div>

            {/* Title & Author */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                {book.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 font-medium">
                Authored / Compiled by: <strong className="text-slate-800 dark:text-slate-200">{book.author}</strong>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Publication Authority: {book.publisher} • Chapter Scope: {book.chapter}
              </p>
            </div>

            {/* Action Buttons: Read Online, Download, Bookmark, Share */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleRead}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>{userProgress > 0 ? `Resume Reading (Page ${lastReadPage})` : 'Read Online in PDF Reader'}</span>
              </button>

              {book.downloadPermitted ? (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-700 active:scale-95 transition"
                >
                  <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Download PDF Document</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Digital Reading Only (Direct Download Restricted by License)</span>
                </div>
              )}

              <button
                onClick={() => toggleBookmark(book)}
                className={`p-3 rounded-2xl border transition ${
                  isBookmarked
                    ? 'bg-amber-500 border-amber-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
                title={isBookmarked ? 'Bookmarked in My Library' : 'Bookmark to My Library'}
              >
                {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold transition"
                title="Share link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>

            {/* Verified Technical Metadata Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Document Pages</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{book.pageCount} Pages</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">File Size</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{formattedSize}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Language</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{book.language}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Readers</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{book.viewCount} Views</span>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Curriculum Synopsis &amp; Study Notes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            </div>

            {/* Copyright & Licensing Transparency */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  Verified Academic Rights &amp; Usage License
                </p>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[11px] leading-relaxed">
                  {book.copyrightLicense || 'Open Educational Resource / Fair-Use Educational Catalog'}. Permitted for individual student reference, exam preparation, and classroom study.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Contextual Affiliate Recommendation (if relevant) */}
      {contextualAffiliate && (
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 p-6 rounded-3xl border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={contextualAffiliate.imageUrl}
              alt={contextualAffiliate.title}
              className="w-16 h-20 object-cover rounded-xl shadow-md border border-white/50 shrink-0"
            />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-white">
                Companion Printed Book • via {contextualAffiliate.merchant}
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {contextualAffiliate.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                {contextualAffiliate.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              {contextualAffiliate.priceDisplay}
            </span>
            <a
              href={contextualAffiliate.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => recordAffiliateClick(contextualAffiliate.id)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md transition"
            >
              <span>Buy Physical Copy</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Related Resources in Same Class or Subject */}
      {relatedBooks.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Related Study Materials in {book.subject}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBooks.map((rel) => (
              <BookCard
                key={rel.id}
                book={rel}
                onOpenDetail={onSelectBook}
                onReadOnline={onReadOnline}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
