export type MaterialType =
  | 'textbook'
  | 'notes'
  | 'solutions'
  | 'question_bank'
  | 'sample_paper'
  | 'pyq'
  | 'reference_book'
  | 'study_guide';

export type EducationBoard =
  | 'CBSE'
  | 'ICSE'
  | 'Bihar Board'
  | 'MP Board'
  | 'NCERT'
  | 'UP Board'
  | 'State Board'
  | 'General';

export type ExamCategory =
  | 'IIT JEE'
  | 'NEET'
  | 'CUET'
  | 'NDA'
  | 'Board Exams'
  | 'Olympiad'
  | 'Foundation'
  | 'None';

export type ClassLevel =
  | 'Class 6'
  | 'Class 7'
  | 'Class 8'
  | 'Class 9'
  | 'Class 10'
  | 'Class 11'
  | 'Class 12'
  | 'Undergraduate'
  | 'General';

export type SubjectName =
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Science'
  | 'Social Science'
  | 'English'
  | 'Hindi'
  | 'Computer Science'
  | 'General Studies'
  | 'Accountancy'
  | 'Economics';

export interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  publisher: string;
  language: 'English' | 'Hindi' | 'Bilingual' | string;
  classLevel: ClassLevel | string;
  board: EducationBoard | string;
  exam: ExamCategory | string;
  subject: SubjectName | string;
  chapter: string;
  contentType: MaterialType | string;
  coverUrl: string;
  pdfUrl: string;
  fileSizeBytes: number;
  pageCount: number;
  published: boolean;
  isFeatured: boolean;
  downloadPermitted: boolean;
  copyrightLicense: string;
  tags: string;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  type: 'class' | 'board' | 'exam' | 'subject' | 'contentType';
  code: string;
  description: string;
  icon?: string;
  createdAt: string;
}

export interface UserLibraryItem {
  bookId: string;
  userId: string;
  bookTitle: string;
  coverUrl: string;
  isBookmarked: boolean;
  lastReadPage: number;
  totalPages: number;
  readingProgressPercent: number;
  lastReadAt: string;
  notes?: string;
}

export interface AffiliateProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  merchant: 'Amazon' | 'Flipkart' | 'MTG' | 'Arihant' | 'Pearson' | string;
  affiliateUrl: string;
  imageUrl: string;
  priceDisplay: string;
  placement: 'home' | 'sidebar' | 'book_detail';
  targetSubject?: string;
  targetExam?: string;
  clickCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  publishedAt: string;
  tags: string;
}

export interface FilterState {
  searchQuery: string;
  classLevel: string;
  board: string;
  exam: string;
  subject: string;
  contentType: string;
  language: string;
  availability: 'all' | 'download_allowed' | 'read_only';
  sortBy: 'relevance' | 'newest' | 'title' | 'popularity';
}
