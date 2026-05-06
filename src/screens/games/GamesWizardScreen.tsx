import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Adversary, BoardSide, Difficulty, GamePlayerSelection, SpiritWithAspects } from '../../types'
import WizardStepSetup from './steps/WizardStepSetup'
import WizardStepSpirits from './steps/WizardStepSpirits'
import WizardStepAdversary from './steps/WizardStepAdversary'
import WizardStepReview from './steps/WizardStepReview'

interface GamesWizardScreenProps {
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
    editingPlayerNameId: number | null
    editingPlayerNameValue: string
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
    beginEditPlayerName: (selection: GamePlayerSelection) => void
    setEditingPlayerNameValue: (value: string) => void
    savePlayerName: (player: number) => void
    cancelEditPlayerName: () => void
    previousGameStep: () => void
    nextGameStep: () => void
    skipAdversaryStep: () => void
    startGameFromWizard: () => void
    getWizardPlayerLabel: (player: number) => string
}

export default function GamesWizardScreen({
    gameStep,
    gameError,
    isStartingGame,
    gameTeamName,
    gamePlayers,
    gameCandidateCount,
    gameBoardSide,
    selectedDifficulties,
    selectedExpansions,
    difficulties,
    expansions,
    filteredSpirits,
    filteredAdversaries,
    gameCurrentPlayer,
    gameSelections,
    editingPlayerNameId,
    editingPlayerNameValue,
    gameAdversary,
    gameAdversaryLevel,
    isAiComposing,
    adversaryFrontCardByName,
    updateGamePlayers,
    setGameTeamName,
    setGameCandidateCount,
    setGameBoardSide,
    toggleDifficulty,
    toggleExpansion,
    drawGameCandidates,
    pickSpiritCompositionForTeam,
    openGameSpiritPicker,
    selectGameAdversary,
    setShowGameAdversaryPickerModal,
    setGameAdversaryLevel,
    beginEditPlayerName,
    setEditingPlayerNameValue,
    savePlayerName,
    cancelEditPlayerName,
    previousGameStep,
    nextGameStep,
    skipAdversaryStep,
    startGameFromWizard,
    getWizardPlayerLabel
}: GamesWizardScreenProps) {
    return (
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
                <WizardStepSetup
                    gameTeamName={gameTeamName}
                    gamePlayers={gamePlayers}
                    gameCandidateCount={gameCandidateCount}
                    gameBoardSide={gameBoardSide}
                    setGameTeamName={setGameTeamName}
                    updateGamePlayers={updateGamePlayers}
                    setGameCandidateCount={setGameCandidateCount}
                    setGameBoardSide={setGameBoardSide}
                />
            )}

            {gameStep === 2 && (
                <WizardStepSpirits
                    gameTeamName={gameTeamName}
                    difficulties={difficulties}
                    expansions={expansions}
                    selectedDifficulties={selectedDifficulties}
                    selectedExpansions={selectedExpansions}
                    gameCurrentPlayer={gameCurrentPlayer}
                    gamePlayers={gamePlayers}
                    gameCandidateCount={gameCandidateCount}
                    filteredSpiritsCount={filteredSpirits.length}
                    isAiComposing={isAiComposing}
                    gameSelections={gameSelections}
                    editingPlayerNameId={editingPlayerNameId}
                    editingPlayerNameValue={editingPlayerNameValue}
                    getWizardPlayerLabel={getWizardPlayerLabel}
                    toggleDifficulty={toggleDifficulty}
                    toggleExpansion={toggleExpansion}
                    drawGameCandidates={drawGameCandidates}
                    pickSpiritCompositionForTeam={pickSpiritCompositionForTeam}
                    openGameSpiritPicker={openGameSpiritPicker}
                    beginEditPlayerName={beginEditPlayerName}
                    setEditingPlayerNameValue={setEditingPlayerNameValue}
                    savePlayerName={savePlayerName}
                    cancelEditPlayerName={cancelEditPlayerName}
                />
            )}

            {gameStep === 3 && (
                <WizardStepAdversary
                    filteredAdversaries={filteredAdversaries}
                    gameAdversary={gameAdversary}
                    gameAdversaryLevel={gameAdversaryLevel}
                    adversaryFrontCardByName={adversaryFrontCardByName}
                    selectGameAdversary={selectGameAdversary}
                    setShowGameAdversaryPickerModal={setShowGameAdversaryPickerModal}
                    setGameAdversaryLevel={setGameAdversaryLevel}
                />
            )}

            {gameStep === 4 && (
                <WizardStepReview
                    gamePlayers={gamePlayers}
                    gameCandidateCount={gameCandidateCount}
                    gameBoardSide={gameBoardSide}
                    gameSelections={gameSelections}
                    gameAdversary={gameAdversary}
                    gameAdversaryLevel={gameAdversaryLevel}
                    editingPlayerNameId={editingPlayerNameId}
                    editingPlayerNameValue={editingPlayerNameValue}
                    beginEditPlayerName={beginEditPlayerName}
                    setEditingPlayerNameValue={setEditingPlayerNameValue}
                    savePlayerName={savePlayerName}
                    cancelEditPlayerName={cancelEditPlayerName}
                />
            )}

            {gameError && <p className='text-rose-400 text-sm font-medium px-1'>{gameError}</p>}

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
    )
}
