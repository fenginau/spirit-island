const GOOGLE_AI_API_KEY = 'AIzaSyDIrZfjGbBmDVjuEi-5MI5zaEdkV5gfLtc'
const getDefaultPlayerName = (player) => `Player ${player}`
const getBoardDifficultyModifier = (boardSide) => (boardSide === 'Thematic' ? 3 : 0)
const LOCAL_PLAY_CARDS_BY_SPIRIT = {
    'Thunderspeaker': { front: '/play-cards/vassal/1sp1.jpg', back: '/play-cards/vassal/1sp2.jpg' },
    "Ocean's Hungry Grasp": { front: '/play-cards/vassal/2sp1.jpg', back: '/play-cards/vassal/2sp2.jpg' },
    'Vital Strength of the Earth': { front: '/play-cards/vassal/3sp1.jpg', back: '/play-cards/vassal/3sp2.jpg' },
    'Bringer of Dreams and Nightmares': {
        front: '/play-cards/vassal/4sp1.jpg',
        back: '/play-cards/vassal/4sp2.jpg'
    },
    'Heart of the Wildfire': { front: '/play-cards/vassal/5sp1.jpg', back: '/play-cards/vassal/5sp2.jpg' },
    'Keeper of the Forbidden Wilds': {
        front: '/play-cards/vassal/6sp1.jpg',
        back: '/play-cards/vassal/6sp2.jpg'
    },
    "Lightning's Swift Strike": { front: '/play-cards/vassal/7sp1.jpg', back: '/play-cards/vassal/7sp2.jpg' },
    'A Spread of Rampant Green': { front: '/play-cards/vassal/8sp1.jpg', back: '/play-cards/vassal/8sp2.jpg' },
    'Shadows Flicker Like Flame': { front: '/play-cards/vassal/9sp1.jpg', back: '/play-cards/vassal/9sp2.jpg' },
    'River Surges in Sunlight': { front: '/play-cards/vassal/10sp1.jpg', back: '/play-cards/vassal/10sp2.jpg' },
    'Sharp Fangs Behind the Leaves': {
        front: '/play-cards/vassal/11sp1.jpg',
        back: '/play-cards/vassal/11sp2.jpg'
    },
    'Serpent Slumbering Beneath the Island': {
        front: '/play-cards/vassal/12sp1.jpg',
        back: '/play-cards/vassal/12sp2.jpg'
    },
    'Downpour Drenches the World': {
        front: '/play-cards/vassal/downpour-front.jpg',
        back: '/play-cards/vassal/downpour-back.jpg'
    },
    'Finder of Paths Unseen': {
        front: '/play-cards/vassal/finder-front.jpg',
        back: '/play-cards/vassal/finder-back.jpg'
    },
    'Lure of the Deep Wilderness': {
        front: '/play-cards/vassal/lure-front.jpg',
        back: '/play-cards/vassal/lure-back.jpg'
    },
    'Many Minds Move as One': {
        front: '/play-cards/vassal/many-minds-front.jpg',
        back: '/play-cards/vassal/many-minds-back.jpg'
    },
    'Shifting Memory of Ages': {
        front: '/play-cards/vassal/shifting-front.jpg',
        back: '/play-cards/vassal/shifting-back.jpg'
    },
    'Shroud of Silent Mist': {
        front: '/play-cards/vassal/shroud-front.jpg',
        back: '/play-cards/vassal/shroud-back.jpg'
    },
    "Stone's Unyielding Defiance": {
        front: '/play-cards/vassal/stones-front.jpg',
        back: '/play-cards/vassal/stones-back.jpg'
    },
    'Volcano Looming High': {
        front: '/play-cards/vassal/volcano-front.jpg',
        back: '/play-cards/vassal/volcano-back.jpg'
    },
    'Vengeance as a Burning Plague': {
        front: '/play-cards/vassal/vengeance-front.jpg',
        back: '/play-cards/vassal/vengeance-back.jpg'
    },
    'Starlight Seeks Its Form': {
        front: '/play-cards/vassal/starlight-front.jpg',
        back: '/play-cards/vassal/starlight-back.jpg'
    },
    'Fractured Days Split the Sky': {
        front: '/play-cards/vassal/shattered-days-front.jpg',
        back: '/play-cards/vassal/shattered-days-back.jpg'
    },
    'Grinning Trickster Stirs Up Trouble': {
        front: '/play-cards/vassal/trickster-front.jpg',
        back: '/play-cards/vassal/trickster-back.jpg'
    },
    'Devouring Teeth Lurk Underfoot': {
        front: '/play-cards/tts/devouring-teeth-lurk-underfoot-front.jpg',
        back: '/play-cards/tts/devouring-teeth-lurk-underfoot-back.jpg'
    },
    'Eyes Watch from the Trees': {
        front: '/play-cards/tts/eyes-watch-from-the-trees-front.jpg',
        back: '/play-cards/tts/eyes-watch-from-the-trees-back.jpg'
    },
    'Fathomless Mud of the Swamp': {
        front: '/play-cards/tts/fathomless-mud-of-the-swamp-front.jpg',
        back: '/play-cards/tts/fathomless-mud-of-the-swamp-back.jpg'
    },
    'Rising Heat of Stone and Sand': {
        front: '/play-cards/tts/rising-heat-of-stone-and-sand-front.jpg',
        back: '/play-cards/tts/rising-heat-of-stone-and-sand-back.jpg'
    },
    'Sun-Bright Whirlwind': {
        front: '/play-cards/tts/sun-bright-whirlwind-front.jpg',
        back: '/play-cards/tts/sun-bright-whirlwind-back.jpg'
    },
    'Ember-Eyed Behemoth': {
        front: '/play-cards/tts/ember-eyed-behemoth-front.jpg',
        back: '/play-cards/tts/ember-eyed-behemoth-back.jpg'
    },
    'Hearth-Vigil': {
        front: '/play-cards/tts/hearth-vigil-front.jpg',
        back: '/play-cards/tts/hearth-vigil-back.jpg'
    },
    'Towering Roots of the Jungle': {
        front: '/play-cards/tts/towering-roots-of-the-jungle-front.jpg',
        back: '/play-cards/tts/towering-roots-of-the-jungle-back.jpg'
    },
    'Breath of Darkness Down Your Spine': {
        front: '/play-cards/tts/breath-of-darkness-down-your-spine-front.jpg',
        back: '/play-cards/tts/breath-of-darkness-down-your-spine-back.jpg'
    },
    'Relentless Gaze of the Sun': {
        front: '/play-cards/tts/relentless-gaze-of-the-sun-front.jpg',
        back: '/play-cards/tts/relentless-gaze-of-the-sun-back.jpg'
    },
    'Wandering Voice Keens Delirium': {
        front: '/play-cards/tts/wandering-voice-keens-delirium-front.jpg',
        back: '/play-cards/tts/wandering-voice-keens-delirium-back.jpg'
    },
    'Wounded Waters Bleeding': {
        front: '/play-cards/tts/wounded-waters-bleeding-front.jpg',
        back: '/play-cards/tts/wounded-waters-bleeding-back.jpg'
    },
    'Dances Up Earthquakes': {
        front: '/play-cards/tts/dances-up-earthquakes-front.jpg',
        back: '/play-cards/tts/dances-up-earthquakes-back.jpg'
    }
}

