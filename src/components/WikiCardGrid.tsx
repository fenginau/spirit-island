import type { WikiCardItem } from '../data/wikiCards'

interface WikiCardGridProps {
    title: string
    cards: WikiCardItem[]
    selectedImage: string | null
    onSelectCard: (card: WikiCardItem) => void
    searchValue: string
    onSearchChange: (value: string) => void
    showSearch: boolean
}

export default function WikiCardGrid({
    title,
    cards,
    selectedImage,
    onSelectCard,
    searchValue,
    onSearchChange,
    showSearch
}: WikiCardGridProps) {
    return (
        <section className='glass-panel p-6 rounded-2xl shadow-xl space-y-4'>
            <div className='flex items-center justify-between gap-3'>
                <h3 className='text-lg font-bold text-slate-100'>{title}</h3>
                <p className='text-xs text-slate-400'>{cards.length} cards</p>
            </div>
            {showSearch && (
                <input
                    type='text'
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder='Search by card name...'
                    className='w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100'
                />
            )}

            {cards.length > 0 ? (
                <div className='space-y-4'>
                    <div className='max-h-[58vh] overflow-y-auto custom-scrollbar pr-2'>
                        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
                            {cards.map((card) => (
                                <button
                                    key={card.image}
                                    onClick={() => onSelectCard(card)}
                                    className={`rounded-xl p-2 border text-left transition-colors ${
                                        selectedImage === card.image
                                            ? 'border-primary bg-primary/10'
                                            : 'border-slate-700 bg-slate-900/40 hover:border-primary/50'
                                    }`}>
                                    <img
                                        src={card.image}
                                        alt={card.name}
                                        className='w-full aspect-[742/1039] object-contain rounded'
                                        referrerPolicy='no-referrer'
                                    />
                                    <p className='text-[11px] text-slate-300 mt-2 line-clamp-2'>{card.name}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <p className='text-slate-500 italic'>No cards found for this category.</p>
            )}
        </section>
    )
}
