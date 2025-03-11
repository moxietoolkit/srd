# Moxie toolkit system reference document (SRD)

This repository contains the official SRD for the Moxie Toolkit tabletop roleplaying game system, hosted at [moxietoolkit.com](https://moxietoolkit.com).

> [!NOTE]  
> The full text of the SRD is available in [markdown](./output/markdown/full-moxie-srd.md), [html](./output/html/full-moxie-srd.html), or [DOCX](./output/docx/full-moxie-srd.docx).

> [!NOTE]  
> **Found a typo?** [Create an issue](https://github.com/moxietoolkit/srd/issues/new/choose) and tell us about it.

## How to use this repository

### Players and gamemasters

If you are a player or gamemaster, we will eventually recommend visiting the full site at [moxietoolkit.com](https://moxietoolkit.com).

For now, you can find the rules in [markdown](./output/markdown/full-moxie-srd.md), [html](./output/html/full-moxie-srd.html), or [DOCX](./output/docx/full-moxie-srd.docx).

### For authors who want to use the rules

You can find the rules in [markdown](./output/markdown/full-moxie-srd.md), [html](./output/html/full-moxie-srd.html), or [DOCX](./output/docx/full-moxie-srd.docx) for your use.

> [!NOTE]  
> See licensing below for full details.

### For authors who want to contribute to the SRD

Awesome! [Create an issue](https://github.com/moxietoolkit/srd/issues/new/choose) with what you'd like to add and how to get in touch with you. (This requires a free Github account.)

## Licensing

This work is based on Moxie © 2024 by J.D. Maxwell and Oddity Press, licensed under CC BY 4.0.

For licensing details, visit [odditypress.com/licensing](https://www.odditypress.com/licensing).

---

## Development

- **Comments**: Use standard HTML comments: <!-- This is a comment. --->
- **Linting**: Use the Markdown Lint [extension](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint), or ["common sense"](https://github.com/markdownlint/markdownlint/blob/main/docs/RULES.md) - don't skip headers, one top-level header per file, consistent unordered lists, proper spacing between paragraphs, etc.
- **Style**: "Pascal Case" for headers and "kebab-case" for files.

### Repository structure

- `output` contains generated files of the full SRD documents in HTML, markdown, and DOCX formats.
- `scripts` are for processing the SRD from source to output.
- `source` contains the system reference document files with metadata.
  - `1-system` is the core Moxie system
    - `1-player` is player-focused content.
    - `2-gamemaster` is gamemaster-focused content.
  – `2-modules` are optional systems.

### Conventions

The SRD follows these key conventions:

- **System Terms** are **bolded** when introduced or for clarity
- **Emphasis** uses _italics_
- **Pools** refer to diminishing resources
- **PC** means player character
- **D66 Tables** are 6x6 random tables using 2d6
- **Crucibles** are d66 word tables for creative inspiration

For complete style guidelines and markdown conventions, see [notes.md](https://github.com/moxietoolkit/srd/blob/main/notes.md).

## Contributing

> [!NOTE]  
> Contributions welcome. A structure for contributing is coming soon.
