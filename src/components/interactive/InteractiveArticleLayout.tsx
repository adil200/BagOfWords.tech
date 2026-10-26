import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Clock, TagIcon } from 'lucide-react';
import { ScrollyProvider } from './Scrollytelling';
import { CommentSection } from '@/components/comments/CommentSection';
import { getAuthorById } from '@/lib/data';
import { ArticleSummaryGenerator } from '@/components/articles/ArticleSummaryGenerator';
import { getR2AssetUrl } from '@/lib/file-mapping';

export interface InteractiveArticleTag {
  label: string;
  variant: 'primary' | 'accent';
  queryOverride?: string;
}

interface InteractiveArticleLayoutProps {
  title: string;
  subtitle?: string;
  date: string;
  readingTime: string;
  tags: InteractiveArticleTag[];
  footerTags?: string[];
  articleSlug: string;
  authorId: string;
  articleContent: string;
  youtubeVideoUrl?: string;
  scrollyTextContent?: React.ReactNode;
  scrollyVisualizerContent?: React.ReactNode;
  children?: React.ReactNode;
}

const AVATAR_URL = getR2AssetUrl('adil (1).png');

/**
 * Layout wrapper for scrollytelling articles, supporting interactive side-by-side visualizers, author bio, and discussion.
 */
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
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      )}
    </>
  );

  return (
    <article className="py-8 relative">
      {isIntegratedLayout ? (
        <ScrollyProvider>
          <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-10">
            <div className="w-full lg:w-1/2">
              <header className="mb-12">
                {LeftHeader}
              </header>
              <div className="flex lg:hidden flex-col gap-6 mb-12">
                {RightHeader}
              </div>
              <div className="w-full pb-[50vh]">
                {scrollyTextContent}
              </div>
            </div>

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
          {children}
        </>
      )}

      <div className="mt-16">
        <Separator className="mb-10" />

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

        <div className="w-full lg:w-2/3">
          <CommentSection articleSlug={articleSlug} />
        </div>
      </div>
    </article>
  );
}

