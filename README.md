A boiler plate for making an api with secure user login 
and creating new users.

This boilerplate is designed to be used with postgesql.

To install dependencies with npm i
Before running add the following to the env file and fill with your info:
NODE_ENV=development
PORT=8000
MIGRATION_DB_HOST=127.0.0.1
MIGRATION_DB_PORT=5432
MIGRATION_DB_NAME=
MIGRATION_DB_USER=
MIGRATION_DB_PASS=
DB_URL=
TEST_DB_URL=
JWT_SECRET =

Remember to change the table names inside the service files as well as in the tests to the desired names.