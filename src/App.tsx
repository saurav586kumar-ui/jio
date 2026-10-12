import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { LibraryView } from './views/LibraryView';
import { BookDetailView } from './views/BookDetailView';
import { StudentLibraryView } from './views/StudentLibraryView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { ArticlesView } from './views/ArticlesView';
import { AffiliatesView } from './views/AffiliatesView';
import { LegalPagesView } from './views/LegalPagesView';
import { PdfReaderModal } from './components/PdfReaderModal';
import { SearchAutocompleteModal } from './components/SearchAutocompleteModal';
import { Book } from './types';

function AppContent() {
  const { books, setFilter } = useLibrary();

  // Navigation states
  const [currentView, setCurrentView] = useState<'home' | 'library' | 'book-detail' | 'student-library' | 'admin' | 'articles' | 'affiliates' | 'legal'>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeReadingBook, setActiveReadingBook] = useState<Book | null>(null);
  const [activeLegalTab, setActiveLegalTab] = useState<string>('about');
  const [activeArticleSlug, setActiveArticleSlug] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('edsu_theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('edsu_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('edsu_theme', 'light');
    }
  }, [darkMode]);

  // URL sync & deep linking support
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('book');
    const viewParam = params.get('view');

    if (bookId) {
      const found = books.find((b) => b.id === bookId);
      if (found) {
        setSelectedBook(found);
        setCurrentView('book-detail');
      }
    } else if (viewParam) {
      if (['home', 'library', 'student-library', 'admin', 'articles', 'affiliates', 'legal'].includes(viewParam)) {
        setCurrentView(viewParam as any);
      }
    }
  }, [books]);

  // Handle URL history state update
  const navigateTo = (view: string, subParam?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'book-detail' && selectedBook) {
      window.history.pushState({}, '', `?book=${selectedBook.id}`);
    } else if (view === 'home') {
      window.history.pushState({}, '', window.location.pathname);
    } else {
      window.history.pushState({}, '', `?view=${view}`);
    }

    if (view === 'legal') {
      setActiveLegalTab(subParam || 'about');
    } else if (view === 'articles') {
      setActiveArticleSlug(subParam);
    }

    setCurrentView(view as any);
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    window.history.pushState({}, '', `?book=${book.id}`);
    setCurrentView('book-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadOnline = (book: Book) => {
    setActiveReadingBook(book);
  };

  const handleSearchNavigate = (queryStr: string) => {
    setFilter((prev) => ({ ...prev, searchQuery: queryStr }));
    navigateTo('library');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onNavigate={navigateTo}
            onOpenSearch={() => setIsSearchOpen(true)}
            onSelectBook={handleSelectBook}
            onReadBook={handleReadOnline}
          />
        )}

        {currentView === 'library' && (
          <LibraryView
            onSelectBook={handleSelectBook}
            onReadBook={handleReadOnline}
          />
        )}

        {currentView === 'book-detail' && selectedBook && (
          <BookDetailView
            book={selectedBook}
            onBack={() => navigateTo('library')}
            onReadOnline={handleReadOnline}
            onSelectBook={handleSelectBook}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'student-library' && (
          <StudentLibraryView
            onSelectBook={handleSelectBook}
            onReadBook={handleReadOnline}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardView />
        )}

        {currentView === 'articles' && (
          <ArticlesView
            initialSlug={activeArticleSlug}
            onSelectBook={handleSelectBook}
            onNavigateToLibrary={() => navigateTo('library')}
          />
        )}

        {currentView === 'affiliates' && (
          <AffiliatesView />
        )}

        {currentView === 'legal' && (
          <LegalPagesView
            initialTab={activeLegalTab}
            onNavigateHome={() => navigateTo('home')}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Fullscreen PDF Reader Modal */}
      {activeReadingBook && (
        <PdfReaderModal
          book={activeReadingBook}
          onClose={() => setActiveReadingBook(null)}
        />
      )}

      {/* Global Search Autocomplete Modal */}
      <SearchAutocompleteModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectBook={handleSelectBook}
        onNavigateToLibrary={handleSearchNavigate}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LibraryProvider>
        <AppContent />
      </LibraryProvider>
    </AuthProvider>
  );
}
