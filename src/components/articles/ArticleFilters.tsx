'use client';

import type { FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RotateCcw } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface ArticleFiltersProps {
  categories: Array<{ slug: string; name: string }>;
  currentView: 'grid' | 'list';
}

/**
 * Filter controls for the articles archive allowing category filtering, sorting, and search querying.
 */
export function ArticleFilters({ categories, currentView }: ArticleFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete('page');
    router.push(`/articles?${params.toString()}`);
  };

  const handleCategoryChange = (value: string) => {
    updateFilters('category', value);
  };

  const handleSortChange = (value: string) => {
    updateFilters('sortBy', value);
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;
    updateFilters('query', query);
  };

  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sortBy') || 'date_desc';
  const currentQuery = searchParams.get('query') || '';

  return (
    <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
      <div className="lg:col-span-1">
        <Label htmlFor="category-select" className="block text-sm font-medium text-muted-foreground mb-1">
          Category
        </Label>
        <Select value={currentCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger id="category-select">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="lg:col-span-1">
        <Label htmlFor="sort-select" className="block text-sm font-medium text-muted-foreground mb-1">
          Sort By
        </Label>
        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger id="sort-select">
            <SelectValue placeholder="Sort articles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date_desc">Newest First</SelectItem>
            <SelectItem value="date_asc">Oldest First</SelectItem>
            <SelectItem value="title_asc">Title (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-3 lg:col-span-2">
        <Label htmlFor="query-input" className="block text-sm font-medium text-muted-foreground mb-1">
          Search Articles
        </Label>
        <div className="flex items-center gap-2">
          <Input
            name="query"
            id="query-input"
            placeholder="Keywords, titles..."
            className="flex-grow"
            defaultValue={currentQuery}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Reset filters"
            asChild
          >
            <Link href={`/articles?view=${currentView}`}>
              <RotateCcw className="h-5 w-5" />
            </Link>
          </Button>
          <Button type="submit" variant="outline" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </form>
  );
}

