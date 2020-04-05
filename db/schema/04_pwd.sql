DROP TABLE IF EXISTS pwd
CASCADE;

CREATE TABLE pwd
(
  id            SERIAL       PRIMARY KEY,
  org_id        INTEGER      REFERENCES org ON DELETE CASCADE,
  website_title VARCHAR(255) NOT NULL,
  website_url   VARCHAR(255) NOT NULL,
  website_pwd TEXT         NOT NULL,
  category      VARCHAR(255)
);
