'use client';
import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('dark');
    if (stored) setDark(stored === 'true');
  }, []);

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('dark', String(dark));
  }, [dark]);

  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input type="checkbox" className="w-4 h-4" checked={dark} onChange={e=>setDark(e.target.checked)} />
      <span>Dark Mode</span>
    </label>
  );
}
