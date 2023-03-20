#!/usr/bin/env bash

pkgName="@alilc/lce-graph"

if [ "$1" ]; then
  pkgName="$1"
fi

lerna exec --scope $pkgName -- npm start
