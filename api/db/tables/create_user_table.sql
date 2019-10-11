create type user_status_enum as enum('pending', 'done', 'error');

CREATE TABLE users
(
  _id serial primary key,

  operator_id varchar,
  territory_id varchar,
  
  email varchar NOT NULL,
  firstname varchar NOT NULL,
  lastname varchar NOT NULL,
  phone varchar,
  
  password varchar NOT NULL,
  status user_status_enum NOT NULL,

  forgotten_token varchar,
  forgotten_at timestamp,

  last_connected_at timestamp,

  roles varchar[],

  created_at timestamp NOT NULL DEFAULT NOW(),
  updated_at timestamp NOT NULL DEFAULT NOW(),
  deleted_at timestamp
);

CREATE UNIQUE INDEX ON users(email);