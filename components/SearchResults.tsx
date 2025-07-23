'use client';
import { Book } from 'lucide-react';
import { useSearch } from './SearchContext';
import { useState } from 'react';
import BookmarkButton from './BookmarkButton';

function gradeColor(g?: string) {
  if (!g) return 'bg-gray-300';
  if (g.includes('صحيح') || g.toLowerCase().includes('sahih')) return 'bg-green-500';
  if (g.includes('حسن') || g.toLowerCase().includes('good')) return 'bg-yellow-500';
  if (g.includes('ضعيف') || g.toLowerCase().includes('weak')) return 'bg-red-500';
  return 'bg-gray-400';
}

export default function SearchResults() {
  const { results } = useSearch();
  const [showArabic, setShowArabic] = useState(false);
  if (!results.length) return null;

  return (
    <div className="space-y-6 mb-12">
      <div className="flex justify-end mb-4">
        <label className="flex items-center space-x-2 text-sm">
          <input type="checkbox" checked={showArabic} onChange={e=>setShowArabic(e.target.checked)} className="w-4 h-4" />
          <span>Show Arabic</span>
        </label>
      </div>
      {results.map((r, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4 mb-2">
            <Book className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-medium">Volume {r.volume}, Page {r.index + 1}</h3>
            <span className={`text-white px-2 py-0.5 rounded text-xs ml-auto ${gradeColor(r.majlisiGrading)}`}>{r.majlisiGrading ?? 'Unknown'}</span>
          </div>
          <pre className="whitespace-pre-wrap text-gray-800 md:text-lg text-base mb-4">{r.englishText}</pre>
          {showArabic && r.arabicText && (
            <pre className="whitespace-pre-wrap text-gray-700 mb-4">{r.arabicText}</pre>
          )}
          <div className="flex items-center space-x-4">
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">View Source →</a>
            <BookmarkButton hadith={r} />
          </div>
        </div>
      ))}
    </div>
  );
}
