interface ScoreBadgeProps {
    score: number | null | undefined
    className?: string
    valueClassName?: string
}

export default function ScoreBadge({
    score,
    className = '',
    valueClassName = 'text-2xl leading-none'
}: ScoreBadgeProps) {
    return (
        <div
            className={`rounded-xl border border-primary/40 bg-slate-900/60 px-4 py-3 min-w-24 text-center flex flex-col items-center justify-center gap-1 ${className}`.trim()}>
            <p className='text-[10px] uppercase tracking-widest font-bold text-slate-400 leading-none'>
                Score
            </p>
            <p className={`${valueClassName} font-bold text-primary`.trim()}>
                {typeof score === 'number' ? score : '—'}
            </p>
        </div>
    )
}
