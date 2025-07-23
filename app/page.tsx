"use client";

import { useState, useEffect } from "react";
import { Search, Book, ChevronDown, Sun, Moon, ArrowUp } from "lucide-react";

export default function Home() {
  const [volume, setVolume] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState("light");

  interface SearchResult {
    volume: number;
    index: number;
    englishText: string;
    URL: string;
    majlisiGrading?: string;
  }

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchAllVolumes, setSearchAllVolumes] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [sahihOnly, setSahihOnly] = useState(false);
  const [goodOnly, setGoodOnly] = useState(false);
  const [weakOnly, setWeakOnly] = useState(false);
  const [unknownOnly, setUnknownOnly] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {
    const handler = () => setShowScroll(window.scrollY > 200);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);


  const handleVolumeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setVolume(Number(event.target.value));
  };

  const validGradings = [
    "صحيح", "صحيح أو حسن", "صحيح الفضلاء", "صحيح بسنديه", "صحيح ظاهرا", "صحيح على الظاهر",
    "صحيح على المشهور", "صحيح معتمد أو موقوف", "صحيح مقطوع", "صحيح مكرر", "حسن", "حسن أو صحيح",
    "حسن أو صحيح على الظاهر", "حسن كالصحيح", "حسن كالصحيح بسنديه", "حسن كالصحيح بل صحيح عندي",
    "حسن كالصحيح على الظاهر", "حسن كالصحيح موثق", "حسن كالصحيح وقد يعد صحيحا", "حسن كالموثق",
    "حسن لا يقصر عن الصحيح", "حسن موثق", "حسن موثق صحيح", "حسن موثق كالصحيح", "حسن مقطوع",
    "موثق", "موثق أو حسن", "موثق صحيح", "موثق كالصحيح", "موثق كالصحيح بسنديه", "موثق على الظاهر",
    "موثق في قوة الصحيح", "ضعيف كالصحيح", "مجهول أو صحيح", "مجهول كالصحيح", "مرسل كالصحيح",
    "حسن أو موثوق كالصحيح", "صحيح وسنده الثاني حسن"
  ];
  const goodGradings = [
    "حسن أو موثق", "حسن أو موثق على الظاهر", "حسن أو موثوق",
    "حسن كالسابق", "حسن كالصحيح وآخره مرسل", "حسن على الظاهر", "حسن على الظاهر وقد يعد مجهول",
    "حسن والثاني ضعيف", "حسن والثاني مجهول", "حسن وربما قيل صحيح", "حسن وقد يعد مجهول وآخره مرسل",
    "حسن وموافق للمشهور", "حسن ويحتمل وجوها من التأويل", "حسن ويمكن أن يعد صحيحا", "حسن الفضلاء",
    "صحيح ظاهرا ولكن في السند غرابة", "صحيح وآخره مرسل", "صحيح وأخره مرسل", "صحيح والثاني موثق",
    "موثق حسن", "موثق على الظاهر", "موثق وآخره مرسل", "موثق وآخره مرسل كالموثق"
  ];

  const weakGradings = [
    "ضعيف", "ضعيف أو مجهول", "ضعيف أو مرسل", "ضعيف على المشهور", "ضعيف على المشهور أو حسن",
    "ضعيف على المشهور لكنه قوي", "ضعيف على المشهور لكنه معتبر", "ضعيف على المشهور معتبر عندي",
    "ضعيف على المشهور معتمد عندي", "ضعيف على المشهور موقوف", "ضعيف كالموثق",
    "ضعيف مرسل", "ضعيف موقوف", "ضعيف وآخره مرسل", "ضعيف وآخره مرفوع", "مجهول أو حسن",
    "مجهول أو ضعيف", "مجهول أو مرسل", "مجهول كالحسن", "مجهول كالموثق",
    "مجهول مختلف فيه", "مجهول مرسل", "مجهول موقوف", "مجهول وآخره مرسل", "مجهول وقد يعد ضعيفا",
    "مجهول ويمكن أن يعد حسنا", "مرسل", "مرسل أو حسن", "مرسل أو مجهول", "مرسل كالحسن",
    "مرسل كالموثق", "مرسل كالموثق أو كالحسن", "مرسل وآخره ضعيف على المشهور"
  ];
  // Create Sets for grading categories
  const validGradingsSet = new Set(validGradings);
  const goodGradingsSet = new Set(goodGradings);
  const weakGradingsSet = new Set(weakGradings);

  // Utility function to detect Arabic characters
  const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);


  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }

    setIsLoading(true);
    setSearchPerformed(true);
    setSearchResults([]);

    const params = new URLSearchParams();
    params.append("q", searchTerm);
    if (searchAllVolumes) {
      params.append("all", "true");
    } else {
      params.append("volume", volume.toString());
    }
    if (sahihOnly) params.append("grade", "sahih");
    if (goodOnly) params.append("grade", "good");
    if (weakOnly) params.append("grade", "weak");
    if (unknownOnly) params.append("grade", "unknown");

    try {
      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      setSearchResults(
        data.results.map((r: SearchResult) => ({
          volume: r.volume,
          index: r.index,
          englishText: r.englishText,
          URL: r.URL,
          majlisiGrading: r.majlisiGrading,
        }))
      );
    } catch (err) {
      console.error("Search error", err);
    }
    setIsLoading(false);
  };

  const handleSearchBlur = () => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setSearchPerformed(false);
    }
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

  const getGradeClass = (grade?: string) => {
    if (!grade) return "bg-gray-200 text-gray-800";
    if (validGradingsSet.has(grade)) return "bg-green-200 text-green-800";
    if (goodGradingsSet.has(grade)) return "bg-amber-200 text-amber-800";
    if (weakGradingsSet.has(grade)) return "bg-red-200 text-red-800";
    return "bg-gray-200 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Kafi Explorer
          </h1>
          <button onClick={toggleTheme} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {theme === "light" ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Search Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
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
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
                <div className="animate-pulse text-gray-600">Loading results...</div>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-600">No results found for your search criteria</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  Showing {searchResults.length} results
                </p>
                {searchResults.map((result, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <Book className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Volume {result.volume}, Page {result.index + 1}
                    </h3>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <pre className="text-gray-800 md:text-lg text-base whitespace-pre-wrap ">
                      {isArabic(searchTerm)
                        ? result.englishText
                        : highlightSearchTerm(result.englishText, searchTerm)}
                    </pre>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <a
                      href={result.URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      View Source →
                    </a>
                    <span className={`text-sm px-2 py-1 rounded ${getGradeClass(result.majlisiGrading)}`}>
                      {result.majlisiGrading || "Unknown"}
                    </span>
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
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}