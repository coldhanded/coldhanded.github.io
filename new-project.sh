#!/usr/bin/env bash

set -euo pipefail

cd -- "$(dirname -- "${BASH_SOURCE[0]}")"

title="${*:-}"

if [[ -z "${title//[[:space:]]/}" ]]; then
    read -r -p 'Project title: ' title
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

projects_directory="$PWD/src/content/philes/volume-0"

if [[ ! -d "$projects_directory" ]]; then
    printf 'Projects directory does not exist: %s\n' "$projects_directory" >&2
    exit 1
fi

post_path="$projects_directory/$slug.txt"

if [[ -e "$post_path" ]]; then
    printf 'A project already exists at: %s\n' "$post_path" >&2
    exit 1
fi

next_order="$(
    awk '
        FNR == 1 {
            found = 0
        }

        /^order:[[:space:]]*[0-9]+[[:space:]]*$/ {
            value = $0
            sub(/^order:[[:space:]]*/, "", value)
            sub(/[[:space:]]*$/, "", value)

            if (!seen || value > maximum) {
                maximum = value
            }

            found = 1
            seen = 1
        }

        ENDFILE {
            if (!found) {
                printf "Could not find a valid order value in: %s\n", FILENAME > "/dev/stderr"
                exit 1
            }
        }

        END {
            if (!seen) {
                print 0
            } else {
                print maximum + 1
            }
        }
    ' "$projects_directory"/*.txt
)"

post_date="$(date +%F)"
last_updated="$(LC_ALL=C date '+%B %Y')"
safe_title="${title//\"/\\\"}"

cat > "$post_path" <<EOF
---
title: "$safe_title"
date: $post_date
author: "cold"
order: $next_order
---

STATUS //

  Active

STACK //

  Add project stack here

LAST UPDATED //

  $last_updated

Write the project overview here.
EOF

printf 'Created project %s: %s\n' "$next_order" "$post_path"
code --reuse-window "$post_path"
