# Notes

## Done

- Docker Compose runs the API, PostgreSQL, and Redis. PostgreSQL loads the schema, seed data, and lock migration on a fresh volume.
- Added product and order listing and order lookup by ID.
- Added `POST /orders/:id/claim`. It uses `X-User-Id` and stores the picker and expiry in `locked_by` and `locked_until`. The default TTL is 900 seconds.
- Claim checks and updates the order on one PostgreSQL connection in one transaction. A competing picker gets `409` with `heldBy` and `lockedUntil`.
- Added `POST /orders/:id/release`. The lock owner gets `204` with an empty body. Another picker gets `409`.

## Manual check

Run `docker compose up -d`. In Postman, choose a paid, open order with no active lock. Send `POST /orders/:id/claim` with `X-User-Id: 1` and expect `200`. Repeat as picker `2` and expect `409`. Try `POST /orders/:id/release` as picker `2` and expect `409`, then release as picker `1` and expect `204`. Picker `2` can now claim the order.

## Next

- Add scanning and show the active lock and order lines in the order lookup.
- Add the marketplace worker, report status, and retry endpoint.
- Add automated tests for competing claims, lock expiry, and scanning.
