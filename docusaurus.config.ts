import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import SearchLocal from "@easyops-cn/docusaurus-search-local";
import type * as Preset from "@docusaurus/preset-classic";
// import remarkMath from "remark-math";
// import rehypeKatex from "rehype-katex";

const config: Config = {
  title: "3sam3's blog",
  tagline: "this is 3sam3's web",
  favicon: "img/b3_logo.svg",
  // Set the production url of your site here
  url: "https://your-docusaurus-site.example.com",
  baseUrl: "/",
  staticDirectories: ["static"],
  markdown: { mermaid: true },
  themes: [
    "@docusaurus/theme-mermaid",
    "@docusaurus/theme-live-codeblock",
    [SearchLocal, { hashed: true, language: ["ko", "en"] }],
  ],

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "3sam3", // Usually your GitHub org/user name.
  projectName: "3sam3-blog", // Usually your repo name.

  noIndex: false,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  plugins: [
    ["@docusaurus/plugin-client-redirects", { fromExtensions: ["html"] }],
  ],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "ko",
    locales: ["ko", "en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/iamdap91",
          routeBasePath: "/tech-posting",
        },
        blog: {
          editUrl: "https://github.com/iamdap91",
          showReadingTime: true,
          routeBasePath: "/",
        },
        theme: { customCss: "./src/css/custom.css" },
      } satisfies Preset.Options,
    ],
    // [
    //   "@docusaurus/preset-classic",
    //   {
    //     docs: {
    //       path: "docs",
    //       remarkPlugins: [remarkMath],
    //       rehypePlugins: [rehypeKatex, { strict: false }],
    //     },
    //   },
    // ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "3sam3's blog",
      logo: { src: "img/b3_logo.svg" },
      items: [
        {
          type: "docSidebar",
          sidebarId: "authGeneratedSideBar",
          position: "left",
          label: "Tech Posting",
        },
        { to: "/", label: "Blog", position: "left" },

        {
          to: "/tags",
          label: "Tags",
          position: "left",
        },
        {
          href: "https://github.com/iamdap91",
          label: "GitHub",
          position: "right",
        },
        {
          href: "https://observablehq.com/user/@3sam3",
          label: "ObservableHQ",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            { label: "Blogs", to: "/" },
            // { label: "Tech Posting", to: "/tech-posting" },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/iamdap91",
            },
            {
              label: "ObservableHQ",
              href: "https://observablehq.com/user/@3sam3",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} 3sam3. Built with docusaurus`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      magicComments: [
        // Remember to extend the default highlight class name as well!
        {
          className: "theme-code-block-highlighted-line",
          line: "highlight-next-line",
          block: { start: "highlight-start", end: "highlight-end" },
        },
        {
          className: "code-block-error-line",
          line: "This will error",
        },
      ],
    },
    mermaid: {
      options: {
        // maxTextSize: 100,
      },
    },
    magicComments: [
      {
        className: "theme-code-block-highlighted-line",
        line: "highlight-next-line",
        block: { start: "highlight-start", end: "highlight-end" },
      },
      {
        className: "code-block-error-line",
        line: "This will error",
      },
    ],
  } satisfies Preset.ThemeConfig,
};

export default config;
