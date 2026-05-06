import type { BoardSide } from '../../../types'

interface WizardStepSetupProps {
    gameTeamName: string
    gamePlayers: number
    gameCandidateCount: number
    gameBoardSide: BoardSide
    setGameTeamName: (value: string) => void
    updateGamePlayers: (value: number) => void
    setGameCandidateCount: (value: number) => void
    setGameBoardSide: (value: BoardSide) => void
}

export default function WizardStepSetup({
    gameTeamName,
    gamePlayers,
    gameCandidateCount,
    gameBoardSide,
    setGameTeamName,
    updateGamePlayers,
    setGameCandidateCount,
    setGameBoardSide
}: WizardStepSetupProps) {
    return (
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
                        onChange={(e) => updateGamePlayers(Number.parseInt(e.target.value || '1', 10))}
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
                            setGameCandidateCount(Math.max(1, Number.parseInt(e.target.value || '3', 10)))
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
    )
}
