from pathlib import Path\ntext = Path('lint-results.txt').read_text('utf-16')\nprint(repr(text[:400]))\n
