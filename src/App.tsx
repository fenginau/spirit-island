/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
    History,
    Check,
    Pencil,
    Share2,
    RotateCcw,
    Sparkles,
    Shield,
    Swords,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import type {
    Difficulty,
    Spirit,
    SpiritWithAspects,
    HistoryEntry,
    Adversary,
    AdversaryHistoryEntry,
    BoardSide,
    GamePlayerSelection,
    GameRecord,
    GameScore,
    AppTab
} from './types'
import ModalShell from './components/ModalShell'
import SpiritDisplayCard from './components/SpiritDisplayCard'
import ScoreBadge from './components/ScoreBadge'

const GOOGLE_AI_API_KEY = 'AIzaSyDIrZfjGbBmDVjuEi-5MI5zaEdkV5gfLtc'
const getDefaultPlayerName = (player: number) => `Player ${player}`
const getBoardDifficultyModifier = (boardSide: BoardSide) => (boardSide === 'Thematic' ? 3 : 0)
const LOCAL_PLAY_CARDS_BY_SPIRIT: Record<string, { front: string; back: string }> = {
    'Thunderspeaker': { front: '/play-cards/vassal/1sp1.jpg', back: '/play-cards/vassal/1sp2.jpg' },
    "Ocean's Hungry Grasp": { front: '/play-cards/vassal/2sp1.jpg', back: '/play-cards/vassal/2sp2.jpg' },
    'Vital Strength of the Earth': { front: '/play-cards/vassal/3sp1.jpg', back: '/play-cards/vassal/3sp2.jpg' },
    'Bringer of Dreams and Nightmares': {
        front: '/play-cards/vassal/4sp1.jpg',
        back: '/play-cards/vassal/4sp2.jpg'
    },
    'Heart of the Wildfire': { front: '/play-cards/vassal/5sp1.jpg', back: '/play-cards/vassal/5sp2.jpg' },
    'Keeper of the Forbidden Wilds': {
        front: '/play-cards/vassal/6sp1.jpg',
        back: '/play-cards/vassal/6sp2.jpg'
    },
    "Lightning's Swift Strike": { front: '/play-cards/vassal/7sp1.jpg', back: '/play-cards/vassal/7sp2.jpg' },
    'A Spread of Rampant Green': { front: '/play-cards/vassal/8sp1.jpg', back: '/play-cards/vassal/8sp2.jpg' },
    'Shadows Flicker Like Flame': { front: '/play-cards/vassal/9sp1.jpg', back: '/play-cards/vassal/9sp2.jpg' },
    'River Surges in Sunlight': { front: '/play-cards/vassal/10sp1.jpg', back: '/play-cards/vassal/10sp2.jpg' },
    'Sharp Fangs Behind the Leaves': {
        front: '/play-cards/vassal/11sp1.jpg',
        back: '/play-cards/vassal/11sp2.jpg'
    },
    'Serpent Slumbering Beneath the Island': {
        front: '/play-cards/vassal/12sp1.jpg',
        back: '/play-cards/vassal/12sp2.jpg'
    },
    'Downpour Drenches the World': {
        front: '/play-cards/vassal/downpour-front.jpg',
        back: '/play-cards/vassal/downpour-back.jpg'
    },
    'Finder of Paths Unseen': {
        front: '/play-cards/vassal/finder-front.jpg',
        back: '/play-cards/vassal/finder-back.jpg'
    },
    'Lure of the Deep Wilderness': {
        front: '/play-cards/vassal/lure-front.jpg',
        back: '/play-cards/vassal/lure-back.jpg'
    },
    'Many Minds Move as One': {
        front: '/play-cards/vassal/many-minds-front.jpg',
        back: '/play-cards/vassal/many-minds-back.jpg'
    },
    'Shifting Memory of Ages': {
        front: '/play-cards/vassal/shifting-front.jpg',
        back: '/play-cards/vassal/shifting-back.jpg'
    },
    'Shroud of Silent Mist': {
        front: '/play-cards/vassal/shroud-front.jpg',
        back: '/play-cards/vassal/shroud-back.jpg'
    },
    "Stone's Unyielding Defiance": {
        front: '/play-cards/vassal/stones-front.jpg',
        back: '/play-cards/vassal/stones-back.jpg'
    },
    'Volcano Looming High': {
        front: '/play-cards/vassal/volcano-front.jpg',
        back: '/play-cards/vassal/volcano-back.jpg'
    },
    'Vengeance as a Burning Plague': {
        front: '/play-cards/vassal/vengeance-front.jpg',
        back: '/play-cards/vassal/vengeance-back.jpg'
    },
    'Starlight Seeks Its Form': {
        front: '/play-cards/vassal/starlight-front.jpg',
        back: '/play-cards/vassal/starlight-back.jpg'
    },
    'Fractured Days Split the Sky': {
        front: '/play-cards/vassal/shattered-days-front.jpg',
        back: '/play-cards/vassal/shattered-days-back.jpg'
    },
    'Grinning Trickster Stirs Up Trouble': {
        front: '/play-cards/vassal/trickster-front.jpg',
        back: '/play-cards/vassal/trickster-back.jpg'
    },
    'Devouring Teeth Lurk Underfoot': {
        front: '/play-cards/tts/devouring-teeth-lurk-underfoot-front.jpg',
        back: '/play-cards/tts/devouring-teeth-lurk-underfoot-back.jpg'
    },
    'Eyes Watch from the Trees': {
        front: '/play-cards/tts/eyes-watch-from-the-trees-front.jpg',
        back: '/play-cards/tts/eyes-watch-from-the-trees-back.jpg'
    },
    'Fathomless Mud of the Swamp': {
        front: '/play-cards/tts/fathomless-mud-of-the-swamp-front.jpg',
        back: '/play-cards/tts/fathomless-mud-of-the-swamp-back.jpg'
    },
    'Rising Heat of Stone and Sand': {
        front: '/play-cards/tts/rising-heat-of-stone-and-sand-front.jpg',
        back: '/play-cards/tts/rising-heat-of-stone-and-sand-back.jpg'
    },
    'Sun-Bright Whirlwind': {
        front: '/play-cards/tts/sun-bright-whirlwind-front.jpg',
        back: '/play-cards/tts/sun-bright-whirlwind-back.jpg'
    },
    'Ember-Eyed Behemoth': {
        front: '/play-cards/tts/ember-eyed-behemoth-front.jpg',
        back: '/play-cards/tts/ember-eyed-behemoth-back.jpg'
    },
    'Hearth-Vigil': {
        front: '/play-cards/tts/hearth-vigil-front.jpg',
        back: '/play-cards/tts/hearth-vigil-back.jpg'
    },
    'Towering Roots of the Jungle': {
        front: '/play-cards/tts/towering-roots-of-the-jungle-front.jpg',
        back: '/play-cards/tts/towering-roots-of-the-jungle-back.jpg'
    },
    'Breath of Darkness Down Your Spine': {
        front: '/play-cards/tts/breath-of-darkness-down-your-spine-front.jpg',
        back: '/play-cards/tts/breath-of-darkness-down-your-spine-back.jpg'
    },
    'Relentless Gaze of the Sun': {
        front: '/play-cards/tts/relentless-gaze-of-the-sun-front.jpg',
        back: '/play-cards/tts/relentless-gaze-of-the-sun-back.jpg'
    },
    'Wandering Voice Keens Delirium': {
        front: '/play-cards/tts/wandering-voice-keens-delirium-front.jpg',
        back: '/play-cards/tts/wandering-voice-keens-delirium-back.jpg'
    },
    'Wounded Waters Bleeding': {
        front: '/play-cards/tts/wounded-waters-bleeding-front.jpg',
        back: '/play-cards/tts/wounded-waters-bleeding-back.jpg'
    },
    'Dances Up Earthquakes': {
        front: '/play-cards/tts/dances-up-earthquakes-front.jpg',
        back: '/play-cards/tts/dances-up-earthquakes-back.jpg'
    }
}

const getSpiritPlayCardCandidates = (spiritName: string, side: 'Front' | 'Back') => {
    const entry = LOCAL_PLAY_CARDS_BY_SPIRIT[spiritName]
    if (!entry) return []
    return [side === 'Front' ? entry.front : entry.back]
}

// --- Data ---
const SPIRIT_ASPECTS: Record<string, string[]> = {
    'A Spread of Rampant Green': ['Regrowth', 'Tangles'],
    'Bringer of Dreams and Nightmares': ['Enticing', 'Violence'],
    'Heart of the Wildfire': ['Transforming'],
    'Keeper of the Forbidden Wilds': ['Spreading Hostility'],
    "Lightning's Swift Strike": ['Pandemonium', 'Wind', 'Immense', 'Sparking'],
    'Lure of the Deep Wilderness': ['Lair'],
    "Ocean's Hungry Grasp": ['Deeps'],
    'River Surges in Sunlight': ['Sunshine', 'Travel', 'Haven'],
    'Serpent Slumbering Beneath the Island': ['Locus'],
    'Shadows Flicker Like Flame': ['Madness', 'Reach', 'Amorphous', 'Foreboding', 'Dark Fire'],
    'Sharp Fangs Behind the Leaves': ['Encircle', 'Unconstrained'],
    'Shifting Memory of Ages': ['Intensify', 'Mentor'],
    'Shroud of Silent Mist': ['Stranded'],
    'Thunderspeaker': ['Tactician', 'Warrior'],
    'Vital Strength of the Earth': ['Resilience', 'Might', 'Nourishing']
}

