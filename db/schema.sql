-- Enquiries sent from the puppy pages and the contact page.
CREATE TABLE IF NOT EXISTS enquiries (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  name        TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 80),
  phone       TEXT NOT NULL CHECK (char_length(phone) <= 40),
  email       TEXT CHECK (char_length(email) <= 254),
  area        TEXT CHECK (char_length(area) <= 80),
  message     TEXT CHECK (char_length(message) <= 2000),
  puppy_id    UUID,
  puppy_label TEXT,
  source      TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries (created_at DESC);
