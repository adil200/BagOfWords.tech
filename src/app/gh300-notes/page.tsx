import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Download, BookOpen, Code, Zap } from 'lucide-react';
import { getR2AssetUrl } from '@/lib/file-mapping';

export const metadata: Metadata = {
  title: 'GH-300 GitHub Copilot Notes | BagOfWords',
  description:
    'Download comprehensive GH-300 certification notes for GitHub Copilot. Master AI-powered coding assistance with detailed guides on prompt engineering, context management, and code generation strategies. Perfect for developers preparing for GitHub Copilot certification.',
  keywords: [
    'GitHub Copilot',
    'GH-300',
    'certification',
    'AI coding assistant',
    'prompt engineering',
    'developer tools',
    'AI programming',
    'code generation',
  ],
  openGraph: {
    title: 'GH-300 GitHub Copilot Notes',
    description:
      'Master GitHub Copilot with comprehensive GH-300 certification notes. Download the complete guide for AI-powered coding assistance.',
    type: 'website',
  },
};

const pdfUrl = getR2AssetUrl('GH-300 (3).pdf');
const coverImageUrl = getR2AssetUrl('WhatsApp Image 2025-11-03 at 14.53.34_361a3eec (1).jpg');

/**
 * GH-300 GitHub Copilot Notes download and preview page.
 */
export default function GH300NotesPage() {
  return (
    <div className="w-full overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 lg:mb-16">
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary leading-tight break-words">
              GH-300 GitHub Copilot Notes
            </h1>

            <div className="space-y-3 sm:space-y-4 text-base sm:text-lg text-muted-foreground">
              <p className="break-words">
                Understand the full potential of GitHub Copilot with my comprehensive GH-300 certification notes.
              </p>
              <p className="break-words">
                These notes cover everything from fundamental concepts to advanced techniques, including
                prompt engineering, context management, code generation strategies, and security considerations.
                Perfect for developers preparing for certification or looking to enhance their development workflow with AI.
              </p>
            </div>

            <div className="pt-2 sm:pt-4">
              <a href={pdfUrl} download className="block">
                <Button size="lg" className="text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 group w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-bounce flex-shrink-0" />
                  <span className="truncate">Download Notes (PDF)</span>
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6">
              <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-accent/10">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-accent mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm">Comprehensive</h3>
                  <p className="text-xs text-muted-foreground">Complete coverage</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-accent/10">
                <Code className="h-5 w-5 sm:h-6 sm:w-6 text-accent mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm">Code Examples</h3>
                  <p className="text-xs text-muted-foreground">Real-world scenarios</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-accent/10">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-accent mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm">Exam Ready</h3>
                  <p className="text-xs text-muted-foreground">GH-300 focused</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end order-first lg:order-last mb-6 lg:mb-0">
            <div className="relative w-full max-w-[260px] sm:max-w-sm md:max-w-md group">
              <div className="relative transition-transform duration-500 ease-out transform hover:rotate-3 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg blur-xl sm:blur-2xl group-hover:blur-2xl sm:group-hover:blur-3xl transition-all duration-500" />
                <div className="relative bg-gradient-to-br from-accent/10 to-primary/10 p-4 sm:p-6 md:p-8 rounded-lg shadow-2xl border border-accent/20">
                  <Image
                    src={coverImageUrl}
                    alt="GH-300 GitHub Copilot Notes PDF Cover"
                    width={400}
                    height={500}
                    className="rounded-lg shadow-xl transform rotate-2 w-full h-auto"
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 sm:mb-6 text-center break-words">
            Preview the Notes
          </h2>
          <div className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl border border-accent/20">
            <iframe
              src={pdfUrl}
              className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[800px]"
              title="GH-300 GitHub Copilot Notes Preview"
            />
          </div>
        </div>

        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8 text-center break-words">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Link href="/articles?category=ai-tools-review&sortBy=date_desc&query=&view=grid" className="group">
              <div className="p-5 sm:p-6 rounded-lg border border-accent/20 hover:border-accent hover:shadow-lg transition-all duration-300 h-full">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-accent transition-colors break-words">
                  AI Tools & Reviews
                </h3>
                <p className="text-muted-foreground text-sm break-words">
                  Discover the latest AI tools and comprehensive reviews to enhance your development workflow.
                </p>
              </div>
            </Link>

            <Link href="/articles?category=machine-learning" className="group">
              <div className="p-5 sm:p-6 rounded-lg border border-accent/20 hover:border-accent hover:shadow-lg transition-all duration-300 h-full">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-accent transition-colors break-words">
                  Machine Learning
                </h3>
                <p className="text-muted-foreground text-sm break-words">
                  Explore cutting-edge machine learning concepts, tutorials, and practical applications.
                </p>
              </div>
            </Link>

            <Link href="/articles?category=ai-fundamentals&sortBy=date_desc&query=&view=grid" className="group">
              <div className="p-5 sm:p-6 rounded-lg border border-accent/20 hover:border-accent hover:shadow-lg transition-all duration-300 h-full">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-accent transition-colors break-words">
                  AI Fundamentals
                </h3>
                <p className="text-muted-foreground text-sm break-words">
                  Master the basics of artificial intelligence with beginner-friendly guides and tutorials.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

