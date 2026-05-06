import { BookOpen, Sparkles, Swords } from 'lucide-react'

type MainTab = 'games' | 'spirits' | 'wiki'

interface BottomTabNavProps {
    activeTab: MainTab
    onSelectTab: (tab: MainTab) => void
}

export default function BottomTabNav({ activeTab, onSelectTab }: BottomTabNavProps) {
    return (
        <nav className='fixed bottom-0 inset-x-0 z-40 pb-4 px-4'>
            <div className='max-w-4xl mx-auto'>
                <div className='glass-panel rounded-2xl border border-slate-700/60 bg-slate-900/90 backdrop-blur-md p-2 grid grid-cols-3 gap-2 shadow-2xl'>
                    <button
                        onClick={() => onSelectTab('games')}
                        className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors ${
                            activeTab === 'games'
                                ? 'bg-primary text-white'
                                : 'text-slate-300 hover:bg-slate-800'
                        }`}>
                        <Swords size={16} />
                        Games
                    </button>
                    <button
                        onClick={() => onSelectTab('spirits')}
                        className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors ${
                            activeTab === 'spirits'
                                ? 'bg-primary text-white'
                                : 'text-slate-300 hover:bg-slate-800'
                        }`}>
                        <Sparkles size={16} />
                        Spirits
                    </button>
                    <button
                        onClick={() => onSelectTab('wiki')}
                        className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors ${
                            activeTab === 'wiki'
                                ? 'bg-primary text-white'
                                : 'text-slate-300 hover:bg-slate-800'
                        }`}>
                        <BookOpen size={16} />
                        Wiki
                    </button>
                </div>
            </div>
        </nav>
    )
}
