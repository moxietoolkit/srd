# Notes On The Moxie SRD

## What Is This Document For?

It contain observations on the Moxie system as seen in the Grimwild book, for the express purpose of creating the SRD. In this spirit, some references will be made to the [Blades in the Dark SRD](https://github.com/amazingrando/blades-in-the-dark-srd-content), on which the Moxie SRD will be (roughly) based on.

Commentary on specific sections of the SRD is included as comments in the SRD itself.

## Goals Of The SRD

For starters, what's the point of an SRD? As the name implies, it is reference material. Thus, making it **easy to reference** is an obvious goal.

Additionally, Moxie is a **modular system** - easy to get stuff in and out. This aspect should be preserved.

Finally, it should be as **consistent** as possible with other Moxie projects - by using the same conventions, for instance.

## Conventions

As per **Grimwild, Chapter 1: Getting Started**:

- **Dice Notation**: The SRD uses standard dice notation in the format of "AdX". "A" is omitted if 1.
- **System Terms**: Are **bolded** only when first introduced or when clarity is needed. Emphasis is show with _italics_, sometimes **_boldly_**.
- **Pools**: Refer, specifically, to **diminishing pools**.
- **PC**: Refer, specifically, to **player characters**. Used interchangeably with "character".
- **D66 Tables**: 6x6 random tables, roll 2d6 and use one die for each row or column, your choice of which.
- **Crucibles**: d66 tables of words that are meant to be mashed together for inspiration.
- **Pronouns**: The SRD addresses the reader as "you". When employing the third person, "they" is used. "I" and "We" are only used in examples - keep authorial voice to a minimum.

Regarding Markdown:

- **Comments**: Use standard HTML comments: <!-- This is a comment. --->
- **Linting**: Use the Markdown Lint [extension](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint), or ["common sense"](https://github.com/markdownlint/markdownlint/blob/main/docs/RULES.md) - don't skip headers, one top-level header per file, consistent unordered lists, proper spacing between paragraphs, etc.
- **Style**: "Pascal Case" for headers and "kebab-case" for files.

## Layout

The root-level "srd.md" file should contain the text of the SRD in its entirety, with linting disabled and without comments.

The content itself is laid in sections, each with as many subsections as needed. Use the templates below to see this layout in full and make changes.

```markdown
# Player Rules

## Playing With Moxie

## Core Rules

## Working Together

## Dice Rolls

## Diminishing Pools

## Vantage

## Character Details

## Creative Freedom

## Story Arcs

## Damage

## Recovery

## Odds And Ends

## Beginning And Ending Sessions
```

```markdown
# GM Rules

## Running Moxie

## Moves

## Challenges

## Vigilance

## Factions

## GM With Moxie
```

Content from books that is not found in the core SRD rules can most likely be found in the **Modules** directory - Due to module's specificity, they're not included in the standard compiled document, but are nonetheless made available as drop-in rules for anyone to use.
