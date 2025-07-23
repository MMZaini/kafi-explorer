"use client";

import { useState, useEffect } from "react";
import { Search, Book, ChevronDown } from "lucide-react";

export default function Home() {
  const [volume, setVolume] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  interface SearchResult {
    volume: number;
    index: number;
    content: string;
    url: string;
    majlisiGrading: string | undefined;
  }

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [resultsCount, setResultsCount] = useState(0);
  const [searchAllVolumes, setSearchAllVolumes] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [sahihOnly, setSahihOnly] = useState(false);
  const [goodOnly, setGoodOnly] = useState(false);
  const [weakOnly, setWeakOnly] = useState(false);
  const [unknownOnly, setUnknownOnly] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = (stored as 'light' | 'dark') || (systemDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
  };



  const handleVolumeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setVolume(Number(event.target.value));
  };


  // Utility function to detect Arabic characters
  const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);


  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setResultsCount(0);
      setSearchPerformed(false);
      return;
    }

    setIsLoading(true);
    setSearchPerformed(true);
    setSearchResults([]);

    const queryParams = new URLSearchParams();
    queryParams.set("q", searchTerm.trim());
    if (!searchAllVolumes) queryParams.set("volume", String(volume));
    if (sahihOnly) queryParams.set("grade", "صحيح");

    fetch(`/api/search?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.results.filter((r: SearchResult) => {
          const cat = gradingCategory(r.majlisiGrading);
          return (
            (!sahihOnly || cat === 'sahih') &&
            (!goodOnly || cat === 'good') &&
            (!weakOnly || cat === 'weak') &&
            (!unknownOnly || cat === 'unknown')
          );
        });
        setSearchResults(filtered);
        setResultsCount(filtered.length);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const handleSearchBlur = () => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setResultsCount(0);
      setSearchPerformed(false);
    }
  };

  const handleShare = (result: SearchResult) => {
    const url = `${window.location.origin}?q=${encodeURIComponent(searchTerm)}&volume=${result.volume}#hadith-${result.volume}-${result.index}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard");
  };

  const gradingCategory = (g?: string) => {
    if (!g) return "unknown";
    if (g.includes("صحيح")) return "sahih";
    if (g.includes("حسن") || g.includes("موثق")) return "good";
    return "weak";
  };

  const highlightSearchTerm = (text: string, term: string) => {
    if (!term || isArabic(term)) return text;


    const regex = new RegExp(`(${term})`, 'gi');
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <div className="bg-background shadow-lg">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900">Kafi Explorer</h1>
          <button
            onClick={toggleTheme}
            className="text-sm text-blue-600 underline"
          >
            {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
      </div>

      {/* Search Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="bg-background rounded-xl shadow-md p-6 mb-8">
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
                  disabled={searchAllVolumes}
                  className="appearance-none w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 pr-8 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                >
                  {[...Array(8).keys()].map((v) => (
                    <option key={v + 1} value={v + 1}>
                      Volume {v + 1}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    id="searchAllVolumes"
                    type="checkbox"
                    checked={searchAllVolumes}
                    onChange={(e) => setSearchAllVolumes(e.target.checked)}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="searchAllVolumes" className="text-sm text-gray-600">
                    Search Across All Volumes
                  </label>
                </div>

              </div>
            </div>

            {/* Search Input */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Search Terms
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onBlur={handleSearchBlur}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 pl-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter search terms..."
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              {/* Grading Filters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {[
                  { id: "sahihOnly", label: "Sahih", state: sahihOnly, setState: setSahihOnly },
                  { id: "goodOnly", label: "Good", state: goodOnly, setState: setGoodOnly },
                  { id: "weakOnly", label: "Weak", state: weakOnly, setState: setWeakOnly },
                  { id: "unknownOnly", label: "Unknown", state: unknownOnly, setState: setUnknownOnly },
                ].map((filter) => (
                  <div key={filter.id} className="flex items-center space-x-2">
                    <input
                      id={filter.id}
                      type="checkbox"
                      checked={filter.state}
                      onChange={(e) => filter.setState(e.target.checked)}
                      className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={filter.id} className="text-sm text-gray-600">
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
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
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
              <div className="bg-background rounded-xl shadow-md p-8 text-center">
                <div className="animate-pulse text-gray-600">Loading results...</div>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="bg-background rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-600">No results found for your search criteria</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-4">{resultsCount} results found</p>
                {searchResults.map((result, idx) => (
                <div id={`hadith-${result.volume}-${result.index}`} key={idx} className="bg-background rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <Book className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Volume {result.volume}, Page {result.index + 1}
                    </h3>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <pre className="text-gray-800 md:text-lg text-base whitespace-pre-wrap ">
                      {isArabic(searchTerm)
                        ? result.content
                        : highlightSearchTerm(result.content, searchTerm)}
                    </pre>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      View Source →
                    </a>
                    <span className="text-gray-600 text-lg">
                      Grading: <span className="font-medium">{result.majlisiGrading}</span>
                    </span>
                    <button
                      onClick={() => handleShare(result)}
                      className="text-sm text-blue-600 underline"
                    >
                      Share
                    </button>
                  </div>
                </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
      {showScroll && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg"
        >
          ↑ Top
        </button>
      )}
    </div>
  );
}