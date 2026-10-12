import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker using reliable cdn or module worker
const PDFJS_VERSION = pdfjsLib.version || '4.10.38';
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('PDF.js worker initialization notice:', e);
}

export { pdfjsLib };

/**
 * Extracts page count and metadata from an uploaded PDF file
 */
export async function extractPdfMetadata(file: File): Promise<{
  pageCount: number;
  title?: string;
  author?: string;
  fileSizeBytes: number;
}> {
  const arrayBuffer = await file.arrayBuffer();
  try {
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    const metadata = await pdfDoc.getMetadata().catch(() => null);
    
    return {
      pageCount: pdfDoc.numPages || 1,
      title: (metadata?.info as any)?.Title || file.name.replace(/\.[^/.]+$/, ''),
      author: (metadata?.info as any)?.Author || '',
      fileSizeBytes: file.size,
    };
  } catch (err) {
    console.warn('PDF metadata extraction fallback:', err);
    return {
      pageCount: 1,
      title: file.name.replace(/\.[^/.]+$/, ''),
      author: '',
      fileSizeBytes: file.size,
    };
  }
}

/**
 * Generates an authentic multi-page valid PDF 1.4 string for educational chapters
 * Returns a Data URI that PDF.js can parse and render cleanly.
 */
export function generateEducationalPdfDataUrl(book: {
  title: string;
  subject: string;
  classLevel: string;
  board: string;
  author: string;
  chapter: string;
  pages?: number;
}): string {
  const numPages = book.pages || 6;
  const objects: string[] = [];
  
  // Object 1: Catalog
  objects[1] = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj`;

  // Page object numbers: 3, 5, 7, ...
  // Content stream numbers: 4, 6, 8, ...
  const pageRefs: string[] = [];
  for (let i = 0; i < numPages; i++) {
    const pageObjNum = 3 + i * 2;
    pageRefs.push(`${pageObjNum} 0 R`);
  }

  // Object 2: Pages tree
  objects[2] = `2 0 obj\n<< /Type /Pages /Kids [${pageRefs.join(' ')}] /Count ${numPages} >>\nendobj`;

  // Fonts dictionary (Helvetica, Helvetica-Bold)
  const fontObjNum = 3 + numPages * 2;
  const fontBoldObjNum = fontObjNum + 1;
  objects[fontObjNum] = `${fontObjNum} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`;
  objects[fontBoldObjNum] = `${fontBoldObjNum} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj`;

  for (let i = 0; i < numPages; i++) {
    const pageObjNum = 3 + i * 2;
    const contentObjNum = pageObjNum + 1;

    const pageNum = i + 1;
    let streamText = '';

    if (pageNum === 1) {
      // Cover page / Title page
      streamText = `
BT
/F2 26 Tf
50 720 Td
(EDSU DIGITAL LIBRARY) Tj
0 -36 Td
/F2 20 Tf
(${escapePdfString(book.title)}) Tj
0 -26 Td
/F1 14 Tf
(Subject: ${escapePdfString(book.subject)}  |  ${escapePdfString(book.classLevel)}  |  ${escapePdfString(book.board)}) Tj
0 -22 Td
(Author / Board: ${escapePdfString(book.author)}) Tj
0 -22 Td
(Chapter: ${escapePdfString(book.chapter)}) Tj
0 -40 Td
/F2 16 Tf
(SECTION 1.1: OVERVIEW & KEY CONCEPTS) Tj
0 -24 Td
/F1 12 Tf
(1. Theoretical Foundation and Learning Objectives) Tj
0 -18 Td
(This digital curriculum document is curated for rigorous examination mastery.) Tj
0 -18 Td
(Understand the core axioms, step-by-step mathematical proofs, and standard derivations.) Tj
0 -18 Td
(Key Formula: E = mc^2  |  Quadratic Root: x = [-b +- sqrt(b^2 - 4ac)] / (2a)) Tj
0 -30 Td
/F2 14 Tf
(Crucial Guidelines for Board & Competitive Exams) Tj
0 -18 Td
/F1 12 Tf
(- Maintain structured representations and labeled diagrams in answer scripts.) Tj
0 -18 Td
(- Practice numerical problems with precision and SI unit conversions.) Tj
0 -18 Td
(- Reference standard NCERT exemplar problems for advanced multiple choice questions.) Tj
0 -50 Td
/F1 10 Tf
(Page 1 of ${numPages} - EDSU Learning Library - Authorized Educational Edition) Tj
ET
      `.trim();
    } else if (pageNum === 2) {
      // Detailed chapter content
      streamText = `
BT
/F2 18 Tf
50 720 Td
(CHAPTER STUDY NOTES: ${escapePdfString(book.chapter)}) Tj
0 -28 Td
/F2 14 Tf
(2. Essential Theorems & Derivations) Tj
0 -20 Td
/F1 12 Tf
(Theorem 1: Under uniform conditions, energy conservation holds invariant.) Tj
0 -18 Td
(Theorem 2: Fundamental Theorem of Calculus connects integration and differentiation.) Tj
0 -18 Td
(Proof Step A: Consider arbitrary interval [a, b] partitioned into n subintervals.) Tj
0 -18 Td
(Proof Step B: Calculate Riemann upper and lower sums as norm approaches zero.) Tj
0 -30 Td
/F2 14 Tf
(3. High-Yield Examination Highlights) Tj
0 -20 Td
/F1 12 Tf
(* Frequently Asked 5-Marker: Comprehensive explanation of reaction mechanisms.) Tj
0 -18 Td
(* Common Pitfall: Forgetting constant of integration in indefinite integrals.) Tj
0 -18 Td
(* Speed Strategy: Memorize square roots up to 30 and trigonometric standard values.) Tj
0 -40 Td
/F2 14 Tf
(4. Memory Matrix & Mnemonics) Tj
0 -20 Td
/F1 12 Tf
(OIL RIG: Oxidation Is Loss of electrons, Reduction Is Gain of electrons.) Tj
0 -18 Td
(VIBGYOR: Wavelength ordering for spectrum dispersion analysis.) Tj
0 -80 Td
/F1 10 Tf
(Page 2 of ${numPages} - EDSU Study Resource - CBSE / BSEB / MPBSE / NCERT) Tj
ET
      `.trim();
    } else {
      // Questions and practice sets
      streamText = `
BT
/F2 18 Tf
50 720 Td
(PRACTICE QUESTIONS & WORKED SOLUTIONS - PART ${pageNum - 2}) Tj
0 -28 Td
/F2 14 Tf
(Question ${pageNum * 3 - 5} [3 Marks - Previous Year Paper]) Tj
0 -20 Td
/F1 12 Tf
(Calculate the net resultant vector when two orthogonal forces of 12N and 5N act.) Tj
0 -18 Td
(Solution: Resultant R = sqrt(12^2 + 5^2) = sqrt(144 + 25) = sqrt(169) = 13 Newton.) Tj
0 -26 Td
/F2 14 Tf
(Question ${pageNum * 3 - 4} [Objective / MCQ - Competitive Exam]) Tj
0 -20 Td
/F1 12 Tf
(Which of the following represents the correct oxidation state of Mn in KMnO4?) Tj
0 -18 Td
((A) +4       (B) +6       (C) +7 [Correct Answer]       (D) +2) Tj
0 -18 Td
(Explanation: Let Mn = x. 1 + x + 4(-2) = 0 => x - 7 = 0 => x = +7.) Tj
0 -26 Td
/F2 14 Tf
(Self-Evaluation Challenge Question) Tj
0 -20 Td
/F1 12 Tf
(Prove that log_b(a) * log_c(b) * log_a(c) = 1 for all positive reals != 1.) Tj
0 -18 Td
(Hint: Use base change formula to convert each term into natural logarithm.) Tj
0 -80 Td
/F1 10 Tf
(Page ${pageNum} of ${numPages} - EDSU Learning Library - Practice Exercise) Tj
ET
      `.trim();
    }

    const streamLength = streamText.length;
    objects[contentObjNum] = `${contentObjNum} 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamText}\nendstream\nendobj`;

    objects[pageObjNum] = `${pageObjNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents ${contentObjNum} 0 R /Resources << /Font << /F1 ${fontObjNum} 0 R /F2 ${fontBoldObjNum} 0 R >> >> >>\nendobj`;
  }

  // Assemble PDF document with cross reference table
  let pdfContent = `%PDF-1.4\n`;
  const offsets: number[] = [0];

  const totalObjects = objects.length;
  for (let i = 1; i < totalObjects; i++) {
    offsets[i] = pdfContent.length;
    pdfContent += `${objects[i]}\n`;
  }

  const xrefOffset = pdfContent.length;
  pdfContent += `xref\n0 ${totalObjects}\n`;
  pdfContent += `0000000000 65535 f \n`;
  for (let i = 1; i < totalObjects; i++) {
    const offsetStr = String(offsets[i]).padStart(10, '0');
    pdfContent += `${offsetStr} 00000 n \n`;
  }

  pdfContent += `trailer\n<< /Size ${totalObjects} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  // Encode to base64 data url
  const base64 = btoa(unescape(encodeURIComponent(pdfContent)));
  return `data:application/pdf;base64,${base64}`;
}

function escapePdfString(str: string): string {
  if (!str) return '';
  return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}
