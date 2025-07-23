import { NextRequest, NextResponse } from 'next/server'
import lunr from 'lunr'
import fs from 'fs/promises'

interface HadithDoc {
  id: string
  volume: number
  index: number
  content: string
  url: string
  grading?: string
}

let index: lunr.Index | null = null
const documents: HadithDoc[] = []

async function buildIndex() {
  if (index) return
  const vols = [1,2,3,4,5,6,7,8]
  for (const vol of vols) {
    const data: Array<{ englishText: string; URL: string; majlisiGrading?: string }> = JSON.parse(
      await fs.readFile(`./public/jsons/kafi/kafi_v${vol}.json`, 'utf-8')
    )
    data.forEach((item, idx) => {
      documents.push({
        id: `${vol}-${idx}`,
        volume: vol,
        index: idx,
        content: item.englishText,
        url: item.URL,
        grading: item.majlisiGrading
      })
    })
  }
  index = lunr(function () {
    this.ref('id')
    this.field('content')
    documents.forEach((doc) => this.add(doc))
  })
}

export async function GET(req: NextRequest) {
  await buildIndex()
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')
  const volume = searchParams.get('volume')
  const grade = searchParams.get('grade')
  if (!q) return NextResponse.json({ results: [] })
  const results = index!.search(q)
  const mapped = results
    .map((r) => documents.find((d) => d.id === r.ref)!)
    .filter((d) =>
      (!volume || d.volume === Number(volume)) &&
      (!grade || (d.grading && d.grading.includes(grade)))
    )
    .slice(0, 50)
  return NextResponse.json({ results: mapped })
}
