'use client';
import { useEffect, useState } from 'react';
import { HadithResult } from './SearchContext';

export default function BookmarkButton({ hadith }: { hadith: HadithResult }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('bookmarks') || '[]') as HadithResult[];
    setSaved(data.some(h => h.url === hadith.url));
  }, [hadith]);

  const toggle = () => {
    const data = JSON.parse(localStorage.getItem('bookmarks') || '[]') as HadithResult[];
    if (saved) {
      const n = data.filter(h => h.url !== hadith.url);
      localStorage.setItem('bookmarks', JSON.stringify(n));
      setSaved(false);
    } else {
      data.push(hadith);
      localStorage.setItem('bookmarks', JSON.stringify(data));
      setSaved(true);
    }
  };

  return (
    <button onClick={toggle} className="text-sm underline">
      {saved ? 'Remove bookmark' : 'Bookmark'}
    </button>
  );
}