const SPIRITS: Spirit[] = [
    {
        id: '1',
        name: "Lightning's Swift Strike",
        difficulty: 'Easy',
        expansion: 'Base Game',
        image: '/spirits/lightning-s-swift-strike.png'
    },
    {
        id: '2',
        name: 'River Surges in Sunlight',
        difficulty: 'Easy',
        expansion: 'Base Game',
        image: '/spirits/river-surges-in-sunlight.png'
    },
    {
        id: '3',
        name: 'Shadows Flicker Like Flame',
        difficulty: 'Easy',
        expansion: 'Base Game',
        image: '/spirits/shadows-flicker-like-flame.png'
    },
    {
        id: '4',
        name: 'Vital Strength of the Earth',
        difficulty: 'Easy',
        expansion: 'Base Game',
        image: '/spirits/vital-strength-of-the-earth.png'
    },
    {
        id: '5',
        name: 'A Spread of Rampant Green',
        difficulty: 'Moderate',
        expansion: 'Base Game',
        image: '/spirits/a-spread-of-rampant-green.png'
    },
    {
        id: '6',
        name: 'Thunderspeaker',
        difficulty: 'Moderate',
        expansion: 'Base Game',
        image: '/spirits/thunderspeaker.png'
    },
    {
        id: '7',
        name: 'Bringer of Dreams and Nightmares',
        difficulty: 'Hard',
        expansion: 'Base Game',
        image: '/spirits/bringer-of-dreams-and-nightmares.png'
    },
    {
        id: '8',
        name: "Ocean's Hungry Grasp",
        difficulty: 'Hard',
        expansion: 'Base Game',
        image: '/spirits/ocean-s-hungry-grasp.png'
    },
    {
        id: '9',
        name: 'Keeper of the Forbidden Wilds',
        difficulty: 'Moderate',
        expansion: 'Branch & Claw',
        image: '/spirits/keeper-of-the-forbidden-wilds.png'
    },
    {
        id: '10',
        name: 'Sharp Fangs Behind the Leaves',
        difficulty: 'Moderate',
        expansion: 'Branch & Claw',
        image: '/spirits/sharp-fangs-behind-the-leaves.png'
    },
    {
        id: '11',
        name: 'Heart of the Wildfire',
        difficulty: 'Hard',
        expansion: 'Promo 1',
        image: '/spirits/heart-of-the-wildfire.png'
    },
    {
        id: '12',
        name: 'Serpent Slumbering Beneath the Island',
        difficulty: 'Hard',
        expansion: 'Promo 1',
        image: '/spirits/serpent-slumbering-beneath-the-island.png'
    },
    {
        id: '13',
        name: 'Grinning Trickster Stirs Up Trouble',
        difficulty: 'Moderate',
        expansion: 'Jagged Earth',
        image: '/spirits/grinning-trickster-stirs-up-trouble.png'
    },
    {
        id: '14',
        name: 'Lure of the Deep Wilderness',
        difficulty: 'Moderate',
        expansion: 'Jagged Earth',
        image: '/spirits/lure-of-the-deep-wilderness.png'
    },
    {
        id: '15',
        name: 'Many Minds Move as One',
        difficulty: 'Moderate',
        expansion: 'Jagged Earth',
        image: '/spirits/many-minds-move-as-one.png'
    },
    {
        id: '16',
        name: 'Shifting Memory of Ages',
        difficulty: 'Moderate',
        expansion: 'Jagged Earth',
        image: '/spirits/shifting-memory-of-ages.png'
    },
    {
        id: '17',
        name: "Stone's Unyielding Defiance",
        difficulty: 'Moderate',
        expansion: 'Jagged Earth',
        image: '/spirits/stone-s-unyielding-defiance.png'
    },
    {
        id: '18',
        name: 'Volcano Looming High',
        difficulty: 'Moderate',
        expansion: 'Jagged Earth',
        image: '/spirits/volcano-looming-high.png'
    },
    {
        id: '19',
        name: 'Shroud of Silent Mist',
        difficulty: 'Hard',
        expansion: 'Jagged Earth',
        image: '/spirits/shroud-of-silent-mist.png'
    },
    {
        id: '20',
        name: 'Vengeance as a Burning Plague',
        difficulty: 'Hard',
        expansion: 'Jagged Earth',
        image: '/spirits/vengeance-as-a-burning-plague.png'
    },
    {
        id: '21',
        name: 'Fractured Days Split the Sky',
        difficulty: 'Very Hard',
        expansion: 'Jagged Earth',
        image: '/spirits/fractured-days-split-the-sky.png'
    },
    {
        id: '22',
        name: 'Starlight Seeks Its Form',
        difficulty: 'Very Hard',
        expansion: 'Jagged Earth',
        image: '/spirits/starlight-seeks-its-form.png'
    },
    {
        id: '23',
        name: 'Downpour Drenches the World',
        difficulty: 'Hard',
        expansion: 'Promo 2',
        image: '/spirits/downpour-drenches-the-world.png'
    },
    {
        id: '24',
        name: 'Finder of Paths Unseen',
        difficulty: 'Very Hard',
        expansion: 'Promo 2',
        image: '/spirits/finder-of-paths-unseen.png'
    },
    {
        id: '25',
        name: 'Devouring Teeth Lurk Underfoot',
        difficulty: 'Easy',
        expansion: 'Horizons',
        image: '/spirits/devouring-teeth-lurk-underfoot.png'
    },
    {
        id: '26',
        name: 'Eyes Watch from the Trees',
        difficulty: 'Easy',
        expansion: 'Horizons',
        image: '/spirits/eyes-watch-from-the-trees.png'
    },
    {
        id: '27',
        name: 'Fathomless Mud of the Swamp',
        difficulty: 'Easy',
        expansion: 'Horizons',
        image: '/spirits/fathomless-mud-of-the-swamp.png'
    },
    {
        id: '28',
        name: 'Rising Heat of Stone and Sand',
        difficulty: 'Easy',
        expansion: 'Horizons',
        image: '/spirits/rising-heat-of-stone-and-sand.png'
    },
    {
        id: '29',
        name: 'Sun-Bright Whirlwind',
        difficulty: 'Easy',
        expansion: 'Horizons',
        image: '/spirits/sun-bright-whirlwind.png'
    },
    {
        id: '30',
        name: 'Ember-Eyed Behemoth',
        difficulty: 'Moderate',
        expansion: 'Nature Incarnate',
        image: '/spirits/ember-eyed-behemoth.png'
    },
    {
        id: '31',
        name: 'Hearth-Vigil',
        difficulty: 'Moderate',
        expansion: 'Nature Incarnate',
        image: '/spirits/hearth-vigil.png'
    },
    {
        id: '32',
        name: 'Towering Roots of the Jungle',
        difficulty: 'Moderate',
        expansion: 'Nature Incarnate',
        image: '/spirits/towering-roots-of-the-jungle.png'
    },
    {
        id: '33',
        name: 'Breath of Darkness Down Your Spine',
        difficulty: 'Hard',
        expansion: 'Nature Incarnate',
        image: '/spirits/breath-of-darkness-down-your-spine.png'
    },
    {
        id: '34',
        name: 'Relentless Gaze of the Sun',
        difficulty: 'Hard',
        expansion: 'Nature Incarnate',
        image: '/spirits/relentless-gaze-of-the-sun.png'
    },
    {
        id: '35',
        name: 'Wandering Voice Keens Delirium',
        difficulty: 'Hard',
        expansion: 'Nature Incarnate',
        image: '/spirits/wandering-voice-keens-delirium.png'
    },
    {
        id: '36',
        name: 'Wounded Waters Bleeding',
        difficulty: 'Hard',
        expansion: 'Nature Incarnate',
        image: '/spirits/wounded-waters-bleeding.png'
    },
    {
        id: '37',
        name: 'Dances Up Earthquakes',
        difficulty: 'Very Hard',
        expansion: 'Nature Incarnate',
        image: '/spirits/dances-up-earthquakes.png'
    }
]

const EXPANSIONS = ['Base Game', 'Branch & Claw', 'Jagged Earth', 'Horizons', 'Nature Incarnate']

const DIFFICULTIES: Difficulty[] = ['Easy', 'Moderate', 'Hard', 'Very Hard']
const DIFFICULTY_SORT_ORDER: Record<Difficulty, number> = {
    Easy: 0,
    Moderate: 1,
    Hard: 2,
    'Very Hard': 3
}

const ADVERSARIES: Adversary[] = [
    { id: 'a1', name: 'Brandenburg-Prussia', expansion: 'Base Game', difficultyRange: '1-10' },
    { id: 'a2', name: 'England', expansion: 'Base Game', difficultyRange: '1-11' },
    { id: 'a3', name: 'Sweden', expansion: 'Base Game', difficultyRange: '1-8' },
    { id: 'a4', name: 'France', expansion: 'Branch & Claw', difficultyRange: '2-10' },
    {
        id: 'a5',
        name: 'Habsburg Monarchy (Livestock Colony)',
        expansion: 'Jagged Earth',
        difficultyRange: '2-10'
    },
    { id: 'a6', name: 'Russia', expansion: 'Jagged Earth', difficultyRange: '2-11' },
    { id: 'a7', name: 'Scotland', expansion: 'Jagged Earth', difficultyRange: '1-10' },
    {
        id: 'a8',
        name: 'Habsburg Mining Expedition',
        expansion: 'Nature Incarnate',
        difficultyRange: '2-11'
    }
]

