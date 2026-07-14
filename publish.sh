#!/usr/bin/env bash

set -euo pipefail

cd -- "$(dirname -- "${BASH_SOURCE[0]}")"

branch="$(git branch --show-current)"

if [[ "$branch" != "main" ]]; then
    printf 'Publishing is only allowed from main. Current branch: %s\n' "$branch" >&2
    exit 1
fi

git fetch origin main --quiet

behind="$(git rev-list --count HEAD..origin/main)"

if (( behind > 0 )); then
    printf '%s\n' 'The remote repository has newer commits. Pull them before publishing.' >&2
    exit 1
fi

changes="$(git status --short)"

if [[ -z "$changes" ]]; then
    printf '%s\n' 'Nothing to publish.'
    exit 0
fi

printf '\nChanges to publish:\n%s\n\n' "$changes"
read -r -p 'Build and publish these changes? [y/N] ' confirmation

case "$confirmation" in
    y|Y|yes|YES|Yes)
        ;;
    *)
        printf '%s\n' 'Canceled.'
        exit 0
        ;;
esac

corepack pnpm build

git add --all

if (( $# > 0 )); then
    commit_message="$*"
else
    read -r -p 'Commit message: ' commit_message
fi

if [[ -z "${commit_message//[[:space:]]/}" ]]; then
    printf '%s\n' 'A commit message is required.' >&2
    exit 1
fi

git commit -m "$commit_message"
git push origin main

printf '\n%s\n' 'Published successfully.'
