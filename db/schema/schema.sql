BEGIN;
\i ./db/schema/01_users.sql
\i ./db/schema/02_org.sql
\i ./db/schema/03_membership.sql
\i ./db/schema/04_pwd.sql
\i ./db/schema/05_usage.sql
COMMIT;
-- psql -d midterm -U labber -f ./db/schema/schema.sql