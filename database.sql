CREATE DATABSE airline_ticket_booking

CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT 
    uuid_generate_v4(),
    role VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

CREATE TABLE admin(
    admin_id uuid PRIMARY KEY DEFAULT 
    uuid_generate_v4(),
    role VARCHAR(255) NOT NULL,
    admin_name VARCHAR(255) NOT NULL,
    admin_email VARCHAR(255) NOT NULL,
    admin_password VARCHAR(255) NOT NULL
);

-- Create the routes table
CREATE TABLE IF NOT EXISTS flight_routes (
  id SERIAL PRIMARY KEY,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  CONSTRAINT unique_route UNIQUE (origin, destination)
);

-- Create the configurations table
CREATE TABLE IF NOT EXISTS flight_configurations (
  id SERIAL PRIMARY KEY,
  flight_class VARCHAR(255) NOT NULL,
  seats_available INTEGER NOT NULL,
  seating_arrangement VARCHAR(255) NOT NULL
);

-- Create the flights table
CREATE TABLE IF NOT EXISTS flights (
  id SERIAL PRIMARY KEY,
  route_id INTEGER REFERENCES flight_routes(id),
  configuration_id_1 INTEGER REFERENCES flight_configurations(id),
  configuration_id_2 INTEGER REFERENCES flight_configurations(id),
  configuration_id_3 INTEGER REFERENCES flight_configurations(id),
  flight_name VARCHAR(255) NOT NULL, 
  flight_number VARCHAR(255) NOT NULL,
  departure_time TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  booking_id uuid PRIMARY KEY DEFAULT 
    uuid_generate_v4(),
  flight_id INTEGER REFERENCES flights(id),
  configuration_id INTEGER REFERENCES flight_configurations(id),
  passenger_name VARCHAR(255) NOT NULL,
  passenger_age INTEGER NOT NULL,
  seat_no VARCHAR(255) NOT NULL,
  booking_price VARCHAR(255) NOT NULL,
  booking_time TIMESTAMPTZ NOT NULL
);

-- --create ticket availability table --
-- CREATE TABLE IF NOT EXISTS available_tickets(
--   id SERIAL PRIMARY KEY,
--   route_id INTEGER REFERENCES flight_routes(id),
--   flight_id INTEGER REFERENCES flights(id),
--   configuration_id INTEGER REFERENCES flight_configurations(id),
--   seats_available INTEGER NOT NULL
-- );

-- fake users --
-- INSERT INTO users (userRole, username, user_email, user_password) VALUES ('user','John', 'john@gmail.com', 'john123');
-- postgres cmds --
-- postgres --version :- for checking versioning 
-- psql -U postgres for starting
-- \list :- for showing list of databses
-- \c airline_ticket_booking :- go to databse
-- CREATE EXTENSION "uuid-ossp"; :- for import packages
-- CREATE TABLE users(
--     user_id uuid PRIMARY KEY DEFAULT 
--     uuid_generate_v4(),
--     userRole VARCHAR(255) NOT NULL,
--     username VARCHAR(255) NOT NULL,
--     user_email VARCHAR(255) NOT NULL,
--     user_password VARCHAR(255) NOT NULL
-- );  result :- CREATE TABLE :- for creating table in databse
-- \dt :- for showing list of collections
-- select * from users; :- for checking all users
-- delete from users where username = 'John'; :- for delete users
-- DROP TABLE students; :- for delete table
-- DROP TABLE if exists users cascade; :- this will drop any foreign key that is referencing the users table or any view using it.

