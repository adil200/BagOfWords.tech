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

export interface Author {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
}

export interface Category {
  id?: string;
  slug: string;
  name: string;
  description?: string;
}

export interface Article {
  $id?: string;
  $createdAt?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string | Author;
  coverImage?: string;
  coverImageId?: string;
  status?: 'draft' | 'published';
  featured?: boolean;
  readingTime: number | string;
  readTime?: number;
  views?: number;
  createdAt?: string;
  publishDate?: Date;
  heroImageUrl?: string;
}
