import { ClientHome } from './ClientHome';
import { getPublishedArticles } from '@/lib/article-service';
import { articles as staticArticles, categories } from '@/lib/data';
import type { Article } from '@/types';

/**
 * Server component that fetches published and static articles, prepares featured articles, and renders the homepage.
 */
export default async function HomePage() {
  const mdxArticles = await getPublishedArticles();
  const allArticles = [...mdxArticles, ...staticArticles];

  const slug1 = 'from-bow-to-word2vec';
  const slug2 = 'gemini-diffusion-review';
  const slug3 = 'google-imagen-3-002';

  const featuredArticles: Article[] = [];

  const article1 = allArticles.find((a) => a.slug === slug1);
  if (article1) featuredArticles.push(article1);

  const article2 = allArticles.find((a) => a.slug === slug2);
  if (article2) featuredArticles.push(article2);

  const article3 = allArticles.find((a) => a.slug === slug3);
  if (article3) featuredArticles.push(article3);

  const otherArticles = allArticles.filter(
    (a) =>
      a.slug !== slug1 &&
      a.slug !== slug2 &&
      a.slug !== slug3 &&
      a.slug !== 'password-manager-PasswordCrypto'
  );

  featuredArticles.push(...otherArticles.slice(0, Math.max(0, 3 - featuredArticles.length)));

  return <ClientHome featuredArticles={featuredArticles} categories={categories} />;
}

