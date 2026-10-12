import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  BookOpen, 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  Sparkles, 
  Download, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from '../components/BookCard';
import { Book, FilterState } from '../types';

interface LibraryViewProps {
  onSelectBook: (book: Book) => void;
  onReadBook: (book: Book) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onSelectBook, onReadBook }) => {
  const { filteredBooks, filter, setFilter, books, categories } = useLibrary();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Pagination calculation
  const totalItems = filteredBooks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setFilter({
      searchQuery: '',
      classLevel: 'all',
      board: 'all',
      exam: 'all',
      subject: 'all',
      contentType: 'all',
      language: 'all',
      availability: 'all',
      sortBy: 'relevance',
    });
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof FilterState, val: string) => {
    setFilter((prev) => ({ ...prev, [key]: val }));
    setCurrentPage(1);
  };

  // Distinct subjects, boards, classes from dynamic data + categories
  const dynamicClasses = Array.from(new Set([
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Undergraduate', 'General',
    ...categories.filter((c) => c.type === 'class').map((c) => c.name),
  ]));

  const dynamicBoards = Array.from(new Set([
    'CBSE', 'ICSE', 'Bihar Board', 'MP Board', 'NCERT', 'UP Board', 'State Board', 'General',
    ...categories.filter((c) => c.type === 'board').map((c) => c.name),
  ]));

  const dynamicExams = Array.from(new Set([
    'IIT JEE', 'NEET', 'CUET', 'NDA', 'Board Exams', 'Foundation', 'None',
    ...categories.filter((c) => c.type === 'exam').map((c) => c.name),
  ]));

  const dynamicSubjects = Array.from(new Set([
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Science', 'Social Science', 'English', 'Hindi', 'Computer Science', 'General Studies',
    ...categories.filter((c) => c.type === 'subject').map((c) => c.name),
  ]));

  const materialTypes = [
    { label: 'All Material Types', value: 'all' },
    { label: 'Textbooks', value: 'textbook' },
    { label: 'Revision Notes', value: 'notes' },
    { label: 'NCERT Solutions', value: 'solutions' },
    { label: 'Question Banks', value: 'question_bank' },
    { label: 'Sample Papers', value: 'sample_paper' },
    { label: 'Previous Year Papers (PYQ)', value: 'pyq' },
    { label: 'Reference Books', value: 'reference_book' },
    { label: 'Study Guides', value: 'study_guide' },
  ];

  const hasActiveFilters = 
    filter.searchQuery ||
    filter.classLevel !== 'all' ||
    filter.board !== 'all' ||
    filter.exam !== 'all' ||
    filter.subject !== 'all' ||
    filter.contentType !== 'all' ||
    filter.language !== 'all' ||
    filter.availability !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              Verified Digital Catalog
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Digital Books &amp; Study Resources Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse through {books.length} authentic educational PDFs categorized by curriculum, subject, and examination.
          </p>
        </div>

        {/* View Mode & Sorter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={filter.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevance">Sort: Most Relevant</option>
              <option value="popularity">Sort: Most Popular</option>
              <option value="newest">Sort: Newly Added</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Catalog Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Refine Catalog
                </h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Keyword / Chapter Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={filter.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  placeholder="e.g. Calculus, Optics..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Class / Education Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Class / Standard
              </label>
              <select
                value={filter.classLevel}
                onChange={(e) => handleFilterChange('classLevel', e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Classes (6–12 &amp; Beyond)</option>
                {dynamicClasses.map((cl) => (
                  <option key={cl} value={cl}>
                    {cl}
                  </option>
                ))}
              </select>
            </div>

            {/* Education Board */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Board / Curriculum
              </label>
              <select
                value={filter.board}
                onChange={(e) => handleFilterChange('board', e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Boards</option>
                {dynamicBoards.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Competitive Examination */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Target Examination
              </label>
              <select
                value={filter.exam}
                onChange={(e) => handleFilterChange('exam', e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Examinations</option>
                {dynamicExams.map((ex) => (
                  <option key={ex} value={ex}>
                    {ex}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Subject */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Academic Subject
              </label>
              <select
                value={filter.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Subjects</option>
                {dynamicSubjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Material Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Material Format
              </label>
              <select
                value={filter.contentType}
                onChange={(e) => handleFilterChange('contentType', e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {materialTypes.map((mt) => (
                  <option key={mt.value} value={mt.value}>
                    {mt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Language
              </label>
              <select
                value={filter.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Languages</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Bilingual">Bilingual</option>
              </select>
            </div>

            {/* Availability */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Availability
              </label>
              <select
                value={filter.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value as any)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Any Availability</option>
                <option value="download_allowed">Download Allowed</option>
                <option value="read_only">Read Online Only</option>
              </select>
            </div>

          </div>
        </aside>

        {/* Catalog Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex items-center flex-wrap gap-2 p-3 bg-blue-50/50 dark:bg-slate-900 rounded-2xl border border-blue-100 dark:border-slate-800 text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Active Filters:</span>
              {filter.searchQuery && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  Keyword: "{filter.searchQuery}"
                </span>
              )}
              {filter.classLevel !== 'all' && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  {filter.classLevel}
                </span>
              )}
              {filter.board !== 'all' && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  {filter.board}
                </span>
              )}
              {filter.exam !== 'all' && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  {filter.exam}
                </span>
              )}
              {filter.subject !== 'all' && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  {filter.subject}
                </span>
              )}
              {filter.contentType !== 'all' && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  {filter.contentType}
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-red-600 dark:text-red-400 hover:underline font-bold ml-auto"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Result Count */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-800 dark:text-slate-200">{filteredBooks.length}</strong> matching educational resources
            </span>
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {/* Book Cards Display */}
          {paginatedBooks.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onOpenDetail={onSelectBook}
                    onReadOnline={onReadBook}
                  />
                ))}
              </div>
            ) : (
              /* List Mode */
              <div className="space-y-4">
                {paginatedBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => onSelectBook(book)}
                    className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4 group"
                  >
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded-xl shadow-sm shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                          {book.board}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {book.classLevel}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          • {book.contentType.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition truncate">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {book.description}
                      </p>
                      <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2">
                        <span>By {book.author}</span>
                        <span>•</span>
                        <span>{book.pageCount} pages</span>
                        <span>•</span>
                        <span>{book.viewCount} reads</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReadBook(book);
                        }}
                        className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
                      >
                        Read Online
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* No Results Empty State */
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No educational resources match these filters
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try widening your search criteria by removing specific exam or board constraints, or click "Reset All Filters".
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                    currentPage === pg
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Next
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
