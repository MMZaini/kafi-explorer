import React, { createContext, useContext, useState } from "react";

export interface SearchParams {
  volume: number;
  searchTerm: string;
  searchAll: boolean;
  grades: string[];
  topics: string[];
}

export interface HadithResult {
  volume: number;
  index: number;
  englishText: string;
  arabicText?: string;
  url: string;
  majlisiGrading?: string;
}

interface SearchContextType {
  params: SearchParams;
  setParams: React.Dispatch<React.SetStateAction<SearchParams>>;
  results: HadithResult[];
  setResults: (r: HadithResult[]) => void;
}

const defaultParams: SearchParams = {
  volume: 1,
  searchTerm: "",
  searchAll: false,
  grades: [],
  topics: [],
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [params, setParams] = useState<SearchParams>(defaultParams);
  const [results, setResults] = useState<HadithResult[]>([]);

  return (
    <SearchContext.Provider value={{ params, setParams, results, setResults }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be within provider");
  return ctx;
};
