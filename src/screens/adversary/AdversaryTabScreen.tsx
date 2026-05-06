import { AnimatePresence, motion } from 'motion/react'
import { Check, RotateCcw, Shield } from 'lucide-react'
import type { Adversary, AdversaryHistoryEntry } from '../../types'

interface AdversaryTabScreenProps {
    expansions: string[]
    selectedExpansions: string[]
    filteredAdversaries: Adversary[]
    pickedAdversary: Adversary | null
    adversaryHistory: AdversaryHistoryEntry[]
    onToggleExpansion: (expansion: string) => void
    onClearFilters: () => void
    onPickAdversary: () => void
    onClearAdversaryHistory: () => void
}

export default function AdversaryTabScreen({
    expansions,
    selectedExpansions,
    filteredAdversaries,
    pickedAdversary,
    adversaryHistory,
    onToggleExpansion,
    onClearFilters,
    onPickAdversary,
    onClearAdversaryHistory
}: AdversaryTabScreenProps) {
    return (
        <>
            <motion.section
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className='glass-panel p-6 rounded-2xl shadow-xl space-y-6'>
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

                <div className='pt-4 border-t border-slate-700/50 flex justify-between items-center gap-4'>
                    <div className='text-slate-400 text-sm font-medium'>
                        <span className='text-primary font-bold'>{filteredAdversaries.length}</span>{' '}
                        Adversaries available
                    </div>
                    <button
                        onClick={onClearFilters}
                        className='text-slate-500 hover:text-slate-200 text-sm flex items-center gap-1.5 transition-colors'>
                        <RotateCcw size={14} />
                        Clear Filters
                    </button>
                </div>
            </motion.section>

            <section className='glass-panel p-6 rounded-2xl shadow-xl space-y-5'>
                <div>
                    <h2 className='text-xl font-bold text-slate-100 flex items-center gap-2'>
                        <Shield className='text-primary' size={20} />
                        Random Adversary
                    </h2>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onPickAdversary}
                    disabled={filteredAdversaries.length === 0}
                    className='w-full md:w-auto px-16 py-6 bg-primary hover:bg-blue-500 text-white rounded-2xl text-2xl font-bold shadow-[0_0_30px_rgba(19,146,236,0.3)] transition-all flex items-center justify-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'>
                    <Shield size={26} />
                    Pick an Adversary
                </motion.button>

                {pickedAdversary && (
                    <div className='rounded-xl border border-primary/30 bg-slate-900/70 p-4'>
                        <h3 className='text-lg font-bold text-slate-100'>{pickedAdversary.name}</h3>
                        <div className='mt-2 flex flex-wrap gap-2'>
                            <span className='px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-widest'>
                                Difficulty {pickedAdversary.difficultyRange}
                            </span>
                            <span className='px-3 py-1 border border-slate-600 text-slate-300 text-xs font-semibold rounded-full'>
                                {pickedAdversary.expansion}
                            </span>
                        </div>
                    </div>
                )}

                <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                        <h3 className='text-sm font-bold uppercase tracking-widest text-slate-400'>
                            Adversary History
                        </h3>
                        <button
                            onClick={onClearAdversaryHistory}
                            className='text-slate-500 hover:text-rose-400 text-xs uppercase tracking-widest font-bold transition-colors'>
                            Clear History
                        </button>
                    </div>
                    <div className='space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1'>
                        <AnimatePresence initial={false}>
                            {adversaryHistory.length > 0 ? (
                                adversaryHistory.map((item, idx) => (
                                    <motion.div
                                        key={`${item.id}-${idx}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className='rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-3'>
                                        <div className='flex justify-between items-start gap-3'>
                                            <h4 className='font-semibold text-slate-100'>{item.name}</h4>
                                            <span className='text-[10px] text-slate-500 uppercase font-mono bg-slate-800 px-2 py-0.5 rounded'>
                                                {item.timestamp}
                                            </span>
                                        </div>
                                        <p className='mt-1 text-xs text-slate-400'>
                                            Difficulty {item.difficultyRange} • {item.expansion}
                                        </p>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className='text-slate-600 text-center py-6 italic border border-dashed border-slate-800 rounded-xl'>
                                    Adversary picks will appear here...
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>
        </>
    )
}
