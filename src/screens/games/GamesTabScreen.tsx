import type { RefObject } from 'react'
import type {
    Adversary,
    BoardSide,
    Difficulty,
    GamePlayerSelection,
    GameRecord,
    SpiritWithAspects
} from '../../types'
import GamesLandingScreen from './GamesLandingScreen'
import GamesDetailScreen from './GamesDetailScreen'
import GamesScoringScreen from './GamesScoringScreen'
import GamesWizardScreen from './GamesWizardScreen'

interface GamesTabScreenProps {
    gamesScreen: 'landing' | 'wizard' | 'detail' | 'scoring'
    selectedGame: GameRecord | null
    gamesSortBy: 'date' | 'score'
    sortedGames: GameRecord[]
    startGameWizard: () => void
    openGameDetail: (gameId: string) => void
    setGamesSortBy: (value: 'date' | 'score') => void
    openGamesLanding: () => void
    openScoring: () => void
    downloadGameDetailImage: (game: GameRecord) => void
    isDownloadingGameImage: boolean
    isExportingGameImage: boolean
    gameDetailExportRef: RefObject<HTMLDivElement | null>
    editingPlayerNameId: number | null
    editingPlayerNameValue: string
    setEditingPlayerNameValue: (value: string) => void
    saveSelectedGamePlayerName: (player: number) => void
    beginEditPlayerName: (selection: GamePlayerSelection) => void
    cancelEditPlayerName: () => void
    getDefaultPlayerName: (player: number) => string
    hasLocalPlayCardForSpirit: (spirit: SpiritWithAspects) => boolean
    openSpiritPlayCardModal: (spirit: SpiritWithAspects, aspect?: string | null) => void
    getBoardDifficultyModifier: (boardSide: BoardSide) => number
    scoreOutcome: 'Victory' | 'Defeat'
    scoreDifficulty: number
    scoreInvaderRemaining: number
    scoreInvaderNotInDeck: number
    scoreLivingDahan: number
    scoreBlight: number
    setGamesScreen: (screen: 'detail') => void
    setScoreOutcome: (outcome: 'Victory' | 'Defeat') => void
    setScoreDifficulty: (value: number) => void
    setScoreInvaderRemaining: (value: number) => void
    setScoreInvaderNotInDeck: (value: number) => void
    setScoreLivingDahan: (value: number) => void
    setScoreBlight: (value: number) => void
    scoreGame: () => void
    gameStep: number
    gameError: string
    isStartingGame: boolean
    gameTeamName: string
    gamePlayers: number
    gameCandidateCount: number
    gameBoardSide: BoardSide
    selectedDifficulties: Difficulty[]
    selectedExpansions: string[]
    difficulties: Difficulty[]
    expansions: string[]
    filteredSpirits: SpiritWithAspects[]
    filteredAdversaries: Adversary[]
    gameCurrentPlayer: number
    gameSelections: GamePlayerSelection[]
    gameAdversary: Adversary | null
    gameAdversaryLevel: number | null
    isAiComposing: boolean
    adversaryFrontCardByName: Record<string, string>
    updateGamePlayers: (value: number) => void
    setGameTeamName: (value: string) => void
    setGameCandidateCount: (value: number) => void
    setGameBoardSide: (value: BoardSide) => void
    toggleDifficulty: (difficulty: Difficulty) => void
    toggleExpansion: (expansion: string) => void
    drawGameCandidates: (player?: number) => void
    pickSpiritCompositionForTeam: () => void
    openGameSpiritPicker: (player: number) => void
    selectGameAdversary: (adversary: Adversary) => void
    setShowGameAdversaryPickerModal: (show: boolean) => void
    setGameAdversaryLevel: (level: number | null) => void
    setEditingPlayerNameValueForWizard: (value: string) => void
    savePlayerName: (player: number) => void
    previousGameStep: () => void
    nextGameStep: () => void
    skipAdversaryStep: () => void
    startGameFromWizard: () => void
    getWizardPlayerLabel: (player: number) => string
}

