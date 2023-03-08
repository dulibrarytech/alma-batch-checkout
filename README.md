# Alma Batch Checkout

Create batch sets of items to be checked out and in using one operation.

## Build
First cd into the ``client`` folder and run the usual commands to install the front-end tooling and dependencies:

- npm install
- jspm install -y

Then cd into the ``server`` folder and just run: ``npm install`` to install the server side dependencies.

# Server Config
Update client/config/Configuration.js settings

serverUrl = "path to server backend (default - same as client domain/port)"; // no trailing slash
ssoUrl = "your sso idp auth url";
ssoResponseUrl = "server sso auth route [serverUrl]/auth/sso";
ssoLogoutUrl = "url to sso logout endpoint";

## Add .env file:
NODE_ENV={development|production}
NODE_TLS_REJECT_UNAUTHORIZED=1
APP_HOST={app domain}
APP_PORT={nodejs port}
CLIENT_HEADER={abc_client}
DB_HOST={localhost or db host}
DB_PORT={21717 or db port}
DB_NAME={mongodb database}
ALMA_API_KEY={alma key}
LDAP_SERVICE={ldap idp domain DEACTIVATED}
JWT_SECRET={any string}
SSO_HOST={your sso provider url}
SSO_CLIENT_LOGIN_URL={e.g. [client domain:port]/#/loginSSO}

## Start app
To run, go into ``server`` and type ``node server.js`` it will run on port 9000 by default. Then visit: ``http://localhost:9000`` to see the app running. (default server)