import React from "react";
import clsx from "clsx";
import {
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import {
  BlogPostProvider,
  useBlogPost,
} from "@docusaurus/theme-common/internal";
import BlogLayout from "@theme/BlogLayout";
import BlogPostItem from "@theme/BlogPostItem";
import BlogPostPaginator from "@theme/BlogPostPaginator";
import BlogPostPageMetadata from "@theme/BlogPostPage/Metadata";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { DiscussionEmbed } from "disqus-react";
import hitsSettings from "./hitsSettings";
import TOC from "@theme/TOC";
import type BlogPostPageType from "@theme/BlogPostPage";
import { WrapperProps } from "@docusaurus/types";

type Props = WrapperProps<typeof BlogPostPageType>;

function BlogPostPageContent({ sidebar, children }) {
  const { metadata, toc } = useBlogPost();
  const { nextItem, prevItem, frontMatter } = metadata;
  const {
    hide_table_of_contents: hideTableOfContents,
    toc_min_heading_level: tocMinHeadingLevel,
    toc_max_heading_level: tocMaxHeadingLevel,
  } = frontMatter;
  const context = useDocusaurusContext();
  const hits = hitsSettings(context.siteConfig.url + metadata.permalink);
  return (
    <BlogLayout
      sidebar={sidebar}
      toc={
        !hideTableOfContents && toc.length > 0 ? (
          <>
            <TOC
              toc={toc}
              minHeadingLevel={tocMinHeadingLevel}
              maxHeadingLevel={tocMaxHeadingLevel}
            />
          </>
        ) : undefined
      }
    >
      <BlogPostItem>
        {hits}
        {children}
      </BlogPostItem>

      <DiscussionEmbed
        shortname="boostbrothers-technology-blog"
        config={{
          url: `${context.siteConfig.url}${metadata.permalink}`,
          title: metadata.title,
          language: "en",
        }}
      />

      {(nextItem || prevItem) && (
        <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
      )}
    </BlogLayout>
  );
}

export default function BlogPostPage(props: Props) {
  const BlogPostContent = props.content;
  return (
    <BlogPostProvider content={props.content} isBlogPostPage>
      <HtmlClassNameProvider
        className={clsx(
          ThemeClassNames.wrapper.blogPages,
          ThemeClassNames.page.blogPostPage,
        )}
      >
        <BlogPostPageMetadata />
        <BlogPostPageContent sidebar={props.sidebar}>
          <BlogPostContent />
        </BlogPostPageContent>
      </HtmlClassNameProvider>
    </BlogPostProvider>
  );
}
