# Alma Batch Checkout

Create batch sets of items to be checked out and in using one operation.

## Build
First cd into the ``client`` folder and run the usual commands to install the front-end tooling and dependencies:

- npm install
- jspm install -y

Then cd into the ``server`` folder and just run: ``npm install`` to install the server side dependencies.

# Server Config
Update client/config/Configuration.js settings

## Add .env file:

NODE_ENV=production
NODE_TLS_REJECT_UNAUTHORIZED=1
APP_HOST={app domain}
APP_PORT={nodejs port}
CLIENT_HEADER=abc_client
DB_HOST=localhost
DB_PORT=8300
DB_NAME=
ALMA_API_KEY=
LDAP_SERVICE=
JWT_SECRET=

## Start app
To run, go into ``server`` and type ``node server.js`` it will run on port 9000 by default. Then visit: ``http://localhost:9000`` to see the app running. (default server)