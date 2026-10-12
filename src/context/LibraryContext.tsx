import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  increment,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testConnection } from '../lib/firebase';
import { Book, CategoryItem, AffiliateProduct, Article, UserLibraryItem, FilterState } from '../types';
import { INITIAL_BOOKS, INITIAL_CATEGORIES, INITIAL_AFFILIATES, INITIAL_ARTICLES } from '../lib/seedData';
import { useAuth } from './AuthContext';

interface LibraryContextType {
  books: Book[];
  categories: CategoryItem[];
  affiliates: AffiliateProduct[];
  articles: Article[];
  userLibrary: Record<string, UserLibraryItem>;
  loading: boolean;
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  filteredBooks: Book[];
  addBook: (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'downloadCount'>) => Promise<Book>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  toggleFeatureBook: (id: string, current: boolean) => Promise<void>;
  togglePublishBook: (id: string, current: boolean) => Promise<void>;
  recordBookView: (id: string) => Promise<void>;
  recordBookDownload: (id: string) => Promise<void>;
  recordAffiliateClick: (id: string) => Promise<void>;
  addCategory: (cat: Omit<CategoryItem, 'id' | 'createdAt'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addAffiliate: (aff: Omit<AffiliateProduct, 'id' | 'createdAt' | 'clickCount'>) => Promise<void>;
  updateAffiliate: (id: string, aff: Partial<AffiliateProduct>) => Promise<void>;
  deleteAffiliate: (id: string) => Promise<void>;
  toggleBookmark: (book: Book) => Promise<void>;
  updateReadingProgress: (bookId: string, page: number, totalPages: number, bookTitle: string, coverUrl: string) => Promise<void>;
  activeReadingBook: Book | null;
  setActiveReadingBook: (book: Book | null) => void;
  selectedBookForModal: Book | null;
  setSelectedBookForModal: (book: Book | null) => void;
  seedInitialDataToFirestore: () => Promise<void>;
}

const initialFilterState: FilterState = {
  searchQuery: '',
  classLevel: 'all',
  board: 'all',
  exam: 'all',
  subject: 'all',
  contentType: 'all',
  language: 'all',
  availability: 'all',
  sortBy: 'relevance',
};

const LibraryContext = createContext<LibraryContextType | null>(null);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, currentUserId, isDemoUser } = useAuth();
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [affiliates, setAffiliates] = useState<AffiliateProduct[]>(INITIAL_AFFILIATES);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [userLibrary, setUserLibrary] = useState<Record<string, UserLibraryItem>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<FilterState>(initialFilterState);
  const [activeReadingBook, setActiveReadingBook] = useState<Book | null>(null);
  const [selectedBookForModal, setSelectedBookForModal] = useState<Book | null>(null);

  // Initialize test connection and fetch remote Firestore collections
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        await testConnection();

        // Load Books from Firestore
        const booksCol = collection(db, 'books');
        const booksSnap = await getDocs(booksCol).catch((err) => {
          console.warn('Initial books fetch from Firestore had notice; using verified catalog', err);
          return null;
        });

        if (isMounted && booksSnap && !booksSnap.empty) {
          const loadedBooks: Book[] = [];
          booksSnap.forEach((doc) => {
            loadedBooks.push({ id: doc.id, ...doc.data() } as Book);
          });
          setBooks(loadedBooks);
        }

        // Load Categories from Firestore
        const catCol = collection(db, 'categories');
        const catSnap = await getDocs(catCol).catch(() => null);
        if (isMounted && catSnap && !catSnap.empty) {
          const loadedCats: CategoryItem[] = [];
          catSnap.forEach((doc) => loadedCats.push({ id: doc.id, ...doc.data() } as CategoryItem));
          setCategories(loadedCats);
        }

        // Load Affiliates
        const affCol = collection(db, 'affiliates');
        const affSnap = await getDocs(affCol).catch(() => null);
        if (isMounted && affSnap && !affSnap.empty) {
          const loadedAffs: AffiliateProduct[] = [];
          affSnap.forEach((doc) => loadedAffs.push({ id: doc.id, ...doc.data() } as AffiliateProduct));
          setAffiliates(loadedAffs);
        }

        // Load Articles
        const artCol = collection(db, 'articles');
        const artSnap = await getDocs(artCol).catch(() => null);
        if (isMounted && artSnap && !artSnap.empty) {
          const loadedArts: Article[] = [];
          artSnap.forEach((doc) => loadedArts.push({ id: doc.id, ...doc.data() } as Article));
          setArticles(loadedArts);
        }
      } catch (err) {
        console.warn('Data sync notice:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, []);

  // Listen to Student User Library (Bookmarks & Reading progress)
  useEffect(() => {
    if (!user && !isDemoUser) {
      setUserLibrary({});
      return;
    }

    if (isDemoUser) {
      // Load local student storage for demo
      const stored = localStorage.getItem('edsu_demo_library');
      if (stored) {
        try {
          setUserLibrary(JSON.parse(stored));
        } catch {
          setUserLibrary({});
        }
      }
      return;
    }

    if (user) {
      const userLibCol = collection(db, `users/${user.uid}/library`);
      const unsub = onSnapshot(
        userLibCol,
        (snapshot) => {
          const map: Record<string, UserLibraryItem> = {};
          snapshot.forEach((d) => {
            map[d.id] = d.data() as UserLibraryItem;
          });
          setUserLibrary(map);
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}/library`);
        }
      );

      return () => unsub();
    }
  }, [user, isDemoUser]);

  // Seed Initial Data to Firestore (for admin convenience)
  const seedInitialDataToFirestore = async () => {
    try {
      for (const book of INITIAL_BOOKS) {
        await setDoc(doc(db, 'books', book.id), book, { merge: true });
      }
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat, { merge: true });
      }
      for (const aff of INITIAL_AFFILIATES) {
        await setDoc(doc(db, 'affiliates', aff.id), aff, { merge: true });
      }
      for (const art of INITIAL_ARTICLES) {
        await setDoc(doc(db, 'articles', art.id), art, { merge: true });
      }
      console.log('Seed data successfully synchronized to Firestore');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'seed');
    }
  };

  // Add Book
  const addBook = async (
    bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'downloadCount'>
  ): Promise<Book> => {
    const newId = `edsu-book-${Date.now()}`;
    const nowIso = new Date().toISOString();
    const newBook: Book = {
      ...bookData,
      id: newId,
      viewCount: 0,
      downloadCount: 0,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    try {
      await setDoc(doc(db, 'books', newId), newBook);
      setBooks((prev) => [newBook, ...prev]);
      return newBook;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `books/${newId}`);
      // Fallback local update
      setBooks((prev) => [newBook, ...prev]);
      return newBook;
    }
  };

  // Update Book
  const updateBook = async (id: string, updates: Partial<Book>) => {
    const updatedPayload = { ...updates, updatedAt: new Date().toISOString() };
    try {
      await updateDoc(doc(db, 'books', id), updatedPayload);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `books/${id}`);
    }
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updatedPayload } : b)));
  };

  // Delete Book
  const deleteBook = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'books', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `books/${id}`);
    }
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  // Toggle Feature
  const toggleFeatureBook = async (id: string, current: boolean) => {
    await updateBook(id, { isFeatured: !current });
  };

  // Toggle Publish
  const togglePublishBook = async (id: string, current: boolean) => {
    await updateBook(id, { published: !current });
  };

  // Record View
  const recordBookView = async (id: string) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, viewCount: (b.viewCount || 0) + 1 } : b)));
    try {
      await updateDoc(doc(db, 'books', id), { viewCount: increment(1) });
    } catch {
      // Non-blocking view count tracking
    }
  };

  // Record Download
  const recordBookDownload = async (id: string) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, downloadCount: (b.downloadCount || 0) + 1 } : b)));
    try {
      await updateDoc(doc(db, 'books', id), { downloadCount: increment(1) });
    } catch {
      // Non-blocking download count tracking
    }
  };

  // Record Affiliate Click
  const recordAffiliateClick = async (id: string) => {
    setAffiliates((prev) =>
      prev.map((a) => (a.id === id ? { ...a, clickCount: (a.clickCount || 0) + 1 } : a))
    );
    try {
      await updateDoc(doc(db, 'affiliates', id), { clickCount: increment(1) });
    } catch {
      // Non-blocking click tracking
    }
  };

  // Categories CRUD
  const addCategory = async (cat: Omit<CategoryItem, 'id' | 'createdAt'>) => {
    const id = `cat-${Date.now()}`;
    const newCat: CategoryItem = { ...cat, id, createdAt: new Date().toISOString() };
    try {
      await setDoc(doc(db, 'categories', id), newCat);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `categories/${id}`);
    }
    setCategories((prev) => [...prev, newCat]);
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Affiliate CRUD
  const addAffiliate = async (aff: Omit<AffiliateProduct, 'id' | 'createdAt' | 'clickCount'>) => {
    const id = `aff-${Date.now()}`;
    const newAff: AffiliateProduct = {
      ...aff,
      id,
      clickCount: 0,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'affiliates', id), newAff);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `affiliates/${id}`);
    }
    setAffiliates((prev) => [...prev, newAff]);
  };

  const updateAffiliate = async (id: string, aff: Partial<AffiliateProduct>) => {
    try {
      await updateDoc(doc(db, 'affiliates', id), aff);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `affiliates/${id}`);
    }
    setAffiliates((prev) => prev.map((a) => (a.id === id ? { ...a, ...aff } : a)));
  };

  const deleteAffiliate = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'affiliates', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `affiliates/${id}`);
    }
    setAffiliates((prev) => prev.filter((a) => a.id !== id));
  };

  // Student Library: Bookmark toggle
  const toggleBookmark = async (book: Book) => {
    const existing = userLibrary[book.id];
    const isCurrentlyBookmarked = existing?.isBookmarked ?? false;
    const nextState = !isCurrentlyBookmarked;

    const item: UserLibraryItem = {
      bookId: book.id,
      userId: currentUserId,
      bookTitle: book.title,
      coverUrl: book.coverUrl,
      isBookmarked: nextState,
      lastReadPage: existing?.lastReadPage || 1,
      totalPages: existing?.totalPages || book.pageCount,
      readingProgressPercent: existing?.readingProgressPercent || 0,
      lastReadAt: new Date().toISOString(),
      notes: existing?.notes || '',
    };

    if (user) {
      const docPath = `users/${user.uid}/library/${book.id}`;
      try {
        await setDoc(doc(db, docPath), item, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, docPath);
      }
    } else {
      // Save locally for guest/demo student
      const updated = { ...userLibrary, [book.id]: item };
      setUserLibrary(updated);
      localStorage.setItem('edsu_demo_library', JSON.stringify(updated));
    }
  };

  // Student Library: Update Reading Progress
  const updateReadingProgress = async (
    bookId: string,
    page: number,
    totalPages: number,
    bookTitle: string,
    coverUrl: string
  ) => {
    const existing = userLibrary[bookId];
    const safeTotal = totalPages > 0 ? totalPages : 1;
    const progressPercent = Math.min(100, Math.round((page / safeTotal) * 100));

    const item: UserLibraryItem = {
      bookId,
      userId: currentUserId,
      bookTitle,
      coverUrl,
      isBookmarked: existing?.isBookmarked || false,
      lastReadPage: page,
      totalPages: safeTotal,
      readingProgressPercent: progressPercent,
      lastReadAt: new Date().toISOString(),
      notes: existing?.notes || '',
    };

    if (user) {
      const docPath = `users/${user.uid}/library/${bookId}`;
      try {
        await setDoc(doc(db, docPath), item, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, docPath);
      }
    } else {
      const updated = { ...userLibrary, [bookId]: item };
      setUserLibrary(updated);
      localStorage.setItem('edsu_demo_library', JSON.stringify(updated));
    }
  };

  // Filtered & Sorted Books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Must be published unless admin viewing
      if (!book.published) return false;

      // Query
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase().trim();
        const matchesTitle = book.title.toLowerCase().includes(q);
        const matchesAuthor = book.author.toLowerCase().includes(q);
        const matchesSubject = book.subject.toLowerCase().includes(q);
        const matchesBoard = book.board.toLowerCase().includes(q);
        const matchesExam = book.exam.toLowerCase().includes(q);
        const matchesTags = book.tags.toLowerCase().includes(q);
        const matchesChapter = book.chapter.toLowerCase().includes(q);
        const matchesDesc = book.description.toLowerCase().includes(q);

        if (!matchesTitle && !matchesAuthor && !matchesSubject && !matchesBoard && !matchesExam && !matchesTags && !matchesChapter && !matchesDesc) {
          return false;
        }
      }

      // Class
      if (filter.classLevel !== 'all' && book.classLevel !== filter.classLevel) {
        return false;
      }

      // Board
      if (filter.board !== 'all' && book.board !== filter.board) {
        return false;
      }

      // Exam
      if (filter.exam !== 'all' && book.exam !== filter.exam) {
        return false;
      }

      // Subject
      if (filter.subject !== 'all' && book.subject !== filter.subject) {
        return false;
      }

      // Material Type
      if (filter.contentType !== 'all' && book.contentType !== filter.contentType) {
        return false;
      }

      // Language
      if (filter.language !== 'all' && book.language !== filter.language) {
        return false;
      }

      // Availability
      if (filter.availability === 'download_allowed' && !book.downloadPermitted) {
        return false;
      }
      if (filter.availability === 'read_only' && book.downloadPermitted) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (filter.sortBy === 'popularity') {
        return (b.viewCount + (b.downloadCount * 2)) - (a.viewCount + (a.downloadCount * 2));
      }
      if (filter.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      // Relevance: featured first, then views
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (b.viewCount || 0) - (a.viewCount || 0);
    });
  }, [books, filter]);

  return (
    <LibraryContext.Provider
      value={{
        books,
        categories,
        affiliates,
        articles,
        userLibrary,
        loading,
        filter,
        setFilter,
        filteredBooks,
        addBook,
        updateBook,
        deleteBook,
        toggleFeatureBook,
        togglePublishBook,
        recordBookView,
        recordBookDownload,
        recordAffiliateClick,
        addCategory,
        deleteCategory,
        addAffiliate,
        updateAffiliate,
        deleteAffiliate,
        toggleBookmark,
        updateReadingProgress,
        activeReadingBook,
        setActiveReadingBook,
        selectedBookForModal,
        setSelectedBookForModal,
        seedInitialDataToFirestore,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within LibraryProvider');
  return context;
};
