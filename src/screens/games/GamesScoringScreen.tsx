import type { BoardSide } from '../../types'

interface GamesScoringScreenProps {
    selectedGameBoardSide: BoardSide
    scoreOutcome: 'Victory' | 'Defeat'
    scoreDifficulty: number
    scoreInvaderRemaining: number
    scoreInvaderNotInDeck: number
    scoreLivingDahan: number
    scoreBlight: number
    getBoardDifficultyModifier: (boardSide: BoardSide) => number
    setGamesScreen: (screen: 'detail') => void
    setScoreOutcome: (outcome: 'Victory' | 'Defeat') => void
    setScoreDifficulty: (value: number) => void
    setScoreInvaderRemaining: (value: number) => void
    setScoreInvaderNotInDeck: (value: number) => void
    setScoreLivingDahan: (value: number) => void
    setScoreBlight: (value: number) => void
    scoreGame: () => void
}

export default function GamesScoringScreen({
    selectedGameBoardSide,
    scoreOutcome,
    scoreDifficulty,
    scoreInvaderRemaining,
    scoreInvaderNotInDeck,
    scoreLivingDahan,
    scoreBlight,
    getBoardDifficultyModifier,
    setGamesScreen,
    setScoreOutcome,
    setScoreDifficulty,
    setScoreInvaderRemaining,
    setScoreInvaderNotInDeck,
    setScoreLivingDahan,
    setScoreBlight,
    scoreGame
}: GamesScoringScreenProps) {
    return (
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
                    Difficulty starts at adversary level + {getBoardDifficultyModifier(selectedGameBoardSide)} from{' '}
                    {selectedGameBoardSide} board side.
                </p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <label className='space-y-2'>
                        <span className='text-xs uppercase tracking-widest font-bold text-slate-400'>
                            Outcome
                        </span>
                        <select
                            value={scoreOutcome}
                            onChange={(e) => setScoreOutcome(e.target.value as 'Victory' | 'Defeat')}
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
                            onChange={(e) => setScoreDifficulty(Number.parseInt(e.target.value || '0', 10))}
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
                                    setScoreInvaderRemaining(Number.parseInt(e.target.value || '0', 10))
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
                                    setScoreInvaderNotInDeck(Number.parseInt(e.target.value || '0', 10))
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
                            onChange={(e) => setScoreLivingDahan(Number.parseInt(e.target.value || '0', 10))}
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
                            onChange={(e) => setScoreBlight(Number.parseInt(e.target.value || '0', 10))}
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
    )
}
