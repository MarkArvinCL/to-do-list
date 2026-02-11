CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID NOT NULL,
    description TEXT,
    status TEXT
);
CREATE TABLE list (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    title TEXT,
    status TEXT
  );
  CREATE TABLE user_accounts (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    username TEXT,
    password TEXT,
    name TEXT
);
