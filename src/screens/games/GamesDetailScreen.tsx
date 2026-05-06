import { Pencil, Share2 } from 'lucide-react'
import type { RefObject } from 'react'
import ScoreBadge from '../../components/ScoreBadge'
import SpiritDisplayCard from '../../components/SpiritDisplayCard'
import type { GamePlayerSelection, GameRecord, SpiritWithAspects } from '../../types'

interface GamesDetailScreenProps {
    selectedGame: GameRecord
    gameDetailExportRef: RefObject<HTMLDivElement | null>
    isDownloadingGameImage: boolean
    isExportingGameImage: boolean
    editingPlayerNameId: number | null
    editingPlayerNameValue: string
    openGamesLanding: () => void
    openScoring: () => void
    downloadGameDetailImage: (game: GameRecord) => void
    setEditingPlayerNameValue: (value: string) => void
    saveSelectedGamePlayerName: (player: number) => void
    beginEditPlayerName: (selection: GamePlayerSelection) => void
    cancelEditPlayerName: () => void
    getDefaultPlayerName: (player: number) => string
    hasLocalPlayCardForSpirit: (spirit: SpiritWithAspects) => boolean
    openSpiritPlayCardModal: (spirit: SpiritWithAspects, aspect?: string | null) => void
}

export default function GamesDetailScreen({
    selectedGame,
    gameDetailExportRef,
    isDownloadingGameImage,
    isExportingGameImage,
    editingPlayerNameId,
    editingPlayerNameValue,
    openGamesLanding,
    openScoring,
    downloadGameDetailImage,
    setEditingPlayerNameValue,
    saveSelectedGamePlayerName,
    beginEditPlayerName,
    cancelEditPlayerName,
    getDefaultPlayerName,
    hasLocalPlayCardForSpirit,
    openSpiritPlayCardModal
}: GamesDetailScreenProps) {
    return (
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
                        <ScoreBadge score={selectedGame.score?.total} valueClassName='text-4xl' />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                        <div className='rounded-xl border border-slate-700 bg-slate-900/40 p-4'>
                            <p className='text-slate-400 uppercase text-xs tracking-widest font-bold'>Players</p>
                            <p className='text-slate-100 mt-2'>{selectedGame.players}</p>
                        </div>
                        <div className='rounded-xl border border-slate-700 bg-slate-900/40 p-4'>
                            <p className='text-slate-400 uppercase text-xs tracking-widest font-bold'>
                                Candidates Per Pick
                            </p>
                            <p className='text-slate-100 mt-2'>{selectedGame.candidateCount}</p>
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
                                {!isExportingGameImage && editingPlayerNameId === selection.player ? (
                                    <input
                                        type='text'
                                        autoFocus
                                        value={editingPlayerNameValue}
                                        onFocus={(e) => e.currentTarget.select()}
                                        onChange={(e) => setEditingPlayerNameValue(e.target.value)}
                                        onBlur={() => saveSelectedGamePlayerName(selection.player)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                saveSelectedGamePlayerName(selection.player)
                                            } else if (e.key === 'Escape') {
                                                cancelEditPlayerName()
                                            }
                                        }}
                                        className='w-full max-w-xs rounded-lg border border-slate-600 bg-slate-900 px-3 py-1.5 text-sm font-bold text-slate-100'
                                    />
                                ) : (
                                    <div className='flex items-center gap-2'>
                                        <p className='text-sm font-bold text-slate-200'>
                                            {selection.playerName || getDefaultPlayerName(selection.player)}
                                        </p>
                                        <button
                                            onClick={() => beginEditPlayerName(selection)}
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
                                            openSpiritPlayCardModal(selection.spirit!, selection.aspect)
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
                    <h3 className='text-sm font-bold uppercase tracking-widest text-slate-400'>Adversary</h3>
                    <p className='text-slate-200 mt-2'>
                        {selectedGame.adversary
                            ? `${selectedGame.adversary.name} • Level ${selectedGame.adversaryLevel ?? 0}`
                            : 'None'}
                    </p>
                </section>
            </div>
        </section>
    )
}
