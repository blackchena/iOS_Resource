# Nginx Map Aligner

Align selected text in VS Code similarly to:

```bash
awk '{$1=$1}1' | column -t
```

## Usage

1. Open a file and select multiple lines.
2. Run command: `Nginx Map Aligner: Align Selected Text`.
3. Selected text is normalized and aligned in columns.

## Notes

- Whitespace is normalized to single-field separation before alignment.
- Empty lines are preserved.
