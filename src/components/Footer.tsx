import React from 'react';
import { BookOpen, Shield, HelpCircle, FileText, Mail, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, subTab?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                EDSU
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              EDSU is an open digital education library dedicated to empowering students, educators, and competitive exam aspirants with authentic, curated textbooks, revision notes, model test papers, and study guides.
            </p>

            <div className="pt-2 text-[11px] text-slate-500">
              <p>National Curriculum Support: CBSE • BSEB • MPBSE • NCERT • IIT JEE • NEET</p>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Boards &amp; Curricula
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('library')} className="hover:text-blue-400 transition">
                  CBSE Class 10 &amp; 12
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('library')} className="hover:text-blue-400 transition">
                  Bihar Board (BSEB) Matrix
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('library')} className="hover:text-blue-400 transition">
                  MP Board (MPBSE) Notes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('library')} className="hover:text-blue-400 transition">
                  NCERT Complete Solutions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('library')} className="hover:text-blue-400 transition">
                  IIT JEE &amp; NEET Banks
                </button>
              </li>
            </ul>
          </div>

          {/* Learning & Articles */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Resources &amp; Editorial
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('articles')} className="hover:text-blue-400 transition">
                  Editorial Study Guides
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('affiliates')} className="hover:text-blue-400 transition">
                  Recommended Physical Books
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal', 'faq')} className="hover:text-blue-400 transition">
                  Help Center &amp; FAQ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal', 'about')} className="hover:text-blue-400 transition">
                  About the EDSU Mission
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal', 'contact')} className="hover:text-blue-400 transition">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Transparency &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('legal', 'copyright')} className="hover:text-amber-400 transition flex items-center gap-1">
                  <span>Copyright &amp; Removal (DMCA)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal', 'affiliate')} className="hover:text-blue-400 transition">
                  Affiliate Disclosure
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal', 'privacy')} className="hover:text-blue-400 transition">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal', 'terms')} className="hover:text-blue-400 transition">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Affiliate Disclosure Notice Box */}
        <div className="mt-10 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-1">
            Institutional Notice &amp; Affiliate Disclosure:
          </p>
          <p>
            EDSU is an independent digital learning catalog. We participate in select book distributor affiliate programs (e.g., Amazon Associates, Flipkart). When you purchase recommended printed reference books through links on our platform, EDSU may earn a modest referral commission at zero additional cost to you. All digital PDFs displayed are open-educational or fair-use educational materials; copyright holders may submit removal notices via our Copyright Policy portal.
          </p>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} EDSU Educational Foundation. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Built with precision for students across India &amp; Worldwide
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
