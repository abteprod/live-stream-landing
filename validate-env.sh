#!/bin/bash

ENV_FILE=".env"
REQUIRED_KEYS=".env.validate"

echo "🔍 Validating environment variables from $ENV_FILE..."

if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌ $ENV_FILE not found."
  exit 1
fi

if [[ ! -f "$REQUIRED_KEYS" ]]; then
  echo "❌ $REQUIRED_KEYS not found."
  exit 1
fi

# Load .env into environment
set -a
source "$ENV_FILE" 2>/dev/null
set +a

# Validate each required key
MISSING=false
while IFS= read -r key || [[ -n "$key" ]]; do
  if [[ -z "${!key}" ]]; then
    echo "❌ Missing required env var: $key"
    MISSING=true
  fi
done < "$REQUIRED_KEYS"

if [[ "$MISSING" == "true" ]]; then
  echo "⛔ Validation failed. Fix your .env file."
  exit 1
else
  echo "✅ All required env vars are present."
fi
