#!/bin/bash

# Navigate to the src directory
cd frontend/src

# Rename all .js files to .jsx in the main directory
for file in *.js; do
  if [ -f "$file" ]; then
    mv "$file" "${file%.js}.jsx"
  fi
done

# Rename all .js files to .jsx in the components directory
cd components
for file in *.js; do
  if [ -f "$file" ]; then
    mv "$file" "${file%.js}.jsx"
  fi
done

echo "All .js React files have been renamed to .jsx"
