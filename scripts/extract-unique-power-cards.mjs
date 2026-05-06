import fs from 'fs'
import { execSync } from 'child_process'

const WORKSHOP_FILE = 'tmp-spirit-island-tts-workshop.json'
const STRINGS_FILE = '/tmp/tts-strings.txt'
const APP_FILE = 'src/App.tsx'
const OUT_JSON = '/tmp/unique-cards-map.json'
const OUT_TS = 'src/data/uniquePowerCards.ts'
const OUT_DIR = 'public/unique-powers/tts'

execSync(`strings '${WORKSHOP_FILE}' > '${STRINGS_FILE}'`)

const lines = fs.readFileSync(STRINGS_FILE, 'utf8').split(/\r?\n/)
const src = fs.readFileSync(APP_FILE, 'utf8')
const spiritBlock = src.match(/const SPIRITS: Spirit\[] = \[([\s\S]*?)\n\]/m)?.[1] ?? ''
const spirits = [...spiritBlock.matchAll(/name:\s*(["'])(.*?)\1/g)].map((m) => m[2])
const aliases = new Map([
  ['Eyes Watch from the Trees', 'Eyes Watch From the Trees']
])

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function occurrencesForSpirit(spirit) {
  const names = [spirit, aliases.get(spirit)].filter(Boolean)
  const occ = []
  for (const name of names) {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === name && lines[i - 1] === 'Nickname') {
        occ.push(i)
      }
    }
  }
  return [...new Set(occ)].sort((a, b) => a - b)
}

function parseCards(start, end) {
  const cards = []
  for (let i = start; i < end - 2; i++) {
    if (lines[i] !== 'Nickname') continue
    const title = lines[i + 1] ?? ''
    if (!title || title === 'Progression') continue
    let face = ''
    const tags = []

    for (let j = i + 2; j < Math.min(end, i + 140); j++) {
      if (lines[j] === 'Tags') {
        for (let k = j + 1; k < Math.min(end, j + 16); k++) {
          const t = lines[k]
          if (
            [
              'LayoutGroupSortIndex',
              'Value',
              'Locked',
              'GMNotes',
              'AltLookAngle',
              'ColorDiffuse',
              'Hands',
              'CardID',
              'CustomDeck'
            ].includes(t)
          )
            break
          if (t) tags.push(t)
        }
      }
      if (lines[j] === 'FaceURL' && /^https?:\/\//.test(lines[j + 1] ?? '')) face = lines[j + 1]
      if (j > i + 8 && lines[j] === 'Nickname') break
    }

    if (tags.includes('Unique') && face) cards.push({ name: title, face })
  }

  const unique = []
  const seen = new Set()
  for (const card of cards) {
    const key = `${card.name}|${card.face}`
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(card)
    }
  }
  return unique
}

const map = {}
for (const spirit of spirits) {
  const occ = occurrencesForSpirit(spirit)
  const candidates = []
  for (let i = 0; i < occ.length - 1; i++) {
    const start = occ[i]
    const end = occ[i + 1]
    const dist = end - start
    if (dist < 80 || dist > 4000) continue
    const cards = parseCards(start, end)
    if (cards.length > 0) candidates.push({ start, end, dist, cards })
  }

  candidates.sort((a, b) => b.cards.length - a.cards.length || a.dist - b.dist)
  map[spirit] = candidates[0]?.cards ?? []
}

fs.writeFileSync(OUT_JSON, JSON.stringify(map, null, 2))

for (const [spirit, cards] of Object.entries(map)) {
  const spiritSlug = slugify(spirit)
  fs.mkdirSync(`${OUT_DIR}/${spiritSlug}`, { recursive: true })
  for (const card of cards) {
    const cardSlug = slugify(card.name)
    const outPath = `${OUT_DIR}/${spiritSlug}/${cardSlug}.jpg`
    try {
      execSync(`curl -L '${card.face}' -o '${outPath}'`, { stdio: 'ignore' })
      card.local = `/${outPath}`
    } catch {
      // skip failed downloads
    }
  }
}

const linesOut = []
linesOut.push('export interface UniquePowerCard {')
linesOut.push('    name: string')
linesOut.push('    image: string')
linesOut.push('}')
linesOut.push('')
linesOut.push('export const LOCAL_UNIQUE_POWER_CARDS_BY_SPIRIT: Record<string, UniquePowerCard[]> = {')
for (const spirit of spirits) {
  const cards = (map[spirit] ?? []).filter((c) => c.local)
  linesOut.push(`    ${JSON.stringify(spirit)}: [`)
  for (const card of cards) {
    linesOut.push(`        { name: ${JSON.stringify(card.name)}, image: ${JSON.stringify(card.local)} },`)
  }
  linesOut.push('    ],')
}
linesOut.push('}')
linesOut.push('')

fs.writeFileSync(OUT_TS, linesOut.join('\n'))

const covered = Object.values(map).filter((v) => v.length > 0).length
console.log(`spirits: ${spirits.length}, with unique cards: ${covered}`)
for (const spirit of spirits) {
  if ((map[spirit] ?? []).length === 0) console.log(`missing: ${spirit}`)
}
