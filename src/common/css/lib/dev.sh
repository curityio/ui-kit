#!/bin/bash

while true; do
    npm run build
    # npm pack
    # cp *.tgz ../docs/src/packages
    sleep 5
done
