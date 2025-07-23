'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useSearch } from './SearchContext';

export default function SearchInput({ onSearch }: { onSearch: () => void }) {
  const { params, setParams } = useSearch();
  const [localTerm, setLocalTerm] = useState(params.searchTerm);

  const handle = () => {
    setParams({ searchTerm: localTerm });
    onSearch();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">Search Terms</label>
      <div className="relative">
        <input
          type="text"
          value={localTerm}
          onChange={(e) => setLocalTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handle()}
          className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 pl-10"
          placeholder="Enter search terms..."
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>
    </div>
  );
}
