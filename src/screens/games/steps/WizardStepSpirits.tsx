import { motion } from 'motion/react'
import { Check, Pencil } from 'lucide-react'
import SpiritDisplayCard from '../../../components/SpiritDisplayCard'
import type { Difficulty, GamePlayerSelection } from '../../../types'

interface WizardStepSpiritsProps {
    gameTeamName: string
    difficulties: Difficulty[]
    expansions: string[]
    selectedDifficulties: Difficulty[]
    selectedExpansions: string[]
    gameCurrentPlayer: number
    gamePlayers: number
    gameCandidateCount: number
    filteredSpiritsCount: number
    isAiComposing: boolean
    gameSelections: GamePlayerSelection[]
    editingPlayerNameId: number | null
    editingPlayerNameValue: string
    getWizardPlayerLabel: (player: number) => string
    toggleDifficulty: (difficulty: Difficulty) => void
    toggleExpansion: (expansion: string) => void
    drawGameCandidates: (player?: number) => void
    pickSpiritCompositionForTeam: () => void
    openGameSpiritPicker: (player: number) => void
    beginEditPlayerName: (selection: GamePlayerSelection) => void
    setEditingPlayerNameValue: (value: string) => void
    savePlayerName: (player: number) => void
    cancelEditPlayerName: () => void
}

export default function WizardStepSpirits({
    gameTeamName,
    difficulties,
    expansions,
    selectedDifficulties,
    selectedExpansions,
    gameCurrentPlayer,
    gamePlayers,
    gameCandidateCount,
    filteredSpiritsCount,
    isAiComposing,
    gameSelections,
    editingPlayerNameId,
    editingPlayerNameValue,
    getWizardPlayerLabel,
    toggleDifficulty,
    toggleExpansion,
    drawGameCandidates,
    pickSpiritCompositionForTeam,
    openGameSpiritPicker,
    beginEditPlayerName,
    setEditingPlayerNameValue,
    savePlayerName,
    cancelEditPlayerName
}: WizardStepSpiritsProps) {
    return (
        <>
            <motion.section
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className='glass-panel p-6 rounded-2xl shadow-xl space-y-8'>
                {gameTeamName.trim() && (
                    <div className='rounded-xl border border-primary/30 bg-slate-900/60 px-4 py-3'>
                        <p className='text-xs uppercase tracking-widest text-slate-400 font-bold'>Team</p>
                        <p className='text-slate-100 font-semibold mt-1'>{gameTeamName.trim()}</p>
                    </div>
                )}
                <div className='space-y-4'>
                    <label className='block text-xs font-bold uppercase tracking-widest text-slate-400'>
                        Difficulty
                    </label>
                    <div className='flex flex-wrap gap-3'>
                        {difficulties.map((diff) => (
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
                        {expansions.map((exp) => (
                            <label key={exp} className='flex items-center space-x-3 cursor-pointer group'>
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
                        Picking for {getWizardPlayerLabel(gameCurrentPlayer)} of {gamePlayers}
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => drawGameCandidates()}
                            disabled={filteredSpiritsCount === 0}
                            className='px-6 py-3 rounded-xl bg-primary hover:bg-blue-500 text-white font-bold transition-colors disabled:opacity-50'>
                            Draw {gameCandidateCount} Candidates
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={pickSpiritCompositionForTeam}
                            disabled={filteredSpiritsCount === 0 || isAiComposing}
                            className='px-6 py-3 rounded-xl border border-primary/50 text-slate-100 hover:bg-primary/10 font-bold transition-colors disabled:opacity-50'>
                            {isAiComposing ? 'Composing...' : 'AI Team Composition'}
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
                                            <p className='text-sm font-bold text-slate-200'>
                                                {selection.playerName}
                                            </p>
                                            <button
                                                onClick={() => beginEditPlayerName(selection)}
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
                                <p className='text-sm text-slate-500 mt-1 italic'>Not selected yet</p>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}
