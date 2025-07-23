import { createContext, useContext } from "react";

export interface SearchParams {
  searchTerm: string;
  volume: number;
  flexible: boolean;
  sahih: boolean;
  good: boolean;
  weak: boolean;
  unknown: boolean;
  searchAll: boolean;
}

export interface SearchResult {
  volume: number;
  index: number;
  englishText: string;
  url: string;
  majlisiGrading?: string;
}

export interface SearchState {
  params: SearchParams;
  setParams: (p: Partial<SearchParams>) => void;
  results: SearchResult[];
  setResults: (r: SearchResult[]) => void;
  loading: boolean;
  setLoading: (l: boolean) => void;
}

export const SearchContext = createContext<SearchState | undefined>(undefined);

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("SearchContext not found");
  return ctx;
};
