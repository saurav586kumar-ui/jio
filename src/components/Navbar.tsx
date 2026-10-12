import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Moon, 
  Sun, 
  User, 
  LogIn, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  Bookmark, 
  Compass, 
  GraduationCap, 
  ChevronDown,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenSearch: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenSearch,
  darkMode,
  setDarkMode,
}) => {
  const { user, isAdmin, isDemoUser, signInGoogle, signOut, activateGuestMode, currentUserName } = useAuth();
  const { userLibrary } = useLibrary();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [boardDropdownOpen, setBoardDropdownOpen] = useState(false);

  const bookmarkCount = Object.values(userLibrary).filter((item) => item.isBookmarked).length;

  // Keyboard shortcut Cmd+K or / for search
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenSearch();
      } else if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onOpenSearch]);

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setBoardDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  EDSU
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 uppercase tracking-wider">
                  Library
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block -mt-1 tracking-tight">
                Digital Books &amp; Learning
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'home'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('library')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'library'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Browse Library
            </button>

            {/* Boards & Exams Submenu */}
            <div className="relative">
              <button
                onClick={() => setBoardDropdownOpen(!boardDropdownOpen)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 transition"
              >
                <span>Curricula &amp; Exams</span>
                <ChevronDown className={`w-3.5 h-3.5 transition transform ${boardDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {boardDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-60 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setBoardDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Education Boards
                  </div>
                  <button
                    onClick={() => handleNavClick('library')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>CBSE Board (Classes 6–12)</span>
                    <span className="text-[10px] text-blue-600">Verified</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('library')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>Bihar Board (BSEB)</span>
                    <span className="text-[10px] text-emerald-600">Model Papers</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('library')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>MP Board (MPBSE)</span>
                    <span className="text-[10px] text-amber-600">Notes</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('library')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    NCERT Complete Textbooks
                  </button>
                  
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                  
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Competitive Entrances
                  </div>
                  <button
                    onClick={() => handleNavClick('library')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    IIT JEE Main &amp; Advanced
                  </button>
                  <button
                    onClick={() => handleNavClick('library')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    NEET UG Medical Entrance
                  </button>
                  <button
                    onClick={() => handleNavClick('library')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    CUET UG General &amp; Domain
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('articles')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'articles'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Study Guides
            </button>

            <button
              onClick={() => handleNavClick('affiliates')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition ${
                currentView === 'affiliates'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
              <span>Recommended Books</span>
            </button>
          </nav>

          {/* Right Action Tools: Search, DarkMode, Account, Admin */}
          <div className="flex items-center gap-2">
            
            {/* Quick Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition"
              title="Search Library (Press / or Cmd+K)"
            >
              <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="hidden md:inline">Search library...</span>
              <kbd className="hidden md:inline-block text-[10px] bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600 text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Student My Library Bookmark shortcut */}
            {(user || isDemoUser) && (
              <button
                onClick={() => handleNavClick('student-library')}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition hidden sm:inline-flex"
                title="My Library & Bookmarks"
              >
                <Bookmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                {bookmarkCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {bookmarkCount}
                  </span>
                )}
              </button>
            )}

            {/* Admin Dashboard Badge if Admin */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  currentView === 'admin'
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                    : 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700 hover:bg-amber-200'
                }`}
                title="Open Administrator Console"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Panel</span>
              </button>
            )}

            {/* User Account Controls */}
            {user || isDemoUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {user?.displayName ? user.displayName.charAt(0) : 'S'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {currentUserName}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user?.email || (isDemoUser ? 'Student Guest Mode' : '')}
                      </p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                          Super Admin
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleNavClick('student-library')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-blue-600" />
                      <span>My Library &amp; Progress</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleNavClick('admin')}
                        className="w-full text-left px-4 py-2 text-xs text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-800 flex items-center gap-2 font-semibold"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                    <button
                      onClick={() => {
                        signOut();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => signInGoogle().catch(() => activateGuestMode())}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
                <button
                  onClick={activateGuestMode}
                  className="hidden md:inline-flex px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  title="Preview as Student"
                >
                  Guest
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('library')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Browse Library
          </button>
          <button
            onClick={() => handleNavClick('articles')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Study Guides &amp; Articles
          </button>
          <button
            onClick={() => handleNavClick('affiliates')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
          >
            <span>Recommended Reference Books</span>
            <span className="text-[10px] text-amber-500 font-bold">Affiliate</span>
          </button>

          {(user || isDemoUser) && (
            <button
              onClick={() => handleNavClick('student-library')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Bookmark className="w-4 h-4" />
              <span>My Student Library ({bookmarkCount})</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Management Dashboard</span>
            </button>
          )}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">Theme</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
