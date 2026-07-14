import React from 'react';
import { ScrollyProvider } from './Scrollytelling';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Clock, Sparkles, TagIcon } from 'lucide-react';
import { CommentSection } from '@/components/comments/CommentSection';
import { getAuthorById } from '@/lib/data';
import { ArticleSummaryGenerator } from '@/components/articles/ArticleSummaryGenerator';

export interface InteractiveArticleTag {
  label: string;
  /** 'primary' = muted white pill, 'accent' = cyan pill */
  variant: 'primary' | 'accent';
  /** Optional: link to /articles?query=<tag>. Defaults to label. */
  queryOverride?: string;
}

interface InteractiveArticleLayoutProps {
  title: string;
  subtitle?: string;
  date: string;
  readingTime: string;
  /** Tags displayed above the title as styled badges (also linked to /articles search) */
  tags: InteractiveArticleTag[];
  /** Footer tags shown after the article content, linked to /articles?query=<tag> */
  footerTags?: string[];
  articleSlug: string;
  authorId: string;
  /**
   * Plain-text summary of the article's content — passed to the AI summariser.
   * For interactive articles (no MDX body), provide a text description of what
   * the article covers so the AI has something meaningful to work with.
   */
  articleContent: string;
  /** Optional YouTube video URL to display below the summary block */
  youtubeVideoUrl?: string;
  scrollyTextContent?: React.ReactNode;
  scrollyVisualizerContent?: React.ReactNode;
  children?: React.ReactNode;
}

const AVATAR_URL =
  'https://fra.cloud.appwrite.io/v1/storage/buckets/68c2db3e000567f1099a/files/68c51529003933a7cb34/view?project=68a9e75000030fe77800&mode=admin';

export function InteractiveArticleLayout({
  title,
  subtitle,
  date,
  readingTime,
  tags,
  footerTags,
  articleSlug,
  authorId,
  articleContent,
  youtubeVideoUrl,
  scrollyTextContent,
  scrollyVisualizerContent,
  children,
}: InteractiveArticleLayoutProps) {
  const authorDetails = getAuthorById(authorId);
  const isIntegratedLayout = !!(scrollyTextContent && scrollyVisualizerContent);

  const LeftHeader = (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <Link
            key={tag.label}
            href={`/articles?query=${encodeURIComponent(tag.queryOverride ?? tag.label)}`}
          >
            <Badge
              variant="secondary"
              className={
                tag.variant === 'accent'
                  ? 'text-sm uppercase tracking-wider bg-accent/10 text-accent hover:bg-accent/20 transition-colors cursor-pointer'
                  : 'text-sm uppercase tracking-wider bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer'
              }
            >
              {tag.label}
            </Badge>
          </Link>
        ))}
      </div>
      <h1 className="text-4xl lg:text-5xl font-extrabold text-primary mb-6 leading-tight tracking-tight">
        {title}
        {subtitle && (
          <>
            <br />
            <span className="text-muted-foreground">{subtitle}</span>
          </>
        )}
      </h1>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-sm">
        <div className="flex items-center">
          <CalendarDays className="h-4 w-4 mr-1.5" />
          {date}
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1.5" />
          {readingTime}
        </div>
      </div>
    </>
  );

  const RightHeader = (
    <>
      <ArticleSummaryGenerator
        articleContent={articleContent}
        articleTitle={title}
      />
      {youtubeVideoUrl && (
        <div className="w-full aspect-video rounded-xl overflow-hidden shadow-md border border-accent/30">
          <iframe 
            className="w-full h-full"
            src={youtubeVideoUrl} 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          ></iframe>
        </div>
      )}
    </>
  );

  return (
    <article className="py-8 relative">
      {isIntegratedLayout ? (
        <ScrollyProvider>
          <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-10">
            {/* Left Column */}
            <div className="w-full lg:w-1/2">
              <header className="mb-12">
                {LeftHeader}
              </header>
              {/* Mobile RightHeader: shown below title on mobile */}
              <div className="flex lg:hidden flex-col gap-6 mb-12">
                {RightHeader}
              </div>
              <div className="w-full pb-[50vh]">
                {scrollyTextContent}
              </div>
            </div>

            {/* Right Column (Desktop Only) */}
            <div className="hidden lg:block lg:w-1/2 mt-6 lg:mt-0 relative">
              <div className="flex flex-col gap-6 mb-12">
                {RightHeader}
              </div>
              <div className="flex w-full sticky top-24 h-[calc(100vh-6rem)] max-h-[800px] items-center justify-center">
                <div className="w-full max-h-full overflow-hidden">
                  {scrollyVisualizerContent}
                </div>
              </div>
            </div>
          </div>
        </ScrollyProvider>
      ) : (
        <>
          {/* ── Header ── */}
          <header className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">
              <div className="flex-1 min-w-0">
                {LeftHeader}
              </div>
              <div className="lg:w-[520px] xl:w-[600px] shrink-0 mt-6 lg:mt-0 flex flex-col gap-6">
                {RightHeader}
              </div>
            </div>
          </header>

          {/* ── Scrollytelling content (passed as children) ── */}
          {children}
        </>
      )}

      {/* ── Footer ── */}
      <div className="mt-16">
        <Separator className="mb-10" />

        {/* Footer tags */}
        {footerTags && footerTags.length > 0 && (
          <div className="mb-10 pt-2">
            <h3 className="text-md font-semibold mb-3 text-muted-foreground flex items-center">
              <TagIcon className="h-5 w-5 mr-2" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {footerTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="px-3 py-1 text-sm"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Author bio */}
        {authorDetails?.bio && (
          <Link href="/about#about-the-author" className="block hover:opacity-90 transition-opacity w-full lg:w-2/3 mb-8">
            <section className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={authorDetails.name === 'Adil Naib' ? AVATAR_URL : authorDetails.avatarUrl}
                    alt={authorDetails.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl">{authorDetails.name.substring(0, 1)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">WRITTEN BY</h3>
                  <p className="text-xl font-semibold text-primary mb-1">{authorDetails.name}</p>
                  <p className="text-foreground/80 text-sm leading-relaxed">{authorDetails.bio}</p>
                </div>
              </div>
            </section>
          </Link>
        )}

        {/* Comments */}
        <div className="w-full lg:w-2/3">
          <CommentSection articleSlug={articleSlug} />
        </div>
      </div>
    </article>
  );
}
