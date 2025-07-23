'use client';
import { useState } from 'react';
import { SearchContext, SearchParams, SearchResult } from './SearchContext';

export default function SearchProvider({ children }: { children: React.ReactNode }) {
  const [params, setParamsState] = useState<SearchParams>({
    searchTerm: '',
    volume: 1,
    flexible: false,
    sahih: false,
    good: false,
    weak: false,
    unknown: false,
    searchAll: false,
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const setParams = (p: Partial<SearchParams>) =>
    setParamsState((prev) => ({ ...prev, ...p }));

  return (
    <SearchContext.Provider value={{ params, setParams, results, setResults, loading, setLoading }}>
      {children}
    </SearchContext.Provider>
  );
}
