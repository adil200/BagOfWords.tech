
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock } from 'lucide-react';

interface ArticleListItemProps {
  article: any;
}

export function ArticleListItem({ article }: ArticleListItemProps) {
  return (
    <div className="py-4 px-6 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-x-4 gap-y-2">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold mb-1">
            <Link href={`/articles/${article.slug}`} className="hover:text-accent transition-colors">
              {article.title}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {article.excerpt}
          </p>
        </div>
        <div className="flex-shrink-0 flex flex-col sm:items-end sm:text-right gap-1 text-xs text-muted-foreground mt-1 sm:mt-0">
          <Badge variant="secondary" className="mb-1 w-fit sm:self-end">
            {article.category || "Uncategorized"}
          </Badge>
          <div className="flex items-center">
            <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
            {new Date(article.publishDate || article.createdAt || article.$createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            {article.readingTime || article.readTime || '5 min read'}
          </div>
        </div>
      </div>
    </div>
  );
}
