docker compose config --services
docker compose up --build -d
docker compose ps
docker compose exec postgres psql -U warehouse -d warehouse

ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS locked_by text,
    ADD COLUMN IF NOT EXISTS locked_until timestamptz;