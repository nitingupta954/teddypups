"""Extract the reference site's content into src/data/*.json.

The reference (puppy.instabizweb.com) is a Next.js app, so every page embeds its
props in the React Server Components payload (`self.__next_f.push(...)`).
Download the pages listed in /sitemap.xml into a folder named `<slug>.html`
(`home.html`, `puppies.html`, `puppies__<slug>.html`, ...) and run:

    python3 scripts/extract-content.py <pages-dir>
"""

import json
import re
import sys
from pathlib import Path

PAGES = Path(sys.argv[1])
OUT = Path(__file__).resolve().parent.parent / "src" / "data"
DEC = json.JSONDecoder()


def rsc(name: str) -> str:
    html = (PAGES / f"{name}.html").read_text()
    chunks = re.findall(r'self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)', html)
    return "".join(json.loads(f'"{c}"') for c in chunks)


def array_after(payload: str, key: str) -> list:
    i = payload.index(f'"{key}":[')
    return DEC.raw_decode(payload, i + len(key) + 3)[0]


def slugify(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


KEEP = ("id", "slug", "name", "displayName", "breed", "gender", "genderLabel", "age", "status", "origin", "breeds", "collections", "media")

# Available puppies: the listing page passes the full objects to its client component.
available = [{k: p[k] for k in KEEP} for p in array_after(rsc("puppies"), "puppies")]

# Gone-home puppies only exist as detail pages; rebuild the same shape from each one.
gone_page = rsc("gone-home")
gone = []
for pid, slug in dict.fromkeys(re.findall(r'\["\$","li","([0-9a-f-]{36})",\{"className":"tp-ticket".{0,200}?"href":"/puppies/([a-z0-9-]+)"', gone_page)):
    d = rsc(f"puppies__{slug}")
    m = re.search(r'\{"name":"((?:[^"\\]|\\.)*)","media":\[', d)
    media = DEC.raw_decode(d, m.end() - 1)[0]
    facts = dict(re.findall(r'"children":"([^"]+)"\}\],\["\$","dd",null,\{"className":"[^"]*","children":"([^"]*)"', d))
    title = json.loads(f'"{m.group(1)}"')
    breed = facts["Breed"]
    # The gallery prop carries the display title; an unnamed pup's title is just its breed.
    name = "" if title == breed else title
    # One CMS entry (pomsky-ollie-boy) has no gender fact; its slug still says it.
    label = facts.get("Boy or girl") or ("Boy" if re.search(r"-(boy|male)$", slug) else "Girl")
    local = facts["Where"] == "In Dubai"
    gone.append({
        "id": pid, "slug": slug, "name": name, "displayName": title, "breed": breed,
        "gender": {"Boy": "male", "Girl": "female"}.get(label, "male-female"), "genderLabel": label,
        "age": facts["Age"], "status": "gone-home",
        "origin": {"slug": "local", "name": "In Dubai"} if local else {"slug": "imported", "name": "Imported"},
        "breeds": [{"slug": slugify(breed), "name": breed}], "collections": [], "media": media,
    })

home = rsc("home")
OUT.mkdir(parents=True, exist_ok=True)
data = {
    "puppies.json": available + gone,
    "family-photos.json": array_after(rsc("happy-families"), "photos"),
    "faqs.json": array_after(rsc("faq"), "faqs"),
    "journey-steps.json": array_after(home, "items"),
}
for file, value in data.items():
    (OUT / file).write_text(json.dumps(value, indent=1, ensure_ascii=False) + "\n")
    print(file, len(value))
