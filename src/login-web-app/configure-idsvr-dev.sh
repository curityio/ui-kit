#!/bin/bash
set -e

# Configures a local instance of the Curity Identity Server for development with API-driven UI.
#
# This script is paired with the configuration of the Vite development server so that it's possible to bootstrap the
# API-driven UI on the Identity Server while still developing the front-end application with Vite.
#
# The Vite development server runs on https://localhost:8443 and proxies applicable requests to Identity Server
# running on https://localhost:9443.
#
# This script assumes that the Identity Server instance is already configured in a way that it is possible to run
# OAuth authorization flows against it. It also assumes that there is a service role which exposes all relevant
# endpoints.
#
# Changes applied to the Identity Server instance:
# - Enables API-driven UI in the server
# - Set the base URL to https://localhost:8443
# - Set the listening port of the first service role to 9443
# - Copy the development loader template to template overrides directory

IDSVR_HOME=${IDSVR_HOME:-"../identity-server/dist"}
IDSH="$IDSVR_HOME/bin/idsh"

# Check for required commands
command -v $IDSH >/dev/null || { echo "idsh not found at $IDSH"; exit 1; }
command -v jq >/dev/null || { echo "jq not found"; exit 1; }

# Configure the server

SERVICE_ROLES_JSON=$($IDSH << EOF
configure
show environments environment services service-role | display json
EOF)
SERVICE_ROLE=$(echo $SERVICE_ROLES_JSON | jq -r '.data.["base:environments"].environment.services.["service-role"].[0].id')

if [[ -z "$SERVICE_ROLE" || "$SERVICE_ROLE" == "null" ]]; then
  echo "At least on service role must be configured"
  exit 1
fi

$IDSH << EOF
configure
edit environments environment
set base-url https://localhost:8443
set services service-role $SERVICE_ROLE listening-port 9443
set ui-experience api-driven
commit
exit no-confirm
exit
EOF

# Copy the loader template

OVERRIDES_DIR=$IDSVR_HOME/usr/share/templates/overrides
API_DRIVEN_UI_DIR=$OVERRIDES_DIR/api-driven-ui

mkdir -p $API_DRIVEN_UI_DIR

cp ./loader-dev.vm.html $API_DRIVEN_UI_DIR/index.vm