'use client';
import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('dark-mode');
    if (stored) setDark(stored === 'true');
  }, []);

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('dark-mode', String(dark));
  }, [dark]);

  return (
    <button onClick={() => setDark((d) => !d)} className="ml-4 px-2 py-1 border rounded">
      {dark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
