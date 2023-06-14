#!/usr/bin/env bash

selected=`cat ./.apps| fzf`
if [[ -z $selected ]]; then
    exit 0
fi

cargo run --bin $selected
