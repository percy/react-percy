#!/bin/bash

set -ev

SUITE=$1

error() {
  echo "error: $*" >&2
  exit 1
}

if [ "$SUITE" = "react-percy" ]; then
  cd integration-tests/react-percy
  DEBUG="react-percy:*" yarn percy -- --color
elif [ "$SUITE" = "create-react-app" ]; then
  cd integration-tests/create-react-app
  # Test React 15
  yarn add react@^15 react-dom@^15
  DEBUG="react-percy:*" yarn percy -- --color

  # Test React 16.
  yarn add react@^16 react-dom@^16
  DEBUG="react-percy:*" yarn percy -- --color
else
  cat <<EOF
Valid targets are:
* react-percy
* create-react-app
EOF
fi
