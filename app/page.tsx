"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [volume, setVolume] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  interface SearchResult {
    volume: number;
    index: number;
    content: string;
    url: string;
    majlisiGrading: string | undefined;
  }

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchAllVolumes, setSearchAllVolumes] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [sahihOnly, setSahihOnly] = useState(false);
  const [goodOnly, setGoodOnly] = useState(false);
  const [weakOnly, setWeakOnly] = useState(false);
  const [unknownOnly, setUnknownOnly] = useState(false);

  useEffect(() => {
    fetch(`/jsons/kafi/kafi_v${volume}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [volume]);

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

  // Utility function to remove harakat (diacritics)
  const removeHarakat = (text: string) => text.replace(/[\u064B-\u0652]/g, "");

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }

    setSearchPerformed(true);
    const searchResults: SearchResult[] = [];
    const volumesToSearch = searchAllVolumes ? [1, 2, 3, 4, 5, 6, 7, 8] : [volume];
    const searchInArabic = isArabic(searchTerm);
    const normalizedSearchTerm = searchInArabic ? removeHarakat(searchTerm.trim()) : searchTerm.trim().toLowerCase();

    volumesToSearch.forEach((vol) => {
      fetch(`/jsons/kafi/kafi_v${vol}.json`)
        .then((response) => response.json())
        .then((volumeData: { englishText: string; arabicText?: string; majlisiGrading?: string; URL: string; }[]) => {
          volumeData.forEach((item, idx) => {
            const contentToSearch = searchInArabic ? item.arabicText || "" : item.englishText;
            const normalizedContent = searchInArabic ? removeHarakat(contentToSearch.trim()) : contentToSearch.trim().toLowerCase();
            const majlisiGrading = item.majlisiGrading;
            const url = item.URL;

            // Grading checks
            const isSahih = sahihOnly && majlisiGrading && validGradingsSet.has(majlisiGrading);
            const isGood = goodOnly && majlisiGrading && goodGradingsSet.has(majlisiGrading);
            const isWeak = weakOnly && majlisiGrading && weakGradingsSet.has(majlisiGrading);
            const isUnknown =
              unknownOnly &&
              (majlisiGrading === "مرسل" || majlisiGrading === "مجهول");

            const isGradingValid =
              (sahihOnly && isSahih) ||
              (goodOnly && isGood) ||
              (weakOnly && isWeak) ||
              (unknownOnly && isUnknown) ||
              (!sahihOnly && !goodOnly && !weakOnly && !unknownOnly);

            if (
              (majlisiGrading || unknownOnly) &&
              isGradingValid
            ) {
              const isContentMatch = normalizedContent.includes(normalizedSearchTerm);

              if (isContentMatch) {
                searchResults.push({
                  volume: vol,
                  index: idx,
                  content: item.englishText, // Always display English text
                  url,
                  majlisiGrading: item.majlisiGrading,
                });
              }
            }
          });

          console.log("Search Results:", searchResults);
          setSearchResults(searchResults);
        })
        .catch((error) => console.error("Error fetching data:", error));
    });
  };

  const handleSearchBlur = () => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setSearchPerformed(false);
    }
  };

  const highlightSearchTerm = (text: string, term: string) => {
    if (!term || isArabic(term)) return text;
    const regex = new RegExp(`(${term})`, "gi");
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
    <div className="min-h-screen p-8 pb-20 sm:p-20 bg-gray-100 text-gray-900">
      <h1 className="text-4xl font-bold text-center -mt-10 mb-4">
        Kafi Explorer
      </h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 max-w-md mx-auto">
        <div className="w-full sm:w-auto mb-4 sm:mb-0">
          <label htmlFor="volume" className="block mb-2 text-sm font-medium text-gray-700">
            Select Volume:
          </label>
          <select
            id="volume"
            value={volume}
            onChange={handleVolumeChange}
            className="p-2 border rounded bg-white text-gray-900 w-full"
          >
            {[...Array(8).keys()].map((v) => (
              <option key={v + 1} value={v + 1}>
                Volume {v + 1}
              </option>
            ))}
          </select>

          <div className="flex items-center mt-4">
            <input
              id="searchAllVolumes"
              type="checkbox"
              checked={searchAllVolumes}
              onChange={(e) => setSearchAllVolumes(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="searchAllVolumes" className="text-sm text-gray-700">
              Search All Volumes
            </label>
          </div>
        </div>

        <div className="w-full sm:w-auto ml-auto">
          <label htmlFor="search" className="block mb-2 text-sm font-medium text-gray-700">
            Search:
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
            onBlur={handleSearchBlur}
            className="p-2 border rounded bg-white text-gray-900 w-full"
          />
          <div className="grid grid-cols-2 gap-x-8 gap-2 mt-4">
            <div className="flex items-center">
              <input
                id="sahihOnly"
                type="checkbox"
                checked={sahihOnly}
                onChange={(e) => setSahihOnly(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="sahihOnly" className="text-sm text-gray-700">
                Sahih
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="goodOnly"
                type="checkbox"
                checked={goodOnly}
                onChange={(e) => setGoodOnly(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="goodOnly" className="text-sm text-gray-700">
                Good
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="weakOnly"
                type="checkbox"
                checked={weakOnly}
                onChange={(e) => setWeakOnly(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="weakOnly" className="text-sm text-gray-700">
                Weak
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="unknownOnly"
                type="checkbox"
                checked={unknownOnly}
                onChange={(e) => setUnknownOnly(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="unknownOnly" className="text-sm text-gray-700">
                Unknown
              </label>
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="mt-4 p-2 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-600 transition"
          >
            Search
          </button>
        </div>
      </div>

      {searchPerformed && (
        <div className="mb-12">
          <div className="border p-4 rounded mb-4 bg-white shadow max-w-7xl mx-auto">
            {searchResults.length === 0 ? (
              <p className="text-gray-700">No search results</p>
            ) : (
              searchResults.map((result, idx) => (
                <div key={idx} className="mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Volume {result.volume}, Page {result.index + 1}
                  </h3>
                  <pre className="bg-gray-200 p-2 rounded text-gray-800 text-lg whitespace-pre-wrap">
                    {isArabic(searchTerm)
                      ? result.content
                      : highlightSearchTerm(result.content, searchTerm)}
                  </pre>
                  <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    Link
                  </a>
                  <p className="text-lg">
                    Grading: {result.majlisiGrading}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}