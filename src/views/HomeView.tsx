import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Award, 
  DownloadCloud, 
  Layers, 
  CheckCircle, 
  ArrowRight, 
  FileCheck2, 
  TrendingUp, 
  Clock, 
  ExternalLink, 
  Mail, 
  Check, 
  Flame, 
  Compass, 
  GraduationCap,
  Library,
  BookMarked
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from '../components/BookCard';
import { Book } from '../types';

interface HomeViewProps {
  onNavigate: (view: string, subParam?: string) => void;
  onOpenSearch: () => void;
  onSelectBook: (book: Book) => void;
  onReadBook: (book: Book) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenSearch,
  onSelectBook,
  onReadBook,
}) => {
  const { books, affiliates, articles, userLibrary, setFilter, recordAffiliateClick } = useLibrary();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Featured books
  const featuredBooks = books.filter((b) => b.isFeatured && b.published).slice(0, 4);

  // Recently added
  const recentBooks = [...books]
    .filter((b) => b.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Popular downloads
  const popularBooks = [...books]
    .filter((b) => b.published)
    .sort((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, 4);

  // Recently read by user
  const userReadList = Object.values(userLibrary)
    .sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime())
    .slice(0, 3);

  const recentlyReadBooks = userReadList
    .map((item) => books.find((b) => b.id === item.bookId))
    .filter((b): b is Book => Boolean(b));

  const handleCategoryClick = (filterType: string, value: string) => {
    setFilter((prev) => ({
      ...prev,
      searchQuery: '',
      classLevel: filterType === 'classLevel' ? value : 'all',
      board: filterType === 'board' ? value : 'all',
      exam: filterType === 'exam' ? value : 'all',
      subject: filterType === 'subject' ? value : 'all',
      contentType: filterType === 'contentType' ? value : 'all',
    }));
    onNavigate('library');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      setNewsletterSubmitted(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Verified Educational Curricula • Free &amp; Open Digital Access</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Your Knowledge. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              One Digital Library.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Discover verified textbooks, chapter-wise revision notes, model question papers, and high-yield study materials by class, board, and competitive exam. Read online or download.
          </p>

          {/* Prominent Global Search Bar */}
          <div className="max-w-2xl mx-auto pt-2">
            <div 
              onClick={onOpenSearch}
              className="group flex items-center bg-white dark:bg-slate-900/90 rounded-2xl p-2 shadow-2xl border-2 border-blue-400/30 hover:border-blue-400 transition-all cursor-pointer backdrop-blur-md text-left"
            >
              <div className="p-3 text-blue-600 dark:text-blue-400 shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  Search by class, subject, board, chapter, or book title...
                </p>
              </div>
              <button 
                type="button"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition shrink-0 group-hover:scale-[1.02]"
              >
                Explore Library
              </button>
            </div>
            
            {/* Quick Filter Tags below search */}
            <div className="flex items-center justify-center flex-wrap gap-2 pt-3 text-xs text-slate-400">
              <span className="text-slate-500 font-medium">Quick Jump:</span>
              <button 
                onClick={() => handleCategoryClick('board', 'NCERT')}
                className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 transition"
              >
                NCERT Books
              </button>
              <button 
                onClick={() => handleCategoryClick('board', 'CBSE')}
                className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 transition"
              >
                CBSE Class 10 &amp; 12
              </button>
              <button 
                onClick={() => handleCategoryClick('board', 'Bihar Board')}
                className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 transition"
              >
                Bihar Board (BSEB)
              </button>
              <button 
                onClick={() => handleCategoryClick('exam', 'IIT JEE')}
                className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 transition"
              >
                IIT JEE Notes
              </button>
              <button 
                onClick={() => handleCategoryClick('exam', 'NEET')}
                className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 transition"
              >
                NEET Biology Bank
              </button>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-slate-800/80">
            <div>
              <p className="text-2xl font-black text-white">1,500+</p>
              <p className="text-xs text-slate-400">Curated Books &amp; Notes</p>
            </div>
            <div>
              <p className="text-2xl font-black text-blue-400">100%</p>
              <p className="text-xs text-slate-400">Verified Academic Sources</p>
            </div>
            <div>
              <p className="text-2xl font-black text-cyan-300">12+</p>
              <p className="text-xs text-slate-400">Boards &amp; Exams Supported</p>
            </div>
            <div>
              <p className="text-2xl font-black text-indigo-300">Fast</p>
              <p className="text-xs text-slate-400">Instant PDF.js Reader</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Continue Reading (If Student has active books) */}
      {recentlyReadBooks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Continue Reading
              </h2>
            </div>
            <button
              onClick={() => onNavigate('student-library')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              My Library &amp; History <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentlyReadBooks.map((book) => {
              const item = userLibrary[book.id];
              return (
                <div
                  key={book.id}
                  onClick={() => onReadBook(book)}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-3 group"
                >
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-14 h-20 object-cover rounded-lg shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      {book.subject}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 mt-1">
                      {book.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Last on Page {item?.lastReadPage || 1} of {item?.totalPages || book.pageCount}
                    </p>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${item?.readingProgressPercent || 5}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. Browse By Category: Classes, Boards & Competitive Exams */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore by Class, Board &amp; Examination
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Targeted academic resources structured according to the latest prescribed syllabi and marking schemes.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: 'Class 6', type: 'classLevel', value: 'Class 6', icon: '6' },
            { label: 'Class 7', type: 'classLevel', value: 'Class 7', icon: '7' },
            { label: 'Class 8', type: 'classLevel', value: 'Class 8', icon: '8' },
            { label: 'Class 9', type: 'classLevel', value: 'Class 9', icon: '9' },
            { label: 'Class 10', type: 'classLevel', value: 'Class 10', icon: '10' },
            { label: 'Class 11', type: 'classLevel', value: 'Class 11', icon: '11' },
            { label: 'Class 12', type: 'classLevel', value: 'Class 12', icon: '12' },
            { label: 'Undergrad', type: 'classLevel', value: 'Undergraduate', icon: 'UG' },
          ].map((c) => (
            <button
              key={c.label}
              onClick={() => handleCategoryClick(c.type, c.value)}
              className="p-3 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-2xl shadow-sm text-center transition group flex flex-col items-center justify-center gap-1.5"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold text-sm flex items-center justify-center group-hover:scale-110 transition">
                {c.icon}
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600">
                {c.label}
              </span>
            </button>
          ))}
        </div>

        {/* Board & Exam Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* CBSE */}
          <div 
            onClick={() => handleCategoryClick('board', 'CBSE')}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/40 dark:from-slate-900 dark:to-slate-800/80 border border-blue-200 dark:border-slate-700/80 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                National Board
              </span>
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
              CBSE Curriculum
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Classes 9 to 12 sample question papers, marking schemes, and exemplar solutions.
            </p>
          </div>

          {/* Bihar Board */}
          <div 
            onClick={() => handleCategoryClick('board', 'Bihar Board')}
            className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 dark:from-slate-900 dark:to-slate-800/80 border border-emerald-200 dark:border-slate-700/80 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                State Board
              </span>
              <Award className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition">
              Bihar Board (BSEB)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Matric &amp; Inter model papers, OMR strategy sheets, and Hindi-medium study materials.
            </p>
          </div>

          {/* MP Board */}
          <div 
            onClick={() => handleCategoryClick('board', 'MP Board')}
            className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/40 dark:from-slate-900 dark:to-slate-800/80 border border-amber-200 dark:border-slate-700/80 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                State Board
              </span>
              <Layers className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition">
              MP Board (MPBSE)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Madhya Pradesh High School and Intermediate blue-print notes and formula sheets.
            </p>
          </div>

          {/* IIT JEE & NEET */}
          <div 
            onClick={() => handleCategoryClick('exam', 'IIT JEE')}
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/40 dark:from-slate-900 dark:to-slate-800/80 border border-purple-200 dark:border-slate-700/80 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                Competitive Entrances
              </span>
              <Flame className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition">
              IIT JEE &amp; NEET UG
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              High-yield question banks, previous year solved papers (PYQ), and concept notes.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Featured Resources */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Featured Resources
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Hand-picked by academic reviewers for comprehensive syllabus coverage.
            </p>
          </div>

          <button
            onClick={() => onNavigate('library')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            View Complete Library <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onOpenDetail={onSelectBook}
              onReadOnline={onReadBook}
            />
          ))}
        </div>
      </section>

      {/* 5. Popular Downloads & Recently Added Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Popular Downloads List */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DownloadCloud className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Popular Student Downloads
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Top Reads</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {popularBooks.map((book, idx) => (
                <div
                  key={book.id}
                  onClick={() => onSelectBook(book)}
                  className="py-3 flex items-center gap-3 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl px-2 transition"
                >
                  <span className="w-6 font-mono font-bold text-sm text-slate-400 group-hover:text-blue-600">
                    0{idx + 1}
                  </span>
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-10 h-14 object-cover rounded shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600">
                      {book.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {book.subject} • {book.classLevel}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                      {book.downloadCount} dl
                    </span>
                    <span className="text-[10px] text-slate-400">Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Added Resources List */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Recently Added Materials
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Latest</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => onSelectBook(book)}
                  className="py-3 flex items-center gap-3 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl px-2 transition"
                >
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-10 h-14 object-cover rounded shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                        {book.board}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {book.contentType.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600">
                      {book.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {book.chapter}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReadBook(book);
                    }}
                    className="p-2 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition"
                    title="Read Online"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 6. Editorial Study Guides & Academic Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Editorial Study Guides &amp; Articles
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Topper roadmaps, marking rubrics, and high-scoring revision timetables.
            </p>
          </div>

          <button
            onClick={() => onNavigate('articles')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            All Articles <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((art) => (
            <div
              key={art.id}
              onClick={() => onNavigate('articles', art.slug)}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[10px]">
                    {art.category}
                  </span>
                  <span>{art.readTime}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition leading-snug mb-2">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 truncate max-w-[150px]">{art.author}</span>
                <span className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Read Guide <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Clearly Labelled Sponsored & Affiliate Recommendations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 rounded-3xl p-6 sm:p-8 border border-amber-500/20">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white">
                  Sponsored Reference Picks
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Recommended Physical Reference Books
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Hand-selected printed practice books and hard-copy entrance references.
              </p>
            </div>

            <button
              onClick={() => onNavigate('affiliates')}
              className="text-xs font-semibold text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1"
            >
              Browse all recommended picks <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {affiliates.filter((a) => a.isActive).slice(0, 4).map((aff) => (
              <div
                key={aff.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                    <img
                      src={aff.imageUrl}
                      alt={aff.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur">
                      via {aff.merchant}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 mb-1">
                    {aff.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                    {aff.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {aff.priceDisplay}
                  </span>
                  <a
                    href={aff.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => recordAffiliateClick(aff.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition"
                  >
                    <span>View Deal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 text-center">
            Disclosure: EDSU participates in verified affiliate partnerships. Purchases made through these external merchant links support our free digital educational server hosting at no extra charge to students.
          </p>
        </div>
      </section>

      {/* 8. Newsletter Signup (Configured) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-8 sm:p-10 rounded-3xl shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight">
            Stay Updated with New Board Papers &amp; Syllabus Changes
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 max-w-lg mx-auto">
            Receive weekly notifications when fresh official CBSE, BSEB, MPBSE model test papers and NCERT revision summaries are uploaded to EDSU. No spam.
          </p>

          {newsletterSubmitted ? (
            <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl inline-flex items-center gap-2 text-xs font-bold text-emerald-200">
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Thank you! You are subscribed to EDSU Educational Alerts.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your student email..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-blue-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-white text-blue-900 font-bold text-xs sm:text-sm shadow hover:bg-blue-50 transition"
              >
                Subscribe Free
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};
