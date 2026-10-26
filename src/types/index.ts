/**
 * Comment model representing user comments and nested replies on articles.
 */
export interface Comment {
  id: string;
  content: string;
  author: {
    id?: string;
    name: string;
    avatarUrl?: string;
  };
  timestamp: string | Date;
  upvotes: number;
  downvotes: number;
  parentId?: string | null;
  isAuthor?: boolean;
  replies?: Comment[];
  articleSlug?: string;
}

/**
 * Author profile metadata.
 */
export interface Author {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
}

/**
 * Article categorization tag.
 */
export interface Category {
  id?: string;
  slug: string;
  name: string;
  description?: string;
}

/**
 * Article post metadata and content body.
 */
export interface Article {
  $id?: string;
  $createdAt?: string;
  publishedAt?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string | Author;
  coverImage?: string;
  coverImageId?: string;
  status?: 'draft' | 'published' | string;
  featured?: boolean;
  readingTime: number | string;
  readTime?: number;
  views?: number;
  createdAt?: string;
  publishDate?: string | Date;
  heroImageUrl?: string;
}
