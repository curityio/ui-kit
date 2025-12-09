#!/bin/bash

#
# Deployment script for Curity UI Kit
#
# This script deploys build artifacts (assets, templates, and messages) to a production environment.
#
# Prerequisites:
# - Set IDSVR_HOME environment variable to your Identity Server installation directory
# - Run the build process before deploying: npm run build
#
# Usage:
#   ./deploy.sh
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if IDSVR_HOME is set
if [ -z "$IDSVR_HOME" ]; then
    echo -e "${RED}Error: IDSVR_HOME environment variable is not set${NC}"
    echo "Please set IDSVR_HOME to point to your Identity Server installation directory"
    echo "Example: export IDSVR_HOME=/path/to/idsvr"
    exit 1
fi

# Check if IDSVR_HOME exists
if [ ! -d "$IDSVR_HOME" ]; then
    echo -e "${RED}Error: IDSVR_HOME directory does not exist: $IDSVR_HOME${NC}"
    exit 1
fi

echo -e "${GREEN}Starting deployment to: $IDSVR_HOME/usr/share${NC}"
echo ""

# Function to copy files with feedback
copy_with_feedback() {
    local source=$1
    local dest=$2
    local description=$3

    if [ -e "$source" ]; then
        echo -e "${YELLOW}Deploying $description...${NC}"
        mkdir -p "$dest"
        cp -r "$source" "$dest"
        echo -e "${GREEN}✓ $description deployed${NC}"
    else
        echo -e "${YELLOW}⚠ Skipping $description (source not found: $source)${NC}"
    fi
}

echo "================================================"
echo "Identity Server Deployment"
echo "================================================"

# Identity Server - Assets (CSS, Fonts, Images, JS)
copy_with_feedback \
    "src/identity-server/build/webroot" \
    "$IDSVR_HOME/usr/share/" \
    "Identity Server Assets (CSS, Fonts, Images, JS)"

# Identity Server - Templates
copy_with_feedback \
    "src/identity-server/build/templates" \
    "$IDSVR_HOME/usr/share/" \
    "Identity Server Templates"

# Identity Server - Messages
copy_with_feedback \
    "src/identity-server/build/messages" \
    "$IDSVR_HOME/usr/share/" \
    "Identity Server Messages"

echo ""
echo "================================================"
echo "Self Service Portal Deployment"
echo "================================================"

# Self Service Portal - Check if dist exists
if [ ! -d "src/self-service-portal/app/dist" ]; then
    echo -e "${YELLOW}⚠ Self Service Portal build not found. Skipping USSP deployment.${NC}"
    echo -e "${YELLOW}  Run 'npm run build:ussp' first if you want to deploy the Self Service Portal.${NC}"
else
    # Deploy to global overrides
    echo -e "${YELLOW}Deploying Self Service Portal to global overrides...${NC}"
    USSP_TEMPLATE_PATH="$IDSVR_HOME/usr/share/templates/overrides/apps/self-service-portal"
    USSP_MESSAGES_BASE="$IDSVR_HOME/usr/share/messages/overrides"

    mkdir -p "$USSP_TEMPLATE_PATH"
    cp src/self-service-portal/app/dist/index.html "$USSP_TEMPLATE_PATH/index.vm"
    cp -r src/self-service-portal/app/dist/assets "$USSP_TEMPLATE_PATH/" 2>/dev/null || true
    echo -e "${GREEN}✓ Self Service Portal Templates deployed to global overrides${NC}"

    # Deploy USSP Messages for global overrides
    if [ -d "src/self-service-portal/messages" ]; then
        for lang_dir in src/self-service-portal/messages/*/; do
            if [ -d "$lang_dir" ]; then
                lang=$(basename "$lang_dir")
                dest_dir="$USSP_MESSAGES_BASE/$lang/apps/self-service-portal"
                mkdir -p "$dest_dir"
                cp -r "$lang_dir"* "$dest_dir/"
                echo -e "${GREEN}✓ Self Service Portal Messages ($lang) deployed to global overrides${NC}"
            fi
        done
    fi

    # Check if template areas exist and deploy there too
    if [ -d "$IDSVR_HOME/usr/share/templates/template-areas" ]; then
        echo ""
        echo -e "${YELLOW}Deploying Self Service Portal to template areas...${NC}"
        for template_area_dir in "$IDSVR_HOME/usr/share/templates/template-areas"/*/; do
            if [ -d "$template_area_dir" ]; then
                template_area=$(basename "$template_area_dir")
                USSP_TEMPLATE_PATH="$IDSVR_HOME/usr/share/templates/template-areas/$template_area/apps/self-service-portal"
                USSP_MESSAGES_BASE="$IDSVR_HOME/usr/share/messages/template-areas/$template_area"

                mkdir -p "$USSP_TEMPLATE_PATH"
                cp src/self-service-portal/app/dist/index.html "$USSP_TEMPLATE_PATH/index.vm"
                cp -r src/self-service-portal/app/dist/assets "$USSP_TEMPLATE_PATH/" 2>/dev/null || true
                echo -e "${GREEN}✓ Self Service Portal Templates deployed to template area: $template_area${NC}"

                # Deploy messages for this template area
                if [ -d "src/self-service-portal/messages" ]; then
                    for lang_dir in src/self-service-portal/messages/*/; do
                        if [ -d "$lang_dir" ]; then
                            lang=$(basename "$lang_dir")
                            dest_dir="$USSP_MESSAGES_BASE/$lang/apps/self-service-portal"
                            mkdir -p "$dest_dir"
                            cp -r "$lang_dir"* "$dest_dir/"
                        fi
                    done
                    echo -e "${GREEN}✓ Self Service Portal Messages deployed to template area: $template_area${NC}"
                fi
            fi
        done
    else
        echo -e "${YELLOW}⚠ No template areas found${NC}"
    fi
fi

echo ""
echo "================================================"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo "================================================"
