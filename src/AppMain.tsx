/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { History } from 'lucide-react'
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
import BottomTabNav from './components/BottomTabNav'
import FlippableImageCard from './components/FlippableImageCard'
import ThumbnailCardRail from './components/ThumbnailCardRail'
import { LOCAL_UNIQUE_POWER_CARDS_BY_SPIRIT } from './data/uniquePowerCards'
import { WIKI_CARD_DATA, type WikiCardItem, type WikiSection } from './data/wikiCards'
import SpiritsTabScreen from './screens/spirits'
import AdversaryTabScreen from './screens/adversary'
import WikiTabScreen from './screens/wiki'
import GamesTabScreen from './screens/games'

import {
    GOOGLE_AI_API_KEY,
    getDefaultPlayerName,
    getBoardDifficultyModifier,
    getSpiritPlayCardCandidates,
    getWikiCardPair,
    WIKI_SECTION_LABELS,
    LOCAL_ADVERSARY_FRONT_CARD_BY_NAME,
    LOCAL_ASPECT_CARDS_BY_NAME,
    SPIRIT_ASPECTS,
    SPIRITS,
    EXPANSIONS,
    DIFFICULTIES,
    DIFFICULTY_SORT_ORDER,
    ADVERSARIES,
    LOCAL_PLAY_CARDS_BY_SPIRIT
} from './constants.js'
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
    const [playCardAspect, setPlayCardAspect] = useState<string | null>(null)
    const [playCardAspectPreview, setPlayCardAspectPreview] = useState<string | null>(null)
    const [playCardUniquePreview, setPlayCardUniquePreview] = useState<string | null>(null)
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
    const [wikiSection, setWikiSection] = useState<WikiSection>('major')
    const [wikiCardSearch, setWikiCardSearch] = useState('')
    const [wikiSelectedCard, setWikiSelectedCard] = useState<WikiCardItem | null>(null)
    const [isWikiCardFlipped, setIsWikiCardFlipped] = useState(false)
    const [isAiComposing, setIsAiComposing] = useState(false)
    const [isStartingGame, setIsStartingGame] = useState(false)
    const [isDownloadingGameImage, setIsDownloadingGameImage] = useState(false)
    const [isExportingGameImage, setIsExportingGameImage] = useState(false)
    const [editingPlayerNameId, setEditingPlayerNameId] = useState<number | null>(null)
    const [editingPlayerNameValue, setEditingPlayerNameValue] = useState('')
    const gameDetailExportRef = useRef<HTMLDivElement | null>(null)
    const mainNavTab: 'games' | 'spirits' | 'wiki' =
        activeTab === 'games' || activeTab === 'spirits' || activeTab === 'wiki'
            ? activeTab
            : 'games'

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
    const playCardAspectEntries = useMemo(() => {
        if (!playCardSpirit) return []
        const spiritAspects =
            playCardSpirit.aspects && playCardSpirit.aspects.length > 0
                ? playCardSpirit.aspects
                : (SPIRIT_ASPECTS[playCardSpirit.name] ?? [])
        const entries = spiritAspects.map((aspectName) => ({
            name: aspectName,
            entry: LOCAL_ASPECT_CARDS_BY_NAME[aspectName] ?? null
        }))

        if (!playCardAspect) return entries
        return entries.sort((a, b) =>
            a.name === playCardAspect ? -1 : b.name === playCardAspect ? 1 : 0
        )
    }, [playCardSpirit, playCardAspect])
    const playCardAspectPreviewEntry = playCardAspectPreview
        ? (LOCAL_ASPECT_CARDS_BY_NAME[playCardAspectPreview] ?? null)
        : null
    const playCardUniqueEntries = useMemo(() => {
        if (!playCardSpirit) return []
        const entries = LOCAL_UNIQUE_POWER_CARDS_BY_SPIRIT[playCardSpirit.name] ?? []
        const seen = new Set<string>()
        return entries.filter((card) => {
            const key = `${card.name}::${card.image}`
            if (seen.has(key)) return false
            seen.add(key)
            return true
        })
    }, [playCardSpirit])
    const playCardUniquePreviewEntry = playCardUniqueEntries.find(
        (card) => card.image === playCardUniquePreview
    )
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

    const openSpiritPlayCardModal = (spirit: SpiritWithAspects, aspect: string | null = null) => {
        setPlayCardSpirit(spirit)
        setPlayCardAspect(aspect)
        setPlayCardAspectPreview(aspect)
        setPlayCardUniquePreview(null)
        setIsPlayCardFlipped(true)
        setPlayCardFrontUrlIndex(0)
        setPlayCardBackUrlIndex(0)
    }

    const closeSpiritPlayCardModal = () => {
        setPlayCardSpirit(null)
        setPlayCardAspect(null)
        setPlayCardAspectPreview(null)
        setPlayCardUniquePreview(null)
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

    const wikiCards = useMemo(() => WIKI_CARD_DATA[wikiSection] ?? [], [wikiSection])
    const wikiVisibleCards = useMemo(() => {
        const supportsSearch = wikiSection === 'major' || wikiSection === 'minor'
        if (!supportsSearch) return wikiCards
        const query = wikiCardSearch.trim().toLowerCase()
        if (!query) return wikiCards
        return wikiCards.filter((card) => card.name.toLowerCase().includes(query))
    }, [wikiCards, wikiCardSearch, wikiSection])
    const wikiCardPair = useMemo(
        () => (wikiSelectedCard ? getWikiCardPair(wikiCards, wikiSelectedCard) : null),
        [wikiCards, wikiSelectedCard]
    )

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
                    <SpiritsTabScreen
                        difficulties={DIFFICULTIES}
                        expansions={EXPANSIONS}
                        selectedDifficulties={selectedDifficulties}
                        selectedExpansions={selectedExpansions}
                        filteredSpirits={filteredSpirits}
                        sortedFilteredSpirits={sortedFilteredSpirits}
                        spiritsSort={spiritsSort}
                        onSpiritsSortChange={setSpiritsSort}
                        onToggleDifficulty={toggleDifficulty}
                        onToggleExpansion={toggleExpansion}
                        onClearFilters={clearFilters}
                        onPickSpirit={pickSpirit}
                        onShowHistory={() => setShowSpiritHistoryModal(true)}
                        hasLocalPlayCardForSpirit={hasLocalPlayCardForSpirit}
                        onOpenSpiritPlayCard={(spirit) => openSpiritPlayCardModal(spirit)}
                    />
                )}

                {activeTab === 'adversary' && (
                    <AdversaryTabScreen
                        expansions={EXPANSIONS}
                        selectedExpansions={selectedExpansions}
                        filteredAdversaries={filteredAdversaries}
                        pickedAdversary={pickedAdversary}
                        adversaryHistory={adversaryHistory}
                        onToggleExpansion={toggleExpansion}
                        onClearFilters={clearFilters}
                        onPickAdversary={pickAdversary}
                        onClearAdversaryHistory={clearAdversaryHistory}
                    />
                )}

                {activeTab === 'wiki' && (
                    <WikiTabScreen
                        sectionLabels={WIKI_SECTION_LABELS}
                        wikiSection={wikiSection}
                        wikiVisibleCards={wikiVisibleCards}
                        wikiSelectedCard={wikiSelectedCard}
                        wikiCardSearch={wikiCardSearch}
                        setWikiSection={setWikiSection}
                        setWikiSelectedCard={setWikiSelectedCard}
                        setIsWikiCardFlipped={setIsWikiCardFlipped}
                        setWikiCardSearch={setWikiCardSearch}
                    />
                )}

                {activeTab === 'games' && (
                    <GamesTabScreen
                        gamesScreen={gamesScreen}
                        selectedGame={selectedGame}
                        gamesSortBy={gamesSortBy}
                        sortedGames={sortedGames}
                        startGameWizard={startGameWizard}
                        openGameDetail={openGameDetail}
                        setGamesSortBy={setGamesSortBy}
                        openGamesLanding={openGamesLanding}
                        openScoring={openScoring}
                        downloadGameDetailImage={downloadGameDetailImage}
                        isDownloadingGameImage={isDownloadingGameImage}
                        isExportingGameImage={isExportingGameImage}
                        gameDetailExportRef={gameDetailExportRef}
                        editingPlayerNameId={editingPlayerNameId}
                        editingPlayerNameValue={editingPlayerNameValue}
                        setEditingPlayerNameValue={setEditingPlayerNameValue}
                        saveSelectedGamePlayerName={saveSelectedGamePlayerName}
                        beginEditPlayerName={beginEditPlayerName}
                        cancelEditPlayerName={cancelEditPlayerName}
                        getDefaultPlayerName={getDefaultPlayerName}
                        hasLocalPlayCardForSpirit={hasLocalPlayCardForSpirit}
                        openSpiritPlayCardModal={openSpiritPlayCardModal}
                        getBoardDifficultyModifier={getBoardDifficultyModifier}
                        scoreOutcome={scoreOutcome}
                        scoreDifficulty={scoreDifficulty}
                        scoreInvaderRemaining={scoreInvaderRemaining}
                        scoreInvaderNotInDeck={scoreInvaderNotInDeck}
                        scoreLivingDahan={scoreLivingDahan}
                        scoreBlight={scoreBlight}
                        setGamesScreen={(screen) => setGamesScreen(screen)}
                        setScoreOutcome={setScoreOutcome}
                        setScoreDifficulty={setScoreDifficulty}
                        setScoreInvaderRemaining={setScoreInvaderRemaining}
                        setScoreInvaderNotInDeck={setScoreInvaderNotInDeck}
                        setScoreLivingDahan={setScoreLivingDahan}
                        setScoreBlight={setScoreBlight}
                        scoreGame={scoreGame}
                        gameStep={gameStep}
                        gameError={gameError}
                        isStartingGame={isStartingGame}
                        gameTeamName={gameTeamName}
                        gamePlayers={gamePlayers}
                        gameCandidateCount={gameCandidateCount}
                        gameBoardSide={gameBoardSide}
                        selectedDifficulties={selectedDifficulties}
                        selectedExpansions={selectedExpansions}
                        difficulties={DIFFICULTIES}
                        expansions={EXPANSIONS}
                        filteredSpirits={filteredSpirits}
                        filteredAdversaries={filteredAdversaries}
                        gameCurrentPlayer={gameCurrentPlayer}
                        gameSelections={gameSelections}
                        gameAdversary={gameAdversary}
                        gameAdversaryLevel={gameAdversaryLevel}
                        isAiComposing={isAiComposing}
                        adversaryFrontCardByName={LOCAL_ADVERSARY_FRONT_CARD_BY_NAME}
                        updateGamePlayers={updateGamePlayers}
                        setGameTeamName={setGameTeamName}
                        setGameCandidateCount={setGameCandidateCount}
                        setGameBoardSide={setGameBoardSide}
                        toggleDifficulty={toggleDifficulty}
                        toggleExpansion={toggleExpansion}
                        drawGameCandidates={drawGameCandidates}
                        pickSpiritCompositionForTeam={pickSpiritCompositionForTeam}
                        openGameSpiritPicker={openGameSpiritPicker}
                        selectGameAdversary={selectGameAdversary}
                        setShowGameAdversaryPickerModal={setShowGameAdversaryPickerModal}
                        setGameAdversaryLevel={setGameAdversaryLevel}
                        setEditingPlayerNameValueForWizard={setEditingPlayerNameValue}
                        savePlayerName={savePlayerName}
                        previousGameStep={previousGameStep}
                        nextGameStep={nextGameStep}
                        skipAdversaryStep={skipAdversaryStep}
                        startGameFromWizard={startGameFromWizard}
                        getWizardPlayerLabel={getWizardPlayerLabel}
                    />
                )}
            </main>

            <BottomTabNav
                activeTab={mainNavTab}
                onSelectTab={(tab) => {
                    setActiveTab(tab)
                    if (tab === 'games') {
                        setGamesScreen('landing')
                    }
                }}
            />

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

            {/* Wiki Card Modal */}
            <ModalShell
                open={!!wikiSelectedCard}
                onClose={() => {
                    setWikiSelectedCard(null)
                    setIsWikiCardFlipped(false)
                }}
                maxWidthClass='max-w-5xl'
                zIndexClass='z-[70]'>
                {wikiSelectedCard && wikiCardPair && (
                    <div className='p-6 md:p-8 space-y-4'>
                        <div className='pr-12'>
                            <h2 className='text-xl md:text-2xl font-bold text-white'>
                                {wikiCardPair.front.name.replace(/\s+Front$/i, '')}
                            </h2>
                            {wikiCardPair.hasTwoSides && (
                                <p className='text-sm text-slate-400 mt-1'>
                                    Click the card to flip between front and back.
                                </p>
                            )}
                        </div>
                        <FlippableImageCard
                            frontImage={wikiCardPair.front.image}
                            backImage={wikiCardPair.back?.image ?? null}
                            frontAlt={`${wikiCardPair.front.name} front`}
                            backAlt={`${wikiCardPair.back?.name ?? wikiCardPair.front.name} back`}
                            flipped={isWikiCardFlipped}
                            onToggle={() => setIsWikiCardFlipped((prev) => !prev)}
                            canFlip={wikiCardPair.hasTwoSides}
                            aspectRatioClass='aspect-[742/1039]'
                            maxWidthClass='max-w-xl'
                        />
                    </div>
                )}
            </ModalShell>

            {/* Spirit Result Modal */}
            <ModalShell open={showModal && !!pickedSpirit} onClose={() => setShowModal(false)} maxWidthClass='max-w-lg'>
                {pickedSpirit && (
                    <SpiritDisplayCard
                        spirit={pickedSpirit}
                        selectedAspect={selectedAspect}
                        showViewPlayCard={hasLocalPlayCardForSpirit(pickedSpirit)}
                        onViewPlayCard={() => openSpiritPlayCardModal(pickedSpirit, selectedAspect)}
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
                    <div className='p-6 md:p-8 space-y-5 max-h-[88vh] overflow-y-auto custom-scrollbar'>
                        <div className='pr-12'>
                            <h2 className='text-xl md:text-2xl font-bold text-white'>{playCardSpirit.name}</h2>
                            <p className='text-sm text-slate-400 mt-1'>
                                Click the card to flip between front and back.
                            </p>
                        </div>
                        <FlippableImageCard
                            frontImage={playCardFrontUrl}
                            backImage={playCardBackUrl}
                            frontAlt={`${playCardSpirit.name} play card front`}
                            backAlt={`${playCardSpirit.name} play card back`}
                            flipped={isPlayCardFlipped}
                            onToggle={() => setIsPlayCardFlipped((prev) => !prev)}
                            canFlip={true}
                            aspectRatioClass='aspect-[1349/870]'
                            maxWidthClass='max-w-5xl'
                            onFrontError={() =>
                                setPlayCardFrontUrlIndex((current) =>
                                    current < playCardFrontCandidates.length - 1 ? current + 1 : current
                                )
                            }
                            onBackError={() =>
                                setPlayCardBackUrlIndex((current) =>
                                    current < playCardBackCandidates.length - 1 ? current + 1 : current
                                )
                            }
                        />
                        {playCardAspectEntries.length > 0 && (
                            <div className='w-full'>
                                <ThumbnailCardRail
                                    title='Aspects'
                                    items={playCardAspectEntries.map((aspect) => ({
                                        id: aspect.name,
                                        name: aspect.name,
                                        image: aspect.entry?.front ?? null,
                                        alt: `${aspect.name} aspect card`,
                                        placeholderText: 'No local image'
                                    }))}
                                    selectedId={playCardAspectPreview}
                                    onToggleSelect={(id) =>
                                        setPlayCardAspectPreview((current) => {
                                            setPlayCardUniquePreview(null)
                                            return current === id ? null : id
                                        })
                                    }
                                />
                            </div>
                        )}
                        {playCardUniqueEntries.length > 0 && (
                            <div className='w-full'>
                                <ThumbnailCardRail
                                    title='Unique Power Cards'
                                    items={playCardUniqueEntries.map((card) => ({
                                        id: card.image,
                                        name: card.name,
                                        image: card.image,
                                        alt: `${card.name} unique power card`
                                    }))}
                                    selectedId={playCardUniquePreview}
                                    onToggleSelect={(id) =>
                                        setPlayCardUniquePreview((current) => {
                                            setPlayCardAspectPreview(null)
                                            return current === id ? null : id
                                        })
                                    }
                                />
                            </div>
                        )}
                    </div>
                )}
            </ModalShell>

            {/* Aspect Preview Modal */}
            <ModalShell
                open={!!playCardAspectPreview}
                onClose={() => setPlayCardAspectPreview(null)}
                maxWidthClass='max-w-3xl'
                zIndexClass='z-[90]'>
                <div className='p-6 md:p-8 space-y-3'>
                    <h3 className='text-lg md:text-xl font-bold text-white'>
                        {playCardAspectPreview ? `Aspect: ${playCardAspectPreview}` : 'Aspect Preview'}
                    </h3>
                    {playCardAspectPreviewEntry ? (
                        <img
                            src={playCardAspectPreviewEntry.front}
                            alt={`${playCardAspectPreview ?? 'Selected'} enlarged aspect card`}
                            className='mx-auto w-full max-w-xl aspect-[742/1039] object-contain'
                            referrerPolicy='no-referrer'
                        />
                    ) : (
                        <p className='text-center text-sm text-slate-500'>
                            Aspect card image not available.
                        </p>
                    )}
                </div>
            </ModalShell>

            {/* Unique Power Preview Modal */}
            <ModalShell
                open={!!playCardUniquePreview}
                onClose={() => setPlayCardUniquePreview(null)}
                maxWidthClass='max-w-3xl'
                zIndexClass='z-[90]'>
                <div className='p-6 md:p-8 space-y-3'>
                    <h3 className='text-lg md:text-xl font-bold text-white'>
                        {playCardUniquePreviewEntry?.name ?? 'Unique Power Card'}
                    </h3>
                    {playCardUniquePreviewEntry ? (
                        <img
                            src={playCardUniquePreviewEntry.image}
                            alt={`${playCardUniquePreviewEntry.name} enlarged unique power card`}
                            className='mx-auto w-full max-w-xl aspect-[742/1039] object-contain'
                            referrerPolicy='no-referrer'
                        />
                    ) : (
                        <p className='text-center text-sm text-slate-500'>
                            Unique card image not available.
                        </p>
                    )}
                </div>
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
                                            onViewPlayCard={() =>
                                                openSpiritPlayCardModal(
                                                    candidate,
                                                    gameCandidateAspects[candidate.id] ?? null
                                                )
                                            }
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
                                            onViewPlayCard={() =>
                                                openSpiritPlayCardModal(
                                                    spirit,
                                                    gameSpiritPickerAspects[spirit.id] ?? null
                                                )
                                            }
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
