import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { remarkKroki } from "remark-kroki";
import rehypeRaw from "rehype-raw";

const d2PluginConfig = {
  remarkPlugins: [[remarkKroki, { server: "https://kroki.io" }]],
  rehypePlugins: [
    [
      rehypeRaw,
      {
        passThrough: [
          "mdxFlowExpression",
          "mdxJsxFlowElement",
          "mdxJsxTextElement",
          "mdxTextExpression",
          "mdxjsEsm",
        ],
      },
    ],
  ],
};
const themes = [
  [
    "@easyops-cn/docusaurus-search-local",
    {
      docsRouteBasePath: ["/tech-hack", "/books"],
      blogRouteBasePath: "/",
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
    {
      name: "google-site-verification",
      content: "MZY4D3mVNRsMGGIj_ndm1BI651AGSrju1bsHRUdyOG8",
    },
  ],
  navbar: {
    title: "3sam3's Inventory",
    logo: { src: "img/b3_logo.svg" },
    items: [
      {
        type: "docSidebar",
        sidebarId: "coffeeSideBar",
        position: "left",
        label: "Tech Hacks",
      },
      {
        sidebarId: "bookSideBar",
        position: "left",
        label: "Books",
        to: "/books",
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
          { label: "Blog", to: "/" },
          { label: "Books", to: "/books" },
          { label: "Tech Hacks", to: "/tech-hack/Linux/disk-usage" },
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
      "json",
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
const plugins = [
  [
    "@docusaurus/plugin-content-docs",
    {
      id: "books",
      path: "books",
      routeBasePath: "/books",
      sidebarPath: "./sidebars.ts",
      editUrl: "https://github.com/iamdap91",
    },
  ],
];
const presets = [
  [
    "@docusaurus/preset-classic",
    {
      docs: {
        ...d2PluginConfig,
        sidebarPath: "./sidebars.ts",
        editUrl: "https://github.com/iamdap91",
        routeBasePath: "/tech-hack",
        breadcrumbs: true,
      },
      blog: {
        ...d2PluginConfig,
        rehypePlugins: [
          [
            rehypeRaw,
            {
              passThrough: [
                "mdxFlowExpression",
                "mdxJsxFlowElement",
                "mdxJsxTextElement",
                "mdxTextExpression",
                "mdxjsEsm",
              ],
            },
          ],
        ],
        editUrl: "https://github.com/iamdap91",
        showReadingTime: true,
        routeBasePath: "/",
        blogSidebarTitle: "All posts",
        blogSidebarCount: "ALL",
      },
      theme: { customCss: "./src/css/custom.css" },
    } satisfies Preset.Options,
  ],
];
const scripts = [
  {
    src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3076159641750066",
    async: true,
    crossorigin: "anonymous",
  },
];

const config: Config = {
  title: "3sam3's Inventory",
  tagline: "this is 3sam3's web",
  favicon: "img/b3_logo.svg",
  url: "https://iamdap91.github.io",
  baseUrl: "/",
  trailingSlash: true,
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
  scripts,
};

export default config;
