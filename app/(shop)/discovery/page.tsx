'use client';

import { useState, useEffect, useCallback } from 'react';

import { DELAY_CLASSES } from '@/features/discovery/discovery-data';
import type { Opportunity } from '@/features/discovery/discovery-data';
import { DiscoverySidebar } from '@/features/discovery/DiscoverySidebar';
import { OpportunityCard } from '@/features/discovery/OpportunityCard';
import { OpportunityModal } from '@/features/discovery/OpportunityModal';
import { SearchBar } from '@/features/discovery/SearchBar';

const DiscoveryPage = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [checkedSubjects, setCheckedSubjects] = useState<string[]>([]);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<Opportunity | null>(null);

  const fetchData = useCallback(
    (type: string | null, query: string, subjects: string[]) => {
      setLoading(true);
      const params = new URLSearchParams();
      if (type) params.set('type', type);
      if (query) params.set('search', query);
      if (subjects.length > 0) params.set('subject', subjects.join(','));

      fetch(`/api/opportunities?${params}`)
        .then((res) => res.json())
        .then((json) => {
          setOpportunities(json.opportunities ?? []);
          setTotal(json.total ?? 0);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    },
    [],
  );

  useEffect(() => {
    fetchData(null, '', []);
  }, [fetchData]);

  const toggleSubject = (subject: string) => {
    setCheckedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject],
    );
  };

  const handleTypeToggle = (type: string) => {
    const next = activeType === type ? null : type;
    setActiveType(next);
    fetchData(next, search, checkedSubjects);
  };

  const handleSearch = () => fetchData(activeType, search, checkedSubjects);
  const applyFilters = () => fetchData(activeType, search, checkedSubjects);

  const handleScrape = async () => {
    setScraping(true);
    try {
      await fetch('/api/scrape', { method: 'POST' });
      fetchData(activeType, search, checkedSubjects);
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Page Header */}
      <div className="heading-section animate-fade-up mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
            Боломжууд
          </h1>
          <div className="accent-line mt-3" />
          <p className="mt-4 max-w-xl text-sm text-on-surface-variant">
            Тэтгэлэг, тэмцээн, хөтөлбөр болон бусад боломжууд. AI ашиглан шүүж, ангилсан.
          </p>
        </div>
        <button
          onClick={handleScrape}
          disabled={scraping}
          className="btn-glow flex-shrink-0 rounded-full bg-gradient-to-r from-ds-primary to-ds-secondary px-5 py-2 text-sm font-semibold text-on-primary-fixed shadow-lg shadow-ds-primary/20 disabled:opacity-50"
        >
          {scraping ? 'Шинэчилж байна...' : 'Мэдээ шинэчлэх'}
        </button>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <DiscoverySidebar
          checkedSubjects={checkedSubjects}
          activeType={activeType}
          total={total}
          toggleSubject={toggleSubject}
          handleTypeToggle={handleTypeToggle}
          applyFilters={applyFilters}
        />

        <div className="flex-1">
          <SearchBar search={search} setSearch={setSearch} handleSearch={handleSearch} />

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass-card animate-pulse rounded-2xl p-5">
                  <div className="mb-3 h-5 w-20 rounded bg-surface-container-highest" />
                  <div className="mb-2 h-5 w-full rounded bg-surface-container-highest" />
                  <div className="h-4 w-3/4 rounded bg-surface-container-highest" />
                  <div className="mt-5 h-px bg-outline-variant/30" />
                  <div className="mt-3 h-4 w-1/2 rounded bg-surface-container-highest" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && opportunities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg className="mb-4 h-16 w-16 text-on-surface-variant/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-on-surface-variant">Боломж олдсонгүй</p>
              <button
                onClick={handleScrape}
                disabled={scraping}
                className="mt-4 rounded-full bg-ds-primary px-6 py-2 text-sm font-bold text-on-primary-fixed disabled:opacity-50"
              >
                {scraping ? 'Шинэчилж байна...' : 'Мэдээ татах'}
              </button>
            </div>
          )}

          {/* Cards Grid */}
          {!loading && opportunities.length > 0 && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {opportunities.map((item, i) => (
                <OpportunityCard key={item.id} item={item} delayClass={DELAY_CLASSES[i % 8]} onSelect={setSelectedItem} />
              ))}
            </div>
          )}
        </div>
      </div>

      <OpportunityModal
        item={selectedItem}
        open={selectedItem !== null}
        onOpenChange={(isOpen) => { if (!isOpen) setSelectedItem(null); }}
      />
    </div>
  );
};

export default DiscoveryPage;
