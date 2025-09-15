# Gemini Context for iamdap91.github.io

This document provides instructions and context for interacting with this project.

## Project Overview

This is a personal blog and knowledge base built with Docusaurus. It's written in TypeScript and contains content in both English and Korean. The site is deployed to GitHub Pages.

The project is structured into three main content areas:
- `blog/`: The main blog, available at the site root (`/`).
- `docs/`: A documentation section for "Hacks", available at `/hacks`.
- `studies/`: A documentation section for "Study Materials", available at `/studies`.

## Core Technologies

- **Framework**: Docusaurus
- **Language**: TypeScript, React
- **Content**: MDX (`.mdx`) and Markdown (`.md`)
- **Styling**: CSS Modules (`.module.css`) and global styles in `src/css/custom.css`.
- **Diagrams**:
  - `remark-kroki` is used for D2 diagrams. Code fences should look like:
    ```
    ```kroki type=d2
    vars: {
      d2-config: {
        sketch: true
      }
    }
    A -> B
    ```
    ```
  - `@docusaurus/theme-mermaid` is used for Mermaid diagrams.
- **Package Manager**: `npm`

## How to Work with this Project

### Creating or Editing Content (Blog Posts, Docs)

1.  **Location**: Place new files in the appropriate directory (`blog/`, `docs/`, or `studies/`). Create subdirectories for organization.
2.  **File Format**: Use `.mdx` to allow for React components within Markdown. Use `.md` for simple content.
3.  **Frontmatter**: All posts must have frontmatter. Key fields include:
    - `slug`: The URL slug for the post.
    - `title`: The title of the post.
    - `authors`: Always `[3sam3]`.
    - `tags`: An array of relevant tags (e.g., `[docusaurus, react, typescript]`).
    - `date`: The publication date in `YYYY-MM-DDTHH:mm:ss` format.
    - `sidebar_position`: (For `docs`/`studies`) to order items in the sidebar.
4.  **Custom Components**: You can use custom React components from `src/components/` inside `.mdx` files. For example:
    - `<HighlightOrange text="some text" />` to highlight text.
    - `<BuyMeACoffee />` for the "Buy Me a Coffee" button.
5.  **Language**: Content can be in English or Korean. Maintain the language of the existing file when editing.
6.  **Diagrams**: Use `kroki` for D2 diagrams and `mermaid` for others, following the existing style. The `sketch: true` option is preferred for D2 diagrams to give them a hand-drawn look.

### Developing Custom React Components

1.  **Location**: Create new components in `src/components/`.
2.  **Language**: Use TypeScript (`.tsx`).
3.  **Styling**: Use CSS Modules. Create a `styles.module.css` file for your component and import it.
4.  **Conventions**: Follow the structure and style of existing components.

### Customizing the Theme

- The theme is customized ("swizzled") in the `src/theme/` directory.
- For example, `src/theme/BlogPostPage/index.tsx` is modified to include Disqus comments and a view counter.
- `src/theme/TOC/index.tsx` is modified to add a `<BuyMeACoffee />` component to the table of contents.
- When making theme changes, edit these files or swizzle new components.

### Deployment

- Deployment is automated via GitHub Actions in `.github/workflows/deploy.yml`.
- The workflow builds the site and deploys it to the `main` branch for GitHub Pages.
- **Important**: The build process uses a `kroki` Docker container to render D2 diagrams. Any changes to the deployment workflow must preserve this service.

### Key Files to Reference

- `docusaurus.config.ts`: The main configuration file. Check this for plugins, presets, and theme settings.
- `package.json`: For a list of dependencies and scripts.
- `sidebars.ts`: Defines the sidebar structure for `docs/` and `studies/`.
- Existing `.mdx` files: For examples of content structure, frontmatter, and component usage.

## Think and Infer in English, and Answer in Korean
