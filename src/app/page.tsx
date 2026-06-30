import { ClientHome } from './ClientHome';
import { getPublishedArticles } from '@/lib/article-service';
import { articles as staticArticles, categories } from '@/lib/data';

// Server Component for data fetching
export default async function HomePage() {
  // Fetch MDX articles (which includes from-bow-to-word2vec)
  const mdxArticles = await getPublishedArticles();
  
  // Combine all articles (MDX + static from data.ts)
  const allArticles = [...mdxArticles, ...staticArticles];
  
  // Featured Articles Logic:
  // 1st: from-bow-to-word2vec
  // 2nd: gemini-diffusion-review
  // 3rd: google-imagen-3-002
  const slug1 = 'from-bow-to-word2vec';
  const slug2 = 'gemini-diffusion-review';
  const slug3 = 'google-imagen-3-002';

  const featuredArticles = [];
  
  const article1 = allArticles.find(a => a.slug === slug1);
  if (article1) featuredArticles.push(article1);
  
  const article2 = allArticles.find(a => a.slug === slug2);
  if (article2) featuredArticles.push(article2);
  
  const article3 = allArticles.find(a => a.slug === slug3);
  if (article3) featuredArticles.push(article3);

  // Fallback: If we don't have 3 featured yet, grab from the rest (excluding the password article)
  const otherArticles = allArticles.filter(a => 
    a.slug !== slug1 && 
    a.slug !== slug2 && 
    a.slug !== slug3 && 
    a.slug !== 'password-manager-PasswordCrypto' // explicit exclude as requested
  );
  
  featuredArticles.push(...otherArticles.slice(0, Math.max(0, 3 - featuredArticles.length)));

  return <ClientHome featuredArticles={featuredArticles} categories={categories} />;
}
