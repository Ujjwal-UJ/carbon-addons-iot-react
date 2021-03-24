#!/usr/bin/env bash

set -e # exit with nonzero exit code if anything fails

rm -rf dist

# run the angular/ng-packagr build
yarn ng:build

# restore the scripts to the dist package.json
node scripts/add-package-scripts.js

# move/generate/update meta files into dist
gulp buildMeta

# generate ALL the documentation
mkdir dist/docs
yarn build:storybook
yarn docs:build && mv documentation dist/docs/
