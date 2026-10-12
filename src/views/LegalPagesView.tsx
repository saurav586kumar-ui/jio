import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  Mail, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Send, 
  ExternalLink,
  ChevronDown,
  Info,
  Code
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

interface LegalPagesViewProps {
  initialTab?: string;
  onNavigateHome: () => void;
}

export const LegalPagesView: React.FC<LegalPagesViewProps> = ({ initialTab = 'about', onNavigateHome }) => {
  const { books } = useLibrary();
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCategory, setContactCategory] = useState('General Academic Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // DMCA / Removal Notice state
  const [dmcaName, setDmcaName] = useState('');
  const [dmcaEmail, setDmcaEmail] = useState('');
  const [dmcaWorkTitle, setDmcaWorkTitle] = useState('');
  const [dmcaUrl, setDmcaUrl] = useState('');
  const [dmcaStatement, setDmcaStatement] = useState(false);
  const [dmcaSent, setDmcaSent] = useState(false);

  // FAQ open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 4000);
  };

  const handleDmcaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmcaStatement) return;
    setDmcaSent(true);
    setTimeout(() => {
      setDmcaName('');
      setDmcaEmail('');
      setDmcaWorkTitle('');
      setDmcaUrl('');
      setDmcaStatement(false);
    }, 5000);
  };

  const faqs = [
    {
      q: 'Are the educational PDFs on EDSU completely free to read online?',
      a: 'Yes. All digital books, notes, NCERT solutions, and sample papers hosted on EDSU are free to browse and read in our high-resolution web PDF reader. Permitted titles may also be downloaded locally for offline student revision.',
    },
    {
      q: 'Which education boards and competitive examinations does EDSU support?',
      a: 'EDSU currently supports CBSE (Classes 6–12), Bihar Board (BSEB Matric & Intermediate), MP Board (MPBSE High School & Higher Secondary), NCERT national curricula, as well as competitive entrance materials for IIT JEE (Main & Advanced), NEET UG, and CUET.',
    },
    {
      q: 'How does the PDF reader work on mobile and tablet devices?',
      a: 'Our PDF reader is built using vector-based PDF.js rendering. On desktops and tablets, you can enable a two-page spread book layout. On mobile devices, it auto-fits single page mode with touch gestures and page navigation.',
    },
    {
      q: 'Do I need an account to browse and read materials?',
      a: 'No account is required to read open materials. However, creating a free student account allows you to sync your bookmarks, record your last read page across devices, and view personalized reading progress.',
    },
    {
      q: 'How can content owners request removal or update of educational resources?',
      a: 'Publishers and copyright holders can use our Copyright & Removal (DMCA) form accessible in the legal portal. We review and process verified removal inquiries within 24 to 48 business hours.',
    },
  ];

  // Dynamic Sitemap XML generator
  const generatedSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://edsu.org/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://edsu.org/library</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
