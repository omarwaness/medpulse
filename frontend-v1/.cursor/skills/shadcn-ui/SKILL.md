---
name: shadcn-ui
description: Integrates and manages the shadcn/ui component library in this project using the official GitHub repo and CLI. Use when the user asks to install, configure, or update shadcn/ui, to run `npx skills add shadcn/ui`, or to build UI components based on shadcn/ui.
---

# shadcn/ui integration

## Instructions

Follow this workflow whenever the user wants to install or work with **shadcn/ui** in this project.

### 1. When to apply this skill

- Use this skill when the user:
  - Mentions `shadcn/ui`, "shadcn", or the shadcn component library
  - Asks to "run `npx skills add shadcn/ui`" or similar
  - Wants to install, configure, or update shadcn/ui in this codebase
  - Asks to add, remove, or customize UI components based on shadcn/ui

### 2. Install / sync shadcn/ui via CLI

When the user wants to add or refresh the shadcn/ui setup:

1. Confirm you are operating from the project root (this repository).
2. Use the Shell tool to run:

   ```bash
   npx skills add shadcn/ui
   ```

3. If the CLI prompts for options (like framework or paths), follow the user's stated preferences when available; otherwise:
   - Prefer Next.js + Tailwind defaults that match the existing project setup.
   - Keep component paths consistent with the current `components` directory layout.
4. After the command completes, review any generated or updated files (such as configuration, components, or utilities) before making further changes.

The source for this skill and components is the official `shadcn/ui` repository (`https://github.com/shadcn/ui.git`) and its documentation (`https://ui.shadcn.com/docs`).

### 3. Using shadcn/ui components

When building or updating UI:

1. Prefer shadcn/ui components and patterns (composition, variants, theming) over ad-hoc custom components when they match the design requirements.
2. Reuse existing components before creating new ones; keep styling consistent with shadcn/ui defaults unless the user requests custom designs.
3. When creating new components modeled after shadcn/ui:
   - Follow the same file structure and naming conventions as existing shadcn/ui-based components.
   - Keep components accessible (focus states, ARIA attributes, keyboard navigation).

### 4. Reference material

When you need additional details:

- Use the official docs at `https://ui.shadcn.com/docs` for:
  - Component APIs and examples
  - Theming, dark mode, and Tailwind configuration
  - CLI usage and advanced configuration
- Use the GitHub repo `https://github.com/shadcn/ui.git` as the canonical source for:
  - Example implementations
  - Updates to the skills integration and component set

Do not copy large sections of documentation verbatim; instead, summarize and adapt patterns to this project.

## Examples

**Example 1 – Install shadcn/ui via skills CLI**

- User: "Create a skill to run `npx skills add shadcn/ui` and set up shadcn UI."
- Assistant behavior using this skill:
  1. Run `npx skills add shadcn/ui` from the project root using the Shell tool.
  2. Inspect generated configuration and component files.
  3. Explain briefly what was installed and how to use the components.

**Example 2 – Add a new component**

- User: "Add a settings panel using shadcn/ui components."
- Assistant behavior using this skill:
  1. Confirm shadcn/ui is installed (and run `npx skills add shadcn/ui` if needed).
  2. Create or extend components using the existing shadcn/ui patterns and Tailwind classes.
  3. Keep the design and accessibility consistent with other shadcn/ui-based components in the project.

