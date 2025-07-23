import { NextRequest, NextResponse } from 'next/server';
import { searchHadiths } from '../../../components/useFuseSearch';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const vol = searchParams.get('volume');
  const all = searchParams.get('all') === 'true';
  const vols = all ? [1,2,3,4,5,6,7,8] : [Number(vol || 1)];
  const res = await searchHadiths(vols, q);
  return NextResponse.json(res.slice(0,50));
}
