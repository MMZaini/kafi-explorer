'use client';
import { useSearch } from './SearchContext';

export default function VolumeSelector() {
  const { params, setParams } = useSearch();
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">Volume Selection</label>
      <select
        value={params.volume}
        onChange={(e) => setParams({ volume: Number(e.target.value) })}
        className="appearance-none w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 pr-8 text-gray-800"
      >
        {[...Array(8).keys()].map((v) => (
          <option key={v + 1} value={v + 1}>
            Volume {v + 1}
          </option>
        ))}
      </select>
      <div className="flex flex-col space-y-2">
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={params.searchAll}
            onChange={(e) => setParams({ searchAll: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm">Search Across All Volumes</span>
        </label>
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={params.flexible}
            onChange={(e) => setParams({ flexible: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm">Flexible Word Search</span>
        </label>
      </div>
    </div>
  );
}
