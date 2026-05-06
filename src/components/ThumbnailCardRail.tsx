interface ThumbnailCardRailItem {
    id: string
    name: string
    image: string | null
    alt: string
    placeholderText?: string
}

interface ThumbnailCardRailProps {
    title: string
    items: ThumbnailCardRailItem[]
    selectedId: string | null
    onToggleSelect: (id: string) => void
}

export default function ThumbnailCardRail({
    title,
    items,
    selectedId,
    onToggleSelect
}: ThumbnailCardRailProps) {
    return (
        <div className='w-full space-y-2 pt-2'>
            <p className='text-sm text-slate-300 text-center'>
                {title} ({items.length})
            </p>
            <div className='flex justify-center gap-3 overflow-x-auto pb-2 custom-scrollbar'>
                {items.map((item) => (
                    <button
                        key={item.id}
                        type='button'
                        onClick={() => onToggleSelect(item.id)}
                        className={`shrink-0 w-40 ${
                            selectedId === item.id ? 'ring-2 ring-primary rounded-lg' : ''
                        }`}>
                        {item.image ? (
                            <img
                                src={item.image}
                                alt={item.alt}
                                className='w-full aspect-[742/1039] object-contain'
                                referrerPolicy='no-referrer'
                            />
                        ) : (
                            <div className='w-full aspect-[742/1039] rounded border border-slate-700/70 bg-slate-900/60 grid place-items-center px-2 text-center text-[11px] text-slate-400'>
                                {item.placeholderText ?? 'No local image'}
                            </div>
                        )}
                        <p className='text-[11px] text-slate-300 text-center mt-1'>{item.name}</p>
                    </button>
                ))}
            </div>
        </div>
    )
}