const getSpiritPlayCardCandidates = (spiritName, side) => {
    const entry = LOCAL_PLAY_CARDS_BY_SPIRIT[spiritName]
    if (!entry) return []
    return [side === 'Front' ? entry.front : entry.back]
}

const getWikiCardPair = (cards, card) => {
    const image = card.image
    const frontImageFromPath = image.replace(/-back(\.[a-z0-9]+)$/i, '-front$1')
    const backImageFromPath = image.replace(/-front(\.[a-z0-9]+)$/i, '-back$1')
    const frontNameFromTitle = card.name.replace(/\s+Back$/i, ' Front')
    const backNameFromTitle = card.name.replace(/\s+Front$/i, ' Back')

    let front = card
    let back = null

    if (/-front\.[a-z0-9]+$/i.test(image)) {
        const paired = cards.find((item) => item.image === backImageFromPath)
        if (paired) {
            back = paired
        } else {
            back = { name: backNameFromTitle, image: backImageFromPath }
        }
    } else if (/-back\.[a-z0-9]+$/i.test(image)) {
        const paired = cards.find((item) => item.image === frontImageFromPath)
        if (paired) {
            front = paired
            back = card
        } else {
            front = { name: frontNameFromTitle, image: frontImageFromPath }
            back = card
        }
    } else if (/\s+front$/i.test(card.name)) {
        const paired = cards.find((item) => item.name.toLowerCase() === backNameFromTitle.toLowerCase())
        if (paired) {
            back = paired
        }
    } else if (/\s+back$/i.test(card.name)) {
        const paired = cards.find(
            (item) => item.name.toLowerCase() === frontNameFromTitle.toLowerCase()
        )
        if (paired) {
            front = paired
            back = card
        } else {
            front = { name: frontNameFromTitle, image: frontImageFromPath }
            back = card
        }
    }

    return { front, back, hasTwoSides: !!back }
}

