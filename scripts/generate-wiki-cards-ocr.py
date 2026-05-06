import json
import re
import subprocess
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
VASSAL_DIR = ROOT / 'public/wiki-cards/vassal'
OUT_FILE = ROOT / 'src/data/wikiCards.ts'

SMALL_WORDS = {'a', 'an', 'and', 'as', 'at', 'by', 'for', 'from', 'in', 'of', 'on', 'or', 'the', 'to', 'up', 'with'}
TRIM_NOISE = {'N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW'}
SAFE_SHORT = {'AN', 'AND', 'AS', 'AT', 'BY', 'FOR', 'FROM', 'IN', 'OF', 'ON', 'OR', 'THE', 'TO', 'UP', 'WITH'}


def title_case(text: str) -> str:
    words = text.split()
    if not words:
        return ''
    out = []
    for i, w in enumerate(words):
        if i > 0 and i < len(words) - 1 and w.lower() in SMALL_WORDS:
            out.append(w.lower())
        else:
            out.append(w.capitalize())
    return ' '.join(out)


def slug_to_title(name: str) -> str:
    stem = re.sub(r'\.(jpg|png)$', '', name, flags=re.I)
    stem = stem.replace('_', ' ').replace('-', ' ')
    stem = re.sub(r'\s+', ' ', stem).strip()
    return title_case(stem)


def normalize_line(line: str) -> str:
    line = line.strip()
    if not line:
        return ''
    letters_raw = [c for c in line if c.isalpha()]
    if letters_raw:
        uppercase_ratio = sum(1 for c in letters_raw if c.isupper()) / len(letters_raw)
        if uppercase_ratio < 0.7:
            return ''
    line = re.sub(r'^[^A-Za-z]+', '', line)
    line = re.sub(r"[^A-Za-z0-9'’&\- ]+", ' ', line)
    line = re.sub(r'\s+', ' ', line).strip()
    if not line:
        return ''
    line = line.replace('’', "'")
    tokens = re.findall(r"[A-Za-z0-9'&\-]+", line)
    if not tokens:
        return ''

    def token_letters(t: str) -> int:
        return sum(c.isalpha() for c in t)

    while tokens and (tokens[0].upper() in TRIM_NOISE or (token_letters(tokens[0]) < 2 and tokens[0].upper() not in {'A', 'I'})):
        tokens.pop(0)
    while tokens and (tokens[-1].upper() in TRIM_NOISE or (token_letters(tokens[-1]) < 2 and tokens[-1].upper() not in {'A', 'I'})):
        tokens.pop()

    return ' '.join(tokens)


def cleanup_ocr_title(text: str) -> str:
    text = re.sub(r"(?i)\bdreamofthe\b", "dream of the", text)
    text = re.sub(r"(?i)\bthestrength\b", "the strength", text)
    text = re.sub(r"(?i)\bcallto", "call to ", text)
    text = re.sub(r"(?i)\bintothe\b", "into the", text)
    text = re.sub(r"(?i)\binthe\b", "in the", text)
    text = re.sub(r"(?i)\bofthe\b", "of the", text)
    text = re.sub(r"\s+", " ", text).strip()

    tokens = text.split()
    filtered = []
    for tok in tokens:
        letters = len(re.sub(r'[^A-Za-z]', '', tok))
        if letters <= 2 and tok.upper() not in SAFE_SHORT:
            continue
        filtered.append(tok)
    tokens = filtered

    while tokens and len(re.sub(r'[^A-Za-z]', '', tokens[0])) <= 2 and tokens[0].upper() not in SAFE_SHORT:
        tokens.pop(0)
    while tokens and len(re.sub(r'[^A-Za-z]', '', tokens[-1])) <= 2 and tokens[-1].upper() not in SAFE_SHORT:
        tokens.pop()
    text = ' '.join(tokens)
    text = re.sub(r"\s+", " ", text).strip(" -'\"")
    return text


def score_candidate(text: str) -> int:
    letters = sum(c.isalpha() for c in text)
    words = text.split()
    if not words:
        return -999
    one_letter_noise = sum(1 for w in words if len(w) == 1 and w.upper() not in {'A', 'I'})
    digit_words = sum(1 for w in words if any(ch.isdigit() for ch in w))
    return letters - one_letter_noise * 8 - digit_words * 4


