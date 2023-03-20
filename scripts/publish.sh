#!/usr/bin/env bash

WORK_DIR=$PWD
BUILD_DEST=$1

if [ ! -d "$BUILD_DEST" ]; then
  mkdir -p "$BUILD_DEST"
fi

npm i -g n
# 使用官方源有较大概率会 block
export N_NODE_MIRROR=https://npm.taobao.org/mirrors/node

echo "Switch node version to 16"
n 16.15.1
echo "Node Version"
node -v

echo "Deploy ${WORK_DIR} -> ${BUILD_DEST} ..."

echo "Setup"
npm run setup
npm run build

mv ./packages/bootstrap/build/* $BUILD_DEST

echo "Complete"
