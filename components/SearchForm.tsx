'use client';
import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useSearch } from './SearchContext';

const gradings = ['sahih','good','weak','unknown'];

export default function SearchForm() {
  const { params, setParams } = useSearch();
  const [localTerm, setLocalTerm] = useState(params.searchTerm);
  const [topics, setTopics] = useState<string[]>([]);

  useEffect(() => {
    fetch('/jsons/topics.json').then(r=>r.json()).then(obj=> setTopics(Object.keys(obj)));
  }, []);

  const toggleGrade = (g: string) => {
    const grades = params.grades.includes(g)
      ? params.grades.filter((x) => x !== g)
      : [...params.grades, g];
    setParams({ ...params, grades });
  };

  const submit = () => {
    setParams({ ...params, searchTerm: localTerm });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-sm font-medium" htmlFor="volume">Volume</label>
          <div className="relative">
            <select
              id="volume"
              value={params.volume}
              onChange={(e)=>setParams({ ...params, volume: Number(e.target.value) })}
              className="appearance-none w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 pr-8"
            >
              {[...Array(8).keys()].map(v => (
                <option key={v+1} value={v+1}>Volume {v+1}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          <div className="flex items-center space-x-2">
            <input id="searchAll" type="checkbox" checked={params.searchAll} onChange={(e)=>setParams({...params, searchAll:e.target.checked})} className="w-4 h-4" />
            <label htmlFor="searchAll" className="text-sm">Search Across All Volumes</label>
          </div>
          {topics.length > 0 && (
            <div>
              <label className="block text-sm font-medium" htmlFor="topic">Topic</label>
              <select id="topic" value={params.topics[0] || ''} onChange={e=>setParams({...params, topics: e.target.value? [e.target.value]: []})} className="mt-1 w-full border rounded p-2">
                <option value="">All Topics</option>
                {topics.map(t=> (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-medium" htmlFor="search">Search Terms</label>
          <div className="relative">
            <input id="search" type="text" value={localTerm} onChange={e=>setLocalTerm(e.target.value)} onKeyDown={e=>e.key==='Enter' && submit()} className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 pl-10" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {gradings.map(g=> (
              <div key={g} className="flex items-center space-x-2">
                <input id={`grade-${g}`} type="checkbox" checked={params.grades.includes(g)} onChange={()=>toggleGrade(g)} className="w-4 h-4" />
                <label htmlFor={`grade-${g}`} className="text-sm capitalize">{g}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={submit} className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg">
          <Search className="w-5 h-5 mr-2"/>Search
        </button>
      </div>
    </div>
  );
}
