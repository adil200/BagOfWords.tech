'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { updateArticle, getArticleById, generateSlug } from '../../../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Upload, Loader2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { StatusBadge } from '@/components/admin/StatusBadge';

export default function EditArticlePage() {
  const params = useParams();
  const articleId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('Adil Naib');
  const [coverImage, setCoverImage] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  const fetchArticle = async () => {
    setIsLoading(true);
    const result = await getArticleById(articleId);

    if (result.success && result.article) {
      const article = result.article;
      setTitle(article.title || '');
      setSlug(article.slug || '');
      setExcerpt(article.excerpt || '');
      setContent(article.content || '');
      setCategory(article.category || '');
      setTags(Array.isArray(article.tags) ? article.tags.join(', ') : '');
      setAuthor(article.author || 'Adil Naib');
      setCoverImage(article.coverImage || '');
      setFeatured(article.featured || false);
      setStatus(article.status || 'draft');
    } else {
      toast({
        title: 'Error',
        description: 'Failed to load article',
        variant: 'destructive',
      });
      router.push('/admin/articles');
    }
    setIsLoading(false);
  };

  const handleSubmit = async (newStatus?: 'draft' | 'published') => {
    if (!title || !content || !category) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('excerpt', excerpt);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('author', author);
    formData.append('coverImage', coverImage);
    formData.append('coverImageId', '');
    formData.append('status', newStatus || status);
    formData.append('featured', featured.toString());

    const result = await updateArticle(articleId, formData);

    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: 'Success',
        description: result.message,
      });
      if (newStatus) {
        setStatus(newStatus);
      }
      // Optionally redirect back to articles list
      // router.push('/admin/articles');
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  const categories = [
    { value: 'ai-fundamentals', label: 'AI Fundamentals' },
    { value: 'machine-learning', label: 'Machine Learning' },
    { value: 'nlp', label: 'Natural Language Processing' },
    { value: 'ai-tools-review', label: 'AI Tools Review' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Edit Article</h1>
              <StatusBadge status={status} />
            </div>
            <p className="text-muted-foreground mt-1">
              Update your article content and settings
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.open(`/articles/${slug}`, '_blank')}
            disabled={!slug}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
          {status === 'draft' ? (
            <Button
              onClick={() => handleSubmit('published')}
              disabled={isSubmitting}
              className="bg-accent hover:bg-accent/90"
            >
              <Upload className="h-4 w-4 mr-2" />
              Publish
            </Button>
          ) : (
            <Button
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting}
              variant="outline"
            >
              Unpublish
            </Button>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Article Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter article title"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="article-url-slug"
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  URL: /articles/{slug || 'article-url-slug'}
                </p>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of the article"
                  rows={3}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Content *</Label>
                <div className="mt-1.5">
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Start writing your article..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Article Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="AI, Machine Learning, NLP"
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate tags with commas
                </p>
              </div>

              <div>
                <Label htmlFor="coverImage">Cover Image</Label>
                <Input
                  id="coverImage"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="image-filename.png"
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter filename from media library
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={featured}
                  onCheckedChange={(checked) => setFeatured(checked as boolean)}
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Featured article
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