const WIKI_SECTION_LABELS = {
    major: 'Major Power Cards',
    minor: 'Minor Power Cards',
    fear: 'Fear Cards',
    event: 'Event Cards',
    invader: 'Invader Cards',
    scenario: 'Scenario Cards',
    blight: 'Blight Cards',
    adversary: 'Adversary'
}

const LOCAL_ADVERSARY_FRONT_CARD_BY_NAME = {
    'Brandenburg-Prussia': '/wiki-cards/tts/adversary/brandenburg-prussia-front.jpg',
    'England': '/wiki-cards/tts/adversary/england-front.jpg',
    'Sweden': '/wiki-cards/tts/adversary/sweden-front.jpg',
    'France': '/wiki-cards/tts/adversary/france-front.jpg',
    'Habsburg Monarchy (Livestock Colony)': '/wiki-cards/tts/adversary/habsburg-livestock-front.jpg',
    'Russia': '/wiki-cards/tts/adversary/russia-front.jpg',
    'Scotland': '/wiki-cards/tts/adversary/scotland-front.jpg',
    'Habsburg Mining Expedition': '/wiki-cards/tts/adversary/habsburg-mining-front.jpg'
}

const LOCAL_ASPECT_CARDS_BY_NAME = {
    'Pandemonium': { front: '/aspects/tts/pandemonium-front.jpg', back: '/aspects/tts/pandemonium-back.jpg' },
    'Wind': { front: '/aspects/tts/wind-front.jpg', back: '/aspects/tts/wind-back.jpg' },
    'Immense': { front: '/aspects/tts/immense-front.jpg', back: '/aspects/tts/immense-back.jpg' },
    'Sparking': { front: '/aspects/tts/sparking-front.jpg', back: '/aspects/tts/sparking-back.jpg' },
    'Sunshine': { front: '/aspects/tts/sunshine-front.jpg', back: '/aspects/tts/sunshine-back.jpg' },
    'Travel': { front: '/aspects/tts/travel-front.jpg', back: '/aspects/tts/travel-back.jpg' },
    'Haven': { front: '/aspects/tts/haven-front.jpg', back: '/aspects/tts/haven-back.jpg' },
    'Madness': { front: '/aspects/tts/madness-front.jpg', back: '/aspects/tts/madness-back.jpg' },
    'Reach': { front: '/aspects/tts/reach-front.jpg', back: '/aspects/tts/reach-back.jpg' },
    'Amorphous': { front: '/aspects/tts/amorphous-front.jpg', back: '/aspects/tts/amorphous-back.jpg' },
    'Foreboding': { front: '/aspects/tts/foreboding-front.jpg', back: '/aspects/tts/foreboding-back.jpg' },
    'Dark Fire': { front: '/aspects/tts/dark-fire-front.jpg', back: '/aspects/tts/dark-fire-back.jpg' },
    'Unconstrained': { front: '/aspects/tts/unconstrained-front.jpg', back: '/aspects/tts/unconstrained-back.jpg' },
    'Encircle': { front: '/aspects/tts/encircle-front.jpg', back: '/aspects/tts/encircle-back.jpg' },
    'Resilience': { front: '/aspects/tts/resilience-front.jpg', back: '/aspects/tts/resilience-back.jpg' },
    'Might': { front: '/aspects/tts/might-front.jpg', back: '/aspects/tts/might-back.jpg' },
    'Nourishing': { front: '/aspects/tts/nourishing-front.jpg', back: '/aspects/tts/nourishing-back.jpg' },
    'Tangles': { front: '/aspects/tts/tangles-front.jpg', back: '/aspects/tts/tangles-back.jpg' },
    'Regrowth': { front: '/aspects/tts/regrowth-front.jpg', back: '/aspects/tts/regrowth-back.jpg' },
    'Tactician': { front: '/aspects/tts/tactician-front.jpg', back: '/aspects/tts/tactician-back.jpg' },
    'Warrior': { front: '/aspects/tts/warrior-front.jpg', back: '/aspects/tts/warrior-back.jpg' },
    'Enticing': { front: '/aspects/tts/enticing-front.jpg', back: '/aspects/tts/enticing-back.jpg' },
    'Violence': { front: '/aspects/tts/violence-front.jpg', back: '/aspects/tts/violence-back.jpg' },
    'Deeps': { front: '/aspects/tts/deeps-front.jpg', back: '/aspects/tts/deeps-back.jpg' },
    'Spreading Hostility': {
        front: '/aspects/tts/spreading-hostility-front.jpg',
        back: '/aspects/tts/spreading-hostility-back.jpg'
    },
    'Transforming': { front: '/aspects/tts/transforming-front.jpg', back: '/aspects/tts/transforming-back.jpg' },
    'Locus': { front: '/aspects/tts/locus-front.jpg', back: '/aspects/tts/locus-back.jpg' },
    'Lair': { front: '/aspects/tts/lair-front.jpg', back: '/aspects/tts/lair-back.jpg' },
    'Stranded': { front: '/aspects/tts/stranded-front.jpg', back: '/aspects/tts/stranded-back.jpg' },
    'Intensify': { front: '/aspects/tts/intensify-front.jpg', back: '/aspects/tts/intensify-back.jpg' },
    'Mentor': { front: '/aspects/tts/mentor-front.jpg', back: '/aspects/tts/mentor-back.jpg' }
}

