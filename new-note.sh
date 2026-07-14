#!/usr/bin/env bash

set -euo pipefail

cd -- "$(dirname -- "${BASH_SOURCE[0]}")"

title="${*:-}"

if [[ -z "${title//[[:space:]]/}" ]]; then
    read -r -p 'Post title: ' title
fi

if [[ -z "${title//[[:space:]]/}" ]]; then
    printf '%s\n' 'A title is required.' >&2
    exit 1
fi

slug="$(
    printf '%s' "$title" |
        tr '[:upper:]' '[:lower:]' |
        sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//'
)"

if [[ -z "$slug" ]]; then
    printf '%s\n' 'Could not create a valid filename from the title.' >&2
    exit 1
fi

notes_directory="$PWD/src/content/philes/volume-1"

if [[ ! -d "$notes_directory" ]]; then
    printf 'Notes directory does not exist: %s\n' "$notes_directory" >&2
    exit 1
fi

post_path="$notes_directory/$slug.txt"

if [[ -e "$post_path" ]]; then
    printf 'A post already exists at: %s\n' "$post_path" >&2
    exit 1
fi

post_date="$(date +%F)"
safe_title="${title//\"/\\\"}"

cat > "$post_path" <<EOF
---
title: "$safe_title"
date: $post_date
author: "cold"
---

INTRODUCTION //

Write the article here.
EOF

printf 'Created: %s\n' "$post_path"
code --reuse-window "$post_path"
