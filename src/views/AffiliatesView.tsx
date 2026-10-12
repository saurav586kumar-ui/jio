import React, { useState } from 'react';
import { ShoppingBag, ExternalLink, ShieldCheck, Tag, Sparkles, Filter, Check } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

export const AffiliatesView: React.FC = () => {
  const { affiliates, recordAffiliateClick } = useLibrary();
  const [selectedMerchant, setSelectedMerchant] = useState('all');

  const merchants = ['all', ...Array.from(new Set(affiliates.map((a) => a.merchant)))];

  const filteredAffiliates = affiliates.filter((a) => {
    if (!a.isActive) return false;
    if (selectedMerchant !== 'all' && a.merchant !== selectedMerchant) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 uppercase tracking-wider">
            Sponsored Education Curations
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Recommended Physical Reference Books &amp; Exam Materials
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
          While EDSU provides free digital PDF access, many competitive examinations (JEE, NEET, Board practicals) benefit from hard-copy physical editions with scratch-code test series. Below are hand-vetted printed editions from authentic publishers.
        </p>
      </div>

      {/* Filter by Merchant */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Retailer:
        </span>
        {merchants.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMerchant(m)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition capitalize ${
              selectedMerchant === m
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            {m === 'all' ? 'All Retailers' : m}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredAffiliates.map((aff) => (
          <div
            key={aff.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
                <img
                  src={aff.imageUrl}
                  alt={aff.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur border border-white/20">
                  via {aff.merchant}
                </span>
                {aff.targetExam && (
                  <span className="absolute bottom-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow">
                    {aff.targetExam}
                  </span>
                )}
              </div>

              <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                {aff.category}
              </span>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mt-1 mb-2">
                {aff.title}
              </h3>

              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                {aff.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {aff.priceDisplay}
              </span>

              <a
                href={aff.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => recordAffiliateClick(aff.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition active:scale-95"
              >
                <span>Check Deal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Mandatory Affiliate Disclosure Card */}
      <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-2">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Affiliate Advertising &amp; Transparency Statement</span>
        </div>
        <p>
          EDSU participates in verified third-party affiliate programs (such as Amazon Associates and publisher partner programs). When students purchase recommended physical textbooks via our sponsored links, we may earn a small referral commission at no additional cost to the buyer. This assists us in subsidizing server hosting, database maintenance, and verified PDF digitizing efforts. We never endorse unvetted or low-quality study materials.
        </p>
      </div>

    </div>
  );
};
