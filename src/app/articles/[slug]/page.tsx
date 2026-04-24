
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getCategoryBySlug, getAuthorById } from '@/lib/data';
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/article-service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, UserCircle, TagIcon, AlignLeft } from 'lucide-react';
import { CommentSection } from '@/components/comments/CommentSection';
import Link from 'next/link';
import { ArticleSummaryGenerator } from '@/components/articles/ArticleSummaryGenerator';
import { ArticleContent } from '@/components/articles/ArticleContent';

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Internal component for rendering ToC content
const TocContentDisplay = ({ entries }: { entries: { id: string; text: string; level: number }[] }) => (
  <>
    <h3 className="text-lg font-semibold mb-3 flex items-center text-primary"><AlignLeft className="h-5 w-5 mr-2 text-accent" />Table of Contents</h3>
    <ul className="space-y-2">
      {entries.map(entry => (
        <li key={entry.id} className={`${entry.level === 3 ? 'ml-4' : ''}`}>
          <a href={`#${entry.id}`} className="text-sm text-foreground/80 hover:text-accent hover:underline transition-colors">
            {entry.text}
          </a>
        </li>
      ))}
    </ul>
  </>
);


export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const category = getCategoryBySlug(article.category);
  const authorDetails = getAuthorById(article.author.id);

  const tocEntries: { id: string; text: string; level: number }[] = [];
  let processedContent = article.content;
  if (processedContent) {
    const headingRegex = /<h([2-3])(?:[^>]*)>(.*?)<\/h\1>/gi;
    let match;
    const replacements: { original: string, new: string }[] = [];
    while ((match = headingRegex.exec(processedContent)) !== null) {
      const level = parseInt(match[1], 10);
      const text = match[2].replace(/<[^>]+>/g, '');
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      tocEntries.push({ id, text, level });
      replacements.push({ original: match[0], new: `<h${level} id="${id}">${match[2]}</h${level}>` });
    }
    replacements.forEach(rep => {
      processedContent = processedContent.replace(rep.original, rep.new);
    });
  }

  return (
    <article className="py-8">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        {/* Left Column: Contains Header, Hero, Article Summary (all screens), Mobile ToC (conditionally), Content Body, and Comments */}
        <div className="lg:w-2/3">
          <header className="mb-8">
            {category && (
              <Link href={`/articles?category=${category.slug}`}>
                <Badge variant="secondary" className="text-sm mb-2 uppercase tracking-wider hover:bg-accent/20 hover:text-accent transition-colors">{category.name}</Badge>
              </Link>
            )}
            <h1 className="text-4xl lg:text-5xl font-extrabold text-primary mb-4 leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-sm">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1.5" />
                {new Date(article.publishDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1.5" />
                {article.readingTime}
              </div>
            </div>
          </header>

          {article.heroImageUrl && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg relative w-full max-h-[450px] h-[300px] md:h-[400px] lg:h-[450px]">
              <Image
                src={article.heroImageUrl}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                priority
                data-ai-hint="technology blog post"
              />
            </div>
          )}

          {/* Article Summary for ALL Screens */}
          <ArticleSummaryGenerator articleContent={processedContent} articleTitle={article.title} />


          {/* Mobile Table of Contents: Rendered here in the flow, hidden on desktop */}
          {tocEntries.length > 0 && (
            <div className="lg:hidden mt-8 mb-8 p-4 bg-card rounded-lg shadow-sm border max-h-[calc(100vh-12rem)] overflow-y-auto">
              <TocContentDisplay entries={tocEntries} />
            </div>
          )}

          <ArticleContent content={processedContent} />

          {/* Tags - inside left column */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t">
              <h3 className="text-md font-semibold mb-3 text-muted-foreground flex items-center"><TagIcon className="h-5 w-5 mr-2" />Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string) => (
                  <Link key={tag} href={`/articles?query=${encodeURIComponent(tag)}`}>
                    <Badge variant="outline" className="px-3 py-1 text-sm hover:bg-accent/10 hover:border-accent cursor-pointer transition-colors">
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio - inside left column */}
          {authorDetails?.bio && (
            <Link href="/about#about-the-author" className="block hover:opacity-90 transition-opacity">
              <section className="mt-12 pt-8 border-t bg-card p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    {authorDetails.avatarUrl && <AvatarImage src={authorDetails.name === 'Adil Naib' ? 'https://fra.cloud.appwrite.io/v1/storage/buckets/68c2db3e000567f1099a/files/68c51529003933a7cb34/view?project=68a9e75000030fe77800&mode=admin' : authorDetails.avatarUrl} alt={authorDetails.name} className="object-cover" />}
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

          {/* Comment Section - inside left column */}
          <CommentSection articleSlug={article.slug} />
        </div>

        {/* Right Column: Container for Table of Contents (Desktop only, sticky) */}
        <aside className="hidden lg:block lg:w-1/3 lg:sticky lg:top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto space-y-6">
          {/* Box 1: Table of Contents */}
          {tocEntries.length > 0 && (
            <div className="p-4 bg-card rounded-lg shadow-sm border">
              <TocContentDisplay entries={tocEntries} />
            </div>
          )}
        </aside>
      </div>

    </article>
  );
}
