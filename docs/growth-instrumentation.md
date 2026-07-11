# Growth instrumentation

This release adds:

- search API input limits and Redis-backed rate limits with an in-memory fallback
- GA4 events for search, copying, sharing, downloads, favorites, and feedback
- shareable `/q/...` browser URLs after successful homepage searches
- cached hot rankings with today → week → long-term/editorial fallbacks
- explicit editorial labels instead of presenting fallback content as real search counts

No raw search text is sent to GA4. Search terms continue to be recorded only by the existing server-side trending pipeline when they pass the public-query safety filter.

Validation covers database seeding, query relevance regression tests, and the production Next.js build.
