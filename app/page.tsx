'use client';
import { useEffect, useState } from 'react';
import { SearchProvider, useSearch } from '../components/SearchContext';
import SearchForm from '../components/SearchForm';
import SearchResults from '../components/SearchResults';
import { searchHadiths } from '../components/useFuseSearch';
import DarkModeToggle from '../components/DarkModeToggle';
import ScrollTopButton from '../components/ScrollTopButton';

function SearchContainer() {
  const { params, setParams, setResults } = useSearch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const q = url.searchParams.get('q');
    const vol = url.searchParams.get('volume');
    const all = url.searchParams.get('all');
    setParams(p => ({
      ...p,
      searchTerm: q || p.searchTerm,
      volume: vol ? Number(vol) : p.volume,
      searchAll: all === 'true' ? true : p.searchAll,
    }));
  }, [setParams]);

 useEffect(() => {
    if (!params.searchTerm) { setResults([]); return; }
    const url = new URL(window.location.href);
    url.searchParams.set('q', params.searchTerm);
    url.searchParams.set('volume', String(params.volume));
    url.searchParams.set('all', String(params.searchAll));
    window.history.replaceState(null, '', url.toString());
    setLoading(true);
    const vols = params.searchAll ? [1,2,3,4,5,6,7,8] : [params.volume];
    searchHadiths(vols, params.searchTerm).then(res => {
      let filtered = res;
      if (params.grades.length) {
        filtered = filtered.filter(h => {
          const g = h.majlisiGrading?.toLowerCase() || 'unknown';
          return params.grades.some(sel => g.includes(sel));
        });
      }
      if (params.topics.length) {
        // simple topic filter using topics.json
        fetch('/jsons/topics.json').then(r=>r.json()).then(map=> {
          const allowed: number[] = map[params.topics[0]] || [];
          filtered = filtered.filter(h => allowed.includes(h.index+1));
          setResults(filtered);
          setLoading(false);
        });
        return;
      }
      setResults(filtered);
      setLoading(false);
    });
  }, [params, setResults]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
      <SearchForm />
      {loading && <div className="text-center py-8">Loading...</div>}
      <SearchResults />
      <ScrollTopButton />
    </main>
  );
}

export default function Home() {
  return (
    <SearchProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-900">Kafi Explorer</h1>
            <div className="flex items-center space-x-4">
              <a href="/bookmarks" className="underline text-sm">Bookmarks</a>
              <DarkModeToggle />
            </div>
          </div>
        </header>
        <SearchContainer />
      </div>
    </SearchProvider>
  );
}
