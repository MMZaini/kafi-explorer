'use client';
import { Search } from 'lucide-react';

export default function SearchButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg"
    >
      <Search className="w-5 h-5 mr-2" />
      Search
    </button>
  );
}
