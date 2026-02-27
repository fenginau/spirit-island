import type { SpiritWithAspects } from '../types'

interface SpiritDisplayCardProps {
    spirit: SpiritWithAspects
    selectedAspect: string | null
    onSelectAspect?: (aspect: string | null) => void
    onConfirm?: () => void
    confirmDisabled?: boolean
    confirmLabel?: string
    compact?: boolean
    footerText?: string
}

export default function SpiritDisplayCard({
    spirit,
    selectedAspect,
    onSelectAspect,
    onConfirm,
    confirmDisabled = false,
    confirmLabel = 'Confirm Selection',
    compact = false,
    footerText
}: SpiritDisplayCardProps) {
    if (compact) {
        return (
            <div className='rounded-xl border border-slate-700 bg-slate-900/40 p-4'>
                <div className='flex items-center gap-3'>
                    <img
                        src={spirit.image}
                        alt={spirit.name}
                        className='w-16 h-16 rounded-lg object-cover border border-slate-700'
                    />
                    <div>
                        <h4 className='font-bold text-slate-100'>{spirit.name}</h4>
                        <p className='text-xs text-slate-400'>
                            {spirit.difficulty} • {spirit.expansion}
                        </p>
                        <p className='text-xs text-slate-500 mt-1'>Aspect: {selectedAspect ?? 'No Aspect'}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className='relative h-72 overflow-hidden'>
                <img
                    src={spirit.image}
                    alt={spirit.name}
                    className='w-full h-full object-cover'
                    referrerPolicy='no-referrer'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent' />
            </div>

            <div className='p-8 space-y-6'>
                <div className='flex flex-wrap gap-3'>
                    <span className='px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg shadow-primary/20'>
                        {spirit.difficulty}
                    </span>
                    <span className='px-4 py-1.5 border border-slate-600 text-slate-300 text-xs font-semibold rounded-full bg-slate-800/50'>
                        {spirit.expansion}
                    </span>
                </div>

                <h2 className='text-4xl md:text-5xl font-bold leading-tight text-white tracking-tight'>
                    {spirit.name}
                </h2>

                {onSelectAspect && (
                    <div className='space-y-2'>
                        <p className='text-xs uppercase tracking-widest text-slate-400 font-bold'>Aspect</p>
                        <div className='flex flex-wrap gap-2'>
                            <button
                                onClick={() => onSelectAspect(null)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                                    selectedAspect === null
                                        ? 'bg-primary border-primary text-white'
                                        : 'border-slate-600 text-slate-300 hover:border-primary/60'
                                }`}>
                                No Aspect
                            </button>
                            {spirit.aspects.map((aspect) => (
                                <button
                                    key={aspect}
                                    onClick={() => onSelectAspect(aspect)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                                        selectedAspect === aspect
                                            ? 'bg-primary border-primary text-white'
                                            : 'border-slate-600 text-slate-300 hover:border-primary/60'
                                    }`}>
                                    {aspect}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {(onConfirm || footerText) && (
                    <div className='pt-6 border-t border-slate-800 space-y-3'>
                        {onConfirm && (
                            <button
                                onClick={onConfirm}
                                disabled={confirmDisabled}
                                className='w-full py-3 rounded-xl bg-primary hover:bg-blue-500 text-white font-bold text-sm uppercase tracking-wider transition-colors shadow-[0_0_24px_rgba(19,146,236,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary'>
                                {confirmLabel}
                            </button>
                        )}
                        {footerText && <p className='text-center text-[11px] text-slate-500'>{footerText}</p>}
                    </div>
                )}
            </div>
        </div>
    )
}
