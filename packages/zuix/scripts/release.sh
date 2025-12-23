#!/bin/bash
dirPath=`dirname $0`
cd $dirPath
cd ..

if [ $? -gt 0 ]; then
    exit 1
fi

RELEASE=$(basename $BRANCH | tr -d '.')
VERSION=$(npm view @zigbang/zuix2 version --registry http://npm.zigbang.io)
npm version $VERSION
if [ "$STAGE" == "prod" ]; then
    VERSION=$(npm version patch)
elif [ "$STAGE" == "preview" ]; then
    VERSION=$(npm version prerelease --preid=$RELEASE)
else
    VERSION=$(npm version prerelease --preid=$STAGE)
fi

# Modify package.json main roots
cp ./package.json ./package.tmp.json
jq ' .main = "dist/cjs/index.js" | .browser = "dist/esm/index.js" | .types = "dist/types/index.d.ts" | ."react-native" = "dist/app/index.js"' ./package.tmp.json > ./package.json

# Publish
npm publish --registry http://npm.zigbang.io
mv ./package.tmp.json ./package.json