export default function App() {
    const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([])
    const [selectedExpansions, setSelectedExpansions] = useState<string[]>(EXPANSIONS)
    const [history, setHistory] = useState<HistoryEntry[]>([])
    const [adversaryHistory, setAdversaryHistory] = useState<AdversaryHistoryEntry[]>([])
    const [activeTab, setActiveTab] = useState<AppTab>('spirits')
    const [games, setGames] = useState<GameRecord[]>([])
    const [gamesSortBy, setGamesSortBy] = useState<'date' | 'score'>('date')
    const [gamesScreen, setGamesScreen] = useState<'landing' | 'wizard' | 'detail' | 'scoring'>(
        'landing'
    )
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null)
    const [storageHydrated, setStorageHydrated] = useState(false)
    const [pickedSpirit, setPickedSpirit] = useState<SpiritWithAspects | null>(null)
    const [pickedSpiritHistoryEntryId, setPickedSpiritHistoryEntryId] = useState<string | null>(
        null
    )
    const [selectedAspect, setSelectedAspect] = useState<string | null>(null)
    const [pickedAdversary, setPickedAdversary] = useState<Adversary | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [showSpiritHistoryModal, setShowSpiritHistoryModal] = useState(false)
    const [playCardSpirit, setPlayCardSpirit] = useState<SpiritWithAspects | null>(null)
    const [isPlayCardFlipped, setIsPlayCardFlipped] = useState(false)
    const [playCardFrontUrlIndex, setPlayCardFrontUrlIndex] = useState(0)
    const [playCardBackUrlIndex, setPlayCardBackUrlIndex] = useState(0)
    const [spiritsSort, setSpiritsSort] = useState<
        'name-asc' | 'name-desc' | 'difficulty-asc' | 'difficulty-desc'
    >('name-asc')
    const [gameStep, setGameStep] = useState(1)
    const [gameTeamName, setGameTeamName] = useState('')
    const [gameBoardSide, setGameBoardSide] = useState<BoardSide>('Balanced')
    const [gamePlayers, setGamePlayers] = useState(2)
    const [gameCandidateCount, setGameCandidateCount] = useState(3)
    const [gameCurrentPlayer, setGameCurrentPlayer] = useState(1)
    const [gameCandidates, setGameCandidates] = useState<SpiritWithAspects[]>([])
    const [showGameCandidateModal, setShowGameCandidateModal] = useState(false)
    const [gameCandidateAspects, setGameCandidateAspects] = useState<Record<string, string | null>>(
        {}
    )
    const [showGameAdversaryPickerModal, setShowGameAdversaryPickerModal] = useState(false)
    const [showGameSpiritPickerModal, setShowGameSpiritPickerModal] = useState(false)
    const [gameSpiritPickerPlayer, setGameSpiritPickerPlayer] = useState<number | null>(null)
    const [gameSpiritSearch, setGameSpiritSearch] = useState('')
    const [gameSpiritPickerAspects, setGameSpiritPickerAspects] = useState<
        Record<string, string | null>
    >({})
    const [gameSelections, setGameSelections] = useState<GamePlayerSelection[]>([
        { player: 1, playerName: getDefaultPlayerName(1), spirit: null, aspect: null },
        { player: 2, playerName: getDefaultPlayerName(2), spirit: null, aspect: null }
    ])
    const [gameAdversary, setGameAdversary] = useState<Adversary | null>(null)
    const [gameAdversaryLevel, setGameAdversaryLevel] = useState<number | null>(null)
    const [gameError, setGameError] = useState('')
    const [scoreOutcome, setScoreOutcome] = useState<'Victory' | 'Defeat'>('Victory')
    const [scoreDifficulty, setScoreDifficulty] = useState(0)
    const [scoreInvaderRemaining, setScoreInvaderRemaining] = useState(0)
    const [scoreInvaderNotInDeck, setScoreInvaderNotInDeck] = useState(0)
    const [scoreLivingDahan, setScoreLivingDahan] = useState(0)
    const [scoreBlight, setScoreBlight] = useState(0)
    const [isAiComposing, setIsAiComposing] = useState(false)
    const [isStartingGame, setIsStartingGame] = useState(false)
    const [isDownloadingGameImage, setIsDownloadingGameImage] = useState(false)
    const [isExportingGameImage, setIsExportingGameImage] = useState(false)
    const [editingPlayerNameId, setEditingPlayerNameId] = useState<number | null>(null)
    const [editingPlayerNameValue, setEditingPlayerNameValue] = useState('')
    const gameDetailExportRef = useRef<HTMLDivElement | null>(null)

    // Load history from localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem('spiritHistory')
        if (savedHistory) {
            try {
                const parsedHistory = JSON.parse(savedHistory)
                if (Array.isArray(parsedHistory)) {
                    setHistory(
                        parsedHistory.map((entry, idx) => ({
                            ...entry,
                            aspects: Array.isArray(entry.aspects)
                                ? entry.aspects
                                : (SPIRIT_ASPECTS[entry.name] ?? []),
                            entryId: entry.entryId ?? `${entry.id}-${entry.timestamp}-${idx}`,
                            selectedAspect: entry.selectedAspect ?? null
                        }))
                    )
                }
            } catch (e) {
                console.error('Failed to parse history', e)
            }
        }
    }, [])

    useEffect(() => {
        const savedAdversaryHistory = localStorage.getItem('adversaryHistory')
        if (savedAdversaryHistory) {
            try {
                setAdversaryHistory(JSON.parse(savedAdversaryHistory))
            } catch (e) {
                console.error('Failed to parse adversary history', e)
            }
        }
        const savedGames = localStorage.getItem('savedGames')
        if (savedGames) {
            try {
                const parsed = JSON.parse(savedGames)
                if (Array.isArray(parsed)) {
                    setGames(
                        parsed.map((game) => ({
                            ...game,
                            teamName: game.teamName ?? '',
                            boardSide: game.boardSide ?? 'Balanced',
                            selections: Array.isArray(game.selections)
                                ? game.selections.map((selection: GamePlayerSelection) => ({
                                      ...selection,
                                      playerName:
                                          selection.playerName ??
                                          getDefaultPlayerName(selection.player)
                                  }))
                                : []
                        }))
                    )
                }
            } catch (e) {
                console.error('Failed to parse saved games', e)
            }
        }
        setStorageHydrated(true)
    }, [])

    // Save history to localStorage
    useEffect(() => {
        if (!storageHydrated) return
        localStorage.setItem('spiritHistory', JSON.stringify(history))
    }, [history, storageHydrated])

    useEffect(() => {
        if (!storageHydrated) return
        localStorage.setItem('adversaryHistory', JSON.stringify(adversaryHistory))
    }, [adversaryHistory, storageHydrated])

    useEffect(() => {
        if (!storageHydrated) return
        localStorage.setItem('savedGames', JSON.stringify(games))
    }, [games, storageHydrated])

    const filteredSpirits = useMemo<SpiritWithAspects[]>(() => {
        return SPIRITS.filter((s) => {
            const matchesDiff =
                selectedDifficulties.length === 0 || selectedDifficulties.includes(s.difficulty)
            const matchesExp = selectedExpansions.includes(s.expansion)
            return matchesDiff && matchesExp
        }).map((s) => ({
            ...s,
            aspects: SPIRIT_ASPECTS[s.name] ?? []
        }))
    }, [selectedDifficulties, selectedExpansions])

    const filteredAdversaries = useMemo(() => {
        return ADVERSARIES.filter((a) => selectedExpansions.includes(a.expansion))
    }, [selectedExpansions])

    const sortedFilteredSpirits = useMemo(() => {
        const items = [...filteredSpirits]
        const isDifficultySort = spiritsSort.startsWith('difficulty')
        const isAsc = spiritsSort.endsWith('asc')
        items.sort((a, b) => {
            if (isDifficultySort) {
                const orderDiff = DIFFICULTY_SORT_ORDER[a.difficulty] - DIFFICULTY_SORT_ORDER[b.difficulty]
                if (orderDiff !== 0) {
                    return isAsc ? orderDiff : -orderDiff
                }
                const nameDiff = a.name.localeCompare(b.name)
                return isAsc ? nameDiff : -nameDiff
            }

            const nameDiff = a.name.localeCompare(b.name)
            if (nameDiff !== 0) {
                return isAsc ? nameDiff : -nameDiff
            }
            const orderDiff = DIFFICULTY_SORT_ORDER[a.difficulty] - DIFFICULTY_SORT_ORDER[b.difficulty]
            return isAsc ? orderDiff : -orderDiff
        })
        return items
    }, [filteredSpirits, spiritsSort])

    const gameSpiritPickerTakenByOthers = useMemo(() => {
        const currentPlayer = gameSpiritPickerPlayer ?? gameCurrentPlayer
        return new Set(
            gameSelections
                .filter((selection) => selection.player !== currentPlayer)
                .map((selection) => selection.spirit?.id)
                .filter(Boolean)
        )
    }, [gameSelections, gameSpiritPickerPlayer, gameCurrentPlayer])

    const gameSpiritPickerSpirits = useMemo(() => {
        const search = gameSpiritSearch.trim().toLowerCase()

        return filteredSpirits.filter((spirit) => {
            if (!search) return true
            return spirit.name.toLowerCase().includes(search)
        })
    }, [filteredSpirits, gameSpiritSearch])

    const playCardFrontCandidates = useMemo(
        () => (playCardSpirit ? getSpiritPlayCardCandidates(playCardSpirit.name, 'Front') : []),
        [playCardSpirit]
    )

    const playCardBackCandidates = useMemo(
        () => (playCardSpirit ? getSpiritPlayCardCandidates(playCardSpirit.name, 'Back') : []),
        [playCardSpirit]
    )

    const playCardFrontUrl = playCardFrontCandidates[playCardFrontUrlIndex] ?? null
    const playCardBackUrl = playCardBackCandidates[playCardBackUrlIndex] ?? null
    const hasLocalPlayCardForSpirit = (spirit: SpiritWithAspects) =>
        Boolean(LOCAL_PLAY_CARDS_BY_SPIRIT[spirit.name])

    const toggleDifficulty = (diff: Difficulty) => {
        setSelectedDifficulties((prev) =>
            prev.includes(diff) ? prev.filter((d) => d !== diff) : [...prev, diff]
        )
    }

    const toggleExpansion = (exp: string) => {
        setSelectedExpansions((prev) =>
            prev.includes(exp) ? prev.filter((e) => e !== exp) : [...prev, exp]
        )
    }

    const clearFilters = () => {
        setSelectedDifficulties([])
        setSelectedExpansions(EXPANSIONS)
    }

    const pickSpirit = () => {
        if (filteredSpirits.length === 0) return
        const randomIndex = Math.floor(Math.random() * filteredSpirits.length)
        const spirit = filteredSpirits[randomIndex]
        const entryId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

        setPickedSpirit(spirit)
        setPickedSpiritHistoryEntryId(entryId)
        setSelectedAspect(null)
        setShowModal(true)

        const newEntry: HistoryEntry = {
            ...spirit,
            entryId,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            selectedAspect: null
        }
        setHistory((prev) => [newEntry, ...prev].slice(0, 20))
    }

    const openSpiritPlayCardModal = (spirit: SpiritWithAspects) => {
        setPlayCardSpirit(spirit)
        setIsPlayCardFlipped(true)
        setPlayCardFrontUrlIndex(0)
        setPlayCardBackUrlIndex(0)
    }

    const closeSpiritPlayCardModal = () => {
        setPlayCardSpirit(null)
        setIsPlayCardFlipped(false)
    }

    const updateSelectedAspect = (aspect: string | null) => {
        setSelectedAspect(aspect)
        if (!pickedSpiritHistoryEntryId) return

        setHistory((prev) =>
            prev.map((entry) =>
                entry.entryId === pickedSpiritHistoryEntryId
                    ? { ...entry, selectedAspect: aspect }
                    : entry
            )
        )
    }

    const clearHistory = () => {
        if (window.confirm('Are you sure you want to clear your pick history?')) {
            setHistory([])
        }
    }

    const pickAdversary = () => {
        if (filteredAdversaries.length === 0) return
        const randomIndex = Math.floor(Math.random() * filteredAdversaries.length)
        const adversary = filteredAdversaries[randomIndex]

        setPickedAdversary(adversary)

        const newEntry: AdversaryHistoryEntry = {
            ...adversary,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setAdversaryHistory((prev) => [newEntry, ...prev].slice(0, 20))
    }

    const clearAdversaryHistory = () => {
        if (window.confirm('Are you sure you want to clear your adversary pick history?')) {
            setAdversaryHistory([])
        }
    }

    const selectedGame = useMemo(
        () => games.find((game) => game.id === selectedGameId) ?? null,
        [games, selectedGameId]
    )

    const sortedGames = useMemo(() => {
        const items = [...games]
        if (gamesSortBy === 'score') {
            return items.sort((a, b) => {
                const aScore = a.score?.total ?? Number.NEGATIVE_INFINITY
                const bScore = b.score?.total ?? Number.NEGATIVE_INFINITY
                if (aScore !== bScore) return bScore - aScore
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            })
        }
        return items.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    }, [games, gamesSortBy])

    const getWizardPlayerLabel = (player: number) =>
        gameSelections.find((selection) => selection.player === player)?.playerName?.trim() ||
        getDefaultPlayerName(player)

    const beginEditPlayerName = (selection: GamePlayerSelection) => {
        setEditingPlayerNameId(selection.player)
        setEditingPlayerNameValue(selection.playerName || getDefaultPlayerName(selection.player))
    }

    const cancelEditPlayerName = () => {
        setEditingPlayerNameId(null)
        setEditingPlayerNameValue('')
    }

    const savePlayerName = (player: number) => {
        const normalized = editingPlayerNameValue.trim() || getDefaultPlayerName(player)
        setGameSelections((prev) =>
            prev.map((entry) =>
                entry.player === player
                    ? {
                          ...entry,
                          playerName: normalized
                      }
                    : entry
            )
        )
        cancelEditPlayerName()
    }

    const saveSelectedGamePlayerName = (player: number) => {
        if (!selectedGame) return
        const normalized = editingPlayerNameValue.trim() || getDefaultPlayerName(player)
        setGames((prev) =>
            prev.map((game) =>
                game.id === selectedGame.id
                    ? {
                          ...game,
                          selections: game.selections.map((entry) =>
                              entry.player === player
                                  ? {
                                        ...entry,
                                        playerName: normalized
                                    }
                                  : entry
                          )
                      }
                    : game
            )
        )
        cancelEditPlayerName()
    }

    const resetGameWizard = () => {
        setGameStep(1)
        setGameTeamName('')
        setGameBoardSide('Balanced')
        setGamePlayers(2)
        setGameCandidateCount(3)
        setGameCurrentPlayer(1)
        setGameCandidates([])
        setShowGameAdversaryPickerModal(false)
        setGameSelections([
            { player: 1, playerName: getDefaultPlayerName(1), spirit: null, aspect: null },
            { player: 2, playerName: getDefaultPlayerName(2), spirit: null, aspect: null }
        ])
        setGameAdversary(null)
        setGameAdversaryLevel(null)
        setGameError('')
        cancelEditPlayerName()
    }

    const openGamesLanding = () => {
        setGamesScreen('landing')
        setSelectedGameId(null)
    }

    const startGameWizard = () => {
        resetGameWizard()
        setGamesScreen('wizard')
    }

    const generateTeamNameFromSetup = async (): Promise<string> => {
        const spiritLines = gameSelections
            .map((selection) => {
                const spiritName = selection.spirit?.name ?? 'Unknown Spirit'
                const aspect = selection.aspect ?? 'No Aspect'
                return `Player ${selection.player}: ${spiritName} (${aspect})`
            })
            .join('\n')
        const adversaryLine = gameAdversary
            ? `${gameAdversary.name} (Level ${gameAdversaryLevel ?? 0})`
            : 'None'
        const prompt = [
            'Generate a creative Spirit Island team name.',
            'Use only the setup context below.',
            `Spirits:\n${spiritLines}`,
            `Adversary: ${adversaryLine}`,
            'Return plain text only with exactly one team name.',
            'No quotes, no markdown, max 6 words.'
        ].join('\n\n')

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_AI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    generationConfig: {
                        temperature: 0.9
                    },
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: prompt }]
                        }
                    ]
                })
            }
        )

        if (!response.ok) {
            const errText = await response.text()
            throw new Error(`Google AI request failed: ${response.status} ${errText}`)
        }

        const data = await response.json()
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
        const firstLine = String(rawText).split('\n').find((line) => line.trim().length > 0) ?? ''
        const cleaned = firstLine.replace(/^["']|["']$/g, '').trim()
        if (!cleaned) throw new Error('AI returned an empty team name.')
        return cleaned.slice(0, 80)
    }

    const startGameFromWizard = async () => {
        const validationError = validateGameStep(4)
        if (validationError) {
            setGameError(validationError)
            return
        }

        setIsStartingGame(true)
        setGameError('')

        let resolvedTeamName = gameTeamName.trim()
        if (!resolvedTeamName) {
            try {
                resolvedTeamName = await generateTeamNameFromSetup()
                setGameTeamName(resolvedTeamName)
            } catch (error) {
                setGameError(
                    error instanceof Error ? error.message : 'Failed to generate a team name.'
                )
                setIsStartingGame(false)
                return
            }
        }

        const gameId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        const newGame: GameRecord = {
            id: gameId,
            createdAt: new Date().toISOString(),
            teamName: resolvedTeamName,
            boardSide: gameBoardSide,
            players: gamePlayers,
            candidateCount: gameCandidateCount,
            selections: gameSelections,
            adversary: gameAdversary,
            adversaryLevel: gameAdversaryLevel,
            score: null
        }

        setGames((prev) => [newGame, ...prev])
        setSelectedGameId(gameId)
        setGamesScreen('detail')
        setIsStartingGame(false)
    }

    const openGameDetail = (gameId: string) => {
        setSelectedGameId(gameId)
        setGamesScreen('detail')
    }

    const openScoring = () => {
        if (!selectedGame) return
        setScoreOutcome('Victory')
        setScoreDifficulty(
            (selectedGame.adversaryLevel ?? 0) +
                getBoardDifficultyModifier(selectedGame.boardSide ?? 'Balanced')
        )
        setScoreInvaderRemaining(0)
        setScoreInvaderNotInDeck(0)
        setScoreLivingDahan(0)
        setScoreBlight(0)
        setGamesScreen('scoring')
    }

    const scoreGame = () => {
        if (!selectedGame) return

        const dahanPoints = Math.floor(scoreLivingDahan / Math.max(1, selectedGame.players))
        const blightPenalty = Math.floor(scoreBlight / Math.max(1, selectedGame.players))
        const total =
            scoreOutcome === 'Victory'
                ? 5 * scoreDifficulty + 10 + 2 * scoreInvaderRemaining + dahanPoints - blightPenalty
                : 2 * scoreDifficulty + scoreInvaderNotInDeck + dahanPoints - blightPenalty

        const score: GameScore = {
            outcome: scoreOutcome,
            difficulty: scoreDifficulty,
            invaderCardsRemaining: scoreInvaderRemaining,
            invaderCardsNotInDeck: scoreInvaderNotInDeck,
            livingDahan: scoreLivingDahan,
            blightOnIsland: scoreBlight,
            total,
            breakdown:
                scoreOutcome === 'Victory'
                    ? `5*difficulty + 10 + 2*remaining + floor(dahan/players) - floor(blight/players) [board: ${selectedGame.boardSide}, modifier: +${getBoardDifficultyModifier(selectedGame.boardSide)}]`
                    : `2*difficulty + notInDeck + floor(dahan/players) - floor(blight/players) [board: ${selectedGame.boardSide}, modifier: +${getBoardDifficultyModifier(selectedGame.boardSide)}]`,
            scoredAt: new Date().toISOString()
        }

        setGames((prev) => prev.map((game) => (game.id === selectedGame.id ? { ...game, score } : game)))
        setGamesScreen('detail')
    }

    const downloadGameDetailImage = async (game: GameRecord) => {
        if (isDownloadingGameImage) return
        const target = gameDetailExportRef.current
        if (!target) {
            setGameError('Game detail is not ready to export yet.')
            return
        }

        setIsDownloadingGameImage(true)
        setIsExportingGameImage(true)
        cancelEditPlayerName()

        try {
            await new Promise<void>((resolve) =>
                requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
            )
            const cleanupArtifacts = () => {
                document
                    .querySelectorAll('.html2canvas-container')
                    .forEach((node) => node.parentNode?.removeChild(node))
            }
            const waitForImages = async (root: HTMLElement) => {
                const images = Array.from(root.querySelectorAll('img'))
                await Promise.all(
                    images.map(
                        (img) =>
                            new Promise<void>((resolve) => {
                                if (img.complete) {
                                    resolve()
                                    return
                                }
                                const done = () => resolve()
                                img.addEventListener('load', done, { once: true })
                                img.addEventListener('error', done, { once: true })
                            })
                    )
                )
            }

            const loadHtml2Canvas = async () => {
                type Html2CanvasFn = (
                    element: HTMLElement,
                    options?: Record<string, unknown>
                ) => Promise<HTMLCanvasElement>
                const win = window as Window & { html2canvas?: Html2CanvasFn }
                if (win.html2canvas) return win.html2canvas

                const scriptId = 'html2canvas-cdn-loader'
                let script = document.getElementById(scriptId) as HTMLScriptElement | null
                if (!script) {
                    script = document.createElement('script')
                    script.id = scriptId
                    script.src =
                        'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'
                    script.async = true
                    document.head.appendChild(script)
                }

                await Promise.race([
                    new Promise<void>((resolve, reject) => {
                        script?.addEventListener('load', () => resolve(), { once: true })
                        script?.addEventListener(
                            'error',
                            () => reject(new Error('Failed to load export library.')),
                            { once: true }
                        )
                    }),
                    new Promise<void>((_, reject) =>
                        setTimeout(
                            () => reject(new Error('Timed out loading export library.')),
                            10000
                        )
                    )
                ])

                if (!win.html2canvas) {
                    throw new Error('Export library is unavailable.')
                }
                return win.html2canvas
            }

            await waitForImages(target)
            const html2canvas = await loadHtml2Canvas()

            const exportHost = document.createElement('div')
            exportHost.id = 'game-detail-export-host'
            exportHost.style.position = 'fixed'
            exportHost.style.left = '-100000px'
            exportHost.style.top = '0'
            exportHost.style.opacity = '1'
            exportHost.style.pointerEvents = 'none'
            exportHost.style.background = '#020617'
            exportHost.style.padding = '28px'
            exportHost.style.margin = '0'
            exportHost.style.zIndex = '-1'

            const exportNode = target.cloneNode(true) as HTMLElement
            exportNode.style.width = `${Math.ceil(target.getBoundingClientRect().width)}px`

            const inlineStyles = (source: Element, destination: Element) => {
                if (!(source instanceof HTMLElement) || !(destination instanceof HTMLElement)) return
                const computed = window.getComputedStyle(source)
                const styleText = Array.from(computed)
                    .filter((prop) => !prop.startsWith('--'))
                    .map((prop) => `${prop}:${computed.getPropertyValue(prop)};`)
                    .filter(
                        (decl) =>
                            !/oklch\(|oklab\(|\blab\(|\blch\(|color-mix\(|rgb\(from|in oklab|in lab|in lch/i.test(
                                decl
                            )
                    )
                    .join('')
                destination.setAttribute('style', styleText)

                const sourceChildren = Array.from(source.children)
                const destinationChildren = Array.from(destination.children)
                for (let i = 0; i < sourceChildren.length; i++) {
                    inlineStyles(sourceChildren[i], destinationChildren[i])
                }
            }
            inlineStyles(target, exportNode)

            // Prevent html2canvas from parsing class-based styles that may contain unsupported
            // modern color functions (e.g. oklch) after we've already inlined computed styles.
            Array.from(exportNode.querySelectorAll('*')).forEach((node) => {
                if (node instanceof HTMLElement) {
                    node.removeAttribute('class')
                }
            })
            exportNode.removeAttribute('class')

            exportNode.querySelectorAll('[data-export-hide="true"]').forEach((el) => el.remove())
            exportHost.appendChild(exportNode)
            document.body.appendChild(exportHost)

            await waitForImages(exportHost)
            cleanupArtifacts()
            const canvas = (await Promise.race([
                html2canvas(exportHost, {
                    backgroundColor: '#020617',
                    scale: 2,
                    useCORS: true,
                    foreignObjectRendering: false,
                    logging: false,
                    width: exportHost.scrollWidth,
                    height: exportHost.scrollHeight
                }),
                new Promise<HTMLCanvasElement>((_, reject) =>
                    setTimeout(
                        () => reject(new Error('Export timed out while rendering image.')),
                        15000
                    )
                )
            ])) as HTMLCanvasElement
            cleanupArtifacts()
            if (exportHost.parentNode) {
                document.body.removeChild(exportHost)
            }

            const link = document.createElement('a')
            const slug = (game.teamName || 'spirit-island-game')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
            link.download = `${slug || 'spirit-island-game'}-${new Date(game.createdAt)
                .toISOString()
                .slice(0, 10)}.png`
            link.href = canvas.toDataURL('image/png')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Failed to generate game detail image.'
            setGameError(message)
            window.alert(message)
        } finally {
            document
                .querySelectorAll('.html2canvas-container')
                .forEach((node) => node.parentNode?.removeChild(node))
            document.getElementById('game-detail-export-host')?.remove()
            setIsExportingGameImage(false)
            setIsDownloadingGameImage(false)
        }
    }

    const updateGamePlayers = (count: number) => {
        const safeCount = Math.max(1, count)
        setGamePlayers(safeCount)
        setGameCurrentPlayer((prev) => Math.min(prev, safeCount))
        setGameSelections((prev) => {
            const next: GamePlayerSelection[] = []
            for (let i = 1; i <= safeCount; i++) {
                next.push(
                    prev[i - 1] ?? {
                        player: i,
                        playerName: getDefaultPlayerName(i),
                        spirit: null,
                        aspect: null
                    }
                )
            }
            return next
        })
    }

    const pickRandomSpirits = (count: number): SpiritWithAspects[] => {
        const pickedIds = new Set(gameSelections.map((s) => s.spirit?.id).filter(Boolean))
        const pool = filteredSpirits.filter((s) => !pickedIds.has(s.id))
        if (pool.length === 0) return []

        const shuffled = [...pool].sort(() => Math.random() - 0.5)
        return shuffled.slice(0, Math.min(count, shuffled.length))
    }

    const drawGameCandidates = (forPlayer = gameCurrentPlayer) => {
        const targetPlayer = typeof forPlayer === 'number' ? forPlayer : gameCurrentPlayer
        setGameCurrentPlayer(targetPlayer)
        const candidates = pickRandomSpirits(gameCandidateCount)
        setGameCandidates(candidates)
        const current = gameSelections.find((s) => s.player === targetPlayer)
        const nextAspects: Record<string, string | null> = {}
        candidates.forEach((candidate) => {
            nextAspects[candidate.id] =
                current?.spirit?.id === candidate.id ? (current.aspect ?? null) : null
        })
        setGameCandidateAspects(nextAspects)
        setShowGameCandidateModal(true)
        setGameError(
            candidates.length > 0
                ? ''
                : 'No spirit candidates are available with current filters and taken spirits.'
        )
    }

    const updatePlayerSelection = (
        player: number,
        spirit: SpiritWithAspects | null,
        aspect: string | null
    ) => {
        setGameSelections((prev) =>
            prev.map((entry) =>
                entry.player === player
                    ? {
                          ...entry,
                          spirit,
                          aspect
                      }
                    : entry
            )
        )
    }

    const confirmGameCandidateSelection = (candidate: SpiritWithAspects) => {
        const currentBefore = gameSelections.find((s) => s.player === gameCurrentPlayer)
        const hadSelectionBefore = !!currentBefore?.spirit
        updatePlayerSelection(gameCurrentPlayer, candidate, gameCandidateAspects[candidate.id] ?? null)
        setShowGameCandidateModal(false)
        setGameCandidates([])
        if (!hadSelectionBefore && gameCurrentPlayer < gamePlayers) {
            setGameCurrentPlayer((prev) => prev + 1)
        }
    }

    const openGameSpiritPicker = (player: number) => {
        setGameSpiritPickerPlayer(player)
        setGameCurrentPlayer(player)
        const current = gameSelections.find((s) => s.player === player)
        const aspects: Record<string, string | null> = {}
        filteredSpirits.forEach((spirit) => {
            aspects[spirit.id] =
                current?.spirit?.id === spirit.id ? (current.aspect ?? null) : null
        })
        setGameSpiritPickerAspects(aspects)
        setGameSpiritSearch('')
        setShowGameSpiritPickerModal(true)
    }

    const confirmGameSpiritPickerSelection = (spirit: SpiritWithAspects) => {
        const player = gameSpiritPickerPlayer ?? gameCurrentPlayer
        setGameCurrentPlayer(player)
        updatePlayerSelection(player, spirit, gameSpiritPickerAspects[spirit.id] ?? null)
        setShowGameSpiritPickerModal(false)
    }

    const gameCandidateDisplayList = useMemo(() => {
        const pickedIds = new Set(gameSelections.map((selection) => selection.spirit?.id).filter(Boolean))
        return gameCandidates.filter((candidate) => !pickedIds.has(candidate.id))
    }, [gameCandidates, gameSelections])

    const skipAdversaryStep = () => {
        setGameAdversary(null)
        setGameAdversaryLevel(null)
        setGameError('')
        setGameStep(4)
    }

    const selectGameAdversary = (adversary: Adversary) => {
        setGameAdversary(adversary)
        setGameAdversaryLevel(null)
        setShowGameAdversaryPickerModal(false)
    }

    const pickSpiritCompositionForTeam = async () => {
        if (filteredSpirits.length === 0) {
            setGameError('No available spirits with current filters.')
            return
        }

        setIsAiComposing(true)
        setGameError('')

        try {
            const spiritNames = filteredSpirits.map((spirit) => spirit.name)
            const prompt = [
                'Recommend a Spirit Island team composition.',
                `Team name: ${gameTeamName.trim() || 'No team name provided'}`,
                `Number of players: ${gamePlayers}`,
                `Available spirits: ${spiritNames.join(', ')}`,
                'Return strict JSON only in this shape:',
                '{"spirits":[{"name":"Spirit Name","reason":"short reason"}]}',
                `Choose exactly ${gamePlayers} unique spirits from the available list only.`
            ].join('\n')

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_AI_API_KEY}`,
                {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    generationConfig: {
                        temperature: 0.7
                    },
                    contents: [
                        {
                            role: 'user',
                            parts: [
                                {
                                    text:
                                        'You are a Spirit Island strategist. Always return strict JSON only.\n\n' +
                                        prompt
                                }
                            ]
                        }
                    ]
                })
            })

            if (!response.ok) {
                const errText = await response.text()
                throw new Error(`Google AI request failed: ${response.status} ${errText}`)
            }

            const data = await response.json()
            const content: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
            const match = content.match(/\{[\s\S]*\}/)
            const parsed = JSON.parse(match ? match[0] : content)
            const suggestedNames: string[] = Array.isArray(parsed?.spirits)
                ? parsed.spirits.map((s: { name?: string }) => s?.name).filter(Boolean)
                : []

            const byName = new Map(filteredSpirits.map((spirit) => [spirit.name.toLowerCase(), spirit]))
            const picked: SpiritWithAspects[] = []
            for (const name of suggestedNames) {
                const spirit = byName.get(String(name).toLowerCase())
                if (spirit && !picked.some((p) => p.id === spirit.id)) {
                    picked.push(spirit)
                }
            }

            for (const spirit of filteredSpirits) {
                if (picked.length >= gamePlayers) break
                if (!picked.some((p) => p.id === spirit.id)) {
                    picked.push(spirit)
                }
            }

            setGameSelections((prev) =>
                prev.map((entry, idx) => ({
                    ...entry,
                    spirit: picked[idx] ?? entry.spirit ?? null,
                    aspect: entry.aspect ?? null
                }))
            )
        } catch (error) {
            setGameError(
                error instanceof Error
                    ? error.message
                    : 'Failed to get AI spirit composition.'
            )
        } finally {
            setIsAiComposing(false)
        }
    }

    const validateGameStep = (step: number): string | null => {
        if (step === 1) {
            if (gamePlayers < 1) return 'Number of players must be at least 1.'
            if (gameCandidateCount < 1) return 'Spirit candidate count must be at least 1.'
        }

        if (step === 2) {
            const missing = gameSelections.find((selection) => !selection.spirit)
            if (missing) return `Player ${missing.player} has not selected a spirit yet.`
        }

        if (step === 3) {
            if (gameAdversary && gameAdversaryLevel === null) {
                return 'Select an adversary level or clear the adversary.'
            }
        }

        return null
    }

    const nextGameStep = () => {
        const validationError = validateGameStep(gameStep)
        if (validationError) {
            setGameError(validationError)
            return
        }

        setGameError('')
        setGameStep((prev) => Math.min(4, prev + 1))
    }

    const previousGameStep = () => {
        setGameError('')
        setGameStep((prev) => Math.max(1, prev - 1))
    }

    return (
        <div className='max-w-4xl mx-auto px-4 py-8 pb-28 md:py-12 md:pb-32 font-sans antialiased'>
            {/* Header */}
            <header className='text-center mb-10'>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-4xl md:text-5xl font-bold tracking-tight text-primary mb-3'>
                    Spirit Island Game Companion
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className='text-slate-400 text-lg'>
                    Where storms whisper, roots awaken, and legends gather at your table.
                </motion.p>
            </header>

            <main className='space-y-8'>
                {activeTab === 'spirits' && (
                    <>
                        {/* Filters Section */}
                        <motion.section
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className='glass-panel p-6 rounded-2xl shadow-xl space-y-8'>
                            {/* Difficulty */}
                            <div className='space-y-4'>
                                <label className='block text-xs font-bold uppercase tracking-widest text-slate-400'>
                                    Difficulty
                                </label>
                                <div className='flex flex-wrap gap-3'>
                                    {DIFFICULTIES.map((diff) => (
                                        <button
                                            key={diff}
                                            onClick={() => toggleDifficulty(diff)}
                                            className={`px-5 py-2 rounded-full border transition-all text-sm font-medium ${
                                                selectedDifficulties.includes(diff)
                                                    ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(19,146,236,0.4)]'
                                                    : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-primary/10 hover:border-primary/50'
                                            }`}>
                                            {diff}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Expansions */}
                            <div className='space-y-4'>
                                <label className='block text-xs font-bold uppercase tracking-widest text-slate-400'>
                                    Expansions
                                </label>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                                    {EXPANSIONS.map((exp) => (
                                        <label
                                            key={exp}
                                            className='flex items-center space-x-3 cursor-pointer group'>
                                            <div className='relative flex items-center justify-center'>
                                                <input
                                                    type='checkbox'
                                                    checked={selectedExpansions.includes(exp)}
                                                    onChange={() => toggleExpansion(exp)}
                                                    className='peer appearance-none w-5 h-5 rounded border border-slate-700 bg-slate-800 checked:bg-primary checked:border-primary transition-all cursor-pointer'
                                                />
                                                <Check className='absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none' />
                                            </div>
                                            <span
                                                className={`text-sm transition-colors ${
                                                    selectedExpansions.includes(exp)
                                                        ? 'text-slate-100'
                                                        : 'text-slate-400 group-hover:text-slate-200'
                                                }`}>
                                                {exp}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Filter Footer */}
                            <div className='pt-6 border-t border-slate-700/50 flex flex-col sm:flex-row justify-between items-center gap-4'>
                                <div className='text-slate-400 text-sm font-medium flex items-center gap-2'>
                                    <span className='text-primary font-bold'>
                                        {filteredSpirits.length}
                                    </span>
                                    Spirits matching filters
                                </div>
                                <button
                                    onClick={clearFilters}
                                    className='text-slate-500 hover:text-slate-200 text-sm flex items-center gap-1.5 transition-colors'>
                                    <RotateCcw size={14} />
                                    Clear Filters
                                </button>
                            </div>
                        </motion.section>

                        {/* Primary Action */}
                        <div className='text-center'>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={pickSpirit}
                                disabled={filteredSpirits.length === 0}
                                className='w-full md:w-auto px-16 py-6 bg-primary hover:bg-blue-500 text-white rounded-2xl text-2xl font-bold shadow-[0_0_30px_rgba(19,146,236,0.3)] transition-all flex items-center justify-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'>
                                <Sparkles size={28} />
                                Draw a Spirit
                            </motion.button>
                            <button
                                onClick={() => setShowSpiritHistoryModal(true)}
                                className='mt-3 text-sm text-slate-400 hover:text-primary underline underline-offset-4 transition-colors'>
                                Display draw history
                            </button>
                            {filteredSpirits.length === 0 && (
                                <p className='mt-4 text-rose-400 text-sm'>
                                    Please select at least one expansion and difficulty.
                                </p>
                            )}
                        </div>

                        {/* Spirit List */}
                        <section className='space-y-4'>
                            <div className='glass-panel p-5 rounded-2xl border border-slate-700/60 space-y-4'>
                                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                                    <h2 className='text-lg font-bold text-slate-100'>Spirit List</h2>
                                    <div className='flex items-center gap-2'>
                                        <select
                                            value={spiritsSort}
                                            onChange={(e) =>
                                                setSpiritsSort(
                                                    e.target.value as
                                                        | 'name-asc'
                                                        | 'name-desc'
                                                        | 'difficulty-asc'
                                                        | 'difficulty-desc'
                                                )
                                            }
                                            className='bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100'>
                                            <option value='name-asc'>Name A-Z</option>
                                            <option value='name-desc'>Name Z-A</option>
                                            <option value='difficulty-asc'>Difficulty ↑</option>
                                            <option value='difficulty-desc'>Difficulty ↓</option>
                                        </select>
                                    </div>
                                </div>
                                <p className='text-sm text-slate-400'>
                                    {sortedFilteredSpirits.length} spirits match current filters.
                                </p>

                                <div className='max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar'>
                                    {sortedFilteredSpirits.length > 0 ? (
                                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                                            {sortedFilteredSpirits.map((spirit) => (
                                                <div
                                                    key={spirit.id}
                                                    className='rounded-2xl border border-slate-700/70 overflow-hidden bg-slate-900/40'>
                                                    <SpiritDisplayCard
                                                        spirit={spirit}
                                                        selectedAspect={null}
                                                        titleSize='small'
                                                        showViewPlayCard={hasLocalPlayCardForSpirit(spirit)}
                                                        onViewPlayCard={() => openSpiritPlayCardModal(spirit)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className='text-slate-500 text-center py-8 border border-dashed border-slate-700 rounded-xl'>
                                            No spirits match current filters.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>
                    </>
                )}

                {activeTab === 'adversary' && (
                    <>
                        <motion.section
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className='glass-panel p-6 rounded-2xl shadow-xl space-y-6'>
                            <div className='space-y-4'>
                                <label className='block text-xs font-bold uppercase tracking-widest text-slate-400'>
                                    Expansions
                                </label>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                                    {EXPANSIONS.map((exp) => (
                                        <label
                                            key={exp}
                                            className='flex items-center space-x-3 cursor-pointer group'>
                                            <div className='relative flex items-center justify-center'>
                                                <input
                                                    type='checkbox'
                                                    checked={selectedExpansions.includes(exp)}
                                                    onChange={() => toggleExpansion(exp)}
                                                    className='peer appearance-none w-5 h-5 rounded border border-slate-700 bg-slate-800 checked:bg-primary checked:border-primary transition-all cursor-pointer'
                                                />
                                                <Check className='absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none' />
                                            </div>
                                            <span
                                                className={`text-sm transition-colors ${
                                                    selectedExpansions.includes(exp)
                                                        ? 'text-slate-100'
                                                        : 'text-slate-400 group-hover:text-slate-200'
                                                }`}>
                                                {exp}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className='pt-4 border-t border-slate-700/50 flex justify-between items-center gap-4'>
                                <div className='text-slate-400 text-sm font-medium'>
                                    <span className='text-primary font-bold'>
                                        {filteredAdversaries.length}
                                    </span>{' '}
                                    Adversaries available
                                </div>
                                <button
                                    onClick={clearFilters}
                                    className='text-slate-500 hover:text-slate-200 text-sm flex items-center gap-1.5 transition-colors'>
                                    <RotateCcw size={14} />
                                    Clear Filters
                                </button>
                            </div>
                        </motion.section>

                        {/* Adversary Picker */}
                        <section className='glass-panel p-6 rounded-2xl shadow-xl space-y-5'>
                            <div>
                                <h2 className='text-xl font-bold text-slate-100 flex items-center gap-2'>
                                    <Shield className='text-primary' size={20} />
                                    Random Adversary
                                </h2>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={pickAdversary}
                                disabled={filteredAdversaries.length === 0}
                                className='w-full md:w-auto px-16 py-6 bg-primary hover:bg-blue-500 text-white rounded-2xl text-2xl font-bold shadow-[0_0_30px_rgba(19,146,236,0.3)] transition-all flex items-center justify-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'>
                                <Shield size={26} />
                                Pick an Adversary
                            </motion.button>

                            {pickedAdversary && (
                                <div className='rounded-xl border border-primary/30 bg-slate-900/70 p-4'>
                                    <h3 className='text-lg font-bold text-slate-100'>
                                        {pickedAdversary.name}
                                    </h3>
                                    <div className='mt-2 flex flex-wrap gap-2'>
                                        <span className='px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-widest'>
                                            Difficulty {pickedAdversary.difficultyRange}
                                        </span>
                                        <span className='px-3 py-1 border border-slate-600 text-slate-300 text-xs font-semibold rounded-full'>
                                            {pickedAdversary.expansion}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className='space-y-3'>
                                <div className='flex justify-between items-center'>
                                    <h3 className='text-sm font-bold uppercase tracking-widest text-slate-400'>
                                        Adversary History
                                    </h3>
                                    <button
                                        onClick={clearAdversaryHistory}
                                        className='text-slate-500 hover:text-rose-400 text-xs uppercase tracking-widest font-bold transition-colors'>
                                        Clear History
                                    </button>
                                </div>
                                <div className='space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1'>
                                    <AnimatePresence initial={false}>
                                        {adversaryHistory.length > 0 ? (
                                            adversaryHistory.map((item, idx) => (
                                                <motion.div
                                                    key={`${item.id}-${idx}`}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className='rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-3'>
                                                    <div className='flex justify-between items-start gap-3'>
                                                        <h4 className='font-semibold text-slate-100'>
                                                            {item.name}
                                                        </h4>
                                                        <span className='text-[10px] text-slate-500 uppercase font-mono bg-slate-800 px-2 py-0.5 rounded'>
                                                            {item.timestamp}
                                                        </span>
                                                    </div>
                                                    <p className='mt-1 text-xs text-slate-400'>
                                                        Difficulty {item.difficultyRange} •{' '}
                                                        {item.expansion}
                                                    </p>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className='text-slate-600 text-center py-6 italic border border-dashed border-slate-800 rounded-xl'>
                                                Adversary picks will appear here...
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </section>
                    </>
                )}

                {activeTab === 'games' && (
                    <>
                        {gamesScreen === 'landing' && (
                            <section className='space-y-6'>
                                <section className='glass-panel p-8 rounded-2xl shadow-xl text-center space-y-5'>
                                    <h2 className='text-2xl font-bold text-slate-100'>Games</h2>
                                    <p className='text-slate-400'>
                                        Start a new game setup wizard or open a saved game.
                                    </p>
                                    <button
                                        onClick={startGameWizard}
                                        className='w-full md:w-auto px-16 py-6 bg-primary hover:bg-blue-500 text-white rounded-2xl text-2xl font-bold shadow-[0_0_30px_rgba(19,146,236,0.3)] transition-all inline-flex items-center justify-center gap-3'>
                                        <Swords size={26} />
                                        Start a Game
                                    </button>
                                </section>

                                <section className='space-y-3'>
                                    <div className='flex flex-wrap items-center justify-between gap-3'>
                                        <h3 className='text-lg font-bold text-slate-100'>Saved Games</h3>
                                        <label className='flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-slate-400'>
                                            Sort
                                            <select
                                                value={gamesSortBy}
                                                onChange={(e) =>
                                                    setGamesSortBy(e.target.value as 'date' | 'score')
                                                }
                                                className='picker-select bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 normal-case tracking-normal font-medium'>
                                                <option value='date'>Date</option>
                                                <option value='score'>Score</option>
                                            </select>
                                        </label>
                                    </div>
                                    {sortedGames.length > 0 ? (
                                        sortedGames.map((game) => (
                                            <button
                                                key={game.id}
                                                onClick={() => openGameDetail(game.id)}
                                                className='w-full text-left glass-panel rounded-xl p-4 border border-slate-700/70 hover:border-primary/40 transition-colors'>
                                                <div className='flex items-start justify-between gap-4'>
                                                    <div className='min-w-0 flex-1'>
                                                        <p className='text-slate-100 font-semibold'>
                                                            {new Date(game.createdAt).toLocaleString()}
                                                        </p>
                                                        {game.teamName && (
                                                            <p className='text-sm text-primary mt-1 font-semibold'>
                                                                Team: {game.teamName}
                                                            </p>
                                                        )}
                                                        <p className='text-sm text-slate-400 mt-1'>
                                                            {game.players} players •{' '}
                                                            {game.adversary
                                                                ? `${game.adversary.name} L${game.adversaryLevel ?? 0}`
                                                                : 'No adversary'}
                                                        </p>
                                                        <p className='text-sm text-slate-500 mt-1'>
                                                            Board: {game.boardSide ?? 'Balanced'}
                                                        </p>
                                                        <p className='text-sm text-slate-500 mt-1'>
                                                            Spirits:{' '}
                                                            {game.selections
                                                                .map((selection) => selection.spirit?.name)
                                                                .filter(Boolean)
                                                                .join(', ')}
                                                        </p>
                                                    </div>
                                                    <ScoreBadge score={game.score?.total} />
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <p className='text-slate-500 italic'>
                                            No saved games yet. Start one.
                                        </p>
                                    )}
                                </section>
                            </section>
                        )}

                        {gamesScreen === 'detail' && selectedGame && (
                            <section className='space-y-6'>
                                <div className='flex items-center justify-between gap-3'>
                                    <button
                                        onClick={openGamesLanding}
                                        className='px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:border-slate-400 text-sm'>
                                        Back to Games
                                    </button>
                                    <div className='flex items-center gap-2'>
                                        <button
                                            onClick={() => downloadGameDetailImage(selectedGame)}
                                            disabled={isDownloadingGameImage}
                                            className='px-3 py-2 rounded-lg border border-primary/50 text-slate-100 hover:bg-primary/10 disabled:opacity-50'
                                            aria-label='Share game result as image'
                                            title='Download game result image'>
                                            <Share2 size={16} />
                                        </button>
                                        <button
                                            onClick={openScoring}
                                            className='px-5 py-2 rounded-lg bg-primary hover:bg-blue-500 text-white font-semibold text-sm'>
                                            Score the game
                                        </button>
                                    </div>
                                </div>

                                <div ref={gameDetailExportRef} className='space-y-6'>
                                <section className='glass-panel p-6 rounded-2xl shadow-xl space-y-4'>
                                    <div className='flex items-start justify-between gap-4'>
                                        <div className='min-w-0 flex-1'>
                                            <h2 className='text-xl font-bold text-slate-100'>
                                                Team: {selectedGame.teamName || 'Untitled Team'}
                                            </h2>
                                            <p className='text-sm text-slate-400 mt-1'>
                                                Created {new Date(selectedGame.createdAt).toLocaleString()}
                                            </p>
                                            {selectedGame.score && (
                                                <p className='text-xs text-slate-500 mt-1'>
                                                    {selectedGame.score.breakdown}
                                                </p>
                                            )}
                                        </div>
                                        <ScoreBadge
                                            score={selectedGame.score?.total}
                                            valueClassName='text-4xl'
                                        />
                                    </div>
                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                                        <div className='rounded-xl border border-slate-700 bg-slate-900/40 p-4'>
                                            <p className='text-slate-400 uppercase text-xs tracking-widest font-bold'>
                                                Players
                                            </p>
                                            <p className='text-slate-100 mt-2'>{selectedGame.players}</p>
                                        </div>
                                        <div className='rounded-xl border border-slate-700 bg-slate-900/40 p-4'>
                                            <p className='text-slate-400 uppercase text-xs tracking-widest font-bold'>
                                                Candidates Per Pick
                                            </p>
                                            <p className='text-slate-100 mt-2'>
                                                {selectedGame.candidateCount}
                                            </p>
                                        </div>
                                        <div className='rounded-xl border border-slate-700 bg-slate-900/40 p-4'>
                                            <p className='text-slate-400 uppercase text-xs tracking-widest font-bold'>
                                                Board Side
                                            </p>
                                            <p className='text-slate-100 mt-2'>{selectedGame.boardSide}</p>
                                        </div>
                                    </div>
                                </section>

                                <section className='space-y-3'>
                                    <h3 className='text-lg font-bold text-slate-100'>Players</h3>
                                    {selectedGame.selections.map((selection) => (
                                        <div
                                            key={selection.player}
                                            className='glass-panel rounded-xl p-4 border border-slate-700/70'>
                                            <div className='mb-3'>
                                                {!isExportingGameImage &&
                                                editingPlayerNameId === selection.player ? (
                                                    <input
                                                        type='text'
                                                        autoFocus
                                                        value={editingPlayerNameValue}
                                                        onFocus={(e) => e.currentTarget.select()}
                                                        onChange={(e) =>
                                                            setEditingPlayerNameValue(e.target.value)
                                                        }
                                                        onBlur={() =>
                                                            saveSelectedGamePlayerName(
                                                                selection.player
                                                            )
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                saveSelectedGamePlayerName(
                                                                    selection.player
                                                                )
                                                            } else if (e.key === 'Escape') {
                                                                cancelEditPlayerName()
                                                            }
                                                        }}
                                                        className='w-full max-w-xs rounded-lg border border-slate-600 bg-slate-900 px-3 py-1.5 text-sm font-bold text-slate-100'
                                                    />
                                                ) : (
                                                    <div className='flex items-center gap-2'>
                                                        <p className='text-sm font-bold text-slate-200'>
                                                            {selection.playerName ||
                                                                getDefaultPlayerName(
                                                                    selection.player
                                                                )}
                                                        </p>
                                                        <button
                                                            onClick={() =>
                                                                beginEditPlayerName(selection)
                                                            }
                                                            data-export-hide='true'
                                                            className='text-slate-400 hover:text-slate-200 transition-colors'
                                                            aria-label={`Edit ${selection.playerName || getDefaultPlayerName(selection.player)} name`}>
                                                            <Pencil size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {selection.spirit ? (
                                                <button
                                                    type='button'
                                                    onClick={() => {
                                                        if (hasLocalPlayCardForSpirit(selection.spirit!)) {
                                                            openSpiritPlayCardModal(selection.spirit!)
                                                        }
                                                    }}
                                                    disabled={!hasLocalPlayCardForSpirit(selection.spirit)}
                                                    className='w-full text-left enabled:cursor-pointer disabled:cursor-default'>
                                                    <SpiritDisplayCard
                                                        spirit={selection.spirit}
                                                        selectedAspect={selection.aspect}
                                                        compact
                                                    />
                                                </button>
                                            ) : (
                                                <p className='text-sm text-slate-500 italic'>Not selected</p>
                                            )}
                                        </div>
                                    ))}
                                </section>

                                <section className='glass-panel p-5 rounded-xl border border-slate-700/70'>
                                    <h3 className='text-sm font-bold uppercase tracking-widest text-slate-400'>
                                        Adversary
                                    </h3>
                                    <p className='text-slate-200 mt-2'>
                                        {selectedGame.adversary
                                            ? `${selectedGame.adversary.name} • Level ${selectedGame.adversaryLevel ?? 0}`
                                            : 'None'}
                                    </p>
                                </section>
                                </div>
                            </section>
                        )}

                        {gamesScreen === 'scoring' && selectedGame && (
                            <section className='space-y-5'>
                                <div className='flex items-center justify-between gap-3'>
                                    <button
                                        onClick={() => setGamesScreen('detail')}
                                        className='px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:border-slate-400 text-sm'>
                                        Back
                                    </button>
                                </div>
                                <section className='glass-panel p-6 rounded-2xl shadow-xl space-y-4'>
                                    <h2 className='text-xl font-bold text-slate-100'>Score the Game</h2>
                                    <p className='text-sm text-slate-400'>
                                        Scoring uses Spirit Island&apos;s end-game score formula.
                                    </p>
                                    <p className='text-xs text-slate-500'>
                                        Difficulty starts at adversary level +
                                        {' '}
                                        {getBoardDifficultyModifier(selectedGame.boardSide)} from
                                        {' '}
                                        {selectedGame.boardSide} board side.
                                    </p>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <label className='space-y-2'>
                                            <span className='text-xs uppercase tracking-widest font-bold text-slate-400'>
                                                Outcome
                                            </span>
                                            <select
                                                value={scoreOutcome}
                                                onChange={(e) =>
                                                    setScoreOutcome(
                                                        e.target.value as 'Victory' | 'Defeat'
                                                    )
                                                }
                                                className='picker-select w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100'>
                                                <option value='Victory'>Victory</option>
                                                <option value='Defeat'>Defeat</option>
                                            </select>
                                        </label>
                                        <label className='space-y-2'>
                                            <span className='text-xs uppercase tracking-widest font-bold text-slate-400'>
                                                Difficulty
                                            </span>
                                            <input
                                                type='number'
                                                min={0}
                                                value={scoreDifficulty}
                                                onFocus={(e) => e.currentTarget.select()}
                                                onChange={(e) =>
                                                    setScoreDifficulty(
                                                        Number.parseInt(e.target.value || '0', 10)
                                                    )
                                                }
                                                className='w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100'
                                            />
                                        </label>
                                        {scoreOutcome === 'Victory' ? (
                                            <label className='space-y-2'>
                                                <span className='text-xs uppercase tracking-widest font-bold text-slate-400'>
                                                    Invader Cards Remaining
                                                </span>
                                                <input
                                                    type='number'
                                                    min={0}
                                                    value={scoreInvaderRemaining}
                                                    onFocus={(e) => e.currentTarget.select()}
                                                    onChange={(e) =>
                                                        setScoreInvaderRemaining(
                                                            Number.parseInt(e.target.value || '0', 10)
                                                        )
                                                    }
                                                    className='w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100'
                                                />
                                            </label>
                                        ) : (
                                            <label className='space-y-2'>
                                                <span className='text-xs uppercase tracking-widest font-bold text-slate-400'>
                                                    Invader Cards Not In Deck
                                                </span>
                                                <input
                                                    type='number'
                                                    min={0}
                                                    value={scoreInvaderNotInDeck}
                                                    onFocus={(e) => e.currentTarget.select()}
                                                    onChange={(e) =>
                                                        setScoreInvaderNotInDeck(
                                                            Number.parseInt(e.target.value || '0', 10)
                                                        )
                                                    }
                                                    className='w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100'
                                                />
                                            </label>
                                        )}
                                        <label className='space-y-2'>
                                            <span className='text-xs uppercase tracking-widest font-bold text-slate-400'>
                                                Living Dahan
                                            </span>
                                            <input
                                                type='number'
                                                min={0}
                                                value={scoreLivingDahan}
                                                onFocus={(e) => e.currentTarget.select()}
                                                onChange={(e) =>
                                                    setScoreLivingDahan(
                                                        Number.parseInt(e.target.value || '0', 10)
                                                    )
                                                }
                                                className='w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100'
                                            />
                                        </label>
                                        <label className='space-y-2'>
                                            <span className='text-xs uppercase tracking-widest font-bold text-slate-400'>
                                                Blight on Island
                                            </span>
                                            <input
                                                type='number'
                                                min={0}
                                                value={scoreBlight}
                                                onFocus={(e) => e.currentTarget.select()}
                                                onChange={(e) =>
                                                    setScoreBlight(
                                                        Number.parseInt(e.target.value || '0', 10)
                                                    )
                                                }
                                                className='w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100'
                                            />
                                        </label>
                                    </div>
                                    <button
                                        onClick={scoreGame}
                                        className='w-full md:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-blue-500 text-white font-bold'>
                                        Score
                                    </button>
                                </section>
                            </section>
                        )}

                        {gamesScreen === 'wizard' && (
                        <>
                        <section className='glass-panel p-5 rounded-2xl shadow-xl space-y-4'>
                            <div className='flex items-center justify-between gap-3'>
                                {[
                                    { id: 1, name: 'Setup' },
                                    { id: 2, name: 'Spirits' },
                                    { id: 3, name: 'Adversary' },
                                    { id: 4, name: 'Review' }
                                ].map((step) => (
                                    <div key={step.id} className='flex-1 flex flex-col items-center gap-1'>
                                        <div
                                            className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center border ${
                                                gameStep >= step.id
                                                    ? 'bg-primary border-primary text-white'
                                                    : 'border-slate-700 text-slate-500'
                                            }`}>
                                            {step.id}
                                        </div>
                                        <span className='text-[11px] text-slate-400'>{step.name}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {gameStep === 1 && (
                            <section className='glass-panel p-6 rounded-2xl shadow-xl space-y-6'>
                                <h2 className='text-xl font-bold text-slate-100'>Game Setup</h2>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <label className='space-y-2 md:col-span-2'>
                                        <span className='text-xs font-bold uppercase tracking-widest text-slate-400'>
                                            Team Name (Optional)
                                        </span>
                                        <input
                                            type='text'
                                            value={gameTeamName}
                                            onChange={(e) => setGameTeamName(e.target.value)}
                                            placeholder='e.g. Defenders of the Isle'
                                            className='w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100'
                                        />
                                    </label>
                                    <label className='space-y-2'>
                                        <span className='text-xs font-bold uppercase tracking-widest text-slate-400'>
                                            Number of Players
                                        </span>
                                        <select
                                            value={gamePlayers}
                                            onChange={(e) =>
                                                updateGamePlayers(Number.parseInt(e.target.value || '1', 10))
                                            }
                                            className='picker-select w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100'>
                                            {[1, 2, 3, 4, 5, 6].map((count) => (
                                                <option key={count} value={count}>
                                                    {count}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className='space-y-2'>
                                        <span className='text-xs font-bold uppercase tracking-widest text-slate-400'>
                                            Spirit Candidates Each Pick
                                        </span>
                                        <select
                                            value={gameCandidateCount}
                                            onChange={(e) =>
                                                setGameCandidateCount(
                                                    Math.max(1, Number.parseInt(e.target.value || '3', 10))
                                                )
                                            }
                                            className='picker-select w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100'>
                                            {[1, 2, 3, 4, 5].map((count) => (
                                                <option key={count} value={count}>
                                                    {count}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <div className='md:col-span-2'>
                                        <span className='block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3'>
                                            Board Side
                                        </span>
                                        <div className='inline-flex rounded-xl border border-slate-700 overflow-hidden'>
                                            <button
                                                type='button'
                                                onClick={() => setGameBoardSide('Balanced')}
                                                className={`px-4 py-2 text-sm font-semibold transition-colors ${
                                                    gameBoardSide === 'Balanced'
                                                        ? 'bg-primary text-white'
                                                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                                                }`}>
                                                Balanced
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => setGameBoardSide('Thematic')}
                                                className={`px-4 py-2 text-sm font-semibold transition-colors ${
                                                    gameBoardSide === 'Thematic'
                                                        ? 'bg-primary text-white'
                                                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                                                }`}>
                                                Thematic (+3 Difficulty)
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {gameStep === 2 && (
                            <>
                                <motion.section
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className='glass-panel p-6 rounded-2xl shadow-xl space-y-8'>
                                    {gameTeamName.trim() && (
                                        <div className='rounded-xl border border-primary/30 bg-slate-900/60 px-4 py-3'>
                                            <p className='text-xs uppercase tracking-widest text-slate-400 font-bold'>
                                                Team
                                            </p>
                                            <p className='text-slate-100 font-semibold mt-1'>
                                                {gameTeamName.trim()}
                                            </p>
                                        </div>
                                    )}
                                    <div className='space-y-4'>
                                        <label className='block text-xs font-bold uppercase tracking-widest text-slate-400'>
                                            Difficulty
                                        </label>
                                        <div className='flex flex-wrap gap-3'>
                                            {DIFFICULTIES.map((diff) => (
                                                <button
                                                    key={diff}
                                                    onClick={() => toggleDifficulty(diff)}
                                                    className={`px-5 py-2 rounded-full border transition-all text-sm font-medium ${
                                                        selectedDifficulties.includes(diff)
                                                            ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(19,146,236,0.4)]'
                                                            : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-primary/10 hover:border-primary/50'
                                                    }`}>
                                                    {diff}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className='space-y-4'>
                                        <label className='block text-xs font-bold uppercase tracking-widest text-slate-400'>
                                            Expansions
                                        </label>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                                            {EXPANSIONS.map((exp) => (
                                                <label
                                                    key={exp}
                                                    className='flex items-center space-x-3 cursor-pointer group'>
                                                    <div className='relative flex items-center justify-center'>
                                                        <input
                                                            type='checkbox'
                                                            checked={selectedExpansions.includes(exp)}
                                                            onChange={() => toggleExpansion(exp)}
                                                            className='peer appearance-none w-5 h-5 rounded border border-slate-700 bg-slate-800 checked:bg-primary checked:border-primary transition-all cursor-pointer'
                                                        />
                                                        <Check className='absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none' />
                                                    </div>
                                                    <span
                                                        className={`text-sm transition-colors ${
                                                            selectedExpansions.includes(exp)
                                                                ? 'text-slate-100'
                                                                : 'text-slate-400 group-hover:text-slate-200'
                                                        }`}>
                                                        {exp}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className='pt-4 border-t border-slate-700/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                        <div className='text-slate-300 font-semibold'>
                                            Picking for {getWizardPlayerLabel(gameCurrentPlayer)} of{' '}
                                            {gamePlayers}
                                        </div>
                                        <div className='flex flex-wrap gap-2'>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => drawGameCandidates()}
                                                disabled={filteredSpirits.length === 0}
                                                className='px-6 py-3 rounded-xl bg-primary hover:bg-blue-500 text-white font-bold transition-colors disabled:opacity-50'>
                                                Draw {gameCandidateCount} Candidates
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={pickSpiritCompositionForTeam}
                                                disabled={filteredSpirits.length === 0 || isAiComposing}
                                                className='px-6 py-3 rounded-xl border border-primary/50 text-slate-100 hover:bg-primary/10 font-bold transition-colors disabled:opacity-50'>
                                                {isAiComposing
                                                    ? 'Composing...'
                                                    : 'AI Team Composition'}
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.section>

                                <section className='space-y-4'>
                                    <div className='flex justify-between items-center'>
                                        <h3 className='text-lg font-bold text-slate-100'>Players</h3>
                                    </div>
                                    <div className='space-y-2'>
                                        {gameSelections.map((selection) => (
                                            <div
                                                key={selection.player}
                                                className='glass-panel rounded-xl p-4 border border-slate-700/70'>
                                                <div className='mb-3 flex items-start justify-between gap-3'>
                                                    <div className='min-w-0'>
                                                        {editingPlayerNameId === selection.player ? (
                                                            <input
                                                                type='text'
                                                                autoFocus
                                                                value={editingPlayerNameValue}
                                                                onFocus={(e) =>
                                                                    e.currentTarget.select()
                                                                }
                                                                onChange={(e) =>
                                                                    setEditingPlayerNameValue(
                                                                        e.target.value
                                                                    )
                                                                }
                                                                onBlur={() =>
                                                                    savePlayerName(selection.player)
                                                                }
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        savePlayerName(
                                                                            selection.player
                                                                        )
                                                                    } else if (e.key === 'Escape') {
                                                                        cancelEditPlayerName()
                                                                    }
                                                                }}
                                                                className='w-full max-w-xs rounded-lg border border-slate-600 bg-slate-900 px-3 py-1.5 text-sm font-bold text-slate-100'
                                                            />
                                                        ) : (
                                                            <div className='flex items-center gap-2'>
                                                                <p className='text-sm font-bold text-slate-200'>
                                                                    {selection.playerName}
                                                                </p>
                                                                <button
                                                                    onClick={() =>
                                                                        beginEditPlayerName(
                                                                            selection
                                                                        )
                                                                    }
                                                                    className='text-slate-400 hover:text-slate-200 transition-colors'
                                                                    aria-label={`Edit ${selection.playerName} name`}>
                                                                    <Pencil size={14} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <button
                                                            onClick={() => openGameSpiritPicker(selection.player)}
                                                            className='px-3 py-1.5 rounded-lg border border-primary/40 text-slate-200 hover:border-primary text-xs font-semibold'>
                                                            Pick a spirit
                                                        </button>
                                                        {selection.spirit && (
                                                            <button
                                                                onClick={() => drawGameCandidates(selection.player)}
                                                                className='px-3 py-1.5 rounded-lg border border-slate-600 text-slate-300 hover:border-primary/60 text-xs font-semibold'>
                                                                Re-draw Spirits
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                {selection.spirit ? (
                                                    <SpiritDisplayCard
                                                        spirit={selection.spirit}
                                                        selectedAspect={selection.aspect}
                                                        compact
                                                    />
                                                ) : (
                                                    <p className='text-sm text-slate-500 mt-1 italic'>
                                                        Not selected yet
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </>
                        )}

                        {gameStep === 3 && (
                            <section className='glass-panel p-6 rounded-2xl shadow-xl space-y-5'>
                                <div className='flex flex-wrap items-center justify-between gap-3'>
                                    <h2 className='text-xl font-bold text-slate-100'>Adversary (Optional)</h2>
                                    <p className='text-sm text-slate-400'>
                                        {filteredAdversaries.length} available with current expansions
                                    </p>
                                </div>

                                <div className='flex flex-wrap gap-3'>
                                    <button
                                        onClick={() => {
                                            if (filteredAdversaries.length === 0) return
                                            const randomIndex = Math.floor(
                                                Math.random() * filteredAdversaries.length
                                            )
                                            selectGameAdversary(filteredAdversaries[randomIndex])
                                        }}
                                        disabled={filteredAdversaries.length === 0}
                                        className='px-6 py-3 rounded-xl bg-primary hover:bg-blue-500 text-white font-bold disabled:opacity-50'>
                                        Pick Adversary
                                    </button>
                                    <button
                                        onClick={() => setShowGameAdversaryPickerModal(true)}
                                        disabled={filteredAdversaries.length === 0}
                                        className='px-6 py-3 rounded-xl border border-primary/50 text-slate-100 hover:bg-primary/10 font-bold disabled:opacity-50'>
                                        Manual Select
                                    </button>
                                </div>

                                {gameAdversary && (
                                    <div className='rounded-xl border border-primary/30 bg-slate-900/70 p-4 space-y-4'>
                                        <h3 className='text-lg font-bold text-slate-100'>{gameAdversary.name}</h3>
                                        <p className='text-sm text-slate-400'>
                                            Difficulty Range: {gameAdversary.difficultyRange}
                                        </p>
                                        <label className='space-y-2 block'>
                                            <span className='text-xs font-bold uppercase tracking-widest text-slate-400'>
                                                Level
                                            </span>
                                            <select
                                                value={gameAdversaryLevel ?? ''}
                                                onChange={(e) =>
                                                    setGameAdversaryLevel(
                                                        e.target.value === ''
                                                            ? null
                                                            : Number.parseInt(e.target.value, 10)
                                                    )
                                                }
                                                className='picker-select w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100'>
                                                <option value=''>Select level</option>
                                                {[0, 1, 2, 3, 4, 5, 6].map((level) => (
                                                    <option key={level} value={level}>
                                                        Level {level}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>
                                )}
                            </section>
                        )}

                        {gameStep === 4 && (
                            <section className='glass-panel p-6 rounded-2xl shadow-xl space-y-6'>
                                <h2 className='text-xl font-bold text-slate-100'>Review</h2>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                                    <div className='rounded-xl border border-slate-700 bg-slate-900/40 p-4'>
                                        <p className='text-slate-400 uppercase text-xs tracking-widest font-bold'>
                                            Players
                                        </p>
                                        <p className='text-slate-100 mt-2'>{gamePlayers}</p>
                                    </div>
                                    <div className='rounded-xl border border-slate-700 bg-slate-900/40 p-4'>
                                        <p className='text-slate-400 uppercase text-xs tracking-widest font-bold'>
                                            Candidates Per Pick
                                        </p>
                                        <p className='text-slate-100 mt-2'>{gameCandidateCount}</p>
                                    </div>
                                    <div className='rounded-xl border border-slate-700 bg-slate-900/40 p-4'>
                                        <p className='text-slate-400 uppercase text-xs tracking-widest font-bold'>
                                            Board Side
                                        </p>
                                        <p className='text-slate-100 mt-2'>{gameBoardSide}</p>
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <h3 className='text-sm font-bold uppercase tracking-widest text-slate-400'>
                                        Player Choices
                                    </h3>
                                    {gameSelections.map((selection) => (
                                        <div
                                            key={selection.player}
                                            className='rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm'>
                                            <div className='mb-2'>
                                                {editingPlayerNameId === selection.player ? (
                                                    <input
                                                        type='text'
                                                        autoFocus
                                                        value={editingPlayerNameValue}
                                                        onFocus={(e) => e.currentTarget.select()}
                                                        onChange={(e) =>
                                                            setEditingPlayerNameValue(e.target.value)
                                                        }
                                                        onBlur={() => savePlayerName(selection.player)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                savePlayerName(selection.player)
                                                            } else if (e.key === 'Escape') {
                                                                cancelEditPlayerName()
                                                            }
                                                        }}
                                                        className='w-full max-w-xs rounded-lg border border-slate-600 bg-slate-900 px-3 py-1.5 text-sm font-bold text-slate-100'
                                                    />
                                                ) : (
                                                    <div className='flex items-center gap-2'>
                                                        <span className='text-slate-200 font-semibold'>
                                                            {selection.playerName}:
                                                        </span>
                                                        <button
                                                            onClick={() => beginEditPlayerName(selection)}
                                                            className='text-slate-400 hover:text-slate-200 transition-colors'
                                                            aria-label={`Edit ${selection.playerName} name`}>
                                                            <Pencil size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <span className='text-slate-100'>
                                                {selection.spirit?.name ?? 'Not selected'}
                                            </span>
                                            <span className='text-slate-400'>
                                                {' '}
                                                ({selection.aspect ?? 'No Aspect'})
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className='space-y-2'>
                                    <h3 className='text-sm font-bold uppercase tracking-widest text-slate-400'>
                                        Adversary
                                    </h3>
                                    <div className='rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-200'>
                                        {gameAdversary ? (
                                            <>
                                                {gameAdversary.name} • Level {gameAdversaryLevel}
                                            </>
                                        ) : (
                                            'None'
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}

                        {gameError && (
                            <p className='text-rose-400 text-sm font-medium px-1'>{gameError}</p>
                        )}

                        <section className='flex items-center justify-between gap-3'>
                            <button
                                onClick={previousGameStep}
                                disabled={gameStep === 1}
                                className='px-5 py-3 rounded-xl border border-slate-600 text-slate-300 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2'>
                                <ChevronLeft size={18} />
                                Previous
                            </button>
                            <div className='flex items-center gap-2'>
                                {gameStep === 3 && (
                                    <button
                                        onClick={skipAdversaryStep}
                                        className='px-5 py-3 rounded-xl border border-slate-600 text-slate-300 hover:border-slate-400 font-semibold'>
                                        Skip
                                    </button>
                                )}
                                <button
                                    onClick={gameStep === 4 ? startGameFromWizard : nextGameStep}
                                    disabled={gameStep === 4 && isStartingGame}
                                    className='px-5 py-3 rounded-xl bg-primary hover:bg-blue-500 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2'>
                                    {gameStep === 4 ? (isStartingGame ? 'Starting...' : 'Start') : 'Next'}
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </section>
                        </>
                        )}
                    </>
                )}
            </main>

            <nav className='fixed bottom-0 inset-x-0 z-40 pb-4 px-4'>
                <div className='max-w-4xl mx-auto'>
                    <div className='glass-panel rounded-2xl border border-slate-700/60 bg-slate-900/90 backdrop-blur-md p-2 grid grid-cols-3 gap-2 shadow-2xl'>
                        <button
                            onClick={() => setActiveTab('spirits')}
                            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors ${
                                activeTab === 'spirits'
                                    ? 'bg-primary text-white'
                                    : 'text-slate-300 hover:bg-slate-800'
                            }`}>
                            <Sparkles size={16} />
                            Spirits
                        </button>
                        <button
                            onClick={() => setActiveTab('adversary')}
                            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors ${
                                activeTab === 'adversary'
                                    ? 'bg-primary text-white'
                                    : 'text-slate-300 hover:bg-slate-800'
                            }`}>
                            <Shield size={16} />
                            Adversary
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('games')
                                setGamesScreen('landing')
                            }}
                            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors ${
                                activeTab === 'games'
                                    ? 'bg-primary text-white'
                                    : 'text-slate-300 hover:bg-slate-800'
                            }`}>
                            <Swords size={16} />
                            Games
                        </button>
                    </div>
                </div>
            </nav>

            {/* Spirit History Modal */}
            <ModalShell
                open={showSpiritHistoryModal}
                onClose={() => setShowSpiritHistoryModal(false)}
                maxWidthClass='max-w-3xl'>
                <div className='p-6 space-y-4'>
                    <div className='flex items-center gap-5 px-1'>
                        <h3 className='text-xl font-bold flex items-center gap-2 text-slate-100'>
                            <History className='text-primary' size={20} />
                            Spirit Draw History
                        </h3>
                        <button
                            onClick={clearHistory}
                            className='text-slate-500 hover:text-rose-400 text-xs uppercase tracking-widest font-bold transition-colors'>
                            Clear History
                        </button>
                    </div>
                    <div className='space-y-3 max-h-[65vh] overflow-y-auto custom-scrollbar pr-2'>
                        <AnimatePresence initial={false}>
                            {history.length > 0 ? (
                                history.map((item) => (
                                    <motion.div
                                        key={item.entryId}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className='glass-panel p-4 rounded-xl flex items-center gap-4 group hover:border-primary/30 transition-colors'>
                                        <div className='w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-slate-700 shadow-inner'>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className='w-full h-full object-cover'
                                                referrerPolicy='no-referrer'
                                            />
                                        </div>
                                        <div className='flex-grow'>
                                            <div className='flex justify-between items-start gap-3'>
                                                <h4 className='font-bold text-slate-100 group-hover:text-primary transition-colors'>
                                                    {item.name}
                                                </h4>
                                                <span className='text-[10px] text-slate-500 uppercase font-mono bg-slate-800 px-2 py-0.5 rounded whitespace-nowrap'>
                                                    {item.timestamp}
                                                </span>
                                            </div>
                                            <div className='flex items-center gap-2 mt-1.5'>
                                                <span className='text-[10px] text-primary font-bold uppercase tracking-wider'>
                                                    {item.difficulty}
                                                </span>
                                                <span className='text-[10px] text-slate-600'>•</span>
                                                <span className='text-[10px] text-slate-400 font-medium'>
                                                    {item.expansion}
                                                </span>
                                            </div>
                                            <p className='mt-1 text-[10px] text-slate-500'>
                                                Aspect: {item.selectedAspect ?? 'No Aspect'}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className='text-slate-600 text-center py-12 italic border-2 border-dashed border-slate-800 rounded-2xl'>
                                    Your journey&apos;s history will appear here...
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </ModalShell>

            {/* Spirit Result Modal */}
            <ModalShell open={showModal && !!pickedSpirit} onClose={() => setShowModal(false)} maxWidthClass='max-w-lg'>
                {pickedSpirit && (
                    <SpiritDisplayCard
                        spirit={pickedSpirit}
                        selectedAspect={selectedAspect}
                        showViewPlayCard={hasLocalPlayCardForSpirit(pickedSpirit)}
                        onViewPlayCard={() => openSpiritPlayCardModal(pickedSpirit)}
                        onSelectAspect={updateSelectedAspect}
                        onConfirm={() => setShowModal(false)}
                        confirmLabel='Confirm Selection'
                        footerText={`Selected: ${selectedAspect ?? 'No Aspect'}`}
                    />
                )}
            </ModalShell>

            {/* Spirit Play Card Modal */}
            <ModalShell
                open={!!playCardSpirit}
                onClose={closeSpiritPlayCardModal}
                maxWidthClass='max-w-6xl'
                zIndexClass='z-[70]'>
                {playCardSpirit && (
                    <div className='p-6 md:p-8 space-y-5'>
                        <div className='pr-12'>
                            <h2 className='text-xl md:text-2xl font-bold text-white'>{playCardSpirit.name}</h2>
                            <p className='text-sm text-slate-400 mt-1'>
                                Click the card to flip between front and back.
                            </p>
                        </div>
                        <div className='mx-auto w-full max-w-5xl [perspective:1400px]'>
                            <button
                                type='button'
                                onClick={() => setIsPlayCardFlipped((prev) => !prev)}
                                className='w-full cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70'>
                                <div
                                    className='relative aspect-[1349/870] w-full transition-transform duration-700 [transform-style:preserve-3d]'
                                    style={{
                                        transform: isPlayCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                    }}>
                                    <div className='absolute inset-0 rounded-2xl overflow-hidden [backface-visibility:hidden]'>
                                        {playCardFrontUrl ? (
                                            <img
                                                src={playCardFrontUrl}
                                                alt={`${playCardSpirit.name} play card front`}
                                                className='h-full w-full object-contain'
                                                referrerPolicy='no-referrer'
                                                onError={() =>
                                                    setPlayCardFrontUrlIndex((current) =>
                                                        current < playCardFrontCandidates.length - 1
                                                            ? current + 1
                                                            : current
                                                    )
                                                }
                                            />
                                        ) : (
                                            <div className='h-full grid place-items-center text-sm text-slate-400 px-6 text-center'>
                                                Unable to load front side.
                                            </div>
                                        )}
                                    </div>
                                    <div className='absolute inset-0 rounded-2xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]'>
                                        {playCardBackUrl ? (
                                            <img
                                                src={playCardBackUrl}
                                                alt={`${playCardSpirit.name} play card back`}
                                                className='h-full w-full object-contain'
                                                referrerPolicy='no-referrer'
                                                onError={() =>
                                                    setPlayCardBackUrlIndex((current) =>
                                                        current < playCardBackCandidates.length - 1
                                                            ? current + 1
                                                            : current
                                                    )
                                                }
                                            />
                                        ) : (
                                            <div className='h-full grid place-items-center text-sm text-slate-400 px-6 text-center'>
                                                Unable to load back side.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </ModalShell>

            {/* Game Candidates Modal */}
            <ModalShell
                open={showGameCandidateModal}
                onClose={() => setShowGameCandidateModal(false)}
                maxWidthClass='max-w-6xl'>
                <div className='p-6 space-y-4'>
                    <div className='px-2'>
                        <h3 className='text-xl font-bold text-slate-100'>
                            Player {gameCurrentPlayer}: Pick One Spirit
                        </h3>
                        <p className='text-sm text-slate-400 mt-1'>
                            Choose one candidate and optionally set an aspect.
                        </p>
                    </div>
                    <div className='max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar'>
                        {gameCandidateDisplayList.length > 0 ? (
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                                {gameCandidateDisplayList.map((candidate) => (
                                    <div key={candidate.id} className='rounded-2xl border border-slate-700/70 overflow-hidden bg-slate-900/40'>
                                        <SpiritDisplayCard
                                            spirit={candidate}
                                            selectedAspect={gameCandidateAspects[candidate.id] ?? null}
                                            onSelectAspect={(aspect) =>
                                                setGameCandidateAspects((prev) => ({
                                                    ...prev,
                                                    [candidate.id]: aspect
                                                }))
                                            }
                                            showViewPlayCard={hasLocalPlayCardForSpirit(candidate)}
                                            onViewPlayCard={() => openSpiritPlayCardModal(candidate)}
                                            onConfirm={() => confirmGameCandidateSelection(candidate)}
                                            confirmLabel='Confirm This Spirit'
                                            footerText={`Selected: ${gameCandidateAspects[candidate.id] ?? 'No Aspect'}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='rounded-xl border border-dashed border-slate-700 p-10 text-center text-slate-400'>
                                No candidates available. Adjust difficulty/expansion filters or re-draw for another player.
                            </div>
                        )}
                    </div>
                </div>
            </ModalShell>

            {/* Game Adversary Picker Modal */}
            <ModalShell
                open={showGameAdversaryPickerModal}
                onClose={() => setShowGameAdversaryPickerModal(false)}
                maxWidthClass='max-w-4xl'>
                <div className='p-6 space-y-4'>
                    <div className='px-2'>
                        <h3 className='text-xl font-bold text-slate-100'>Pick an Adversary</h3>
                        <p className='text-sm text-slate-400 mt-1'>
                            Choose one adversary from the current expansion filters.
                        </p>
                    </div>
                    <div className='max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar'>
                        {filteredAdversaries.length > 0 ? (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {filteredAdversaries.map((adversary) => (
                                    <div
                                        key={adversary.id}
                                        className='rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-3'>
                                        <div>
                                            <h4 className='text-lg font-bold text-slate-100'>
                                                {adversary.name}
                                            </h4>
                                            <p className='text-sm text-slate-400 mt-1'>
                                                Difficulty Range: {adversary.difficultyRange}
                                            </p>
                                            <p className='text-xs text-slate-500 mt-1'>
                                                {adversary.expansion}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => selectGameAdversary(adversary)}
                                            className='w-full py-2.5 rounded-xl bg-primary hover:bg-blue-500 text-white font-bold text-sm transition-colors'>
                                            Select This Adversary
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='rounded-xl border border-dashed border-slate-700 p-10 text-center text-slate-400'>
                                No adversaries available with current expansion filters.
                            </div>
                        )}
                    </div>
                </div>
            </ModalShell>

            {/* Game Spirit Picker Modal */}
            <ModalShell
                open={showGameSpiritPickerModal}
                onClose={() => setShowGameSpiritPickerModal(false)}
                maxWidthClass='max-w-6xl'>
                <div className='p-6 space-y-4'>
                    <div className='px-2'>
                        <h3 className='text-xl font-bold text-slate-100'>
                            Player {gameSpiritPickerPlayer ?? gameCurrentPlayer}: Pick a Spirit
                        </h3>
                    </div>

                    <section className='glass-panel p-4 rounded-xl border border-slate-700/70 space-y-4'>
                        <div className='space-y-3'>
                            <label className='block text-xs font-bold uppercase tracking-widest text-slate-400'>
                                Difficulty
                            </label>
                            <div className='flex flex-wrap gap-2'>
                                {DIFFICULTIES.map((diff) => (
                                    <button
                                        key={diff}
                                        onClick={() => toggleDifficulty(diff)}
                                        className={`px-4 py-1.5 rounded-full border transition-all text-xs font-medium ${
                                            selectedDifficulties.includes(diff)
                                                ? 'bg-primary border-primary text-white'
                                                : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-primary/10 hover:border-primary/50'
                                        }`}>
                                        {diff}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className='space-y-3'>
                            <label className='block text-xs font-bold uppercase tracking-widest text-slate-400'>
                                Expansions
                            </label>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                                {EXPANSIONS.map((exp) => (
                                    <label key={exp} className='flex items-center space-x-2 cursor-pointer'>
                                        <input
                                            type='checkbox'
                                            checked={selectedExpansions.includes(exp)}
                                            onChange={() => toggleExpansion(exp)}
                                            className='appearance-none w-4 h-4 rounded border border-slate-700 bg-slate-800 checked:bg-primary checked:border-primary transition-all cursor-pointer'
                                        />
                                        <span className='text-xs text-slate-300'>{exp}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <label className='block text-xs font-bold uppercase tracking-widest text-slate-400'>
                                Search Spirit
                            </label>
                            <input
                                type='text'
                                value={gameSpiritSearch}
                                onChange={(e) => setGameSpiritSearch(e.target.value)}
                                placeholder='Type spirit name...'
                                className='w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100'
                            />
                        </div>
                    </section>

                    <div className='max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar'>
                        {gameSpiritPickerSpirits.length > 0 ? (
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                                {gameSpiritPickerSpirits.map((spirit) => {
                                    const isPickedByAnotherPlayer = gameSpiritPickerTakenByOthers.has(
                                        spirit.id
                                    )
                                    return (
                                    <div
                                        key={spirit.id}
                                        className='rounded-2xl border border-slate-700/70 overflow-hidden bg-slate-900/40'>
                                        <SpiritDisplayCard
                                            spirit={spirit}
                                            selectedAspect={gameSpiritPickerAspects[spirit.id] ?? null}
                                            onSelectAspect={(aspect) =>
                                                setGameSpiritPickerAspects((prev) => ({
                                                    ...prev,
                                                    [spirit.id]: aspect
                                                }))
                                            }
                                            showViewPlayCard={hasLocalPlayCardForSpirit(spirit)}
                                            onViewPlayCard={() => openSpiritPlayCardModal(spirit)}
                                            onConfirm={() => confirmGameSpiritPickerSelection(spirit)}
                                            confirmDisabled={isPickedByAnotherPlayer}
                                            confirmLabel={isPickedByAnotherPlayer ? 'Picked' : 'Confirm This Spirit'}
                                            footerText={`Selected: ${gameSpiritPickerAspects[spirit.id] ?? 'No Aspect'}`}
                                        />
                                    </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className='rounded-xl border border-dashed border-slate-700 p-10 text-center text-slate-400'>
                                No spirits match current filters/search.
                            </div>
                        )}
                    </div>
                </div>
            </ModalShell>
        </div>
    )
}