${books.map((b) => `  <url>
    <loc>https://edsu.org/book/${b.id}</loc>
    <lastmod>${b.updatedAt ? b.updatedAt.slice(0, 10) : '2026-03-20'}</lastmod>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Navigation Sub-tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-bold">
        {[
          { id: 'about', label: 'About EDSU' },
          { id: 'contact', label: 'Contact Us' },
          { id: 'faq', label: 'FAQ & Help' },
          { id: 'copyright', label: 'Copyright & DMCA' },
          { id: 'affiliate', label: 'Affiliate Disclosure' },
          { id: 'privacy', label: 'Privacy Policy' },
          { id: 'terms', label: 'Terms of Use' },
          { id: 'sitemap', label: 'Sitemap & SEO' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded-xl transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: About EDSU */}
      {activeTab === 'about' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
              Educational Mission
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              About EDSU — Digital Books &amp; Learning Library
            </h1>
          </div>

          <div className="prose prose-slate dark:prose-invert text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed">
            <p>
              <strong>EDSU</strong> was founded with a singular conviction: every student in India and around the globe deserves uninterrupted, instantaneous access to high-quality academic books, textbooks, revision notes, and model examination papers regardless of socioeconomic barriers.
            </p>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
              Our Core Pillars
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Curriculum Fidelity:</strong> Every document on EDSU is indexed by official education board (CBSE, BSEB, MPBSE, NCERT), standard grade level (Classes 6–12), and competitive entrance domain (IIT JEE, NEET, CUET).
              </li>
              <li>
                <strong>Authentic PDF Engine:</strong> We utilize client-side PDF rendering powered by PDF.js, ensuring vector fidelity, two-page book spreads, and table-of-contents navigation without loss of quality.
              </li>
              <li>
                <strong>Fair-Use &amp; Open Access:</strong> We champion Open Educational Resources (OER), public board model papers, and educator-contributed study summaries.
              </li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
              Institutional Contact Information
            </h3>
            <p>
              EDSU Educational Initiatives Bureau<br />
              Digital Learning &amp; Curriculum Division<br />
              Email: <code>editorial@edsu.org</code> • Support: <code>support@edsu.org</code>
            </p>
          </div>
        </div>
      )}

      {/* Tab: Contact Us */}
      {activeTab === 'contact' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
              Student &amp; Educator Support
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Contact EDSU Academic Help Desk
            </h1>
            <p className="text-xs text-slate-500">
              Reach out with inquiries regarding book corrections, curriculum requests, or institutional inquiries.
            </p>
          </div>

          {contactSent ? (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                Message Dispatched Successfully
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Thank you for reaching out. An academic coordinator will review your inquiry and follow up within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 max-w-xl text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Your Name *</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Email Address *</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Inquiry Domain</label>
                <select
                  value={contactCategory}
                  onChange={(e) => setContactCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="General Academic Inquiry">General Academic Inquiry</option>
                  <option value="Book / Notes Upload Request">Book / Notes Upload Request</option>
                  <option value="Corrections / Errata Report">Corrections / Errata Report</option>
                  <option value="Institutional Partnership">Institutional Partnership</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Please specify the board, class, or subject you are inquiring about..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow transition flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab: FAQ & Help Center */}
      {activeTab === 'faq' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
              Student Support Center
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions (FAQ)
            </h1>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition transform ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Copyright & Removal Policy (DMCA) */}
      {activeTab === 'copyright' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">
              Compliance &amp; Rights Protection
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Copyright, Fair-Use &amp; Removal (DMCA) Notice
            </h1>
            <p className="text-xs text-slate-500">
              EDSU respects the intellectual property rights of authors, publishing houses, and government education councils.
            </p>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
            <p>
              It is our strict policy to respond promptly to clear, formal notices of alleged copyright infringement under the Digital Millennium Copyright Act (DMCA) and Indian Copyright Act 1957.
            </p>
            <p>
              If you are the copyright holder or authorized agent thereof and believe that any educational resource published on our library infringes upon your copyright, you may submit a formal takedown request using the verified form below or by writing directly to <code>copyright@edsu.org</code>.
            </p>
          </div>

          {dmcaSent ? (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                Takedown Notice Received
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Your notice has been logged into our compliance register. Our legal team will review the link and expedite de-indexing within 24 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleDmcaSubmit} className="space-y-4 max-w-xl text-xs pt-2">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Claimant / Rights Holder Name *</label>
                <input
                  type="text"
                  required
                  value={dmcaName}
                  onChange={(e) => setDmcaName(e.target.value)}
                  placeholder="e.g. Authorized Legal Counsel / Publisher Name"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Contact Email *</label>
                <input
                  type="email"
                  required
                  value={dmcaEmail}
                  onChange={(e) => setDmcaEmail(e.target.value)}
                  placeholder="legal@publisher.com"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Title of Copyrighted Work *</label>
                <input
                  type="text"
                  required
                  value={dmcaWorkTitle}
                  onChange={(e) => setDmcaWorkTitle(e.target.value)}
                  placeholder="Exact work title and registration identifier"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Infringing Resource URL on EDSU *</label>
                <input
                  type="url"
                  required
                  value={dmcaUrl}
                  onChange={(e) => setDmcaUrl(e.target.value)}
                  placeholder="https://edsu.org/book/..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <label className="flex items-start gap-2 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  required
                  checked={dmcaStatement}
                  onChange={(e) => setDmcaStatement(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded mt-0.5"
                />
                <span>
                  I declare under penalty of perjury that I am the copyright owner or authorized to act on behalf of the owner, and believe in good faith that use of the material is not authorized.
                </span>
              </label>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow transition"
              >
                Submit Formal Removal Notice
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab: Affiliate Disclosure */}
      {activeTab === 'affiliate' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-4">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            EDSU Affiliate Marketing &amp; Commercial Disclosure
          </h1>
          <div className="prose prose-slate dark:prose-invert text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed">
            <p>
              In compliance with FTC guidelines and Indian consumer transparency directives, EDSU discloses that we include affiliate links on select pages (clearly labeled as "Sponsored" or "Affiliate").
            </p>
            <p>
              When a user clicks on an outbound retail recommendation (such as Amazon India, Flipkart, or publisher webstores) and completes a transaction, EDSU may receive a small marketing commission.
            </p>
            <p>
              <strong>Zero Cost to Students:</strong> These commissions do not increase the price paid by the user. Referral revenue directly offsets server bandwidth, PDF CDN hosting, and developer costs required to provide open education materials.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Privacy Policy */}
      {activeTab === 'privacy' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-4">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Privacy Policy &amp; Student Data Protection
          </h1>
          <div className="prose prose-slate dark:prose-invert text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed">
            <p>
              EDSU is committed to student privacy. We do not sell, rent, or monetize personal student data.
            </p>
            <p>
              <strong>Data Collected:</strong> When you authenticate via Google Sign-In, we store only your public display name, email, and user ID. Reading bookmarks and page progress are stored in your private user profile in Google Cloud Firestore.
            </p>
            <p>
              <strong>Analytics:</strong> Aggregate page views and book download counts are tracked without linking individual student identities.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Terms of Use */}
      {activeTab === 'terms' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-4">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Terms of Service &amp; Acceptable Use
          </h1>
          <div className="prose prose-slate dark:prose-invert text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed">
            <p>
              By accessing EDSU, you agree to utilize the platform strictly for individual study, non-commercial education, and preparation purposes.
            </p>
            <p>
              You agree not to deploy automated scrapers, denial-of-service payloads, or redistribute licensed textbooks for commercial gain without explicit publisher consent.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Sitemap & SEO */}
      {activeTab === 'sitemap' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Sitemap XML &amp; Crawler Indexing Configuration
              </h1>
              <p className="text-xs text-slate-500">
                Production SEO structure for search engines (Googlebot, Bingbot).
              </p>
            </div>
            <span className="text-xs font-mono bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2.5 py-1 rounded-lg font-bold">
              sitemap.xml
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              The live XML sitemap dynamically indexes all published books and curricula routes:
            </p>
            <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 text-[11px] overflow-x-auto font-mono border border-slate-800">
              {generatedSitemap}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
};
