import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, ArrowRight, Sparkles, Filter, ExternalLink } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { Book } from '../types';

interface SearchAutocompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBook: (book: Book) => void;
  onNavigateToLibrary: (query: string) => void;
}

export const SearchAutocompleteModal: React.FC<SearchAutocompleteModalProps> = ({
  isOpen,
  onClose,
  onSelectBook,
  onNavigateToLibrary,
}) => {
  const { books } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const trimmed = searchTerm.toLowerCase().trim();

  // Find matching books
  const matchingBooks = trimmed
    ? books.filter((b) => {
        return (
          b.title.toLowerCase().includes(trimmed) ||
          b.subject.toLowerCase().includes(trimmed) ||
          b.author.toLowerCase().includes(trimmed) ||
          b.board.toLowerCase().includes(trimmed) ||
          b.exam.toLowerCase().includes(trimmed) ||
          b.tags.toLowerCase().includes(trimmed) ||
          b.classLevel.toLowerCase().includes(trimmed)
        );
      }).slice(0, 6)
    : [];

  // Trending & suggested searches
  const popularKeywords = [
    'NCERT Class 10 Maths',
    'IIT JEE Physics Notes',
    'NEET Human Physiology',
    'Bihar Board Chemistry Model Paper',
    'CBSE Class 12 PYQ',
    'MP Board Class 10 Science',
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && searchTerm.trim()) {
      onNavigateToLibrary(searchTerm.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by book title, subject, board, class, or competitive exam..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded font-mono border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results / Suggestions Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {trimmed ? (
            matchingBooks.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">
                  <span>Matched Resources ({matchingBooks.length})</span>
                  <button
                    onClick={() => {
                      onNavigateToLibrary(searchTerm);
                      onClose();
                    }}
                    className="text-blue-600 hover:underline flex items-center gap-1 normal-case font-medium"
                  >
                    View all in library <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {matchingBooks.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => {
                        onSelectBook(book);
                        onClose();
                      }}
                      className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800/80 cursor-pointer transition"
                    >
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-10 h-14 object-cover rounded shadow-sm shrink-0 border border-slate-200 dark:border-slate-700"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                            {book.board}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {book.classLevel}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition">
                          {book.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {book.subject} • {book.author}
                        </p>
                      </div>
                      <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition pr-2 flex items-center gap-1 shrink-0 font-medium">
                        Read <BookOpen className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                  No verified educational resources found for "{searchTerm}"
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try searching broader terms like "Maths", "Physics", "Class 10", "NCERT", or "JEE".
                </p>
                <button
                  onClick={() => {
                    onNavigateToLibrary('');
                    onClose();
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow transition"
                >
                  Browse Entire Catalog
                </button>
              </div>
            )
          ) : (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Trending Searches &amp; Curricula</span>
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                {popularKeywords.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => {
                      setSearchTerm(kw);
                      onNavigateToLibrary(kw);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white transition"
                  >
                    {kw}
                  </button>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 px-2 flex items-center justify-between text-xs text-slate-400">
                <span>Tip: Press Enter to search whole library</span>
                <button
                  onClick={() => {
                    onNavigateToLibrary('');
                    onClose();
                  }}
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  Advanced Filter Search <Filter className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
