# Search quality dashboard

The private quality dashboard is available at:

```text
/admin/quality
```

## Required environment variable

Configure this value in Vercel Production and Preview environments:

```text
QUALITY_ADMIN_KEY=<a-long-random-secret>
```

The dashboard page itself is marked `noindex`, and the data API requires the secret in the `X-Quality-Key` request header. The key is stored only in the current browser's local storage and is never placed in the URL.

## What is recorded

The search quality log stores the latest search outcomes in Upstash Redis:

- success, empty result, or error
- result count
- top-result score and matching signals
- low-confidence flag
- request duration
- whether AI enhancement was enabled

Queries that are not considered safe public-page candidates are replaced by a short hash label before storage.

The dashboard also aggregates the existing user feedback list by query and result.

## Redis keys

```text
grs:quality:searches
grs:feedback
```

The search quality list is capped at 3,000 records. The dashboard reads up to the latest 500 search and feedback records per request.
