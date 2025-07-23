'use client';
import { useEffect, useState } from 'react';
import { HadithResult } from '../../components/SearchContext';
import BookmarkButton from '../../components/BookmarkButton';

export default function BookmarksPage() {
  const [items, setItems] = useState<HadithResult[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setItems(data);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Bookmarks</h1>
      {items.length === 0 && <p>No bookmarks yet.</p>}
      {items.map((h, i) => (
        <div key={i} className="bg-white rounded shadow p-4">
          <pre className="whitespace-pre-wrap mb-2">{h.englishText}</pre>
          <div className="flex space-x-4 items-center">
            <a href={h.url} target="_blank" className="text-blue-600">View Source</a>
            <BookmarkButton hadith={h} />
          </div>
        </div>
      ))}
    </div>
  );
}
