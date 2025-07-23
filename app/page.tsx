'use client';
import { useSearch } from '../components/SearchContext';
import VolumeSelector from '../components/VolumeSelector';
import SearchInput from '../components/SearchInput';
import SearchButton from '../components/SearchButton';
import SearchResults from '../components/SearchResults';
import GradingFilters from '../components/GradingFilters';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function SearchPage() {
  const { params, setParams, setResults, setLoading } = useSearch();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams?.get('q');
    if (q) setParams({ searchTerm: q });
  }, [searchParams, setParams]);

  const performSearch = async () => {
    setLoading(true);
    const url = `/api/search?q=${encodeURIComponent(params.searchTerm)}&volume=${params.volume}&all=${params.searchAll}&flexible=${params.flexible}&sahih=${params.sahih}&good=${params.good}&weak=${params.weak}&unknown=${params.unknown}`;
    const res = await fetch(url);
    const data = await res.json();
    setResults(data);
    setLoading(false);
    router.replace(`/?q=${encodeURIComponent(params.searchTerm)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 space-y-6">
          <VolumeSelector />
          <SearchInput onSearch={performSearch} />
          <GradingFilters />
          <div className="flex justify-end">
            <SearchButton onClick={performSearch} />
          </div>
        </div>
        <SearchResults />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
}
