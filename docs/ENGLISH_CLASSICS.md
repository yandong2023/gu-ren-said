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

The final Chinese line and attribution must come from a verified Chinese source record. The English layer references stable records by ID and fails fast when an ID is missing. It must not create a line that merely sounds classical.

The catalog is assembled in layers:

- `lib/english-classics.ts`: the original English MVP;
- `lib/english-classics-expanded.ts`: the first major expansion;
- `lib/english-wave2-corpus.ts`: human-reviewed Chinese source records for the second wave;
- `lib/english-classics-wave2.ts`: the current production catalog, topics, curated queries, and shared ranking logic.

## Translation rule

Each English record contains:

- `literalTranslation`: a close, readable rendering of the source line;
- `naturalMeaning`: a plain-English explanation of what the line communicates;
- `whyItFits`: why the line matches a modern intent;
- `culturalNote`: optional context that prevents a misleading interpretation;
- `pinyin`: a pronunciation aid.

The English text is an original reading aid for Gu Ren Said. Do not copy a modern translator's copyrighted wording.

## Current coverage

The production layer now covers more than 110 source-linked classics across more than 30 themes. In addition to love, longing, beauty, friendship, homesickness, sadness, letting go, perseverance, inner peace, life, wisdom, learning, courage, commitment, farewell, family, ambition, work, renewal, perspective, fairness, time, and celebrations, the second wave adds:

- moon and night;
- seasons and nature;
- solitude and reflection;
- travel and journey;
- parents and filial love;
- teaching and mentorship;
- critical thinking and empathy;
- aging and resilience.

## Adding a Chinese classic

1. Verify or add a stable Chinese source record in an approved corpus file.
2. Add an English metadata entry in the latest production catalog, referencing that record ID.
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
