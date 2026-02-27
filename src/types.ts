export type Difficulty = 'Easy' | 'Moderate' | 'Hard' | 'Very Hard'

export interface Spirit {
    id: string
    name: string
    difficulty: Difficulty
    expansion: string
    image: string
    aspects?: string[]
}

export interface SpiritWithAspects extends Spirit {
    aspects: string[]
}

export interface HistoryEntry extends SpiritWithAspects {
    entryId: string
    timestamp: string
    selectedAspect: string | null
}

export interface Adversary {
    id: string
    name: string
    expansion: string
    difficultyRange: string
}

export interface AdversaryHistoryEntry extends Adversary {
    timestamp: string
}

export interface GamePlayerSelection {
    player: number
    playerName: string
    spirit: SpiritWithAspects | null
    aspect: string | null
}

export interface GameScore {
    outcome: 'Victory' | 'Defeat'
    difficulty: number
    invaderCardsRemaining: number
    invaderCardsNotInDeck: number
    livingDahan: number
    blightOnIsland: number
    total: number
    breakdown: string
    scoredAt: string
}

export type BoardSide = 'Balanced' | 'Thematic'

export interface GameRecord {
    id: string
    createdAt: string
    teamName: string
    boardSide: BoardSide
    players: number
    candidateCount: number
    selections: GamePlayerSelection[]
    adversary: Adversary | null
    adversaryLevel: number | null
    score: GameScore | null
}

export type AppTab = 'spirits' | 'adversary' | 'games'
