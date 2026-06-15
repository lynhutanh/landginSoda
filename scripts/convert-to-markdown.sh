#!/bin/bash

# Microsoft MarkItDown Helper Script
# Usage: ./scripts/convert-to-markdown.sh <input_file>

set -e

INPUT_FILE="$1"

if [ -z "$INPUT_FILE" ]; then
  echo "Error: Missing input file."
  echo "Usage: $0 <path_to_document_file>"
  exit 1
fi

if [ ! -f "$INPUT_FILE" ]; then
  echo "Error: File '$INPUT_FILE' not found."
  exit 1
fi

# Detect python or pip
PYTHON_CMD=""
if command -v python3 &>/dev/null; then
  PYTHON_CMD="python3"
elif command -v python &>/dev/null; then
  PYTHON_CMD="python"
fi

MARKITDOWN_CMD=""
if command -v markitdown &>/dev/null; then
  MARKITDOWN_CMD="markitdown"
elif [ -n "$PYTHON_CMD" ] && $PYTHON_CMD -c "import markitdown" &>/dev/null; then
  MARKITDOWN_CMD="$PYTHON_CMD -m markitdown"
fi

if [ -z "$MARKITDOWN_CMD" ]; then
  echo "=========================================================================="
  echo "Microsoft MarkItDown is not installed in your Python environment."
  echo "To install it, run one of the following commands:"
  echo "  pip install markitdown"
  echo "  pipx install markitdown"
  echo "  brew install markitdown  (on macOS via Homebrew)"
  echo "=========================================================================="
  exit 1
fi

OUTPUT_FILE="${INPUT_FILE%.*}.md"
echo "Converting '$INPUT_FILE' to Markdown..."
$MARKITDOWN_CMD "$INPUT_FILE" > "$OUTPUT_FILE"
echo "Successfully created '$OUTPUT_FILE'."
