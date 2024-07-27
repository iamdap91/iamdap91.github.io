import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import SearchLocal from "@easyops-cn/docusaurus-search-local";
import type * as Preset from "@docusaurus/preset-classic";

const themes = [
  [
    "@easyops-cn/docusaurus-search-local",
    {
      docsRouteBasePath: "/tech-posting",
      blogRouteBasePath: "/blog",
      hashed: true,
    },
  ],
  "@docusaurus/theme-mermaid",
  "@docusaurus/theme-live-codeblock",
];
const themeConfig = {
  // Replace with your project's social card
  image: "img/docusaurus-social-card.jpg",
  metadata: [
    {
      name: "keywords",
      content: "blog, dev, linux, nestjs, nodejs, node, shell, utilities",
    },
  ],
  navbar: {
    title: "3sam3's blog",
    logo: { src: "img/b3_logo.svg" },
    items: [
      {
        type: "docSidebar",
        sidebarId: "coffeeSideBar",
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
      {
        href: "https://www.buymeacoffee.com/iamdap91",
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
    additionalLanguages: [
      "shell-session",
      "rust",
      "powershell",
      "java",
      "bash",
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
} satisfies Preset.ThemeConfig;
const plugins = [];
const presets = [
  [
    "@docusaurus/preset-classic",
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
];

const config: Config = {
  title: "3sam3's blog",
  tagline: "this is 3sam3's web",
  favicon: "img/b3_logo.svg",
  url: "https://iamdap91.github.io",
  baseUrl: "/",
  trailingSlash: false,
  staticDirectories: ["static"],
  markdown: { mermaid: true },
  themes,
  organizationName: "iamdap91", // Usually your GitHub org/user name.
  projectName: "iamdap91.github.io", // Usually your repo name.
  deploymentBranch: "main",

  noIndex: false,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: { defaultLocale: "en", locales: ["en", "ko"] },

  plugins,
  presets,
  themeConfig,
};

export default config;
