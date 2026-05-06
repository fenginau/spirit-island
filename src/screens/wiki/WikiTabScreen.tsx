import WikiSectionTabs from '../../components/WikiSectionTabs'
import WikiCardGrid from '../../components/WikiCardGrid'
import type { WikiCardItem, WikiSection } from '../../data/wikiCards'

interface WikiTabScreenProps {
    sectionLabels: Record<WikiSection, string>
    wikiSection: WikiSection
    wikiVisibleCards: WikiCardItem[]
    wikiSelectedCard: WikiCardItem | null
    wikiCardSearch: string
    setWikiSection: (section: WikiSection) => void
    setWikiSelectedCard: (card: WikiCardItem | null) => void
    setIsWikiCardFlipped: (flipped: boolean) => void
    setWikiCardSearch: (value: string) => void
}

export default function WikiTabScreen({
    sectionLabels,
    wikiSection,
    wikiVisibleCards,
    wikiSelectedCard,
    wikiCardSearch,
    setWikiSection,
    setWikiSelectedCard,
    setIsWikiCardFlipped,
    setWikiCardSearch
}: WikiTabScreenProps) {
    return (
        <section className='space-y-5'>
            <WikiSectionTabs
                sectionLabels={sectionLabels}
                selectedSection={wikiSection}
                onSelectSection={(section) => {
                    setWikiSection(section)
                    setWikiSelectedCard(null)
                    setIsWikiCardFlipped(false)
                    setWikiCardSearch('')
                }}
            />

            <WikiCardGrid
                title={sectionLabels[wikiSection]}
                cards={wikiVisibleCards}
                selectedImage={wikiSelectedCard?.image ?? null}
                onSelectCard={(card) => {
                    setWikiSelectedCard(card)
                    setIsWikiCardFlipped(false)
                }}
                searchValue={wikiCardSearch}
                onSearchChange={setWikiCardSearch}
                showSearch={wikiSection === 'major' || wikiSection === 'minor'}
            />
        </section>
    )
}
