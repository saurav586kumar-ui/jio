import React, { useState } from 'react';
import { 
  Bookmark, 
  BookOpen, 
  Clock, 
  LogIn, 
  LogOut, 
  User, 
  Trash2, 
  CheckCircle, 
  BarChart3, 
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { Book } from '../types';
import { BookCard } from '../components/BookCard';

interface StudentLibraryViewProps {
  onSelectBook: (book: Book) => void;
  onReadBook: (book: Book) => void;
  onNavigate: (view: string) => void;
}

export const StudentLibraryView: React.FC<StudentLibraryViewProps> = ({
  onSelectBook,
  onReadBook,
  onNavigate,
}) => {
  const { user, isDemoUser, currentUserName, currentUserEmail, signInGoogle, signOut, activateGuestMode } = useAuth();
  const { books, userLibrary, toggleBookmark } = useLibrary();

  const [activeTab, setActiveTab] = useState<'reading' | 'bookmarks'>('reading');

  const libraryItems = Object.values(userLibrary);

  // Filter bookmarks
  const bookmarkedBooks = libraryItems
    .filter((item) => item.isBookmarked)
    .map((item) => books.find((b) => b.id === item.bookId))
    .filter((b): b is Book => Boolean(b));

  // Filter in-progress reading
  const readingList = libraryItems
    .filter((item) => (item.lastReadPage || 0) > 0)
    .sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime())
    .map((item) => {
      const book = books.find((b) => b.id === item.bookId);
      return { item, book };
    })
    .filter((entry): entry is { item: typeof entry.item; book: Book } => Boolean(entry.book));

  // Total pages read estimate
  const totalPagesRead = libraryItems.reduce((acc, curr) => acc + (curr.lastReadPage || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Student Profile Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center font-extrabold text-2xl text-blue-200 uppercase shadow-inner">
            {currentUserName ? currentUserName.charAt(0) : 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">
                {currentUserName}
              </h1>
              {isDemoUser && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 uppercase">
                  Guest Student
                </span>
              )}
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              {currentUserEmail || 'Student Account synchronized across devices'}
            </p>
            <div className="flex items-center gap-4 text-xs text-blue-300 mt-2">
              <span>{readingList.length} Active Readings</span>
              <span>•</span>
              <span>{bookmarkedBooks.length} Saved to Library</span>
            </div>
          </div>
        </div>

        {/* Account controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => signInGoogle()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-500 hover:bg-blue-600 text-white shadow transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Link Google Account</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reading Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {readingList.length}
            </span>
            <p className="text-xs text-slate-500">Books Opened</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {totalPagesRead}
            </span>
            <p className="text-xs text-slate-500">Total Pages Studied</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {bookmarkedBooks.length}
            </span>
            <p className="text-xs text-slate-500">Saved Bookmarks</p>
          </div>
        </div>
      </div>

      {/* Tabs: Currently Reading vs Saved Bookmarks */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-6">
        <button
          onClick={() => setActiveTab('reading')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'reading'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Currently Reading ({readingList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'bookmarks'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Bookmarks ({bookmarkedBooks.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'reading' ? (
        readingList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {readingList.map(({ item, book }) => (
              <div
                key={book.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 group hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-16 h-24 object-cover rounded-xl shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      {book.subject}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {book.classLevel} • {book.board}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                      Page {item.lastReadPage} of {item.totalPages} ({item.readingProgressPercent}%)
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${item.readingProgressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Action button */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => onReadBook(book)}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Resume Page {item.lastReadPage}</span>
                  </button>
                  <button
                    onClick={() => onSelectBook(book)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="View Details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Active Reading Sessions
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Open any textbook or note from the library to start tracking your reading progress and bookmarks automatically.
            </p>
            <button
              onClick={() => onNavigate('library')}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow hover:bg-blue-700 transition"
            >
              Discover Books in Library
            </button>
          </div>
        )
      ) : bookmarkedBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarkedBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onOpenDetail={onSelectBook}
              onReadOnline={onReadBook}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Bookmarked Resources Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the bookmark icon on any educational resource card to pin it to your personal library for quick access.
          </p>
          <button
            onClick={() => onNavigate('library')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow hover:bg-blue-700 transition"
          >
            Explore Library
          </button>
        </div>
      )}

    </div>
  );
};
