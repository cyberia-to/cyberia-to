#!/usr/bin/env python3
"""
Passport Index Scraper via Firecrawl
=====================================
Uses Firecrawl API to scrape passportindex.org (handles Cloudflare).
Free tier: 500 pages. We need ~199.

Output: passport_matrix.json → then import with:
    cargo run --bin import-visa-json --features tools

Usage:
    pip install firecrawl-py
    python scrape_passport.py
"""

import json
import os
import re
import sys
import time
from pathlib import Path
from functools import partial
print = partial(print, flush=True)

try:
    from firecrawl import FirecrawlApp
except ImportError:
    print("Install: pip install firecrawl-py")
    sys.exit(1)


API_KEY = os.environ.get("FIRECRAWL_API_KEY", "fc-69796415b7bb45238b965b246023b34d")

PASSPORT_CODES = [
    "ae","af","ag","al","am","ao","ar","at","au","az","ba","bb","bd","be","bf",
    "bg","bh","bi","bj","bn","bo","br","bs","bt","bw","by","bz","ca","cd","cf",
    "cg","ch","ci","cl","cm","cn","co","cr","cu","cv","cy","cz","de","dj","dk",
    "dm","do","dz","ec","ee","eg","er","es","et","fi","fj","fm","fr","ga","gb",
    "gd","ge","gh","gm","gn","gq","gr","gt","gw","gy","hk","hn","hr","ht","hu",
    "id","ie","il","in","iq","ir","is","it","jm","jo","jp","ke","kg","kh","ki",
    "km","kn","kp","kr","kw","kz","la","lb","lc","li","lk","lr","ls","lt","lu",
    "lv","ly","ma","mc","md","me","mg","mh","mk","ml","mm","mn","mo","mr","mt",
    "mu","mv","mw","mx","my","mz","na","ne","ng","ni","nl","no","np","nr","nz",
    "om","pa","pe","pg","ph","pk","pl","ps","pt","pw","py","qa","ro","rs","ru",
    "rw","sa","sb","sc","sd","se","sg","si","sk","sl","sm","sn","so","sr","ss",
    "st","sv","sy","sz","td","tg","th","tj","tl","tm","tn","to","tr","tt","tv",
    "tw","tz","ua","ug","us","uy","uz","va","vc","ve","vn","vu","ws","xk","ye",
    "za","zm","zw",
]

CODE_TO_SLUG = {
    "ae": "united-arab-emirates", "ag": "antigua-and-barbuda",
    "ba": "bosnia-and-herzegovina", "cd": "dr-congo",
    "cf": "central-african-republic", "ci": "ivory-coast",
    "cv": "cape-verde", "cz": "czech-republic",
    "do": "dominican-republic", "fm": "micronesia",
    "gb": "united-kingdom", "gq": "equatorial-guinea",
    "gw": "guinea-bissau", "hk": "hong-kong",
    "kn": "saint-kitts-and-nevis", "kp": "north-korea",
    "kr": "south-korea", "lc": "saint-lucia",
    "mh": "marshall-islands", "mk": "north-macedonia",
    "mo": "macao", "pg": "papua-new-guinea",
    "ps": "palestinian-territories", "ru": "russian-federation",
    "sa": "saudi-arabia", "sb": "solomon-islands",
    "sl": "sierra-leone", "ss": "south-sudan",
    "st": "sao-tome-and-principe", "sv": "el-salvador",
    "sz": "swaziland", "tl": "timor-leste",
    "tr": "turkiye", "tt": "trinidad-and-tobago",
    "us": "united-states", "vc": "saint-vincent-and-the-grenadines",
    "vn": "viet-nam", "ws": "samoa",
    "xk": "kosovo", "za": "south-africa",
    "cr": "costa-rica", "nz": "new-zealand",
    "bf": "burkina-faso", "lk": "sri-lanka",
}

JUNK_WORDS = [
    'AVERAGE', 'MEDIAN', 'POPULATION', 'BECOME', 'EMPOWERED',
    'NEWSLETTER', 'VISA CHECKER', 'EXPLORE', 'RANK', 'COMPARE',
    'IMPROVE', 'DISCOVER', 'MOBILITY', 'PASSPORT POWER',
    'COUNTRY', 'VISA REQUIREMENTS', 'WORLD REACH', 'APPLY NOW',
    'PASSPORT DASHBOARD', 'INDIVIDUAL POWER', '©',
]


