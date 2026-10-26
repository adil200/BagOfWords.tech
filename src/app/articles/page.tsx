import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, LayoutGrid, List } from 'lucide-react';
import { categories } from '@/lib/data';
import { getPublishedArticles } from '@/lib/article-service';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { ArticleListItem } from '@/components/articles/ArticleListItem';
import { ArticleFilters } from '@/components/articles/ArticleFilters';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Articles | BagOfWords',
  description: 'Explore in-depth articles on Artificial Intelligence, Machine Learning, and Natural Language Processing.',
};

interface ArticlesPageProps {
  searchParams?: Promise<{
    query?: string;
    category?: string;
    sortBy?: string;
    view?: 'grid' | 'list';
    page?: string;
  }>;
}

const ARTICLES_PER_PAGE = 9;

/**
 * Renders the articles catalog with category filtering, search, sorting, and pagination.
 */
export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const currentView = params?.view || 'grid';

  const searchTerm = params?.query?.toLowerCase() || '';
  const selectedCategory = params?.category || 'all';
  const sortBy = params?.sortBy || 'date_desc';

  const allArticles = await getPublishedArticles();
  let processedArticles: any[] = [...allArticles];

  if (searchTerm) {
    processedArticles = processedArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.excerpt.toLowerCase().includes(searchTerm)
    );
  }

  if (selectedCategory && selectedCategory !== 'all') {
    processedArticles = processedArticles.filter((article) => article.category === selectedCategory);
  }

  switch (sortBy) {
    case 'date_asc':
      processedArticles.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.publishDate || a.$createdAt).getTime();
        const dateB = new Date(b.createdAt || b.publishDate || b.$createdAt).getTime();
        return dateA - dateB;
      });
      break;
    case 'title_asc':
      processedArticles.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'date_desc':
    default:
      processedArticles.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.publishDate || a.$createdAt).getTime();
        const dateB = new Date(b.createdAt || b.publishDate || b.$createdAt).getTime();
        return dateB - dateA;
      });
      break;
  }

  const filteredArticles = processedArticles;
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  const createViewLink = (viewMode: 'grid' | 'list') => {
    const urlParams = new URLSearchParams();
    if (params?.query) urlParams.set('query', params.query);
    if (params?.category) urlParams.set('category', params.category);
    if (params?.sortBy) urlParams.set('sortBy', params.sortBy);
    if (params?.page) urlParams.set('page', params.page);
    urlParams.set('view', viewMode);
    return `/articles?${urlParams.toString()}`;
  };

  const createPageLink = (page: number) => {
    const urlParams = new URLSearchParams();
    if (params?.query) urlParams.set('query', params.query);
    if (params?.category) urlParams.set('category', params.category);
    if (params?.sortBy) urlParams.set('sortBy', params.sortBy);
    if (params?.view) urlParams.set('view', params.view);
    urlParams.set('page', page.toString());
    return `/articles?${urlParams.toString()}`;
  };

  return (
    <div className="space-y-8">
      <header className="text-center py-8 bg-muted/30 rounded-lg shadow-sm">
        <h1 className="text-4xl font-bold">Explore Articles</h1>
        <p className="text-lg text-muted-foreground mt-2">
          In-depth insights into AI, Machine Learning, and NLP.
        </p>
      </header>

      <section className="p-6 bg-card rounded-lg shadow">
        <ArticleFilters categories={categories} currentView={currentView} />
        <Separator className="my-6" />
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredArticles.length)} of {filteredArticles.length} articles
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">View:</span>
            <Button
              variant={currentView === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              aria-label="Grid view"
              asChild
            >
              <Link href={createViewLink('grid')}>
                <LayoutGrid className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant={currentView === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              aria-label="List view"
              asChild
            >
              <Link href={createViewLink('list')}>
                <List className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {paginatedArticles.length > 0 ? (
        <section>
          {currentView === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedArticles.map((article, index) => (
                <ArticleCard key={article.slug} article={article} priority={index <= 2} />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-lg shadow-md overflow-hidden">
              {paginatedArticles.map((article) => (
                <ArticleListItem key={article.slug} article={article} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="text-center py-12">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Articles Found</h2>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </section>
      )}

      {filteredArticles.length > ARTICLES_PER_PAGE && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={currentPage > 1 ? createPageLink(currentPage - 1) : '#'}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {totalPages > 0 && (
              <PaginationItem>
                <PaginationLink href={createPageLink(1)} isActive={currentPage === 1}>
                  1
                </PaginationLink>
              </PaginationItem>
            )}

            {currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (page === 1 || page === totalPages) return false;
                return page >= currentPage - 1 && page <= currentPage + 1;
              })
              .map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink href={createPageLink(page)} isActive={currentPage === page}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

            {currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {totalPages > 1 && (
              <PaginationItem>
                <PaginationLink href={createPageLink(totalPages)} isActive={currentPage === totalPages}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                href={currentPage < totalPages ? createPageLink(currentPage + 1) : '#'}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
