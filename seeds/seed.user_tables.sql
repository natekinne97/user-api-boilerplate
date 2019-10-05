BEGIN;

TRUNCATE
  users
  RESTART IDENTITY CASCADE;

-- insert new user values
INSERT INTO users(user_name, full_name, email,  password)
VALUES
  -- muffun-stuff      email      blah@gmail.com
  ('dunder', 'Dunder Mifflin', 'blah@gmail.com', '$2a$12$3MsnYDHU0g.FBXkHU5qNiOVM/KT.2LXho7D6TZwbOKLFJBmSbHFbG'),
  -- boward-word      email,  bodoop@gmail.com
  ('b.deboop', 'Bodeep Deboop', 'bodoop@gmail.com', '$2a$12$nt8./ljTB2nPzcncvT51OOTl2AvWkDwQx0Fc70d8dB.VwKx.lKJRe'),
  -- charzard              email  personal
  ('c.bloggs', 'Charlie Bloggs', 'nathan.kinne@gmail.com', '$2a$12$I7iresCXsABro/2L1XnAaOKPIqxMHvyWG/YugMlqf4HYxODNMRzM6'),
  -- samword          samsmith@gmail.com
  ('s.smith', 'Sam Smith', 'samsmith@gmail.com', '$2a$12$qkJ4CkTXE5TzeplM5IUs4eVhkvUNm4/IE1H9jdPUPD2jPNSgpkRHq'),
  -- lex-password     email ataylor@gmail.com
  ('lexlor', 'Alex Taylor', 'ataylor@gmail.com', '$2a$12$9YDhqae2Hqt.w9io46C1fO/is48ebGbA0vRSX8xtHcVtX30TAPjd2'),
  -- ping-password            wippy@gmail.com
  ('wippy', 'Ping Won In', 'wippy@gmail.com', '$2a$12$/jAv6ITFFzjO4kaGUK6M5O2cy2OUv3hj8i0HnsPR4CPMCIdRrr5G6');


COMMIT;