def parse_visa_markdown(markdown: str) -> list[dict]:
    """Parse firecrawl markdown into visa entries."""
    results = []

    # The visa table appears after "VISA REQUIREMENTS" or "Country  Visa requirements"
    # Each row is: "CountryName\tVISA-TYPE DAYS" or in markdown: "| Country | Visa |"
    # Or just plain lines with tab separation

    lines = markdown.split('\n')
    in_visa_section = False

    for line in lines:
        line = line.strip().strip('|').strip()
        if not line:
            continue

        # Detect start of visa section
        if 'visa requirements' in line.lower() or 'country' in line.lower() and 'visa' in line.lower():
            in_visa_section = True
            continue

        if not in_visa_section:
            # Also try to detect visa data lines anywhere
            if not re.search(r'VISA[- ]FREE|VISA ON ARRIVAL|VISA REQUIRED|EVISA|ETA\b', line, re.IGNORECASE):
                continue

        # Skip junk
        upper = line.upper()
        if any(j in upper for j in JUNK_WORDS):
            continue
        if line.startswith('---') or line.startswith('|--'):
            continue

        # Try pipe first (markdown table: "| [Country](url) | visa type |")
        parts = [p.strip() for p in line.split('|') if p.strip()]
        if len(parts) < 2:
            # Try tab split
            parts = line.split('\t')
        if len(parts) < 2:
            # Try multiple spaces
            parts = re.split(r'\s{2,}', line)
        if len(parts) < 2:
            m = re.match(r'^(.+?)\s+(VISA[- ]FREE|VISA ON ARRIVAL|VISA REQUIRED|EVISA|ETA|EVISITOR|PRE-ENROLLMENT|TOURIST|E-TICKET|NO ADMISSION)(.*)$', line, re.IGNORECASE)
            if m:
                parts = [m.group(1), m.group(2) + m.group(3)]
            else:
                continue

        country = parts[0].strip()
        # Strip markdown links: [Name](url) → Name
        country = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', country)
        country = re.sub(r'^\[?\!?\[?[^\]]*\]\([^)]*\)\s*', '', country)
        country = re.sub(r'^\*+|\*+$', '', country).strip()
        country = re.sub(r'^[\U0001F1E6-\U0001F1FF]+\s*', '', country)  # strip flag emojis
        country = re.sub(r'^\d+[\.\s]+', '', country).strip()

        if len(country) < 2 or len(country) > 60:
            continue
        if any(j in country.upper() for j in JUNK_WORDS):
            continue

        visa_part = ' '.join(parts[1:]).strip().upper()

        access_type = ''
        days = None

        if 'VISA-FREE' in visa_part or 'VISA FREE' in visa_part:
            access_type = 'visa-free'
        elif 'VISA ON ARRIVAL' in visa_part or 'VOA' in visa_part:
            access_type = 'visa-on-arrival'
        elif 'EVISITOR' in visa_part:
            access_type = 'eta'
        elif 'EVISA' in visa_part or 'E-VISA' in visa_part:
            access_type = 'e-visa'
        elif re.match(r'^ETA\b', visa_part):
            access_type = 'eta'
        elif 'PRE-ENROLLMENT' in visa_part:
            access_type = 'e-visa'
        elif 'TOURIST REGISTRATION' in visa_part:
            access_type = 'visa-free'
        elif 'TOURIST CARD' in visa_part:
            access_type = 'visa-free'
        elif 'E-TICKET' in visa_part:
            access_type = 'visa-free'
        elif 'VISA REQUIRED' in visa_part:
            access_type = 'visa-required'
        elif 'NO ADMISSION' in visa_part:
            access_type = 'no-admission'

        if not access_type:
            continue

        days_match = re.search(r'(\d+)', visa_part)
        if days_match:
            d = int(days_match.group(1))
            if 0 < d <= 360:
                days = d

        results.append({
            'dest_code': '',
            'dest_name': country,
            'category': {'visa-free': 'vf', 'visa-on-arrival': 'voa',
                         'eta': 'eta', 'e-visa': 'eta',
                         'visa-required': 'vr', 'no-admission': 'vr',
                         }.get(access_type, 'unknown'),
            'detail': access_type,
            'days': days,
        })

    return results


def main():
    output_file = Path("passport_matrix.json")
    checkpoint_file = Path("passport_matrix_checkpoint.json")

    app = FirecrawlApp(api_key=API_KEY)

    matrix = {}
    if checkpoint_file.exists():
        with open(checkpoint_file) as f:
            matrix = json.load(f)
        print(f"Loaded checkpoint: {len(matrix)} passports")

    remaining = [c for c in PASSPORT_CODES if c not in matrix]
    if not remaining:
        print("All done!")
        save_output(matrix, output_file)
        return

    print(f"Scraping {len(remaining)} passports via Firecrawl...\n")

    for i, code in enumerate(remaining, 1):
        slug = CODE_TO_SLUG.get(code, code)
        url = f"https://www.passportindex.org/passport/{slug}/"

        try:
            r = app.scrape(url, formats=['markdown'], wait_for=5000)
            markdown = r.markdown or '' if hasattr(r, 'markdown') else ''

            entries = parse_visa_markdown(markdown)

            if entries and len(entries) > 10:
                matrix[code] = entries
                n_vf = sum(1 for e in entries if e['category'] == 'vf')
                n_voa = sum(1 for e in entries if e['category'] == 'voa')
                n_eta = sum(1 for e in entries if e['category'] == 'eta')
                n_vr = sum(1 for e in entries if e['category'] == 'vr')
                print(f"[{len(matrix)}/{len(PASSPORT_CODES)}] {code} ({slug}): "
                      f"{len(entries)} dest (vf:{n_vf} voa:{n_voa} eta:{n_eta} vr:{n_vr})")
            elif entries:
                matrix[code] = entries
                print(f"[{len(matrix)}/{len(PASSPORT_CODES)}] {code} ({slug}): "
                      f"WARNING only {len(entries)} entries")
            else:
                print(f"[{i}] {code} ({slug}): EMPTY — no visa data parsed")

            if len(matrix) % 10 == 0 and len(matrix) > 0:
                with open(checkpoint_file, "w") as f:
                    json.dump(matrix, f, ensure_ascii=False)

            time.sleep(1.2)

        except Exception as e:
            print(f"[{i}] {code} ({slug}): ERROR — {e}")
            if matrix:
                with open(checkpoint_file, "w") as f:
                    json.dump(matrix, f, ensure_ascii=False)
            time.sleep(3)

    save_output(matrix, output_file)
    if checkpoint_file.exists():
        checkpoint_file.unlink()


def save_output(matrix: dict, output_file: Path):
    with open(output_file, "w") as f:
        json.dump(matrix, f, indent=2, ensure_ascii=False)
    total = sum(len(v) for v in matrix.values())
    print(f"\nSaved: {output_file}")
    print(f"Passports: {len(matrix)}, Total pairs: {total}")


if __name__ == "__main__":
    main()