export default function GamesTabScreen(props: GamesTabScreenProps) {
    if (props.gamesScreen === 'landing') {
        return (
            <GamesLandingScreen
                gamesSortBy={props.gamesSortBy}
                sortedGames={props.sortedGames}
                setGamesSortBy={props.setGamesSortBy}
                startGameWizard={props.startGameWizard}
                openGameDetail={props.openGameDetail}
            />
        )
    }

    if (props.gamesScreen === 'detail' && props.selectedGame) {
        return (
            <GamesDetailScreen
                selectedGame={props.selectedGame}
                gameDetailExportRef={props.gameDetailExportRef}
                isDownloadingGameImage={props.isDownloadingGameImage}
                isExportingGameImage={props.isExportingGameImage}
                editingPlayerNameId={props.editingPlayerNameId}
                editingPlayerNameValue={props.editingPlayerNameValue}
                openGamesLanding={props.openGamesLanding}
                openScoring={props.openScoring}
                downloadGameDetailImage={props.downloadGameDetailImage}
                setEditingPlayerNameValue={props.setEditingPlayerNameValue}
                saveSelectedGamePlayerName={props.saveSelectedGamePlayerName}
                beginEditPlayerName={props.beginEditPlayerName}
                cancelEditPlayerName={props.cancelEditPlayerName}
                getDefaultPlayerName={props.getDefaultPlayerName}
                hasLocalPlayCardForSpirit={props.hasLocalPlayCardForSpirit}
                openSpiritPlayCardModal={props.openSpiritPlayCardModal}
            />
        )
    }

    if (props.gamesScreen === 'scoring' && props.selectedGame) {
        return (
            <GamesScoringScreen
                selectedGameBoardSide={props.selectedGame.boardSide}
                scoreOutcome={props.scoreOutcome}
                scoreDifficulty={props.scoreDifficulty}
                scoreInvaderRemaining={props.scoreInvaderRemaining}
                scoreInvaderNotInDeck={props.scoreInvaderNotInDeck}
                scoreLivingDahan={props.scoreLivingDahan}
                scoreBlight={props.scoreBlight}
                getBoardDifficultyModifier={props.getBoardDifficultyModifier}
                setGamesScreen={props.setGamesScreen}
                setScoreOutcome={props.setScoreOutcome}
                setScoreDifficulty={props.setScoreDifficulty}
                setScoreInvaderRemaining={props.setScoreInvaderRemaining}
                setScoreInvaderNotInDeck={props.setScoreInvaderNotInDeck}
                setScoreLivingDahan={props.setScoreLivingDahan}
                setScoreBlight={props.setScoreBlight}
                scoreGame={props.scoreGame}
            />
        )
    }

    if (props.gamesScreen === 'wizard') {
        return (
            <GamesWizardScreen
                gameStep={props.gameStep}
                gameError={props.gameError}
                isStartingGame={props.isStartingGame}
                gameTeamName={props.gameTeamName}
                gamePlayers={props.gamePlayers}
                gameCandidateCount={props.gameCandidateCount}
                gameBoardSide={props.gameBoardSide}
                selectedDifficulties={props.selectedDifficulties}
                selectedExpansions={props.selectedExpansions}
                difficulties={props.difficulties}
                expansions={props.expansions}
                filteredSpirits={props.filteredSpirits}
                filteredAdversaries={props.filteredAdversaries}
                gameCurrentPlayer={props.gameCurrentPlayer}
                gameSelections={props.gameSelections}
                editingPlayerNameId={props.editingPlayerNameId}
                editingPlayerNameValue={props.editingPlayerNameValue}
                gameAdversary={props.gameAdversary}
                gameAdversaryLevel={props.gameAdversaryLevel}
                isAiComposing={props.isAiComposing}
                adversaryFrontCardByName={props.adversaryFrontCardByName}
                updateGamePlayers={props.updateGamePlayers}
                setGameTeamName={props.setGameTeamName}
                setGameCandidateCount={props.setGameCandidateCount}
                setGameBoardSide={props.setGameBoardSide}
                toggleDifficulty={props.toggleDifficulty}
                toggleExpansion={props.toggleExpansion}
                drawGameCandidates={props.drawGameCandidates}
                pickSpiritCompositionForTeam={props.pickSpiritCompositionForTeam}
                openGameSpiritPicker={props.openGameSpiritPicker}
                selectGameAdversary={props.selectGameAdversary}
                setShowGameAdversaryPickerModal={props.setShowGameAdversaryPickerModal}
                setGameAdversaryLevel={props.setGameAdversaryLevel}
                beginEditPlayerName={props.beginEditPlayerName}
                setEditingPlayerNameValue={props.setEditingPlayerNameValueForWizard}
                savePlayerName={props.savePlayerName}
                cancelEditPlayerName={props.cancelEditPlayerName}
                previousGameStep={props.previousGameStep}
                nextGameStep={props.nextGameStep}
                skipAdversaryStep={props.skipAdversaryStep}
                startGameFromWizard={props.startGameFromWizard}
                getWizardPlayerLabel={props.getWizardPlayerLabel}
            />
        )
    }

    return null
}
