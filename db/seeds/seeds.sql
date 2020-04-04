BEGIN;
\i ./db/seeds/01_users.sql
\i ./db/seeds/02_org.sql
\i ./db/seeds/03_membership.sql
\i ./db/seeds/04_pwd.sql
\i ./db/seeds/05_usage.sql
COMMIT;
-- psql -d midterm -U labber -f ./db/seeds/seeds.sql