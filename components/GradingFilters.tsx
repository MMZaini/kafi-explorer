'use client';
import { useSearch, SearchParams } from './SearchContext';

const filters = [
  { key: 'sahih', label: 'Sahih' },
  { key: 'good', label: 'Good' },
  { key: 'weak', label: 'Weak' },
  { key: 'unknown', label: 'Unknown' },
] as const;

type FilterKey = typeof filters[number]['key'];

export default function GradingFilters() {
  const { params, setParams } = useSearch();
  const toggle = (key: FilterKey, val: boolean) =>
    setParams({ [key]: val } as Partial<SearchParams>);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {filters.map((f) => (
        <label key={f.key} className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={(params as unknown as Record<FilterKey, boolean>)[f.key]}
            onChange={(e) => toggle(f.key, e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">{f.label}</span>
        </label>
      ))}
    </div>
  );
}
