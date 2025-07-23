import { NextRequest, NextResponse } from 'next/server';
import Fuse from 'fuse.js';
import path from 'path';
import { promises as fs } from 'fs';

const DATA_DIR = path.join(process.cwd(), 'public', 'jsons', 'kafi');

interface Item {
  id: number;
  englishText: string;
  arabicText?: string;
  URL: string;
  majlisiGrading?: string;
}

interface Result {
  volume: number;
  index: number;
  englishText: string;
  url: string;
  majlisiGrading?: string;
  score?: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get('q') || '';
  const volume = searchParams.get('volume') || '1';
  const searchAll = searchParams.get('all') === 'true';
  const flexible = searchParams.get('flexible') === 'true';
  const sahih = searchParams.get('sahih') === 'true';
  const good = searchParams.get('good') === 'true';
  const weak = searchParams.get('weak') === 'true';
  const unknown = searchParams.get('unknown') === 'true';

  const volumes = searchAll ? [1,2,3,4,5,6,7,8] : [Number(volume)];
  const results: Result[] = [];

  const gradingSets = {
    sahih: new Set(['صحيح','صحيح أو حسن','صحيح الفضلاء','صحيح بسنديه','صحيح ظاهرا','صحيح على الظاهر','صحيح على المشهور','صحيح معتمد أو موقوف','صحيح مقطوع','صحيح مكرر']),
    good: new Set(['حسن','حسن أو صحيح','حسن كالصحيح']),
    weak: new Set(['ضعيف','ضعيف أو مجهول','مرسل']),
  };

  for (const v of volumes) {
    const file = path.join(DATA_DIR, `kafi_v${v}.json`);
    const data: Item[] = JSON.parse(await fs.readFile(file, 'utf8'));
    const fuse = new Fuse(data, {
      keys: ['englishText','arabicText'],
      includeScore: true,
      threshold: flexible ? 0.4 : 0.0,
    });
    const fuseResults = term
      ? fuse.search(term)
      : data.map((d, i) => ({ item: d, refIndex: i, score: 0 }));
    fuseResults.forEach((res) => {
      const g = res.item.majlisiGrading;
      const isSahih = sahih && g && gradingSets.sahih.has(g);
      const isGood = good && g && gradingSets.good.has(g);
      const isWeak = weak && g && gradingSets.weak.has(g);
      const isUnknown = unknown && (!g || g === 'مجهول' || g === 'مرسل');
      const validGrading =
        (sahih && isSahih) ||
        (good && isGood) ||
        (weak && isWeak) ||
        (unknown && isUnknown) ||
        (!sahih && !good && !weak && !unknown);
      if (validGrading) {
        results.push({
          volume: v,
          index: res.refIndex,
          englishText: res.item.englishText,
          url: res.item.URL,
          majlisiGrading: res.item.majlisiGrading,
          score: res.score,
        });
      }
    });
  }

  results.sort((a,b)=> (a.score??0) - (b.score??0));
  return NextResponse.json(results.slice(0,100));
}
