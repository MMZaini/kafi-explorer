"use client";

import { useState, useEffect } from "react";
import Head from "next/head";

export default function Home() {
  const [volume, setVolume] = useState(1);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [exactMatch, setExactMatch] = useState(false);
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
      .then((data) => setData(data))
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
    "موثق في قوة الصحيح"
  ];
  const goodGradings = [
    "حسن أو موثق", "حسن أو موثق على الظاهر", "حسن أو موثوق", "حسن أو موثوق كالصحيح",
    "حسن كالسابق", "حسن كالصحيح وآخره مرسل", "حسن على الظاهر", "حسن على الظاهر وقد يعد مجهول",
    "حسن والثاني ضعيف", "حسن والثاني مجهول", "حسن وربما قيل صحيح", "حسن وقد يعد مجهول وآخره مرسل",
    "حسن وموافق للمشهور", "حسن ويحتمل وجوها من التأويل", "حسن ويمكن أن يعد صحيحا", "حسن الفضلاء",
    "صحيح ظاهرا ولكن في السند غرابة", "صحيح وآخره مرسل", "صحيح وأخره مرسل", "صحيح والثاني موثق",
    "صحيح وسنده الثاني حسن", "موثق حسن", "موثق على الظاهر", "موثق وآخره مرسل", "موثق وآخره مرسل كالموثق"
  ];

  const weakGradings = [
    "ضعيف", "ضعيف أو مجهول", "ضعيف أو مرسل", "ضعيف على المشهور", "ضعيف على المشهور أو حسن",
    "ضعيف على المشهور لكنه قوي", "ضعيف على المشهور لكنه معتبر", "ضعيف على المشهور معتبر عندي",
    "ضعيف على المشهور معتمد عندي", "ضعيف على المشهور موقوف", "ضعيف كالصحيح", "ضعيف كالموثق",
    "ضعيف مرسل", "ضعيف موقوف", "ضعيف وآخره مرسل", "ضعيف وآخره مرفوع", "مجهول", "مجهول أو حسن",
    "مجهول أو صحيح", "مجهول أو ضعيف", "مجهول أو مرسل", "مجهول كالحسن", "مجهول كالصحيح", "مجهول كالموثق",
    "مجهول مختلف فيه", "مجهول مرسل", "مجهول موقوف", "مجهول وآخره مرسل", "مجهول وقد يعد ضعيفا",
    "مجهول ويمكن أن يعد حسنا", "مرسل", "مرسل أو حسن", "مرسل أو مجهول", "مرسل كالحسن", "مرسل كالصحيح",
    "مرسل كالموثق", "مرسل كالموثق أو كالحسن", "مرسل وآخره ضعيف على المشهور"
  ];
  // Create Sets for grading categories
  const validGradingsSet = new Set(validGradings);
  const goodGradingsSet = new Set(goodGradings);
  const weakGradingsSet = new Set(weakGradings);

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }

    setSearchPerformed(true);
    const searchResults = [];
    const volumesToSearch = searchAllVolumes ? [1, 2, 3, 4, 5, 6, 7, 8] : [volume];

    volumesToSearch.forEach((vol) => {
      fetch(`/jsons/kafi/kafi_v${vol}.json`)
        .then((response) => response.json())
        .then((volumeData) => {
          volumeData.forEach((item, idx) => {
            const content = item.englishText; // Using englishText for the search term
            const majlisiGrading = item.majlisiGrading; // Grading may be undefined
            const url = item.URL;

            // Updated grading checks using Sets
            const isSahih = sahihOnly && validGradingsSet.has(majlisiGrading);
            const isGood = goodOnly && goodGradingsSet.has(majlisiGrading);
            const isWeak = weakOnly && weakGradingsSet.has(majlisiGrading);
            const isUnknown =
              unknownOnly &&
              (majlisiGrading === "مرسل" || majlisiGrading === "مجهول");

            // Allow for multiple filters to be active at once
            const isGradingValid =
              (sahihOnly && isSahih) ||
              (goodOnly && isGood) ||
              (weakOnly && isWeak) ||
              (unknownOnly && isUnknown) ||
              (!sahihOnly && !goodOnly && !weakOnly && !unknownOnly); // No filter applied

            // Check if the item has a valid grading if filtering by grading
            if (
              (majlisiGrading || unknownOnly) && // Either there's a grading or we are searching with the "Unknown Only" filter
              isGradingValid
            ) {
              // Check if content matches the search term (exact match or partial match)
              const isContentMatch = exactMatch
                ? content === searchTerm
                : content.includes(searchTerm);

              if (isContentMatch) {
                searchResults.push({
                  volume: vol,
                  index: idx,
                  content,
                  url,
                  majlisiGrading: item.majlisiGrading, // Ensure grading is included
                });
              }
            }
          });

          console.log("Search Results:", searchResults); // Log the results
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
    if (!term) return text;
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
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" />
      </Head>
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
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="flex items-center">
              <input
                id="exactMatch"
                type="checkbox"
                checked={exactMatch}
                onChange={(e) => setExactMatch(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="exactMatch" className="text-sm text-gray-700">
                Exact Match
              </label>
            </div>
            <div className="flex items-center">
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
                    {highlightSearchTerm(result.content, searchTerm)}
                  </pre>
                  <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    Link
                  </a>
                  <p className="text-lg">
                    Grading: {result.majlisiGrading} {/* Displaying the grading */}
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