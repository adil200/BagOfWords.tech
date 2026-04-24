import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, TagIcon } from 'lucide-react';

interface ArticleCardProps {
  article: any;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full shadow-lg hover:shadow-xl hover:shadow-accent/40 transition-shadow duration-300">
      <CardHeader className="p-0">
        {article.heroImageUrl && (
          <Link href={`/articles/${article.slug}`} className="block relative w-full h-48">
            <Image
              src={article.heroImageUrl}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              data-ai-hint="abstract tech"
            />
          </Link>
        )}
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl mb-2 leading-tight">
          <Link href={`/articles/${article.slug}`} className="hover:text-accent transition-colors">
            {article.title}
          </Link>
        </CardTitle>
        <p className="text-muted-foreground text-sm mb-4">{article.excerpt}</p>
         <div className="flex items-center text-xs text-muted-foreground mb-1">
          <CalendarDays className="h-4 w-4 mr-1.5" />
          {new Date(article.publishDate || article.createdAt || article.$createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-4 w-4 mr-1.5" />
          {article.readingTime}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{article.category || "Uncategorized"}</Badge>
          {article.tags.slice(0, 2).map((tag: string) => (
            <Badge key={tag} variant="outline" className="flex items-center gap-1">
              <TagIcon className="h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
