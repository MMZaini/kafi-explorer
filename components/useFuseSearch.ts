import Fuse from 'fuse.js';
import { HadithResult } from './SearchContext';

interface HadithRaw {
  id: number;
  englishText: string;
  arabicText?: string;
  URL: string;
  majlisiGrading?: string;
  volume?: number;
}

export async function searchHadiths(volumes: number[], term: string): Promise<HadithResult[]> {
  const data: HadithRaw[] = [];
  for (const v of volumes) {
    const res = await fetch(`/jsons/kafi/kafi_v${v}.json`);
    const json: HadithRaw[] = await res.json();
    json.forEach((h, idx) => {
      data.push({ ...h, id: idx, volume: v });
    });
  }
  const fuse = new Fuse(data, {
    keys: ['englishText', 'arabicText'],
    threshold: 0.4,
    includeScore: true,
  });
  const results = fuse.search(term).map(({ item }) => ({
    volume: item.volume!,
    index: item.id,
    englishText: item.englishText,
    arabicText: item.arabicText,
    url: item.URL,
    majlisiGrading: item.majlisiGrading,
  }));
  return results;
}
