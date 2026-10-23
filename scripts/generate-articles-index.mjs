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
      const { data, content } = matter(fileContents);
      
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
          avatarUrl: 'https://assets.bagofwords.tech/adil%20(1).png',
          bio: 'AI & ML enthusiast',
        },
        publishDate: publishDate,
        createdAt: publishDate,
        readingTime: data.readingTime || '5 min read',
        readTime: parseInt(data.readingTime) || 5,
        heroImageUrl: data.heroImageUrl || '',
        excerpt: data.excerpt || '',
        content: content,
        status: 'published',
        featured: data.featured || false,
        views: data.views || 0,
      };
    });


  articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  fs.writeFileSync(outputFile, JSON.stringify(articles, null, 2));
}

generateIndex();