// --- Data ---
const SPIRIT_ASPECTS = {
    'A Spread of Rampant Green': ['Regrowth', 'Tangles'],
    'Bringer of Dreams and Nightmares': ['Enticing', 'Violence'],
    'Heart of the Wildfire': ['Transforming'],
    'Keeper of the Forbidden Wilds': ['Spreading Hostility'],
    "Lightning's Swift Strike": ['Pandemonium', 'Wind', 'Immense', 'Sparking'],
    'Lure of the Deep Wilderness': ['Lair'],
    "Ocean's Hungry Grasp": ['Deeps'],
    'River Surges in Sunlight': ['Sunshine', 'Travel', 'Haven'],
    'Serpent Slumbering Beneath the Island': ['Locus'],
    'Shadows Flicker Like Flame': ['Madness', 'Reach', 'Amorphous', 'Foreboding', 'Dark Fire'],
    'Sharp Fangs Behind the Leaves': ['Encircle', 'Unconstrained'],
    'Shifting Memory of Ages': ['Intensify', 'Mentor'],
    'Shroud of Silent Mist': ['Stranded'],
    'Thunderspeaker': ['Tactician', 'Warrior'],
    'Vital Strength of the Earth': ['Resilience', 'Might', 'Nourishing']
}

const SPIRITS = [
    {
        id: '1',
        name: "Lightning's Swift Strike",
        difficulty: 'Easy',
        expansion: 'Base Game',
        image: '/spirits/lightning-s-swift-strike.png'
    },
    {
        id: '2',
        name: 'River Surges in Sunlight',
        difficulty: 'Easy',
        expansion: 'Base Game',
        image: '/spirits/river-surges-in-sunlight.png'
    },
    {
        id: '3',
        name: 'Shadows Flicker Like Flame',
        difficulty: 'Easy',
        expansion: 'Base Game',
        image: '/spirits/shadows-flicker-like-flame.png'
    },
    {
        id: '4',
        name: 'Vital Strength of the Earth',
        difficulty: 'Easy',
        expansion: 'Base Game',
        image: '/spirits/vital-strength-of-the-earth.png'
    },
    {
        id: '5',
        name: 'A Spread of Rampant Green',
        difficulty: 'Moderate',
        expansion: 'Base Game',
        image: '/spirits/a-spread-of-rampant-green.png'
    },
    {
        id: '6',
        name: 'Thunderspeaker',
        difficulty: 'Moderate',
        expansion: 'Base Game',
        image: '/spirits/thunderspeaker.png'
    },
    {
        id: '7',
        name: 'Bringer of Dreams and Nightmares',
        difficulty: 'Hard',
        expansion: 'Base Game',
        image: '/spirits/bringer-of-dreams-and-nightmares.png'
    },
    {
        id: '8',
        name: "Ocean's Hungry Grasp",
        difficulty: 'Hard',
        expansion: 'Base Game',
        image: '/spirits/ocean-s-hungry-grasp.png'
    },
    {
        id: '9',
        name: 'Keeper of the Forbidden Wilds',
        difficulty: 'Moderate',
        expansion: 'Branch & Claw',
        image: '/spirits/keeper-of-the-forbidden-wilds.png'
    },
    {
        id: '10',
        name: 'Sharp Fangs Behind the Leaves',
        difficulty: 'Moderate',
        expansion: 'Branch & Claw',
        image: '/spirits/sharp-fangs-behind-the-leaves.png'
    },
    {
        id: '11',
        name: 'Heart of the Wildfire',
        difficulty: 'Hard',
        expansion: 'Promo 1',
        image: '/spirits/heart-of-the-wildfire.png'
    },
    {
        id: '12',
        name: 'Serpent Slumbering Beneath the Island',
        difficulty: 'Hard',
        expansion: 'Promo 1',
        image: '/spirits/serpent-slumbering-beneath-the-island.png'
    },
    {
        id: '13',
        name: 'Grinning Trickster Stirs Up Trouble',
        difficulty: 'Moderate',
        expansion: 'Jagged Earth',
        image: '/spirits/grinning-trickster-stirs-up-trouble.png'
    },
    {
        id: '14',
        name: 'Lure of the Deep Wilderness',
        difficulty: 'Moderate',
        expansion: 'Jagged Earth',
        image: '/spirits/lure-of-the-deep-wilderness.png'
    },
    {
        id: '15',
        name: 'Many Minds Move as One',
        difficulty: 'Moderate',
        expansion: 'Jagged Earth',
        image: '/spirits/many-minds-move-as-one.png'
    },
    {
        id: '16',
        name: 'Shifting Memory of Ages',
        difficulty: 'Moderate',
        expansion: 'Jagged Earth',
        image: '/spirits/shifting-memory-of-ages.png'
    },
    {
        id: '17',
        name: "Stone's Unyielding Defiance",
        difficulty: 'Moderate',
        expansion: 'Jagged Earth',
        image: '/spirits/stone-s-unyielding-defiance.png'
    },
    {
        id: '18',
        name: 'Volcano Looming High',
        difficulty: 'Moderate',
        expansion: 'Jagged Earth',
        image: '/spirits/volcano-looming-high.png'
    },
    {
        id: '19',
        name: 'Shroud of Silent Mist',
        difficulty: 'Hard',
        expansion: 'Jagged Earth',
        image: '/spirits/shroud-of-silent-mist.png'
    },
    {
        id: '20',
        name: 'Vengeance as a Burning Plague',
        difficulty: 'Hard',
        expansion: 'Jagged Earth',
        image: '/spirits/vengeance-as-a-burning-plague.png'
    },
    {
        id: '21',
        name: 'Fractured Days Split the Sky',
        difficulty: 'Very Hard',
        expansion: 'Jagged Earth',
        image: '/spirits/fractured-days-split-the-sky.png'
    },
    {
        id: '22',
        name: 'Starlight Seeks Its Form',
        difficulty: 'Very Hard',
        expansion: 'Jagged Earth',
        image: '/spirits/starlight-seeks-its-form.png'
    },
    {
        id: '23',
        name: 'Downpour Drenches the World',
        difficulty: 'Hard',
        expansion: 'Promo 2',
        image: '/spirits/downpour-drenches-the-world.png'
    },
    {
        id: '24',
        name: 'Finder of Paths Unseen',
        difficulty: 'Very Hard',
        expansion: 'Promo 2',
        image: '/spirits/finder-of-paths-unseen.png'
    },
    {
        id: '25',
        name: 'Devouring Teeth Lurk Underfoot',
        difficulty: 'Easy',
        expansion: 'Horizons',
        image: '/spirits/devouring-teeth-lurk-underfoot.png'
    },
    {
        id: '26',
        name: 'Eyes Watch from the Trees',
        difficulty: 'Easy',
        expansion: 'Horizons',
        image: '/spirits/eyes-watch-from-the-trees.png'
    },
    {
        id: '27',
        name: 'Fathomless Mud of the Swamp',
        difficulty: 'Easy',
        expansion: 'Horizons',
        image: '/spirits/fathomless-mud-of-the-swamp.png'
    },
    {
        id: '28',
        name: 'Rising Heat of Stone and Sand',
        difficulty: 'Easy',
        expansion: 'Horizons',
        image: '/spirits/rising-heat-of-stone-and-sand.png'
    },
    {
        id: '29',
        name: 'Sun-Bright Whirlwind',
        difficulty: 'Easy',
        expansion: 'Horizons',
        image: '/spirits/sun-bright-whirlwind.png'
    },
    {
        id: '30',
        name: 'Ember-Eyed Behemoth',
        difficulty: 'Moderate',
        expansion: 'Nature Incarnate',
        image: '/spirits/ember-eyed-behemoth.png'
    },
    {
        id: '31',
        name: 'Hearth-Vigil',
        difficulty: 'Moderate',
        expansion: 'Nature Incarnate',
        image: '/spirits/hearth-vigil.png'
    },
    {
        id: '32',
        name: 'Towering Roots of the Jungle',
        difficulty: 'Moderate',
        expansion: 'Nature Incarnate',
        image: '/spirits/towering-roots-of-the-jungle.png'
    },
    {
        id: '33',
        name: 'Breath of Darkness Down Your Spine',
        difficulty: 'Hard',
        expansion: 'Nature Incarnate',
        image: '/spirits/breath-of-darkness-down-your-spine.png'
    },
    {
        id: '34',
        name: 'Relentless Gaze of the Sun',
        difficulty: 'Hard',
        expansion: 'Nature Incarnate',
        image: '/spirits/relentless-gaze-of-the-sun.png'
    },
    {
        id: '35',
        name: 'Wandering Voice Keens Delirium',
        difficulty: 'Hard',
        expansion: 'Nature Incarnate',
        image: '/spirits/wandering-voice-keens-delirium.png'
    },
    {
        id: '36',
        name: 'Wounded Waters Bleeding',
        difficulty: 'Hard',
        expansion: 'Nature Incarnate',
        image: '/spirits/wounded-waters-bleeding.png'
    },
    {
        id: '37',
        name: 'Dances Up Earthquakes',
        difficulty: 'Very Hard',
        expansion: 'Nature Incarnate',
        image: '/spirits/dances-up-earthquakes.png'
    }
]

