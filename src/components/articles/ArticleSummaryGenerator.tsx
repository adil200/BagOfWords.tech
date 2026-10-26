'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, AlertTriangle, Copy } from 'lucide-react';
import { generateArticleSummaryAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { marked } from 'marked';

interface ArticleSummaryGeneratorProps {
  articleContent: string;
  articleTitle: string;
}

/**
 * Builds a sanitized localStorage cache key for an article summary.
 */
function makeCacheKey(title: string) {
  return `article_summary_v1_${title.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`;
}

/**
 * Interactive card component that generates, caches, and renders AI summaries for an article.
 */
export function ArticleSummaryGenerator({ articleContent, articleTitle }: ArticleSummaryGeneratorProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  const cacheKey = makeCacheKey(articleTitle);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setSummary(cached);
        setFromCache(true);
      }
    } catch {
      // Storage unavailable fallback
    }
    setIsInitialized(true);
  }, [cacheKey]);

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);
    setFromCache(false);

    try {
      const result = await generateArticleSummaryAction(articleContent);
      if (result.summary) {
        setSummary(result.summary);
        try {
          localStorage.setItem(cacheKey, result.summary);
        } catch {}
        toast({ title: 'Summary Generated!', description: 'The AI-powered summary is ready.' });
      } else {
        setError(result.error || 'Failed to generate summary.');
        toast({
          title: 'Error Generating Summary',
          description: result.error || 'An unknown error occurred.',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      console.error('Error in summary generation:', err);
      setError(err.message || 'An unexpected error occurred.');
      toast({
        title: 'Error',
        description: err.message || 'An unexpected error occurred during summary generation.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (summary) {
      navigator.clipboard
        .writeText(summary)
        .then(() => toast({ title: 'Copied!', description: 'Summary copied to clipboard.' }))
        .catch(() => toast({ title: 'Copy Failed', variant: 'destructive' }));
    }
  };

  return (
    <Card className="my-8 shadow-md border-accent/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center text-primary">
          <Sparkles className="h-5 w-5 mr-2 text-accent" />
          AI-Powered Article Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isInitialized && (
          <div className="h-16 rounded-md bg-muted/40 animate-pulse" />
        )}

        {isInitialized && !summary && !isLoading && !error && (
          <div className="text-center py-2">
            <p className="text-muted-foreground mb-4 text-sm">
              Want a quick overview? Click to generate an AI summary.
            </p>
            <Button
              onClick={handleGenerateSummary}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Summary
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-accent mb-3" />
            <p className="text-muted-foreground text-sm">Generating summary, please wait...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-red-500/90 bg-red-500/10 p-4 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-red-500" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold mb-1 text-sm">Error Generating Summary</p>
              <p className="text-sm break-words mb-3">{error}</p>
              <Button onClick={handleGenerateSummary} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {isInitialized && summary && !isLoading && !error && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-medium text-muted-foreground">
                Here's a quick AI-generated summary:
              </p>
              <Button
                onClick={handleCopyToClipboard}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-accent-foreground"
              >
                <Copy className="h-4 w-4 mr-1.5" /> Copy
              </Button>
            </div>

            <div className="max-h-64 overflow-y-auto rounded-md border bg-muted/30 p-4">
              <div
                className="text-foreground/90 leading-relaxed text-sm prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: marked.parse(summary) as string }}
              />
            </div>

            {!fromCache && (
              <div className="text-center mt-4">
                <Button onClick={handleGenerateSummary} variant="outline" size="sm" disabled={isLoading}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Regenerate Summary
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
