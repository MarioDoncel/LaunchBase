--Database
DROP DATABASE IF EXISTS foodfy
CREATE DATABASE foodfy

-- TABLES
CREATE TABLE "chefs" (
  "id"	SERIAL PRIMARY KEY,
  "name"	TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT(now())		
);

CREATE TABLE "recipes" (
  "id"	SERIAL PRIMARY KEY,
  "title"	TEXT NOT NULL,
  "ingredients"	TEXT NOT NULL,
  "preparation"	TEXT NOT NULL,
  "information"	TEXT,
  "created_at" TIMESTAMP	DEFAULT(now()),		
  "updated_at" TIMESTAMP DEFAULT(now()),
  "chef_id" INTEGER NOT NULL,
  "user_id" INTEGER	
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "reset_token" TEXT,
  "reset_token_expires" TEXT,
  "is_admin" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP DEFAULT(now()),
  "updated_at" TIMESTAMP DEFAULT(now())
);

-- TABLES FILES
CREATE TABLE "chef_files" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT,
  "path" TEXT NOT NULL,
  "chef_id" INTEGER NOT NULL
);

CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT,
  "path" TEXT NOT NULL,
  "recipe_id" INTEGER NOT NULL
);

-- SESSION
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ON DELETE CASCADE FILES
ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") ON DELETE CASCADE;

ALTER TABLE "chef_files" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id") ON DELETE CASCADE;

-- SET NULL USER_ID ON RECIPE IF USER DELETED
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL

-- AUTO UPDATE FIELD UPDATED_AT
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

