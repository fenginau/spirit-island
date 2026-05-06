import { Swords } from 'lucide-react'
import ScoreBadge from '../../components/ScoreBadge'
import type { GameRecord } from '../../types'

interface GamesLandingScreenProps {
    gamesSortBy: 'date' | 'score'
    sortedGames: GameRecord[]
    setGamesSortBy: (value: 'date' | 'score') => void
    startGameWizard: () => void
    openGameDetail: (gameId: string) => void
}

export default function GamesLandingScreen({
    gamesSortBy,
    sortedGames,
    setGamesSortBy,
    startGameWizard,
    openGameDetail
}: GamesLandingScreenProps) {
    return (
        <section className='space-y-6'>
            <section className='glass-panel p-8 rounded-2xl shadow-xl text-center space-y-5'>
                <h2 className='text-2xl font-bold text-slate-100'>Games</h2>
                <p className='text-slate-400'>Start a new game setup wizard or open a saved game.</p>
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
                            onChange={(e) => setGamesSortBy(e.target.value as 'date' | 'score')}
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
                    <p className='text-slate-500 italic'>No saved games yet. Start one.</p>
                )}
            </section>
        </section>
    )
}
