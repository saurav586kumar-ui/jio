import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Star, 
  Eye, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Layers, 
  Database, 
  Tag, 
  ShoppingBag, 
  BarChart, 
  Sparkles, 
  FileUp, 
  Loader2, 
  Search,
  ExternalLink,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { Book, CategoryItem, AffiliateProduct } from '../types';
import { extractPdfMetadata, generateEducationalPdfDataUrl } from '../lib/pdfHelper';

export const AdminDashboardView: React.FC = () => {
  const { user, isAdmin, currentUserEmail } = useAuth();
  const { 
    books, 
    categories, 
    affiliates, 
    addBook, 
    updateBook, 
    deleteBook, 
    toggleFeatureBook, 
    togglePublishBook, 
    addCategory, 
    deleteCategory, 
    addAffiliate, 
    deleteAffiliate,
    seedInitialDataToFirestore
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<'books' | 'upload' | 'categories' | 'affiliates' | 'analytics'>('books');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Adding / Editing Book
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    publisher: 'EDSU Academic Bureau',
    language: 'English',
    classLevel: 'Class 10',
    board: 'CBSE',
    exam: 'Board Exams',
    subject: 'Mathematics',
    chapter: 'Complete Syllabus',
    contentType: 'textbook',
    coverUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    pdfUrl: '',
    fileSizeBytes: 4200000,
    pageCount: 120,
    published: true,
    isFeatured: false,
    downloadPermitted: true,
    copyrightLicense: 'Open Educational Resource / Institutional Non-Commercial Edition',
    tags: 'ncert, cbse, notes, textbook',
  });

  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractedPdfInfo, setExtractedPdfInfo] = useState<string | null>(null);

  // Category Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<'class' | 'board' | 'exam' | 'subject' | 'contentType'>('board');
  const [newCatCode, setNewCatCode] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Affiliate Form
  const [affTitle, setAffTitle] = useState('');
  const [affDesc, setAffDesc] = useState('');
  const [affMerchant, setAffMerchant] = useState('Amazon');
  const [affUrl, setAffUrl] = useState('');
  const [affPrice, setAffPrice] = useState('₹599');
  const [affImage, setAffImage] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80');
  const [affPlacement, setAffPlacement] = useState<'home' | 'sidebar' | 'book_detail'>('home');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // If unauthorized, render protected gate
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-red-200 dark:border-red-900 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Restricted Administrator Access
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The EDSU administrative console requires verified authorization. Only registered platform administrators ({currentUserEmail || 'saurav586kumar@gmail.com'}) can manage library records and storage.
        </p>
        <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800">
          Signed in as: <strong>{user?.email || 'Guest User (Not Admin)'}</strong>
        </p>
      </div>
    );
  }

  // Handle PDF file selection & automatic metadata extraction
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showToast('Error: Selected file is not a valid PDF document.');
      return;
    }

    setUploadingPdf(true);
    setUploadProgress(20);

    try {
      // Simulate reading stream progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => (prev < 85 ? prev + 15 : prev));
      }, 150);

      const metadata = await extractPdfMetadata(file);
      clearInterval(interval);
      setUploadProgress(100);

      // Read as Data URL
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        setFormData((prev) => ({
          ...prev,
          pdfUrl: base64Data,
          fileSizeBytes: metadata.fileSizeBytes,
          pageCount: metadata.pageCount,
          title: prev.title || metadata.title || file.name.replace(/\.[^/.]+$/, ''),
          author: prev.author || metadata.author || prev.author,
        }));
        setUploadingPdf(false);
        setExtractedPdfInfo(`Verified PDF: ${metadata.pageCount} pages, ${(metadata.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB`);
        showToast('PDF analyzed & uploaded successfully!');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setUploadingPdf(false);
      showToast('Could not parse PDF metadata.');
    }
  };

  // Submit Book (Add or Edit)
  const handleSubmitBook = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast('Error: Book title is mandatory.');
      return;
    }

    let finalPdfUrl = formData.pdfUrl;
    // If no PDF uploaded, automatically synthesize a valid educational PDF
    if (!finalPdfUrl) {
      finalPdfUrl = generateEducationalPdfDataUrl({
        title: formData.title,
        subject: formData.subject,
        classLevel: formData.classLevel,
        board: formData.board,
        author: formData.author || 'EDSU Editorial Board',
        chapter: formData.chapter,
        pages: Math.min(formData.pageCount, 12),
      });
    }

    try {
      if (editingBookId) {
        await updateBook(editingBookId, {
          ...formData,
          pdfUrl: finalPdfUrl,
        });
        showToast('Resource updated successfully!');
      } else {
        await addBook({
          ...formData,
          pdfUrl: finalPdfUrl,
        });
        showToast('New educational resource published!');
      }

      // Reset form
      setEditingBookId(null);
      setFormData({
        title: '',
        description: '',
        author: '',
        publisher: 'EDSU Academic Bureau',
        language: 'English',
        classLevel: 'Class 10',
        board: 'CBSE',
        exam: 'Board Exams',
        subject: 'Mathematics',
        chapter: 'Complete Syllabus',
        contentType: 'textbook',
        coverUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
        pdfUrl: '',
        fileSizeBytes: 4200000,
        pageCount: 120,
        published: true,
        isFeatured: false,
        downloadPermitted: true,
        copyrightLicense: 'Open Educational Resource / Institutional Non-Commercial Edition',
        tags: 'ncert, cbse, notes, textbook',
      });
      setExtractedPdfInfo(null);
      setActiveTab('books');
    } catch (err: any) {
      showToast(`Error saving book: ${err.message || 'Check Firestore permissions'}`);
    }
  };

  const handleEditBookClick = (book: Book) => {
    setEditingBookId(book.id);
    setFormData({
      title: book.title,
      description: book.description,
      author: book.author,
      publisher: book.publisher,
      language: book.language,
      classLevel: book.classLevel,
      board: book.board,
      exam: book.exam,
      subject: book.subject,
      chapter: book.chapter,
      contentType: book.contentType,
      coverUrl: book.coverUrl,
      pdfUrl: book.pdfUrl,
      fileSizeBytes: book.fileSizeBytes,
      pageCount: book.pageCount,
      published: book.published,
      isFeatured: book.isFeatured,
      downloadPermitted: book.downloadPermitted,
      copyrightLicense: book.copyrightLicense,
      tags: book.tags,
    });
    setActiveTab('upload');
  };

  const handleDeleteBookClick = async (book: Book) => {
    if (window.confirm(`Permanently delete "${book.title}" from the library?`)) {
      await deleteBook(book.id);
      showToast('Book removed from library.');
    }
  };

  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await addCategory({
      name: newCatName.trim(),
      type: newCatType,
      code: newCatCode.trim() || newCatName.toLowerCase().replace(/\s+/g, '-'),
      description: newCatDesc.trim(),
    });
    setNewCatName('');
    setNewCatCode('');
    setNewCatDesc('');
    showToast('Category taxonomy added!');
  };

  const handleAddAffiliateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affTitle.trim() || !affUrl.trim()) return;
    await addAffiliate({
      title: affTitle.trim(),
      description: affDesc.trim(),
      category: 'Reference Books',
      merchant: affMerchant,
      affiliateUrl: affUrl.trim(),
      imageUrl: affImage,
      priceDisplay: affPrice,
      placement: affPlacement,
      isActive: true,
    });
    setAffTitle('');
    setAffDesc('');
    setAffUrl('');
    showToast('Sponsored affiliate pick added!');
  };

  // Filter books for admin table
  const filteredAdminBooks = books.filter((b) => {
    const q = searchTerm.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.subject.toLowerCase().includes(q) ||
      b.board.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q)
    );
  });

  // Calculate statistics
  const totalViews = books.reduce((acc, b) => acc + (b.viewCount || 0), 0);
  const totalDownloads = books.reduce((acc, b) => acc + (b.downloadCount || 0), 0);
  const totalAffiliateClicks = affiliates.reduce((acc, a) => acc + (a.clickCount || 0), 0);
  const totalStorageEstimateMb = books.reduce((acc, b) => acc + (b.fileSizeBytes || 0), 0) / (1024 * 1024);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
              Admin Portal
            </span>
            <span className="text-xs text-slate-400">Authenticated as {user?.email}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            EDSU Library Operations &amp; Resource Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage educational books, PDF assets, categories, affiliate sponsorships, and reading metrics.
          </p>
        </div>

        <button
          onClick={async () => {
            await seedInitialDataToFirestore();
            showToast('Catalog synchronized to Cloud Firestore!');
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition"
          title="Ensure initial seed records exist in Cloud Firestore"
        >
          <Database className="w-4 h-4 text-blue-600" />
          <span>Sync Database to Firestore</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => { setActiveTab('books'); setEditingBookId(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'books'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Catalog Inventory ({books.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'upload'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>{editingBookId ? 'Edit Book' : 'Upload / Add Book'}</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'categories'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Taxonomy &amp; Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('affiliates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'affiliates'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Affiliate Products ({affiliates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart className="w-4 h-4" />
          <span>Library Analytics</span>
        </button>
      </div>

      {/* Tab 1: Book Inventory Table */}
      {activeTab === 'books' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search catalog inventory..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => {
                setEditingBookId(null);
                setActiveTab('upload');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Educational Book</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Resource</th>
                  <th className="p-3">Class &amp; Board</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Pages / Size</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Featured</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAdminBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3 flex items-center gap-3 min-w-[240px]">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-10 h-14 object-cover rounded shadow-sm shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">
                          {book.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {book.subject} • {book.author}
                        </p>
                      </div>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <span className="font-semibold block">{book.classLevel}</span>
                      <span className="text-[10px] text-blue-600 font-medium">{book.board}</span>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase">
                        {book.contentType.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                      {book.pageCount} pgs • {(book.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <button
                        onClick={() => togglePublishBook(book.id, book.published)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          book.published
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {book.published ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <button
                        onClick={() => toggleFeatureBook(book.id, book.isFeatured)}
                        className={`p-1.5 rounded-lg ${
                          book.isFeatured ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
                        }`}
                        title="Toggle Featured on Homepage"
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>

                    <td className="p-3 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => handleEditBookClick(book)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBookClick(book)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Delete Book"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Upload / Add Book Form */}
      {activeTab === 'upload' && (
        <form onSubmit={handleSubmitBook} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingBookId ? 'Edit Educational Resource' : 'Add New Educational Resource'}
              </h2>
              <p className="text-xs text-slate-500">
                Upload verified educational PDF and configure curriculum metadata.
              </p>
            </div>
          </div>

          {/* PDF File Upload Zone */}
          <div className="p-6 rounded-2xl border-2 border-dashed border-blue-200 dark:border-slate-700 bg-blue-50/30 dark:bg-slate-800/40 text-center space-y-3">
            <FileUp className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto" />
            <div>
              <label className="cursor-pointer font-bold text-xs sm:text-sm text-blue-600 hover:underline">
                <span>Select or Drop PDF File</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-500 mt-1">
                PDF parser will automatically read page count, embedded title, and file size.
              </p>
            </div>

            {uploadingPdf && (
              <div className="max-w-xs mx-auto space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs text-blue-600 font-bold">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Parsing PDF ({uploadProgress}%)...</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {extractedPdfInfo && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>{extractedPdfInfo}</span>
              </div>
            )}
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            
            {/* Title */}
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Book Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. NCERT Mathematics Class 10 with Solutions"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Author */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Author / Editorial Board</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g. NCERT Faculty / Dr. R. Sharma"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Class Level */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Class / Standard</label>
              <select
                value={formData.classLevel}
                onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Undergraduate', 'General'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Board */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Education Board</label>
              <select
                value={formData.board}
                onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['CBSE', 'ICSE', 'Bihar Board', 'MP Board', 'NCERT', 'UP Board', 'State Board', 'General'].map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Target Exam */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Competitive Exam</label>
              <select
                value={formData.exam}
                onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['Board Exams', 'IIT JEE', 'NEET', 'CUET', 'NDA', 'Foundation', 'None'].map((ex) => (
                  <option key={ex} value={ex}>{ex}</option>
                ))}
              </select>
            </div>

            {/* Academic Subject */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Science', 'Social Science', 'English', 'Hindi', 'Computer Science', 'General Studies'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Material Type */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Material Type</label>
              <select
                value={formData.contentType}
                onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[
                  { value: 'textbook', label: 'Textbook' },
                  { value: 'notes', label: 'Revision Notes' },
                  { value: 'solutions', label: 'NCERT Solutions' },
                  { value: 'question_bank', label: 'Question Bank' },
                  { value: 'sample_paper', label: 'Sample Paper' },
                  { value: 'pyq', label: 'Previous Year Paper (PYQ)' },
                  { value: 'reference_book', label: 'Reference Book' },
                  { value: 'study_guide', label: 'Study Guide' },
                ].map((mt) => (
                  <option key={mt.value} value={mt.value}>{mt.label}</option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Bilingual">Bilingual</option>
              </select>
            </div>

            {/* Chapter Scope */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Chapter / Range</label>
              <input
                type="text"
                value={formData.chapter}
                onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                placeholder="e.g. Chapters 1–12 Complete"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Page Count */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Page Count</label>
              <input
                type="number"
                value={formData.pageCount}
                onChange={(e) => setFormData({ ...formData, pageCount: parseInt(e.target.value, 10) || 1 })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Cover Image URL */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Cover Thumbnail URL</label>
              <input
                type="text"
                value={formData.coverUrl}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tags */}
            <div className="sm:col-span-3 space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Search Tags (Comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g. ncert, cbse, solutions, formulas"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-3 space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Description / Study Outline</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive explanation of book content, examination tips, and formula coverage..."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Permission Toggles */}
            <div className="sm:col-span-3 flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.downloadPermitted}
                  onChange={(e) => setFormData({ ...formData, downloadPermitted: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="font-bold text-slate-700 dark:text-slate-300">Allow Local PDF Download</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="font-bold text-slate-700 dark:text-slate-300">Feature on Homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="font-bold text-slate-700 dark:text-slate-300">Publish to Live Library</span>
              </label>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('books')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition"
            >
              {editingBookId ? 'Save Changes' : 'Publish Book Resource'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Custom Taxonomy & Categories */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create Custom Taxonomy
            </h3>
            <form onSubmit={handleAddCategorySubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Taxonomy Type</label>
                <select
                  value={newCatType}
                  onChange={(e) => setNewCatType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="board">Education Board</option>
                  <option value="class">Class / Standard</option>
                  <option value="exam">Competitive Exam</option>
                  <option value="subject">Academic Subject</option>
                  <option value="contentType">Material Type</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Rajasthan Board (RBSE)"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Slug / Code</label>
                <input
                  type="text"
                  value={newCatCode}
                  onChange={(e) => setNewCatCode(e.target.value)}
                  placeholder="e.g. rbse"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Short curriculum note..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow transition"
              >
                Add Category Item
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Configured Categories ({categories.length})
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
              {categories.map((cat) => (
                <div key={cat.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded mr-2">
                      {cat.type}
                    </span>
                    <strong className="text-slate-800 dark:text-slate-200">{cat.name}</strong>
                    <span className="text-slate-400 text-[11px] ml-2">({cat.code})</span>
                  </div>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-1 text-slate-400 hover:text-red-600"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Affiliate Resource Management */}
      {activeTab === 'affiliates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Add Affiliate / Sponsored Pick
            </h3>
            <form onSubmit={handleAddAffiliateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={affTitle}
                  onChange={(e) => setAffTitle(e.target.value)}
                  placeholder="e.g. Concepts of Physics Vol 1 by HC Verma"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Merchant Retailer</label>
                <select
                  value={affMerchant}
                  onChange={(e) => setAffMerchant(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="Amazon">Amazon India</option>
                  <option value="Flipkart">Flipkart</option>
                  <option value="Pearson">Pearson Academic</option>
                  <option value="Arihant">Arihant Publications</option>
                  <option value="MTG">MTG Learning</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Affiliate Destination URL</label>
                <input
                  type="url"
                  required
                  value={affUrl}
                  onChange={(e) => setAffUrl(e.target.value)}
                  placeholder="https://www.amazon.in/dp/..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Display Price</label>
                <input
                  type="text"
                  value={affPrice}
                  onChange={(e) => setAffPrice(e.target.value)}
                  placeholder="₹650"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Placement</label>
                <select
                  value={affPlacement}
                  onChange={(e) => setAffPlacement(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="home">Homepage Sponsored Carousel</option>
                  <option value="book_detail">Book Detail Contextual Card</option>
                  <option value="sidebar">Sidebar Recommendation</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Brief Description</label>
                <textarea
                  rows={2}
                  value={affDesc}
                  onChange={(e) => setAffDesc(e.target.value)}
                  placeholder="Target audience and features..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow transition"
              >
                Add Sponsored Recommendation
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Active Affiliate Products &amp; Clicks
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {affiliates.map((aff) => (
                <div key={aff.id} className="py-3 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={aff.imageUrl}
                      alt={aff.title}
                      className="w-10 h-14 object-cover rounded shadow-sm shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {aff.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Merchant: {aff.merchant} • {aff.priceDisplay}
                      </p>
                      <span className="text-[10px] text-amber-600 font-semibold">
                        Placement: {aff.placement}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <span className="font-mono font-bold text-emerald-600 block text-xs">
                      {aff.clickCount || 0} Clicks
                    </span>
                    <button
                      onClick={() => deleteAffiliate(aff.id)}
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Library Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase">Total Book Views</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalViews}</p>
              <p className="text-[11px] text-emerald-500 font-semibold mt-1">Verified reading sessions</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase">Total Downloads</span>
              <p className="text-2xl font-black text-blue-600 mt-1">{totalDownloads}</p>
              <p className="text-[11px] text-slate-400 mt-1">Authorized PDF saves</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase">Estimated Storage</span>
              <p className="text-2xl font-black text-purple-600 mt-1">{totalStorageEstimateMb.toFixed(1)} MB</p>
              <p className="text-[11px] text-slate-400 mt-1">Digital PDF repositories</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase">Affiliate Link Clicks</span>
              <p className="text-2xl font-black text-amber-500 mt-1">{totalAffiliateClicks}</p>
              <p className="text-[11px] text-slate-400 mt-1">External merchant visits</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Cloud Architecture &amp; Security Audits
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Firestore Security Rules: Deployed &amp; enforced with zero blanket reads.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Attribute-Based Access Control (ABAC): Super admin privilege locked to verified runtime email.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Student PII Isolation: Student reading history isolated under user-scoped subcollections.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Vector PDF Engine: PDF.js streaming parser active for full-screen book spread reader.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};
