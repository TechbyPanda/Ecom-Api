# Running locally

```powershell
docker compose config --services
docker compose up --build -d
docker compose ps
docker compose exec postgres psql -U warehouse -d warehouse
```

Add the lock columns if they are missing.

```sql
ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS locked_by text,
    ADD COLUMN IF NOT EXISTS locked_until timestamptz;
```

## Order claim query

```sql
UPDATE orders
SET locked_by = $2,
    locked_until = clock_timestamp() + $3 * interval '1 second'
WHERE id = $1
  AND payment_status = 'PAID'
  AND status = 'OPEN'
  AND (
      locked_until IS NULL
      OR locked_until <= clock_timestamp()
      OR locked_by = $2
  )
RETURNING locked_by AS "heldBy", locked_until AS "lockedUntil";
```