def ocr_title(image_path: Path) -> str:
    img = Image.open(image_path).convert('L')
    w, h = img.size

    best = ''
    best_score = -999

    # Crop out left element icon column and keep only top title band.
    left = int(w * 0.12)
    for frac in (0.18, 0.20, 0.22, 0.24, 0.26):
        top = max(1, int(h * frac))
        crop_w = max(1, w - left)
        crop = img.crop((left, 0, w, top)).resize((crop_w * 7, top * 7))
        crop = ImageOps.autocontrast(crop)
        variants = [
            crop,
            crop.point(lambda p: 255 if p > 145 else 0),
            crop.point(lambda p: 255 if p > 160 else 0),
        ]

        for i, var in enumerate(variants):
            tmp = ROOT / f'.tmp-ocr-{i}.jpg'
            var.save(tmp)
            proc = subprocess.run(['tesseract', str(tmp), 'stdout', '--psm', '6'], capture_output=True, text=True)
            raw_lines = [normalize_line(line) for line in proc.stdout.splitlines()]
            lines = [ln for ln in raw_lines if sum(c.isalpha() for c in ln) >= 4]
            if not lines:
                continue
            cand = ' '.join(lines[:2]).strip()
            cand = re.sub(r'\s+', ' ', cand)
            sc = score_candidate(cand)
            if sc > best_score:
                best_score = sc
                best = cand

    for tmp in ROOT.glob('.tmp-ocr-*.jpg'):
        try:
            tmp.unlink()
        except OSError:
            pass

    best = re.sub(r'\b(NE|NW|SE|SW|N|S|E|W)\b$', '', best).strip()
    best = re.sub(r'\s+', ' ', best)
    best = cleanup_ocr_title(best)
    if not best:
        return ''
    return title_case(best)


def major_minor_name(file_name: str, section: str) -> str:
    lower = file_name.lower()
    if lower.endswith('_back.jpg'):
        return f'{section.capitalize()} Back'
    if lower.startswith(f'{section}-power-'):
        return slug_to_title(file_name)

    path = VASSAL_DIR / file_name
    name = ocr_title(path)
    if name:
        return name
    return slug_to_title(file_name)


files = sorted([p.name for p in VASSAL_DIR.iterdir() if p.suffix.lower() in {'.jpg', '.png'}])

def to_card(file_name: str, section_hint: str | None = None):
    if section_hint in {'major', 'minor'}:
        name = major_minor_name(file_name, section_hint)
    else:
        name = slug_to_title(file_name)
    return {'name': name, 'image': f'/wiki-cards/vassal/{file_name}'}

major_files = [f for f in files if f.lower().startswith('major')]
minor_files = [f for f in files if f.lower().startswith('minor')]
fear_files = [f for f in files if f.lower().startswith('fear')]
event_files = [f for f in files if f.lower().startswith('event')]
invader_files = [f for f in files if re.match(r'^i[123]', f, flags=re.I)]

major = [to_card(f, 'major') for f in major_files]
minor = [to_card(f, 'minor') for f in minor_files]
fear = [to_card(f) for f in fear_files]
event = [to_card(f) for f in event_files]
invader = [to_card(f) for f in invader_files]
adversary = [
    {'name': 'Brandenburg-Prussia', 'image': '/wiki-cards/tts/adversary/brandenburg-prussia-back.jpg'},
    {'name': 'England', 'image': '/wiki-cards/tts/adversary/england-back.jpg'},
    {'name': 'Sweden', 'image': '/wiki-cards/tts/adversary/sweden-back.jpg'},
    {'name': 'France', 'image': '/wiki-cards/tts/adversary/france-back.jpg'},
    {'name': 'Habsburg Monarchy (Livestock Colony)', 'image': '/wiki-cards/tts/adversary/habsburg-livestock-back.jpg'},
    {'name': 'Russia', 'image': '/wiki-cards/tts/adversary/russia-back.jpg'},
    {'name': 'Scotland', 'image': '/wiki-cards/tts/adversary/scotland-back.jpg'},
    {'name': 'Habsburg Mining Expedition', 'image': '/wiki-cards/tts/adversary/habsburg-mining-back.jpg'},
]

lines = []
lines.append('export interface WikiCardItem {')
lines.append('    name: string')
lines.append('    image: string')
lines.append('}')
lines.append('')
lines.append("export type WikiSection = 'major' | 'minor' | 'fear' | 'event' | 'invader' | 'adversary'")
lines.append('')
lines.append('export const WIKI_CARD_DATA: Record<WikiSection, WikiCardItem[]> = {')
for key, arr in [
    ('major', major),
    ('minor', minor),
    ('fear', fear),
    ('event', event),
    ('adversary', adversary),
    ('invader', invader),
]:
    lines.append(f'    {key}: [')
    for item in arr:
        lines.append(f'        {{ name: {json.dumps(item["name"])}, image: {json.dumps(item["image"])} }},')
    lines.append('    ],')
lines.append('}')
lines.append('')

OUT_FILE.write_text('\n'.join(lines), encoding='utf-8')
print(json.dumps({
    'major': len(major),
    'minor': len(minor),
    'fear': len(fear),
    'event': len(event),
    'adversary': len(adversary),
    'invader': len(invader)
}, indent=2))
