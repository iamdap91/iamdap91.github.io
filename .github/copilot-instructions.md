# GitHub Copilot Instructions for iamdap91.github.io

This document provides context to GitHub Copilot for working on this project.

## About the Project

This is a personal blog built with Docusaurus, using TypeScript and React. It contains technical articles and study notes in English and Korean.

- **Framework**: Docusaurus
- **Language**: TypeScript
- **Content**: MDX (`.mdx`)
- **Styling**: CSS Modules

The project has three main content sections: `blog/`, `docs/` (for "Hacks"), and `studies/`.

## Key Technologies & Conventions

- **Docusaurus**: The core framework. Configuration is in `docusaurus.config.ts`.
- **TypeScript**: All new code (components, configuration) should be in TypeScript.
- **MDX**: Content is written in MDX to allow for custom React components.
- **Custom Components**: Located in `src/components`. Import them directly into `.mdx` files. A common one is `<HighlightOrange text="..." />`.
- **Diagrams**:
  - **D2 diagrams** are rendered using `remark-kroki`. Use a `kroki` code fence with `type=d2`. The `sketch: true` style is preferred.
  - **Mermaid diagrams** are also supported via `@docusaurus/theme-mermaid`.
- **Styling**: Use CSS Modules (`styles.module.css`) for component-specific styles. Global styles are in `src/css/custom.css`.
- **Theme Customization**: The theme is customized in `src/theme`. This includes adding Disqus comments, view counters, and other UI elements.
- **Package Manager**: Use `npm`.

## How to Contribute

### Writing a New Post

- Create a new `.mdx` file in `blog/`, `docs/`, or `studies/`.
- Add frontmatter, including `slug`, `title`, `authors: [3sam3]`, `tags`, and `date`.
- Write content using Markdown and custom components.
- For diagrams, use `kroki` or `mermaid` code fences.

### Creating a New Component

- Create a `.tsx` file in `src/components/`.
- Create a corresponding `styles.module.css` file for styling.
- Follow the patterns of existing components.

### Deployment

- Deployment is automated with GitHub Actions (`.github/workflows/deploy.yml`).
- The build step requires a running `kroki` service to render D2 diagrams. Do not remove this from the workflow.

## Important Files

- `docusaurus.config.ts`: Main project configuration.
- `package.json`: Dependencies and scripts.
- `sidebars.ts`: Sidebar navigation structure.
- `src/theme/`: Custom theme components.


## Think and Infer in English, and Answer in Korean
