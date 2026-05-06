import fs from 'fs'
import path from 'path'

const dir = path.resolve('public/wiki-cards/vassal')
const outFile = path.resolve('src/data/wikiCards.ts')

const files = fs.readdirSync(dir).filter((f) => /\.(jpg|png)$/i.test(f)).sort((a, b) => a.localeCompare(b))

const slugToTitle = (name) =>
  name
    .replace(/\.(jpg|png)$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())

const toCard = (f) => ({
  name: slugToTitle(f),
  image: `/wiki-cards/vassal/${f}`
})

const major = files.filter((f) => /^major/i.test(f)).map(toCard)
const minor = files.filter((f) => /^minor/i.test(f)).map(toCard)
const fear = files.filter((f) => /^fear/i.test(f)).map(toCard)
const event = files.filter((f) => /^event/i.test(f)).map(toCard)
const invader = files.filter((f) => /^i[123]/i.test(f)).map(toCard)

const lines = []
lines.push('export interface WikiCardItem {')
lines.push('    name: string')
lines.push('    image: string')
lines.push('}')
lines.push('')
lines.push("export type WikiSection = 'major' | 'minor' | 'fear' | 'event' | 'invader'")
lines.push('')
lines.push('export const WIKI_CARD_DATA: Record<WikiSection, WikiCardItem[]> = {')
for (const [key, arr] of [
  ['major', major],
  ['minor', minor],
  ['fear', fear],
  ['event', event],
  ['invader', invader]
]) {
  lines.push(`    ${key}: [`)
  for (const item of arr) {
    lines.push(`        { name: ${JSON.stringify(item.name)}, image: ${JSON.stringify(item.image)} },`)
  }
  lines.push('    ],')
}
lines.push('}')
lines.push('')

fs.writeFileSync(outFile, lines.join('\n'))

console.log(JSON.stringify({ major: major.length, minor: minor.length, fear: fear.length, event: event.length, invader: invader.length }, null, 2))
