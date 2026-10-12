import { Book, AffiliateProduct, Article, CategoryItem } from '../types';
import { generateEducationalPdfDataUrl } from './pdfHelper';

// Curated high quality seed books across classes, boards, and exams
export const INITIAL_BOOKS: Book[] = [
  {
    id: 'edsu-ncert-math-10',
    title: 'NCERT Mathematics Class 10 — Complete Textbook & Solutions',
    description: 'Official comprehensive textbook and chapter-wise solution guidelines covering Real Numbers, Polynomials, Quadratic Equations, Arithmetic Progressions, Coordinate Geometry, and Trigonometry.',
    author: 'NCERT National Council of Educational Research & Training',
    publisher: 'NCERT Publication Division',
    language: 'English',
    classLevel: 'Class 10',
    board: 'NCERT',
    exam: 'Board Exams',
    subject: 'Mathematics',
    chapter: 'Chapters 1–15 Complete Syllabus',
    contentType: 'textbook',
    coverUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    pdfUrl: '', // generated on init
    fileSizeBytes: 4850000,
    pageCount: 320,
    published: true,
    isFeatured: true,
    downloadPermitted: true,
    copyrightLicense: 'Open Educational Resource (OER) / Non-Commercial Educational Use',
    tags: 'ncert, class 10, maths, cbse, bseb, solutions, board exam',
    viewCount: 1420,
    downloadCount: 680,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-03-20T14:30:00Z',
  },
  {
    id: 'edsu-jee-physics-mechanics',
    title: 'IIT JEE Advanced Physics: Comprehensive Mechanics & Dynamics Notes',
    description: 'High-yield conceptual notes, free body diagrams, rotational dynamics, work-energy-power formulas, and solved previous 15 years IIT JEE Advanced problems.',
    author: 'Er. R. K. Agrawal & EDSU Physics Faculty',
    publisher: 'EDSU Advanced Academic Press',
    language: 'English',
    classLevel: 'Class 11',
    board: 'CBSE',
    exam: 'IIT JEE',
    subject: 'Physics',
    chapter: 'Kinematics, Newton Laws, Work Energy & Rotational Motion',
    contentType: 'notes',
    coverUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=600&q=80',
    pdfUrl: '',
    fileSizeBytes: 6200000,
    pageCount: 184,
    published: true,
    isFeatured: true,
    downloadPermitted: true,
    copyrightLicense: 'Creative Commons BY-NC-SA 4.0',
    tags: 'iit jee, jee advanced, physics, mechanics, formulas, notes',
    viewCount: 2310,
    downloadCount: 1140,
    createdAt: '2026-02-01T12:00:00Z',
    updatedAt: '2026-04-05T09:15:00Z',
  },
  {
    id: 'edsu-neet-biology-physiology',
    title: 'NEET UG Biology: Human Physiology High-Yield Question Bank',
    description: '300+ NCERT-aligned MCQs with detailed explanations covering Digestion, Breathing, Body Fluids, Excretion, Locomotion, and Neural Coordination for NEET aspirants.',
    author: 'Dr. Sunita Sharma (MBBS, AIIMS Delhi)',
    publisher: 'EDSU Medical Entrance Cell',
    language: 'English',
    classLevel: 'Class 11',
    board: 'NCERT',
    exam: 'NEET',
    subject: 'Biology',
    chapter: 'Unit 5: Human Physiology (Complete)',
    contentType: 'question_bank',
    coverUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    pdfUrl: '',
    fileSizeBytes: 5400000,
    pageCount: 142,
    published: true,
    isFeatured: true,
    downloadPermitted: true,
    copyrightLicense: 'Free for Registered Students (EDSU Library)',
    tags: 'neet, biology, human physiology, ncert, mcq, medical entrance',
    viewCount: 3105,
    downloadCount: 1540,
    createdAt: '2026-02-14T08:00:00Z',
    updatedAt: '2026-03-29T16:20:00Z',
  },
  {
    id: 'edsu-bihar-board-12-chemistry',
    title: 'Bihar Board (BSEB) Class 12 Chemistry: Model Paper & VIP Questions',
    description: 'Bilingual (Hindi/English) official model practice set for BSEB Intermediate Exam with 70 objective MCQs, short answer questions, and long answer structured proofs.',
    author: 'Bihar School Examination Board (BSEB) Expert Committee',
    publisher: 'BSEB Educational Bureau',
    language: 'Bilingual',
    classLevel: 'Class 12',
    board: 'Bihar Board',
    exam: 'Board Exams',
    subject: 'Chemistry',
    chapter: 'Solid State, Electrochemistry, Organic Chemistry Reactions',
    contentType: 'sample_paper',
    coverUrl: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=600&q=80',
    pdfUrl: '',
    fileSizeBytes: 3900000,
    pageCount: 64,
    published: true,
    isFeatured: true,
    downloadPermitted: true,
    copyrightLicense: 'Public Educational Distribution',
    tags: 'bihar board, bseb, class 12, inter exam, chemistry, model paper, hindi medium',
    viewCount: 1890,
    downloadCount: 940,
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-03-12T10:00:00Z',
  },
  {
    id: 'edsu-mp-board-10-science',
    title: 'MP Board (MPBSE) Class 10 Science: Fast-Track Revision Guide',
    description: 'Madhya Pradesh Board Class 10 High School Vigyan (Science) chapter-wise summary notes, important chemical equations, ray diagrams, and 5-year trend questions.',
    author: 'MP Board Academic Committee & EDSU Team',
    publisher: 'MPBSE Textbook Corporation',
    language: 'Hindi',
    classLevel: 'Class 10',
    board: 'MP Board',
    exam: 'Board Exams',
    subject: 'Science',
    chapter: 'Physics, Chemistry & Life Processes (Chapters 1–16)',
    contentType: 'study_guide',
    coverUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
    pdfUrl: '',
    fileSizeBytes: 4200000,
    pageCount: 96,
    published: true,
    isFeatured: true,
    downloadPermitted: true,
    copyrightLicense: 'Educational Use Only',
    tags: 'mp board, mpbse, class 10, vigyan, science, notes, hindi medium',
    viewCount: 1250,
    downloadCount: 580,
    createdAt: '2026-01-25T14:00:00Z',
    updatedAt: '2026-02-18T11:45:00Z',
  },
  {
    id: 'edsu-cbse-12-math-pyq',
    title: 'CBSE Class 12 Mathematics: Last 10 Years Solved Board Papers (PYQ)',
    description: 'Comprehensive chapter-wise solved questions from CBSE All India, Delhi, and Foreign sets with authentic step marking schemes and examiner tips.',
    author: 'EDSU Board Examination Cell',
    publisher: 'EDSU Publishing',
    language: 'English',
    classLevel: 'Class 12',
    board: 'CBSE',
    exam: 'Board Exams',
    subject: 'Mathematics',
    chapter: 'Calculus, Vectors, 3D Geometry, Linear Programming & Probability',
    contentType: 'pyq',
    coverUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80',
    pdfUrl: '',
    fileSizeBytes: 7800000,
    pageCount: 248,
    published: true,
    isFeatured: false,
    downloadPermitted: true,
    copyrightLicense: 'EDSU Academic Fair-Use Edition',
    tags: 'cbse, class 12, pyq, solved papers, calculus, mathematics',
    viewCount: 2840,
    downloadCount: 1420,
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-03-15T15:00:00Z',
  },
  {
    id: 'edsu-cuet-general-test',
    title: 'CUET UG General Test: Quantitative Aptitude & Logical Reasoning Guide',
    description: 'Targeted preparation manual for NTA Common University Entrance Test (CUET UG) section III featuring 500+ speed-math exercises, syllogisms, and puzzles.',
    author: 'Prof. Ananya Sen & Team',
    publisher: 'National Entrance Guides',
    language: 'English',
    classLevel: 'Class 12',
    board: 'General',
    exam: 'CUET',
    subject: 'General Studies',
    chapter: 'Quantitative Techniques, Analytical Logic, Current Events',
    contentType: 'reference_book',
    coverUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    pdfUrl: '',
    fileSizeBytes: 5100000,
    pageCount: 160,
    published: true,
    isFeatured: false,
    downloadPermitted: false, // Read Online only demo
    copyrightLicense: 'Licensed Online Reader Only (Direct Download Restricted)',
    tags: 'cuet, general test, nta, quantitative aptitude, reasoning',
    viewCount: 980,
    downloadCount: 0,
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-03-25T12:00:00Z',
  },
  {
    id: 'edsu-ncert-9-science',
    title: 'NCERT Class 9 Science: Solutions & In-Depth Concept Notes',
    description: 'Line-by-line NCERT chapter solutions for Matter in Our Surroundings, Is Matter Around Us Pure, Fundamental Unit of Life, Tissues, Motion, and Gravitation.',
    author: 'NCERT Editorial Board',
    publisher: 'NCERT',
    language: 'English',
    classLevel: 'Class 9',
    board: 'NCERT',
    exam: 'Board Exams',
    subject: 'Science',
    chapter: 'Chapters 1–12 Complete',
    contentType: 'solutions',
    coverUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    pdfUrl: '',
    fileSizeBytes: 4400000,
    pageCount: 198,
    published: true,
    isFeatured: false,
    downloadPermitted: true,
    copyrightLicense: 'Open Educational Resource',
    tags: 'ncert, class 9, science, cbse, solutions, notes',
    viewCount: 1120,
    downloadCount: 520,
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-02-10T14:00:00Z',
  }
];

