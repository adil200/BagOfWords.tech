
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, AlertTriangle, Copy } from 'lucide-react';
import { generateArticleSummaryAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ArticleSummaryGeneratorProps {
  articleContent: string;
  articleTitle: string;
}

export function ArticleSummaryGenerator({ articleContent, articleTitle }: ArticleSummaryGeneratorProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      const result = await generateArticleSummaryAction(articleContent);
      if (result.summary) {
        setSummary(result.summary);
        toast({
          title: 'Summary Generated!',
          description: 'The AI-powered summary is ready.',
        });
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
      navigator.clipboard.writeText(summary)
        .then(() => {
          toast({ title: 'Copied!', description: 'Summary copied to clipboard.' });
        })
        .catch(err => {
          console.error('Failed to copy summary: ', err);
          toast({ title: 'Copy Failed', description: 'Could not copy summary to clipboard.', variant: 'destructive' });
        });
    }
  };

  return (
    <Card className="my-8 shadow-md border-accent/30">
      <CardHeader>
        <CardTitle className="text-xl flex items-center text-primary">
          <Sparkles className="h-6 w-6 mr-2 text-accent" />
          AI-Powered Article Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!summary && !isLoading && !error && (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Want a quick overview of "{articleTitle}"? Click the button below to generate an AI summary.
            </p>
            <Button onClick={handleGenerateSummary} disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Summary
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-10 w-10 animate-spin text-accent mb-3" />
            <p className="text-muted-foreground">Generating summary, please wait...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-red-500/90 bg-red-500/10 p-4 rounded-md flex items-start overflow-hidden">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-red-500" />
            <div className="flex-1 min-w-0 overflow-hidden">
                <p className="font-semibold mb-2">Error Generating Summary</p>
                <div className="text-sm break-words overflow-auto max-h-40 pr-2">
                  <p className="break-all whitespace-normal">{error}</p>
                </div>
                 <Button onClick={handleGenerateSummary} variant="outline" size="sm" className="mt-3">
                    Try Again
                </Button>
            </div>
          </div>
        )}

        {summary && !isLoading && !error && (
          <div>
            <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-medium text-muted-foreground">Here's a quick AI-generated summary:</p>
                <Button onClick={handleCopyToClipboard} variant="ghost" size="sm" className="text-muted-foreground hover:text-accent-foreground">
                    <Copy className="h-4 w-4 mr-1.5" /> Copy
                </Button>
            </div>
            <ScrollArea className="h-auto max-h-60 w-full rounded-md border">
              <div className="p-4 bg-muted/30 overflow-x-auto"> {/* Added overflow-x-auto here */}
                <p className="text-foreground/90 whitespace-pre-line leading-relaxed text-sm">{summary}</p>
              </div>
            </ScrollArea>
            <div className="text-center mt-4">
                <Button onClick={handleGenerateSummary} variant="outline" size="sm" disabled={isLoading}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Regenerate Summary
                </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
