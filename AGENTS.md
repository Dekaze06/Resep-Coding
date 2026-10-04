## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Design & UI Guidelines (STRICT)

- **NO EMOJIS / EMOTICONS**: Never use emoji or emoticon characters anywhere (chat responses, explanations, UI text, icons, buttons, menus). Use professional icon fonts (e.g. Font Awesome, Lucide) or inline SVGs when icons are needed.
- **Pure Gemini 3.7 Flash Suggestions**: Generate clean, modern, responsive, and high-quality web interfaces and components based naturally on Gemini 3.7 Flash's intelligence and user specifications.

## Token-Efficiency & Lean Operating Mode (STRICT)

- **Surgical Edits Only**: When modifying code, always target only the exact lines using `replace_file_content`. Never rewrite or display large unchanged blocks of code.
- **Narrow File Views**: View only narrow line ranges (30–60 lines) around target areas instead of loading large file chunks.
- **Concise & Direct Responses**: Provide direct answers, file links, and diff summaries without filler preamble or redundant recaps.
- **Zero Unsolicited Actions**: Do not launch browser subagents, web searches, or broad multi-file scans unless explicitly instructed by the user.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
