import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDirectory = path.join(process.cwd(), 'src/content/articles');
const outputFile = path.join(process.cwd(), 'src/lib/articles-index.json');

function generateIndex() {
  console.log('Generating articles index...');
  
  if (!fs.existsSync(articlesDirectory)) {
    console.warn('Articles directory not found. Skipping index generation.');
    fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
    return;
  }

  const fileNames = fs.readdirSync(articlesDirectory);
  const articles = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      
      const publishDate = data.publishDate || new Date().toISOString();
      const slug = data.slug || fileName.replace(/\.mdx$/, '');
      
      return {
        $id: slug,
        $createdAt: publishDate,
        publishedAt: publishDate,
        slug: slug,
        title: data.title || 'Untitled',
        category: data.category || 'Uncategorized',
        tags: Array.isArray(data.tags) ? data.tags : [],
        author: {
          id: '1',
          name: data.author || 'Adil Naib',
          avatarUrl: 'https://fra.cloud.appwrite.io/v1/storage/buckets/68c2db3e000567f1099a/files/68c51529003933a7cb34/view?project=68a9e75000030fe77800&mode=admin',
          bio: 'AI & ML enthusiast',
        },
        publishDate: publishDate,
        createdAt: publishDate,
        readingTime: data.readingTime || '5 min read',
        readTime: parseInt(data.readingTime) || 5,
        heroImageUrl: data.heroImageUrl || '',
        excerpt: data.excerpt || '',
        status: 'published',
        featured: data.featured || false,
        views: data.views || 0,
      };
    });

  // Inject hardcoded article
  articles.push({
    $id: 'how-gpts-llms-work',
    $createdAt: '2025-11-08T00:00:00.000Z',
    publishedAt: '2025-11-08T00:00:00.000Z',
    slug: 'how-gpts-llms-work',
    title: 'How GPTs/LLMs work? From prompt to output',
    category: 'ai-fundamentals',
    tags: ['LLMs', 'GPT', 'Transformers', 'NLP'],
    author: {
      id: '1',
      name: 'Adil Naib',
      avatarUrl: 'https://fra.cloud.appwrite.io/v1/storage/buckets/68c2db3e000567f1099a/files/68c51529003933a7cb34/view?project=68a9e75000030fe77800&mode=admin',
      bio: 'AI & ML enthusiast',
    },
    publishDate: '2025-11-08T00:00:00.000Z',
    createdAt: '2025-11-08T00:00:00.000Z',
    readingTime: '15 min read',
    readTime: 15,
    heroImageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop',
    excerpt: 'An interactive, animated exploration of how Large Language Models generate human-like text by processing enormous amounts of data.',
    status: 'published',
    featured: true,
    views: 0,
  });

  articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  fs.writeFileSync(outputFile, JSON.stringify(articles, null, 2));
}

generateIndex();
