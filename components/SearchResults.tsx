'use client';
import { Book } from 'lucide-react';
import { useSearch } from './SearchContext';

function highlight(text: string, term: string) {
  if (!term) return text;
  const regex = new RegExp(`(${term})`, 'gi');
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === term.toLowerCase() ? (
      <span key={i} className="bg-yellow-200 font-bold">{part}</span>
    ) : (
      part
    ),
  );
}

export default function SearchResults() {
  const { results, params, loading } = useSearch();
  if (!params.searchTerm && results.length === 0) return null;
  if (loading)
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">Loading...</div>
    );
  if (results.length === 0)
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">No results found</div>
    );
  return (
    <div className="space-y-6 mb-12">
      {results.map((r, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Book className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-medium">Volume {r.volume}, Page {r.index + 1}</h3>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <pre className="whitespace-pre-wrap">
              {highlight(r.englishText, params.searchTerm)}
            </pre>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">View Source →</a>
            {r.majlisiGrading && <span className="text-gray-600">Grading: {r.majlisiGrading}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
