"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Book,
  ChevronDown,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Languages,
} from "lucide-react";

export default function Home() {
  const [volume, setVolume] = useState(1);
  const [searchTerms, setSearchTerms] = useState([""]);
  const [searchMode, setSearchMode] = useState<"AND" | "OR">("AND");
  const [isLoading, setIsLoading] = useState(false);
  const [flexibleSearch, setFlexibleSearch] = useState(false);

  interface SearchResult {
    volume: number;
    index: number;
    content: string;
    arabicContent: string;
    url: string;
    majlisiGrading: string | undefined;
  }

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [sahihOnly, setSahihOnly] = useState(false);
  const [goodOnly, setGoodOnly] = useState(false);
  const [weakOnly, setWeakOnly] = useState(false);
  const [unknownOnly, setUnknownOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedArabic, setExpandedArabic] = useState<Set<number>>(new Set());
  const RESULTS_PER_PAGE = 20;

  // Client-side JSON cache
  const volumeCache = useRef<
    Map<
      number,
      {
        englishText: string;
        arabicText?: string;
        majlisiGrading?: string;
        URL: string;
      }[]
    >
  >(new Map());

  // Ref for keyboard shortcut focus
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-re-search when filters or volume change (only if a search was already performed)
  useEffect(() => {
    if (searchPerformed) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sahihOnly,
    goodOnly,
    weakOnly,
    unknownOnly,
    volume,
    flexibleSearch,
    searchMode,
  ]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setVolume(Number(event.target.value));
  };

  const validGradings = [
    "صحيح",
    "صحيح أو حسن",
    "صحيح الفضلاء",
    "صحيح بسنديه",
    "صحيح ظاهرا",
    "صحيح على الظاهر",
    "صحيح على المشهور",
    "صحيح معتمد أو موقوف",
    "صحيح مقطوع",
    "صحيح مكرر",
    "حسن",
    "حسن أو صحيح",
    "حسن أو صحيح على الظاهر",
    "حسن كالصحيح",
    "حسن كالصحيح بسنديه",
    "حسن كالصحيح بل صحيح عندي",
    "حسن كالصحيح على الظاهر",
    "حسن كالصحيح موثق",
    "حسن كالصحيح وقد يعد صحيحا",
    "حسن كالموثق",
    "حسن لا يقصر عن الصحيح",
    "حسن موثق",
    "حسن موثق صحيح",
    "حسن موثق كالصحيح",
    "حسن مقطوع",
    "موثق",
    "موثق أو حسن",
    "موثق صحيح",
    "موثق كالصحيح",
    "موثق كالصحيح بسنديه",
    "موثق على الظاهر",
    "موثق في قوة الصحيح",
    "ضعيف كالصحيح",
    "مجهول أو صحيح",
    "مجهول كالصحيح",
    "مرسل كالصحيح",
    "حسن أو موثوق كالصحيح",
    "صحيح وسنده الثاني حسن",
  ];
  const goodGradings = [
    "حسن أو موثق",
    "حسن أو موثق على الظاهر",
    "حسن أو موثوق",
    "حسن كالسابق",
    "حسن كالصحيح وآخره مرسل",
    "حسن على الظاهر",
    "حسن على الظاهر وقد يعد مجهول",
    "حسن والثاني ضعيف",
    "حسن والثاني مجهول",
    "حسن وربما قيل صحيح",
    "حسن وقد يعد مجهول وآخره مرسل",
    "حسن وموافق للمشهور",
    "حسن ويحتمل وجوها من التأويل",
    "حسن ويمكن أن يعد صحيحا",
    "حسن الفضلاء",
    "صحيح ظاهرا ولكن في السند غرابة",
    "صحيح وآخره مرسل",
    "صحيح وأخره مرسل",
    "صحيح والثاني موثق",
    "موثق حسن",
    "موثق على الظاهر",
    "موثق وآخره مرسل",
    "موثق وآخره مرسل كالموثق",
  ];

  const weakGradings = [
    "ضعيف",
    "ضعيف أو مجهول",
    "ضعيف أو مرسل",
    "ضعيف على المشهور",
    "ضعيف على المشهور أو حسن",
    "ضعيف على المشهور لكنه قوي",
    "ضعيف على المشهور لكنه معتبر",
    "ضعيف على المشهور معتبر عندي",
    "ضعيف على المشهور معتمد عندي",
    "ضعيف على المشهور موقوف",
    "ضعيف كالموثق",
    "ضعيف مرسل",
    "ضعيف موقوف",
    "ضعيف وآخره مرسل",
    "ضعيف وآخره مرفوع",
    "مجهول أو حسن",
    "مجهول أو ضعيف",
    "مجهول أو مرسل",
    "مجهول كالحسن",
    "مجهول كالموثق",
    "مجهول مختلف فيه",
    "مجهول مرسل",
    "مجهول موقوف",
    "مجهول وآخره مرسل",
    "مجهول وقد يعد ضعيفا",
    "مجهول ويمكن أن يعد حسنا",
    "مرسل",
    "مرسل أو حسن",
    "مرسل أو مجهول",
    "مرسل كالحسن",
    "مرسل كالموثق",
    "مرسل كالموثق أو كالحسن",
    "مرسل وآخره ضعيف على المشهور",
  ];
  // Create Sets for grading categories
  const validGradingsSet = new Set(validGradings);
  const goodGradingsSet = new Set(goodGradings);
  const weakGradingsSet = new Set(weakGradings);

  // Utility function to detect Arabic characters
  const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

  // Utility function to remove harakat (diacritics)
  const removeHarakat = (text: string) => text.replace(/[\u064B-\u0652]/g, "");

  const updateSearchTerm = (index: number, value: string) => {
    const updated = [...searchTerms];
    updated[index] = value;
    setSearchTerms(updated);
  };

  const addSearchTerm = () => {
    setSearchTerms([...searchTerms, ""]);
  };

  const removeSearchTerm = (index: number) => {
    if (searchTerms.length <= 1) return;
    setSearchTerms(searchTerms.filter((_, i) => i !== index));
  };

  const handleSearch = () => {
    const activeTerms = searchTerms.filter((t) => t.trim() !== "");
    if (activeTerms.length === 0) {
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }

    setIsLoading(true);
    setSearchPerformed(true);
    setSearchResults([]);

    const results: SearchResult[] = [];
    const volumesToSearch = volume === 0 ? [1, 2, 3, 4, 5, 6, 7, 8] : [volume];

    const fetchVolume = (vol: number) => {
      if (volumeCache.current.has(vol)) {
        return Promise.resolve(volumeCache.current.get(vol)!);
      }
      return fetch(`/jsons/kafi/kafi_v${vol}.json`)
        .then((response) => response.json())
        .then(
          (
            data: {
              englishText: string;
              arabicText?: string;
              majlisiGrading?: string;
              URL: string;
            }[],
          ) => {
            volumeCache.current.set(vol, data);
            return data;
          },
        );
    };

    const fetchPromises = volumesToSearch.map((vol) =>
      fetchVolume(vol)
        .then((volumeData) => {
          volumeData.forEach((item, idx) => {
            const majlisiGrading = item.majlisiGrading;
            const url = item.URL;

            // Grading checks
            const isSahih =
              sahihOnly &&
              majlisiGrading &&
              validGradingsSet.has(majlisiGrading);
            const isGood =
              goodOnly && majlisiGrading && goodGradingsSet.has(majlisiGrading);
            const isWeak =
              weakOnly && majlisiGrading && weakGradingsSet.has(majlisiGrading);
            const isUnknown =
              unknownOnly &&
              (majlisiGrading === "مرسل" || majlisiGrading === "مجهول");

            const isGradingValid =
              (sahihOnly && isSahih) ||
              (goodOnly && isGood) ||
              (weakOnly && isWeak) ||
              (unknownOnly && isUnknown) ||
              (!sahihOnly && !goodOnly && !weakOnly && !unknownOnly);

            if ((majlisiGrading || unknownOnly) && isGradingValid) {
              const termMatches = activeTerms.map((term) => {
                const searchInArabic = isArabic(term);
                const contentToSearch = searchInArabic
                  ? item.arabicText || ""
                  : item.englishText;
                const normalizedContent = searchInArabic
                  ? removeHarakat(contentToSearch.trim())
                  : contentToSearch.trim().toLowerCase();
                const normalizedTerm = searchInArabic
                  ? removeHarakat(term.trim())
                  : term.trim().toLowerCase();

                return flexibleSearch
                  ? normalizedTerm
                      .split(/\s+/)
                      .every((word) => normalizedContent.includes(word))
                  : normalizedContent.includes(normalizedTerm);
              });

              const isContentMatch =
                searchMode === "AND"
                  ? termMatches.every(Boolean)
                  : termMatches.some(Boolean);

              if (isContentMatch) {
                results.push({
                  volume: vol,
                  index: idx,
                  content: item.englishText,
                  arabicContent: item.arabicText || "",
                  url,
                  majlisiGrading: item.majlisiGrading,
                });
              }
            }
          });
        })
        .catch((error) => console.error("Error fetching data:", error)),
    );

    Promise.all(fetchPromises).then(() => {
      setSearchResults(results);
      setCurrentPage(1);
      setExpandedArabic(new Set());
      setIsLoading(false);
    });
  };

  const handleSearchBlur = () => {
    if (searchTerms.every((t) => t.trim() === "")) {
      setSearchResults([]);
      setSearchPerformed(false);
    }
  };

  const highlightSearchTerms = (text: string, terms: string[]) => {
    const nonArabicTerms = terms.filter((t) => t.trim() && !isArabic(t));
    if (nonArabicTerms.length === 0) return text;

    const allWords: string[] = [];
    for (const term of nonArabicTerms) {
      if (flexibleSearch) {
        allWords.push(...term.trim().split(/\s+/));
      } else {
        allWords.push(term.trim());
      }
    }
    if (allWords.length === 0) return text;

    const escaped = allWords.map((w) =>
      w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    );
    const regex = new RegExp(`(${escaped.join("|")})`, "gi");
    const lowerWords = allWords.map((w) => w.toLowerCase());

    return text.split(regex).map((part, index) =>
      lowerWords.some((w) => part.toLowerCase() === w) ? (
        <span key={index} className="bg-yellow-100 text-yellow-900 font-semibold rounded px-0.5">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const toggleArabic = (idx: number) => {
    setExpandedArabic((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  // Pagination
  const totalPages = Math.ceil(searchResults.length / RESULTS_PER_PAGE);
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE,
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-black">
            Kafi Explorer
          </h1>
        </div>
      </div>

      {/* Search Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Volume Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Volume Selection
              </label>
              <div className="relative">
                <select
                  value={volume}
                  onChange={handleVolumeChange}
                  className="appearance-none w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 pr-8 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
                >
                  <option value={0}>All Volumes</option>
                  {[...Array(8).keys()].map((v) => (
                    <option key={v + 1} value={v + 1}>
                      Volume {v + 1}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
              </div>
            </div>

            {/* Search Input */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Search Terms
              </label>
              <div className="space-y-2">
                {searchTerms.map((term, index) => (
                  <div key={index}>
                    {index > 0 && (
                      <div className="flex items-center justify-center my-1">
                        <span className="text-xs font-medium text-gray-400 uppercase">
                          {searchMode}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          ref={index === 0 ? searchInputRef : undefined}
                          type="text"
                          value={term}
                          onChange={(e) =>
                            updateSearchTerm(index, e.target.value)
                          }
                          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                          onBlur={handleSearchBlur}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 pl-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
                          placeholder={
                            index === 0
                              ? "Enter search terms..."
                              : "Additional search terms..."
                          }
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      </div>
                      {searchTerms.length > 1 && (
                        <button
                          onClick={() => removeSearchTerm(index)}
                          className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
                          aria-label="Remove search field"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                      {index === searchTerms.length - 1 && (
                        <button
                          onClick={addSearchTerm}
                          className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
                          aria-label="Add search field"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                {searchTerms.length > 1 && (
                  <div className="flex items-center gap-1 text-sm">
                    <button
                      onClick={() => setSearchMode("AND")}
                      className={`px-2 py-0.5 rounded text-sm font-medium transition-colors ${
                        searchMode === "AND"
                          ? "bg-black text-white"
                          : "text-gray-500 hover:text-black"
                      }`}
                    >
                      AND
                    </button>
                    <button
                      onClick={() => setSearchMode("OR")}
                      className={`px-2 py-0.5 rounded text-sm font-medium transition-colors ${
                        searchMode === "OR"
                          ? "bg-black text-white"
                          : "text-gray-500 hover:text-black"
                      }`}
                    >
                      OR
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="flexibleSearch"
                  type="checkbox"
                  checked={flexibleSearch}
                  onChange={(e) => setFlexibleSearch(e.target.checked)}
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-400 accent-gray-900"
                />
                <label
                  htmlFor="flexibleSearch"
                  className="text-sm text-gray-600"
                >
                  Flexible Word Search
                </label>
              </div>

              {/* Grading Filters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {[
                  {
                    id: "sahihOnly",
                    label: "Sahih",
                    state: sahihOnly,
                    setState: setSahihOnly,
                  },
                  {
                    id: "goodOnly",
                    label: "Good",
                    state: goodOnly,
                    setState: setGoodOnly,
                  },
                  {
                    id: "weakOnly",
                    label: "Weak",
                    state: weakOnly,
                    setState: setWeakOnly,
                  },
                  {
                    id: "unknownOnly",
                    label: "Unknown",
                    state: unknownOnly,
                    setState: setUnknownOnly,
                  },
                ].map((filter) => (
                  <div key={filter.id} className="flex items-center space-x-2">
                    <input
                      id={filter.id}
                      type="checkbox"
                      checked={filter.state}
                      onChange={(e) => filter.setState(e.target.checked)}
                      className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-400 accent-gray-900"
                    />
                    <label
                      htmlFor={filter.id}
                      className="text-sm text-gray-600"
                    >
                      {filter.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSearch}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchPerformed && (
          <div className="space-y-6 mb-12">
            {isLoading ? (
              /* Loading Skeleton */
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-6 h-6 bg-gray-200 rounded" />
                      <div className="h-5 bg-gray-200 rounded w-40" />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-5/6" />
                      <div className="h-4 bg-gray-200 rounded w-4/6" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-3/6" />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-5 bg-gray-200 rounded w-28" />
                      <div className="h-5 bg-gray-200 rounded w-36" />
                    </div>
                  </div>
                ))}
              </div>
            ) : searchResults.length === 0 ? (
              /* Improved Empty State */
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No results found</p>
                <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
                  {!flexibleSearch &&
                    "Try enabling Flexible Word Search for broader matching. "}
                  {(sahihOnly || goodOnly || weakOnly || unknownOnly) &&
                    "Try removing grading filters to widen your search. "}
                  {!(
                    !flexibleSearch ||
                    sahihOnly ||
                    goodOnly ||
                    weakOnly ||
                    unknownOnly
                  ) &&
                    "Try different search terms or search across All Volumes."}
                </p>
              </div>
            ) : (
              <>
                {/* Result Count Summary */}
                <div className="flex flex-wrap items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-5 py-3">
                  <p className="text-sm text-gray-600">
                    Found{" "}
                    <span className="font-semibold text-gray-900">
                      {searchResults.length}
                    </span>{" "}
                    result{searchResults.length !== 1 ? "s" : ""}{" "}
                    {volume === 0
                      ? "across all volumes"
                      : `in Volume ${volume}`}
                    {(sahihOnly || goodOnly || weakOnly || unknownOnly) && (
                      <span className="text-gray-400">
                        {" · Filtered by "}
                        {[
                          sahihOnly && "Sahih",
                          goodOnly && "Good",
                          weakOnly && "Weak",
                          unknownOnly && "Unknown",
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    )}
                  </p>
                  {totalPages > 1 && (
                    <p className="text-sm text-gray-400">
                      Page {currentPage} of {totalPages}
                    </p>
                  )}
                </div>

                {/* Result Cards */}
                {paginatedResults.map((result, idx) => {
                  const globalIdx = (currentPage - 1) * RESULTS_PER_PAGE + idx;
                  return (
                    <div
                      key={globalIdx}
                      className="bg-white border border-gray-200 rounded-lg p-6 transition-colors hover:border-gray-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <Book className="w-6 h-6 text-gray-700" />
                          <h3 className="text-lg font-medium text-gray-900">
                            Volume {result.volume}, Page {result.index + 1}
                          </h3>
                        </div>
                        {result.arabicContent && (
                          <button
                            onClick={() => toggleArabic(globalIdx)}
                            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors px-2 py-1 rounded hover:bg-gray-50"
                            aria-label={
                              expandedArabic.has(globalIdx)
                                ? "Hide Arabic text"
                                : "Show Arabic text"
                            }
                          >
                            <Languages className="w-4 h-4" />
                            {expandedArabic.has(globalIdx)
                              ? "Hide Arabic"
                              : "Show Arabic"}
                          </button>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <pre className="text-gray-800 md:text-lg text-base whitespace-pre-wrap">
                          {searchTerms.every((t) => !t.trim() || isArabic(t))
                            ? result.content
                            : highlightSearchTerms(result.content, searchTerms)}
                        </pre>
                      </div>

                      {expandedArabic.has(globalIdx) &&
                        result.arabicContent && (
                          <div
                            className="bg-gray-50 rounded-lg p-4 mb-4 border-l-4 border-gray-300"
                            dir="rtl"
                          >
                            <pre className="text-gray-800 md:text-lg text-base whitespace-pre-wrap font-serif leading-relaxed">
                              {result.arabicContent}
                            </pre>
                          </div>
                        )}

                      <div className="flex flex-wrap items-center gap-4">
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-semibold inline-flex items-center text-black hover:text-gray-600 underline transition-colors"
                        >
                          View Source →
                        </a>
                        <span className="text-gray-600 text-lg">
                          Grading:{" "}
                          <span className="font-medium">
                            {result.majlisiGrading}
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-2 pb-4">
                    <button
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          if (totalPages <= 7) return true;
                          if (page === 1 || page === totalPages) return true;
                          if (Math.abs(page - currentPage) <= 1) return true;
                          return false;
                        })
                        .reduce<(number | string)[]>((acc, page, i, arr) => {
                          if (i > 0 && page - (arr[i - 1] as number) > 1)
                            acc.push("...");
                          acc.push(page);
                          return acc;
                        }, [])
                        .map((page, i) =>
                          typeof page === "string" ? (
                            <span
                              key={`ellipsis-${i}`}
                              className="px-2 text-gray-400"
                            >
                              ...
                            </span>
                          ) : (
                            <button
                              key={page}
                              onClick={() => {
                                setCurrentPage(page);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === page
                                  ? "bg-black text-white"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {page}
                            </button>
                          ),
                        )}
                    </div>
                    <button
                      onClick={() => {
                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
