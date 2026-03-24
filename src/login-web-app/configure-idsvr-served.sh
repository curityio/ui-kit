#!/bin/bash
set -e

# Configures a local instance of the Curity Identity Server to use the API-driven UI built from this repo.
#
# This script uses a loader template that is only suitable for local testing.
#
# This script assumes that the Identity Server instance is already configured in a way that it is possible to run
# OAuth authorization flows against it.
#
# Changes applied to the Identity Server instance:
# - Enables API-driven UI in the server
# - Copy the application assets to the corresponding directories

IDSVR_HOME=${IDSVR_HOME:-"../identity-server/dist"}
IDSH="$IDSVR_HOME/bin/idsh"

# Check for required commands
command -v $IDSH >/dev/null || { echo "idsh not found at $IDSH"; exit 1; }

# Build the application

npm run build

# Configure the server

$IDSH << EOF
configure
set environments environment ui-experience api-driven
commit
exit no-confirm
exit
EOF

# Copy the loader template

OVERRIDES_DIR=$IDSVR_HOME/usr/share/templates/overrides
API_DRIVEN_UI_DIR=$OVERRIDES_DIR/api-driven-ui

mkdir -p $API_DRIVEN_UI_DIR

## Replace './assets/' with '$_staticResourceRootPath/assets/api-driven-ui/'
## Using '#' as the separator for sed
sed s#./assets/#\$_staticResourceRootPath/assets/api-driven-ui/#g dist/loader.vm.html > $API_DRIVEN_UI_DIR/index.vm

# Copy the assets

ASSETS_DIR=$IDSVR_HOME/usr/share/webroot/assets/api-driven-ui

if [[ -d $ASSETS_DIR ]]; then
  rm -r $ASSETS_DIR
fi

mkdir -p $ASSETS_DIR
cp -a dist/assets/. $ASSETS_DIR