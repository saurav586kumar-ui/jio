import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Minimize, 
  Bookmark, 
  BookmarkCheck, 
  List, 
  Columns, 
  Square, 
  Download, 
  Share2, 
  RotateCw,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Book } from '../types';
import { pdfjsLib } from '../lib/pdfHelper';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';

interface PdfReaderModalProps {
  book: Book;
  onClose: () => void;
}

interface OutlineItem {
  title: string;
  dest: any;
  items?: OutlineItem[];
}

export const PdfReaderModal: React.FC<PdfReaderModalProps> = ({ book, onClose }) => {
  const { userLibrary, toggleBookmark, updateReadingProgress, recordBookDownload } = useLibrary();
  const { currentUserName } = useAuth();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasLeftRef = useRef<HTMLCanvasElement>(null);
  const canvasRightRef = useRef<HTMLCanvasElement>(null);
  const canvasSingleRef = useRef<HTMLCanvasElement>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number>(book.pageCount || 1);
  const [currentPage, setCurrentPage] = useState<number>(() => {
    return userLibrary[book.id]?.lastReadPage || 1;
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [renderLoading, setRenderLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1.2);
  const [layoutMode, setLayoutMode] = useState<'single' | 'spread'>('single');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showOutline, setShowOutline] = useState<boolean>(false);
  const [outlines, setOutlines] = useState<OutlineItem[]>([]);
  const [pageInput, setPageInput] = useState<string>(String(currentPage));
  const [rotation, setRotation] = useState<number>(0);
  const [copyToast, setCopyToast] = useState<boolean>(false);

  const isBookmarked = userLibrary[book.id]?.isBookmarked || false;

  // Auto-detect large screen for spread mode initially
  useEffect(() => {
    if (window.innerWidth >= 1200) {
      setLayoutMode('spread');
    }
  }, []);

  // Update input when page changes
  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  // Load PDF document using PDF.js
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setLoadError(null);

    const loadPdf = async () => {
      try {
        let pdfSource = book.pdfUrl;
        if (!pdfSource) {
          throw new Error('PDF document location not specified.');
        }

        const loadingTask = pdfjsLib.getDocument({
          url: pdfSource,
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/cmaps/',
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (isCancelled) return;

        setPdfDoc(doc);
        const count = doc.numPages || 1;
        setTotalPages(count);

        // Fetch outline/table of contents if document has it
        try {
          const outline = await doc.getOutline();
          if (!isCancelled && outline && outline.length > 0) {
            setOutlines(outline);
          }
        } catch {
          // No outline in document, non-critical
        }

        setLoading(false);
      } catch (err: any) {
        if (!isCancelled) {
          console.error('Failed to parse PDF document:', err);
          setLoadError(err?.message || 'Could not load PDF document.');
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [book.id, book.pdfUrl]);

  // Render Page to Canvas
  const renderPageToCanvas = useCallback(
    async (pageNum: number, canvas: HTMLCanvasElement | null) => {
      if (!pdfDoc || !canvas) return;
      try {
        const page = await pdfDoc.getPage(pageNum);
        const pixelRatio = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: zoom * pixelRatio, rotation });

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width / pixelRatio}px`;
        canvas.style.height = `${viewport.height / pixelRatio}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (err) {
        console.warn(`Error rendering page ${pageNum}:`, err);
      }
    },
    [pdfDoc, zoom, rotation]
  );

  // Trigger render when page, zoom, layout, or pdf changes
  useEffect(() => {
    if (!pdfDoc || loading) return;

    let active = true;
    setRenderLoading(true);

    const render = async () => {
      if (layoutMode === 'single' || currentPage === 1) {
        await renderPageToCanvas(currentPage, canvasSingleRef.current);
      } else {
        // Spread mode: Even on left, Odd on right (e.g. 2 & 3, 4 & 5)
        const leftNum = currentPage % 2 === 0 ? currentPage : currentPage - 1;
        const rightNum = leftNum + 1;

        await renderPageToCanvas(leftNum, canvasLeftRef.current);
        if (rightNum <= totalPages) {
          await renderPageToCanvas(rightNum, canvasRightRef.current);
        }
      }
      if (active) setRenderLoading(false);
    };

    render();

    // Auto-save reading progress to student profile
    updateReadingProgress(book.id, currentPage, totalPages, book.title, book.coverUrl);

    return () => {
      active = false;
    };
  }, [
    pdfDoc,
    currentPage,
    zoom,
    layoutMode,
    loading,
    renderPageToCanvas,
    rotation,
    totalPages,
    book.id,
    book.title,
    book.coverUrl,
    updateReadingProgress,
  ]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentPage(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentPage(totalPages);
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          exitFullscreen();
        } else {
          onClose();
        }
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, layoutMode, isFullscreen]);

  const goToNext = () => {
    if (layoutMode === 'spread' && currentPage > 1) {
      if (currentPage + 2 <= totalPages) {
        setCurrentPage((prev) => prev + 2);
      } else if (currentPage + 1 <= totalPages) {
        setCurrentPage((prev) => prev + 1);
      }
    } else {
      if (currentPage < totalPages) {
        setCurrentPage((prev) => prev + 1);
      }
    }
  };

  const goToPrev = () => {
    if (layoutMode === 'spread' && currentPage > 2) {
      setCurrentPage((prev) => Math.max(1, prev - 2));
    } else {
      if (currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    }
  };

  const handlePageJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(pageInput, 10);
    if (!isNaN(num) && num >= 1 && num <= totalPages) {
      setCurrentPage(num);
    } else {
      setPageInput(String(currentPage));
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2500);
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

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 select-none backdrop-blur-md"
    >
      {/* Top Reading Toolbar */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between gap-3 shrink-0 shadow-md">
        {/* Left: Book Meta & Outline toggle */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setShowOutline(!showOutline)}
            title="Table of Contents"
            className={`p-2 rounded-lg transition-colors ${
              showOutline ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <List className="w-5 h-5" />
          </button>

          <div className="min-w-0 flex flex-col">
            <h2 className="text-sm font-semibold truncate text-white leading-tight max-w-xs md:max-w-md lg:max-w-xl">
              {book.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
              <span>{book.subject}</span>
              <span>•</span>
              <span>{book.classLevel}</span>
              <span>•</span>
              <span className="text-blue-400">{book.board}</span>
            </div>
          </div>
        </div>

        {/* Center: Page Controls */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <button
            onClick={goToPrev}
            disabled={currentPage <= 1 || loading}
            className="p-1.5 md:p-2 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Previous Page (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <form onSubmit={handlePageJumpSubmit} className="flex items-center gap-1 text-xs md:text-sm">
            <span className="text-slate-400 hidden sm:inline">Page</span>
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="w-12 h-8 text-center bg-slate-800 border border-slate-700 rounded text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="text-slate-400">/ {totalPages}</span>
          </form>

          <button
            onClick={goToNext}
            disabled={currentPage >= totalPages || loading}
            className="p-1.5 md:p-2 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Next Page (Right Arrow)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Layout, Zoom, Bookmark, Download, Close */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Layout switcher (spread vs single) */}
          <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setLayoutMode('single')}
              className={`p-1.5 rounded transition ${
                layoutMode === 'single' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Single Page View"
            >
              <Square className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('spread')}
              className={`p-1.5 rounded transition ${
                layoutMode === 'spread' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Two-Page Spread (Book View)"
            >
              <Columns className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="hidden md:flex items-center gap-1 bg-slate-800 rounded-lg px-1 py-0.5 border border-slate-700">
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
              className="p-1.5 text-slate-400 hover:text-white transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-300 w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}
              className="p-1.5 text-slate-400 hover:text-white transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Rotate */}
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-1.5 md:p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Rotate 90 Degrees"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(book)}
            className={`p-1.5 md:p-2 rounded-lg transition ${
              isBookmarked ? 'text-amber-400 bg-amber-950/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={isBookmarked ? 'Bookmarked' : 'Save Bookmark to My Library'}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          {/* Download if allowed */}
          {book.downloadPermitted && (
            <button
              onClick={handleDownload}
              className="p-1.5 md:p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition hidden sm:inline-flex"
              title="Download PDF Document"
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 md:p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition hidden sm:inline-flex"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1.5 md:p-2 text-slate-400 hover:text-white hover:bg-red-900/40 rounded-lg transition"
            title="Close Reader (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Table of Contents Drawer */}
        {showOutline && (
          <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col z-20 shrink-0 animate-in slide-in-from-left duration-200">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Table of Contents
              </span>
              <button
                onClick={() => setShowOutline(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {outlines.length > 0 ? (
                outlines.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (typeof item.dest === 'number') {
                        setCurrentPage(item.dest + 1);
                      } else {
                        // Advance to chapter estimate
                        setCurrentPage(Math.min(idx * 3 + 1, totalPages));
                      }
                      setShowOutline(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white truncate transition"
                  >
                    {item.title}
                  </button>
                ))
              ) : (
                <div className="space-y-2 py-2">
                  <div className="text-xs text-slate-400 px-2 font-medium">Quick Page Navigation</div>
                  {Array.from({ length: Math.min(totalPages, 20) }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => {
                        setCurrentPage(pg);
                        setShowOutline(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition ${
                        currentPage === pg
                          ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>Section / Page {pg}</span>
                      {currentPage === pg && (
                        <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </button>
                  ))}
                  {totalPages > 20 && (
                    <p className="text-xs text-slate-500 px-3 italic">
                      + {totalPages - 20} additional pages in document
                    </p>
                  )}
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Central Reading Stage */}
        <main className="flex-1 overflow-auto bg-slate-950 flex flex-col items-center justify-center p-4 md:p-6 relative">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-sm font-medium text-slate-300">Rendering digital book stream...</p>
              <p className="text-xs text-slate-500">Vector PDF layout by PDF.js</p>
            </div>
          )}

          {loadError && (
            <div className="max-w-md bg-slate-900 border border-red-500/30 rounded-xl p-6 text-center shadow-2xl">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white mb-2">Unable to Load PDF</h3>
              <p className="text-xs text-slate-400 mb-4">{loadError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition"
              >
                Retry Document
              </button>
            </div>
          )}

          {!loading && !loadError && (
            <div className="relative max-w-full max-h-full flex items-center justify-center">
              {renderLoading && (
                <div className="absolute top-4 right-4 z-10 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-full text-xs text-blue-400 flex items-center gap-2 border border-slate-700 shadow-lg">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Loading high-res page...</span>
                </div>
              )}

              {/* Single Page Layout OR Page 1 (Cover) in Spread Mode */}
              {(layoutMode === 'single' || currentPage === 1) ? (
                <div className="relative shadow-2xl rounded-sm overflow-hidden bg-white border border-slate-700 transition-all duration-300">
                  <canvas ref={canvasSingleRef} className="block max-w-full h-auto" />
                  {currentPage === 1 && layoutMode === 'spread' && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur text-[11px] text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                      Title Page — Press Next for Two-Page Spread
                    </div>
                  )}
                </div>
              ) : (
                /* Two-Page Spread Layout */
                <div className="flex items-center shadow-2xl rounded-sm overflow-hidden bg-white border border-slate-700">
                  {/* Left Page */}
                  <div className="relative book-spread-left bg-white">
                    <canvas ref={canvasLeftRef} className="block max-w-full h-auto" />
                    <div className="absolute bottom-2 left-4 text-[10px] text-slate-400 font-mono">
                      Page {currentPage % 2 === 0 ? currentPage : currentPage - 1}
                    </div>
                  </div>

                  {/* Realistic Book Spine Center Gutter */}
                  <div className="w-4 self-stretch book-binding-gutter shadow-inner shrink-0" />

                  {/* Right Page */}
                  <div className="relative book-spread-right bg-white">
                    <canvas ref={canvasRightRef} className="block max-w-full h-auto" />
                    <div className="absolute bottom-2 right-4 text-[10px] text-slate-400 font-mono">
                      Page {(currentPage % 2 === 0 ? currentPage : currentPage - 1) + 1}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Reader Bottom Status Footer */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-3">
          <span>
            Reading as: <strong className="text-slate-200">{currentUserName}</strong>
          </span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">
            Progress: {Math.round((currentPage / (totalPages || 1)) * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-slate-500">
            Keys: [← / →] Flip | [F] Fullscreen | [Esc] Close
          </span>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </footer>

      {/* Copy Toast */}
      {copyToast && (
        <div className="absolute bottom-14 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xl animate-in fade-in slide-in-from-bottom-2">
          Document link copied to clipboard!
        </div>
      )}
    </div>
  );
};
