import { BookOpen } from 'lucide-react'
import type { WikiSection } from '../data/wikiCards'

interface WikiSectionTabsProps {
    sectionLabels: Record<WikiSection, string>
    selectedSection: WikiSection
    onSelectSection: (section: WikiSection) => void
}

export default function WikiSectionTabs({
    sectionLabels,
    selectedSection,
    onSelectSection
}: WikiSectionTabsProps) {
    return (
        <section className='glass-panel p-6 rounded-2xl shadow-xl space-y-4'>
            <h2 className='text-xl font-bold text-slate-100 flex items-center gap-2'>
                <BookOpen className='text-primary' size={20} />
                Wiki
            </h2>
            <p className='text-sm text-slate-400'>
                Browse card references from the same online-backed archive source.
            </p>
            <div className='flex flex-wrap gap-2'>
                {(Object.keys(sectionLabels) as WikiSection[]).map((section) => (
                    <button
                        key={section}
                        onClick={() => onSelectSection(section)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                            selectedSection === section
                                ? 'bg-primary border-primary text-white'
                                : 'border-slate-600 text-slate-300 hover:border-primary/60'
                        }`}>
                        {sectionLabels[section]}
                    </button>
                ))}
            </div>
        </section>
    )
}
