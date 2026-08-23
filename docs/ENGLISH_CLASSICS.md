# English Chinese-Classics Layer

The English product is not a bulk machine translation of the Chinese website. Its flow is:

```text
English feeling / thought / situation
        ↓
curated English intent matching
        ↓
existing verified Chinese quote record
        ↓
original Chinese + pinyin + English reading + source + context
```

## Source rule

The final Chinese line and attribution must come from the existing `QUOTES` corpus. The English layer references records by ID and fails fast when an ID is missing. It must not create a line that merely sounds classical.

## Translation rule

Each English record contains:

- `literalTranslation`: a close, readable rendering of the source line;
- `naturalMeaning`: a plain-English explanation of what the line communicates;
- `whyItFits`: why the line matches a modern intent;
- `culturalNote`: optional context that prevents a misleading interpretation;
- `pinyin`: a pronunciation aid.

The English text is an original reading aid for Gu Ren Said. Do not copy a modern translator's copyrighted wording.

## Adding a Chinese classic

1. Verify or add the Chinese source record in the main corpus.
2. Add an English metadata entry in `lib/english-classics.ts`, referencing the Chinese record ID.
3. Assign one or more existing topic slugs.
4. Add at least four natural English search expressions.
5. Add a ranking regression case when the line should be the best answer to an important query.
6. Run:

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
- gradual expansion of the Chinese corpus.

### Phase 2 — Western classics

Add a generalized corpus model before importing Shakespeare, Romantic poets, Victorian poets, or other Western public-domain works. Do not force Western works into Chinese-only fields such as `dynasty`. Keep each corpus separately verifiable and expose a corpus selector only after ranking quality is stable.