// Ensure all books have generated PDFs
INITIAL_BOOKS.forEach(b => {
  if (!b.pdfUrl) {
    b.pdfUrl = generateEducationalPdfDataUrl({
      title: b.title,
      subject: b.subject,
      classLevel: b.classLevel,
      board: b.board,
      author: b.author,
      chapter: b.chapter,
      pages: Math.min(b.pageCount > 10 ? 8 : b.pageCount, 12)
    });
  }
});

export const INITIAL_CATEGORIES: CategoryItem[] = [
  // Class levels
  { id: 'cat-c6', name: 'Class 6', type: 'class', code: 'class-6', description: 'Middle school grade 6 foundation courses', createdAt: '2026-01-01' },
  { id: 'cat-c7', name: 'Class 7', type: 'class', code: 'class-7', description: 'Middle school grade 7 foundation courses', createdAt: '2026-01-01' },
  { id: 'cat-c8', name: 'Class 8', type: 'class', code: 'class-8', description: 'Middle school grade 8 foundation courses', createdAt: '2026-01-01' },
  { id: 'cat-c9', name: 'Class 9', type: 'class', code: 'class-9', description: 'Secondary school grade 9 curriculum', createdAt: '2026-01-01' },
  { id: 'cat-c10', name: 'Class 10', type: 'class', code: 'class-10', description: 'Secondary school matriculation & board exam prep', createdAt: '2026-01-01' },
  { id: 'cat-c11', name: 'Class 11', type: 'class', code: 'class-11', description: 'Senior secondary stream specialization', createdAt: '2026-01-01' },
  { id: 'cat-c12', name: 'Class 12', type: 'class', code: 'class-12', description: 'Senior secondary intermediate & entrance exams', createdAt: '2026-01-01' },
  // Boards
  { id: 'cat-cbse', name: 'CBSE', type: 'board', code: 'cbse', description: 'Central Board of Secondary Education', createdAt: '2026-01-01' },
  { id: 'cat-ncert', name: 'NCERT', type: 'board', code: 'ncert', description: 'National Council of Educational Research & Training', createdAt: '2026-01-01' },
  { id: 'cat-bseb', name: 'Bihar Board (BSEB)', type: 'board', code: 'bseb', description: 'Bihar School Examination Board Matric & Inter', createdAt: '2026-01-01' },
  { id: 'cat-mpbse', name: 'MP Board (MPBSE)', type: 'board', code: 'mpbse', description: 'Madhya Pradesh Board of Secondary Education', createdAt: '2026-01-01' },
  { id: 'cat-icse', name: 'ICSE / ISC', type: 'board', code: 'icse', description: 'Council for the Indian School Certificate Examinations', createdAt: '2026-01-01' },
  // Exams
  { id: 'cat-jee', name: 'IIT JEE', type: 'exam', code: 'iit-jee', description: 'JEE Main and JEE Advanced Engineering Entrance', createdAt: '2026-01-01' },
  { id: 'cat-neet', name: 'NEET UG', type: 'exam', code: 'neet', description: 'National Eligibility cum Entrance Test (Medical)', createdAt: '2026-01-01' },
  { id: 'cat-cuet', name: 'CUET', type: 'exam', code: 'cuet', description: 'Common University Entrance Test', createdAt: '2026-01-01' },
  { id: 'cat-boards', name: 'Board Exams', type: 'exam', code: 'board-exams', description: 'Class 10 & 12 Annual Board Examinations', createdAt: '2026-01-01' },
  // Material Types
  { id: 'cat-mat-text', name: 'Textbook', type: 'contentType', code: 'textbook', description: 'Standard syllabus prescribed textbook', createdAt: '2026-01-01' },
  { id: 'cat-mat-notes', name: 'Revision Notes', type: 'contentType', code: 'notes', description: 'Concise summary formulas and theory', createdAt: '2026-01-01' },
  { id: 'cat-mat-sol', name: 'Solutions', type: 'contentType', code: 'solutions', description: 'Step-by-step textbook exercises answers', createdAt: '2026-01-01' },
  { id: 'cat-mat-qb', name: 'Question Bank', type: 'contentType', code: 'question_bank', description: 'Topic-wise collection of practice questions', createdAt: '2026-01-01' },
  { id: 'cat-mat-sp', name: 'Sample Paper', type: 'contentType', code: 'sample_paper', description: 'Official model examination blueprints', createdAt: '2026-01-01' },
  { id: 'cat-mat-pyq', name: 'Previous Year Paper (PYQ)', type: 'contentType', code: 'pyq', description: 'Past 5 to 10 years actual solved papers', createdAt: '2026-01-01' },
  { id: 'cat-mat-sg', name: 'Study Guide', type: 'contentType', code: 'study_guide', description: 'Strategic master plan & revision companion', createdAt: '2026-01-01' }
];

