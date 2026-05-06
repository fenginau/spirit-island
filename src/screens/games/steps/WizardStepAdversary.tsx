import type { Adversary } from '../../../types'

interface WizardStepAdversaryProps {
    filteredAdversaries: Adversary[]
    gameAdversary: Adversary | null
    gameAdversaryLevel: number | null
    adversaryFrontCardByName: Record<string, string>
    selectGameAdversary: (adversary: Adversary) => void
    setShowGameAdversaryPickerModal: (show: boolean) => void
    setGameAdversaryLevel: (level: number | null) => void
}

export default function WizardStepAdversary({
    filteredAdversaries,
    gameAdversary,
    gameAdversaryLevel,
    adversaryFrontCardByName,
    selectGameAdversary,
    setShowGameAdversaryPickerModal,
    setGameAdversaryLevel
}: WizardStepAdversaryProps) {
    return (
        <section className='glass-panel p-6 rounded-2xl shadow-xl space-y-5'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
                <h2 className='text-xl font-bold text-slate-100'>Adversary (Optional)</h2>
                <p className='text-sm text-slate-400'>
                    {filteredAdversaries.length} available with current expansions
                </p>
            </div>

            <div className='flex flex-wrap gap-3'>
                <button
                    onClick={() => {
                        if (filteredAdversaries.length === 0) return
                        const randomIndex = Math.floor(Math.random() * filteredAdversaries.length)
                        selectGameAdversary(filteredAdversaries[randomIndex])
                    }}
                    disabled={filteredAdversaries.length === 0}
                    className='px-6 py-3 rounded-xl bg-primary hover:bg-blue-500 text-white font-bold disabled:opacity-50'>
                    Pick Adversary
                </button>
                <button
                    onClick={() => setShowGameAdversaryPickerModal(true)}
                    disabled={filteredAdversaries.length === 0}
                    className='px-6 py-3 rounded-xl border border-primary/50 text-slate-100 hover:bg-primary/10 font-bold disabled:opacity-50'>
                    Manual Select
                </button>
            </div>

            {gameAdversary && (
                <div className='rounded-xl border border-primary/30 bg-slate-900/70 p-4 space-y-4'>
                    <h3 className='text-lg font-bold text-slate-100'>{gameAdversary.name}</h3>
                    <p className='text-sm text-slate-400'>
                        Difficulty Range: {gameAdversary.difficultyRange}
                    </p>
                    {adversaryFrontCardByName[gameAdversary.name] && (
                        <div className='w-full'>
                            <img
                                src={adversaryFrontCardByName[gameAdversary.name]}
                                alt={`${gameAdversary.name} adversary card front`}
                                className='w-full h-auto object-contain rounded-lg'
                                referrerPolicy='no-referrer'
                            />
                        </div>
                    )}
                    <label className='space-y-2 block'>
                        <span className='text-xs font-bold uppercase tracking-widest text-slate-400'>
                            Level
                        </span>
                        <select
                            value={gameAdversaryLevel ?? ''}
                            onChange={(e) =>
                                setGameAdversaryLevel(
                                    e.target.value === '' ? null : Number.parseInt(e.target.value, 10)
                                )
                            }
                            className='picker-select w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100'>
                            <option value=''>Select level</option>
                            {[0, 1, 2, 3, 4, 5, 6].map((level) => (
                                <option key={level} value={level}>
                                    Level {level}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            )}
        </section>
    )
}
