# English Chinese-Classics Layer

The English product is not a bulk machine translation of the Chinese website. Its flow is:

```text
English feeling / thought / situation
        ↓
curated English intent matching
        ↓
verified Chinese quote record
        ↓
original Chinese + pinyin + English reading + source + context
```

## Source rule

The final Chinese line and attribution must come from the verified Chinese corpus. The English layer references records by ID from `QUOTES` and `EXTRA_QUOTES`, and fails fast when an ID is missing. It must not create a line that merely sounds classical.

The first English MVP remains in `lib/english-classics.ts`. The larger production catalog is assembled in `lib/english-classics-expanded.ts`, which combines the base corpus with additional source-linked records, topics, SEO queries, and the shared ranking logic.

## Translation rule

Each English record contains:

- `literalTranslation`: a close, readable rendering of the source line;
- `naturalMeaning`: a plain-English explanation of what the line communicates;
- `whyItFits`: why the line matches a modern intent;
- `culturalNote`: optional context that prevents a misleading interpretation;
- `pinyin`: a pronunciation aid.

The English text is an original reading aid for Gu Ren Said. Do not copy a modern translator's copyrighted wording.

## Current coverage

The expanded layer covers more than 75 source-linked classics across more than 20 themes. In addition to the original love, longing, beauty, friendship, homesickness, sadness, letting go, perseverance, inner peace, life, wisdom, learning, and courage pages, it now includes:

- commitment and marriage;
- farewell and distance;
- family and reunion;
- ambition and success;
- work and leadership;
- mistakes and renewal;
- perspective and self-knowledge;
- fairness and integrity;
- time and impermanence;
- celebrations and new beginnings.

## Adding a Chinese classic

1. Verify or add the Chinese source record in `QUOTES` or `EXTRA_QUOTES`.
2. Add an English metadata entry in `lib/english-classics-expanded.ts`, referencing the Chinese record ID.
3. Assign one or more existing topic slugs.
4. Add at least four natural English search expressions.
5. Add a ranking regression case when the line should be the best answer to an important query.
6. Add a curated SEO query only when the result is stable enough to index.
7. Run:

```bash
pnpm test:english
pnpm test:queries
pnpm build
```

## Product phases

### Phase 1 — Chinese classics in English

- English homepage and intent search;
- bilingual quote cards;
- crawlable theme pages and curated query pages;
- source-verification and translation policy;
- gradual expansion of the Chinese corpus based on real search demand.

### Phase 2 — Western classics

Add a generalized corpus model before importing Shakespeare, Romantic poets, Victorian poets, or other Western public-domain works. Do not force Western works into Chinese-only fields such as `dynasty`. Keep each corpus separately verifiable and expose a corpus selector only after ranking quality is stable.