export const INITIAL_AFFILIATES: AffiliateProduct[] = [
  {
    id: 'aff-hc-verma',
    title: 'Concepts of Physics by H.C. Verma (Vol 1 & 2 Set)',
    description: 'The golden standard reference for JEE and NEET physics fundamentals. Unmatched conceptual clarity and graded problem sets.',
    category: 'Physics',
    merchant: 'Amazon',
    affiliateUrl: 'https://www.amazon.in/dp/8177091875?tag=edsu-library-21',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    priceDisplay: '₹799 (Set of 2)',
    placement: 'home',
    targetSubject: 'Physics',
    targetExam: 'IIT JEE',
    clickCount: 142,
    isActive: true,
    createdAt: '2026-01-10',
  },
  {
    id: 'aff-mtg-fingertips',
    title: 'MTG NCERT at your Fingertips Biology for NEET',
    description: 'Chapter-wise NCERT line-by-line MCQs, assertion-reason questions, and exam cracker test series for NEET aspirants.',
    category: 'Biology',
    merchant: 'Amazon',
    affiliateUrl: 'https://www.amazon.in/dp/935563148X?tag=edsu-library-21',
    imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&q=80',
    priceDisplay: '₹620',
    placement: 'book_detail',
    targetSubject: 'Biology',
    targetExam: 'NEET',
    clickCount: 215,
    isActive: true,
    createdAt: '2026-01-12',
  },
  {
    id: 'aff-rd-sharma-10',
    title: 'Mathematics for Class 10 by R.D. Sharma with Solutions',
    description: 'Thorough coverage of all CBSE standard and basic mathematics topics, CBSE board examination problems, and MCQs.',
    category: 'Mathematics',
    merchant: 'Flipkart',
    affiliateUrl: 'https://www.flipkart.com/mathematics-class-10-rd-sharma/p/itm1234?affid=edsulib',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80',
    priceDisplay: '₹495',
    placement: 'home',
    targetSubject: 'Mathematics',
    targetExam: 'Board Exams',
    clickCount: 184,
    isActive: true,
    createdAt: '2026-01-15',
  },
  {
    id: 'aff-disha-jee-46',
    title: 'Disha 46 Years IIT JEE Advanced + JEE Main Solved Papers',
    description: 'Authentic previous year question papers categorized topic-wise with video solutions and 100% verified solutions.',
    category: 'Engineering Entrance',
    merchant: 'Amazon',
    affiliateUrl: 'https://www.amazon.in/dp/9395768291?tag=edsu-library-21',
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0d0?auto=format&fit=crop&w=400&q=80',
    priceDisplay: '₹850',
    placement: 'sidebar',
    targetSubject: 'Physics',
    targetExam: 'IIT JEE',
    clickCount: 98,
    isActive: true,
    createdAt: '2026-01-18',
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-master-ncert-strategy',
    title: 'How to Master NCERT for 100 Percentile in NEET & JEE Mains',
    slug: 'how-to-master-ncert-neet-jee',
    summary: 'Discover the 3-step active recall framework utilized by state toppers to decode every diagram, summary bullet, and in-text question in NCERT.',
    content: `
# The Definitive NCERT Mastery Blueprint

For decades, national toppers across CBSE, NEET, and JEE Main have echoed one universal truth: **NCERT is the bible of competitive entrance exams.** However, simply reading NCERT like a novel is the biggest mistake aspirants make.

### 1. The Line-by-Line Micro-Annotation Method
When studying Inorganic Chemistry or Human Physiology:
- **Highlighter Discipline:** Use three distinct colors: Yellow for factual dates/values, Green for reaction conditions and catalysts, and Pink for exceptional trends.
- **Margin Notes:** Translate complex paragraphs into single-sentence flowcharts right inside your margin.

### 2. Don't Skip the Summary and Appendix
Over 15% of tricky assertion-reasoning questions are framed directly from the concluding summary points at the end of each chapter. These summaries often condense axioms that are omitted in the main text.

### 3. Solved Exemplar Problems
Always solve the official NCERT Exemplar. Many difficult MCQs in JEE Main are verbatim variants of exemplar multiple-correct exercises simplified into single-option formats.

*Authored by EDSU Academic Research Cell.*
    `,
    category: 'Exam Strategy',
    author: 'Prof. S. R. Mukherjee (Senior Academic Mentor)',
    readTime: '6 min read',
    publishedAt: '2026-02-10',
    tags: 'ncert, study tips, neet, jee, toppers strategy',
  },
  {
    id: 'art-bihar-board-top-score-blueprint',
    title: 'Bihar Board (BSEB) Class 10 & 12: High-Scoring Answer Writing Format',
    slug: 'bseb-bihar-board-answer-writing-format',
    summary: 'Master the 50% objective MCQ OMR strategy and structured subjective answer presentation to maximize marks in Bihar Board examinations.',
    content: `
# Bihar School Examination Board (BSEB) Scoring Matrix

The Bihar Board evaluation pattern offers students a significant scoring advantage through its **50% Objective MCQ system** and 100% internal choice options.

### Key Tactical Pillars:

1. **OMR Sheet Accuracy:** In Section A, solve only the exact number of required questions (e.g., 50 out of 100 or 35 out of 70). The evaluation software counts strictly the first attempted responses sequentially.
2. **Step-Marking Presentation:** In Section B (Subjective), start each numerical answer with:
   - *Given Data (दिया गया है)*
   - *Required Formula (सूत्र)*
   - *Calculation & Units (गणना एवं मात्रक)*
3. **Diagrams in Science:** Always frame diagrams inside a neat geometric box with labeled arrowheads pointing only to the right-hand side.

*Verified according to latest BSEB examination guidelines.*
    `,
    category: 'State Boards',
    author: 'Ravi Ranjan Jha (BSEB Examination Analyst)',
    readTime: '5 min read',
    publishedAt: '2026-02-18',
    tags: 'bihar board, bseb, matric, intermediate, answer writing',
  },
  {
    id: 'art-cbse-30-day-revision-matrix',
    title: 'CBSE Board Exams: The 30-Day High-Yield Revision Matrix',
    slug: 'cbse-30-day-revision-matrix',
    summary: 'A time-tested day-by-day revision schedule balancing syllabus consolidation, 3-hour mock tests, and stress-free wellness.',
    content: `
# The 30-Day CBSE Revision Blueprint

Success in the final sprint depends not on learning new concepts, but on relentless consolidation of high-weightage topics.

### Phase 1: Days 1–10 (High-Weightage Chapters)
- Group syllabus into A-Tier (Calculus, Optics, Organic Chemistry, Modern Physics).
- Review all formula sheets every morning between 6:00 AM and 7:30 AM.

### Phase 2: Days 11–22 (Full Length Sample Papers)
- Simulate actual examination conditions strictly from 10:30 AM to 1:30 PM.
- Turn off notifications and practice handwriting with the exact ballpoint pen brand you will carry into the examination hall.

### Phase 3: Days 23–30 (Mistake Notebook Review)
- Never solve new unverified questions in the last 7 days.
- Re-solve every problem you marked incorrect during previous mocks.
    `,
    category: 'Board Exams',
    author: 'Meenakshi Iyer (CBSE Senior Evaluator)',
    readTime: '7 min read',
    publishedAt: '2026-03-01',
    tags: 'cbse, class 10, class 12, timetable, revision, sample papers',
  }
];
