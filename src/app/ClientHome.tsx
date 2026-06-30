'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { ArrowRight, Rss, Search, Newspaper, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useRef, useState, type FormEvent } from 'react';
import { subscribeToNewsletter } from './actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { getAppwriteImageUrl } from '@/lib/data';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
      {pending ? 'Subscribing...' : 'Subscribe'}
    </Button>
  );
}

export function ClientHome({ featuredArticles, categories }: { featuredArticles: any[], categories: any[] }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const initialState = { success: false, message: '' };
  const [state, formAction] = useActionState(subscribeToNewsletter, initialState);

  const router = useRouter(); 
  const [searchQuery, setSearchQuery] = useState(''); 

  useEffect(() => {
      if (state?.message) {
          if (!state.success) {
              toast({
                  title: 'Subscription Failed',
                  description: state.message,
                  variant: 'destructive',
              });
          } else {
              toast({
                  title: 'Subscription Success!',
                  description: state.message,
              });
              if (state.success && state.message.startsWith('Successfully subscribed')) {
                  formRef.current?.reset();
              }
          }
      }
  }, [state, toast]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams({
        query: searchQuery.trim(),
        category: 'all',
        sortBy: 'date_desc',
        view: 'grid',
      });
      router.push(`/articles?${params.toString()}`);
    } else {
      router.push(`/articles?category=all&sortBy=date_desc&view=grid`);
    }
  };

  return (
      <div className="space-y-16">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-background to-muted/50 rounded-xl shadow-md">
              <div className="container mx-auto px-4">
                  <div className="grid md:grid-cols-6 gap-6 items-center">
                      <div className="md:col-span-4 text-center md:text-left md:pl-12">
                          <h1 className="text-5xl font-extrabold mb-6 text-primary">
                              BagOfWords: Your Guide to Understanding and Applying AI, ML, and NLP
                          </h1>
                          <p className="text-xl text-foreground/80 mb-8 max-w-full md:max-w-none">
                              Dive deep into the world of Artificial Intelligence. Explore high-quality articles, practical tutorials, and engage with a vibrant community.
                          </p>
                          <div className="flex flex-col sm:flex-row md:justify-start justify-center items-center gap-4 w-full sm:w-auto">
                              <Button asChild size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground hover:text-white">
                                  <Link href="/articles">Explore Articles <ArrowRight className="ml-2 h-5 w-5" /></Link>
                              </Button>
                              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                                  <Link href="#newsletter">Subscribe Now <Rss className="ml-2 h-5 w-5" /></Link>
                              </Button>
                          </div>
                      </div>
                      <div className="hidden md:block md:col-span-2 relative w-full h-80 lg:h-93 px-4 lg:px-0">
                          <Image
                              src="/Ai_Hero.svg"
                              alt="AI Hero Illustration"
                              fill
                              sizes="(max-width: 1023px) 50vw, 33vw"
                              className="object-contain"
                              priority
                          />
                      </div>
                  </div>
              </div>
          </section>

          {/* Search Bar */}
      <section className="container mx-auto px-4">
         <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 p-2 border rounded-lg shadow-sm bg-card">
              <Search className="h-5 w-5 text-muted-foreground ml-2" />
              <Input
                type="search"
                name="query"
                placeholder="Search articles, topics, or keywords..."
                className="flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90">Search</Button>
            </form>
          </div>
      </section>

      {/* Featured Content */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      {/* Content Categories */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Explore Topics</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/articles?category=${category.slug}`}>
              <Card className="hover:shadow-xl hover:shadow-accent/40 transition-shadow duration-300 h-full flex flex-col items-center text-center p-6">
                <CardHeader className="p-0 mb-4">
                  <div className="p-3 bg-accent/20 rounded-full inline-block">
                    <Newspaper className="h-10 w-10 text-accent" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <CardTitle className="text-xl mb-2">{category.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action (Newsletter) */}
      <section id="newsletter" className="scroll-mt-24 bg-muted/70 py-16 rounded-xl shadow-md">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with BagOfWords</h2>
          <p className="text-lg text-foreground/80 mb-8 max-w-xl mx-auto">
            Subscribe to my newsletter to get the latest articles, tutorials, and news directly in your inbox.
          </p>
            <form ref={formRef} action={formAction} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    className="flex-grow text-base p-3 bg-background"
                    aria-label="Email for newsletter"
                    required
                />
                <SubmitButton />
            </form>
            {state?.success && state.message?.includes('already subscribed') && (
                <p className="mt-4 text-sm text-blue-400">{state.message}</p>
            )}
            {state?.success && state.message?.startsWith('Successfully subscribed') && (
                <p className="mt-4 text-sm text-green-400">You're on the list! 🎉 Get ready for amazing AI content.</p>
            )}
        </div>
      </section>

      {/* About Us Snippet & Community Teaser */}
      <section className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">About BagOfWords</h2>
          <p className="text-lg text-foreground/80 mb-4">
            BagOfWords is dedicated to demystifying Artificial Intelligence, Machine Learning, and Natural Language Processing. My mission is to provide clear, in-depth, and practical content for learners at all levels.
          </p>
          <Button asChild variant="link" className="text-accent p-0 text-lg">
            <Link href="/about">Learn More <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
        <div className="bg-card p-8 rounded-lg shadow-md">
          <div className="relative w-full h-56 md:h-64 mb-6 rounded-lg overflow-hidden">
           <Image
              src={getAppwriteImageUrl('community-image.png')}
              alt="Community discussion"
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              className="object-cover"
              data-ai-hint="team collaboration"
              />
          </div>
          <h3 className="text-2xl font-bold mb-3">Join Our Community</h3>
          <p className="text-foreground/80 mb-4">
            Engage with fellow AI enthusiasts, ask questions, and share your knowledge in our interactive comment sections and upcoming forum.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="#newsletter">Connect with Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