const EXPANSIONS = ['Base Game', 'Branch & Claw', 'Jagged Earth', 'Horizons', 'Nature Incarnate']

const DIFFICULTIES = ['Easy', 'Moderate', 'Hard', 'Very Hard']
const DIFFICULTY_SORT_ORDER = {
    Easy: 0,
    Moderate: 1,
    Hard: 2,
    'Very Hard': 3
}

const ADVERSARIES = [
    { id: 'a1', name: 'Brandenburg-Prussia', expansion: 'Base Game', difficultyRange: '1-10' },
    { id: 'a2', name: 'England', expansion: 'Base Game', difficultyRange: '1-11' },
    { id: 'a3', name: 'Sweden', expansion: 'Base Game', difficultyRange: '1-8' },
    { id: 'a4', name: 'France', expansion: 'Branch & Claw', difficultyRange: '2-10' },
    {
        id: 'a5',
        name: 'Habsburg Monarchy (Livestock Colony)',
        expansion: 'Jagged Earth',
        difficultyRange: '2-10'
    },
    { id: 'a6', name: 'Russia', expansion: 'Jagged Earth', difficultyRange: '2-11' },
    { id: 'a7', name: 'Scotland', expansion: 'Jagged Earth', difficultyRange: '1-10' },
    {
        id: 'a8',
        name: 'Habsburg Mining Expedition',
        expansion: 'Nature Incarnate',
        difficultyRange: '2-11'
    }
]

export {
  GOOGLE_AI_API_KEY,
  getDefaultPlayerName,
  getBoardDifficultyModifier,
  LOCAL_PLAY_CARDS_BY_SPIRIT,
  getSpiritPlayCardCandidates,
  getWikiCardPair,
  WIKI_SECTION_LABELS,
  LOCAL_ADVERSARY_FRONT_CARD_BY_NAME,
  LOCAL_ASPECT_CARDS_BY_NAME,
  SPIRIT_ASPECTS,
  SPIRITS,
  EXPANSIONS,
  DIFFICULTIES,
  DIFFICULTY_SORT_ORDER,
  ADVERSARIES
}
