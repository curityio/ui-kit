
# Function to update the .npmrc file with the auth token from curity-npm-group-registry
update_npmrc_token() {
  local npmrc="$HOME/.npmrc"
  local first_token
  local second_token

  # Extract the first auth token
  first_token=$(grep "//hub.curityio.net/repository/curity-npm-group/:_authToken=" "$npmrc" | cut -d'=' -f2)

  # Check if the first token exists
  if [[ -z "$first_token" ]]; then
    echo "First auth token not found!"
    return 1
  fi

  # Update the second auth token to match the first
  sed -i.bak "s#//hub.curityio.net/repository/curity-npm-registry/:_authToken=.*#//hub.curityio.net/repository/curity-npm-registry/:_authToken=${first_token}#" "$npmrc"

  echo "Updated curity-npm-registry auth token to match the curity-npm-group-registry"
}

# Build
npm run build

# Get a curity-cli token
curity-cli t

# Update
update_npmrc_token

# Set version from command line argument
VERSION=${1}

echo "Publishing version: $VERSION"

# Tag, add, commit and push
git tag $VERSION
git add .
git commit -m "${2:-"Published a new version"}"
git push origin master --tags

# Publish
npm version $VERSION
npm pack --pack-destination ./example
npm publish
