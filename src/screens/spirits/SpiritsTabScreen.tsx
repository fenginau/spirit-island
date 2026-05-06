import { motion } from 'motion/react'
import { Check, RotateCcw, Sparkles } from 'lucide-react'
import SpiritDisplayCard from '../../components/SpiritDisplayCard'
import type { Difficulty, SpiritWithAspects } from '../../types'

interface SpiritsTabScreenProps {
    difficulties: Difficulty[]
    expansions: string[]
    selectedDifficulties: Difficulty[]
    selectedExpansions: string[]
    filteredSpirits: SpiritWithAspects[]
    sortedFilteredSpirits: SpiritWithAspects[]
    spiritsSort: 'name-asc' | 'name-desc' | 'difficulty-asc' | 'difficulty-desc'
    onSpiritsSortChange: (value: 'name-asc' | 'name-desc' | 'difficulty-asc' | 'difficulty-desc') => void
    onToggleDifficulty: (difficulty: Difficulty) => void
    onToggleExpansion: (expansion: string) => void
    onClearFilters: () => void
    onPickSpirit: () => void
    onShowHistory: () => void
    hasLocalPlayCardForSpirit: (spirit: SpiritWithAspects) => boolean
    onOpenSpiritPlayCard: (spirit: SpiritWithAspects) => void
}

export default function SpiritsTabScreen({
    difficulties,
    expansions,
    selectedDifficulties,
    selectedExpansions,
    filteredSpirits,
    sortedFilteredSpirits,
    spiritsSort,
    onSpiritsSortChange,
    onToggleDifficulty,
    onToggleExpansion,
    onClearFilters,
    onPickSpirit,
    onShowHistory,
    hasLocalPlayCardForSpirit,
    onOpenSpiritPlayCard
}: SpiritsTabScreenProps) {
    return (
        <>
            <motion.section
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className='glass-panel p-6 rounded-2xl shadow-xl space-y-8'>
                <div className='space-y-4'>
                    <label className='block text-xs font-bold uppercase tracking-widest text-slate-400'>
                        Difficulty
                    </label>
                    <div className='flex flex-wrap gap-3'>
                        {difficulties.map((diff) => (
                            <button
                                key={diff}
                                onClick={() => onToggleDifficulty(diff)}
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
                                        onChange={() => onToggleExpansion(exp)}
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

                <div className='pt-6 border-t border-slate-700/50 flex flex-col sm:flex-row justify-between items-center gap-4'>
                    <div className='text-slate-400 text-sm font-medium flex items-center gap-2'>
                        <span className='text-primary font-bold'>{filteredSpirits.length}</span>
                        Spirits matching filters
                    </div>
                    <button
                        onClick={onClearFilters}
                        className='text-slate-500 hover:text-slate-200 text-sm flex items-center gap-1.5 transition-colors'>
                        <RotateCcw size={14} />
                        Clear Filters
                    </button>
                </div>
            </motion.section>

            <div className='text-center'>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onPickSpirit}
                    disabled={filteredSpirits.length === 0}
                    className='w-full md:w-auto px-16 py-6 bg-primary hover:bg-blue-500 text-white rounded-2xl text-2xl font-bold shadow-[0_0_30px_rgba(19,146,236,0.3)] transition-all flex items-center justify-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'>
                    <Sparkles size={28} />
                    Draw a Spirit
                </motion.button>
                <button
                    onClick={onShowHistory}
                    className='mt-3 text-sm text-slate-400 hover:text-primary underline underline-offset-4 transition-colors'>
                    Display draw history
                </button>
                {filteredSpirits.length === 0 && (
                    <p className='mt-4 text-rose-400 text-sm'>
                        Please select at least one expansion and difficulty.
                    </p>
                )}
            </div>

            <section className='space-y-4'>
                <div className='glass-panel p-5 rounded-2xl border border-slate-700/60 space-y-4'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                        <h2 className='text-lg font-bold text-slate-100'>Spirit List</h2>
                        <div className='flex items-center gap-2'>
                            <select
                                value={spiritsSort}
                                onChange={(e) =>
                                    onSpiritsSortChange(
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
                                            onViewPlayCard={() => onOpenSpiritPlayCard(spirit)}
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
    )
}
