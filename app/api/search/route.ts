import { NextRequest, NextResponse } from 'next/server';
import Fuse from 'fuse.js';
import fs from 'fs/promises';
import path from 'path';

interface Hadith {
  englishText: string;
  arabicText?: string;
  majlisiGrading?: string;
  URL: string;
  volume: number;
  index: number;
}

const validGradings = [
  "صحيح", "صحيح أو حسن", "صحيح الفضلاء", "صحيح بسنديه", "صحيح ظاهرا", "صحيح على الظاهر",
  "صحيح على المشهور", "صحيح معتمد أو موقوف", "صحيح مقطوع", "صحيح مكرر", "حسن",
];
const goodGradings = [
  "حسن أو موثق", "حسن أو موثق على الظاهر", "حسن أو موثوق",
];
const weakGradings = [
  "ضعيف", "ضعيف أو مجهول", "ضعيف أو مرسل",
];
const validSet = new Set(validGradings);
const goodSet = new Set(goodGradings);
const weakSet = new Set(weakGradings);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  if (!q) return NextResponse.json({ results: [] });

  const all = searchParams.get('all') === 'true';
  const volume = Number(searchParams.get('volume') || '1');
  const grades = searchParams.getAll('grade');

  const vols = all ? [1,2,3,4,5,6,7,8] : [volume];
  const items: Hadith[] = [];
  for (const v of vols) {
    const file = path.join(process.cwd(),'public','jsons','kafi',`kafi_v${v}.json`);
    const text = await fs.readFile(file,'utf-8');
    const data: Omit<Hadith, 'volume' | 'index'>[] = JSON.parse(text);
    data.forEach((d, idx) => items.push({ ...d, volume: v, index: idx }));
  }

  const fuse = new Fuse(items,{ keys:['englishText','arabicText'], threshold:0.4 });
  let results = fuse.search(q).map(r=>r.item as Hadith);

  if (grades.length) {
    results = results.filter(r => {
      const g = r.majlisiGrading;
      return grades.some(gr => {
        if (gr === 'sahih') return g && validSet.has(g);
        if (gr === 'good') return g && goodSet.has(g);
        if (gr === 'weak') return g && weakSet.has(g);
        if (gr === 'unknown') return !g || g === 'مرسل' || g === 'مجهول';
        return false;
      });
    });
  }

  return NextResponse.json({ results });
}
