import { Pencil } from 'lucide-react'
import type { Adversary, BoardSide, GamePlayerSelection } from '../../../types'

interface WizardStepReviewProps {
    gamePlayers: number
    gameCandidateCount: number
    gameBoardSide: BoardSide
    gameSelections: GamePlayerSelection[]
    gameAdversary: Adversary | null
    gameAdversaryLevel: number | null
    editingPlayerNameId: number | null
    editingPlayerNameValue: string
    beginEditPlayerName: (selection: GamePlayerSelection) => void
    setEditingPlayerNameValue: (value: string) => void
    savePlayerName: (player: number) => void
    cancelEditPlayerName: () => void
}

export default function WizardStepReview({
    gamePlayers,
    gameCandidateCount,
    gameBoardSide,
    gameSelections,
    gameAdversary,
    gameAdversaryLevel,
    editingPlayerNameId,
    editingPlayerNameValue,
    beginEditPlayerName,
    setEditingPlayerNameValue,
    savePlayerName,
    cancelEditPlayerName
}: WizardStepReviewProps) {
    return (
        <section className='glass-panel p-6 rounded-2xl shadow-xl space-y-6'>
            <h2 className='text-xl font-bold text-slate-100'>Review</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                <div className='rounded-xl border border-slate-700 bg-slate-900/40 p-4'>
                    <p className='text-slate-400 uppercase text-xs tracking-widest font-bold'>Players</p>
                    <p className='text-slate-100 mt-2'>{gamePlayers}</p>
                </div>
                <div className='rounded-xl border border-slate-700 bg-slate-900/40 p-4'>
                    <p className='text-slate-400 uppercase text-xs tracking-widest font-bold'>
                        Candidates Per Pick
                    </p>
                    <p className='text-slate-100 mt-2'>{gameCandidateCount}</p>
                </div>
                <div className='rounded-xl border border-slate-700 bg-slate-900/40 p-4'>
                    <p className='text-slate-400 uppercase text-xs tracking-widest font-bold'>Board Side</p>
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
                                    onChange={(e) => setEditingPlayerNameValue(e.target.value)}
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
                                    <span className='text-slate-200 font-semibold'>{selection.playerName}:</span>
                                    <button
                                        onClick={() => beginEditPlayerName(selection)}
                                        className='text-slate-400 hover:text-slate-200 transition-colors'
                                        aria-label={`Edit ${selection.playerName} name`}>
                                        <Pencil size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <span className='text-slate-100'>{selection.spirit?.name ?? 'Not selected'}</span>
                        <span className='text-slate-400'> ({selection.aspect ?? 'No Aspect'})</span>
                    </div>
                ))}
            </div>

            <div className='space-y-2'>
                <h3 className='text-sm font-bold uppercase tracking-widest text-slate-400'>Adversary</h3>
                <div className='rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-200'>
                    {gameAdversary ? `${gameAdversary.name} • Level ${gameAdversaryLevel}` : 'None'}
                </div>
            </div>
        </section>
    )
}
