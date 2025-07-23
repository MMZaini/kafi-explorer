'use client';
import { useEffect, useState } from 'react';

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;
  return (
    <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow">↑</button>
  );
}
