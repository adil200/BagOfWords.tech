
import Link from 'next/link';
import { Github, Linkedin, Globe } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t mt-12 py-10 bg-muted/50 text-muted-foreground">
      <div className="container mx-auto px-4 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Column 1: Logo, Slogan, Socials */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-accent transition-colors">
              <img src="/BagOfWords.svg" alt="BagOfWords Logo" className="h-[3rem] w-auto" />
              <span>BagOfWords</span>
            </Link>
            <p className="text-sm">
              Your Guide to Understanding and Applying AI, ML, NLP, and more.
            </p>
            <Link href="/about#about-the-author" className="hover:text-accent transition-colors">
              <p className="text-sm italic text-muted-foreground/80 pt-1">
                - by Adil Naib
              </p>
            </Link>
            <div className="flex space-x-4 pt-1">
              <Link href="https://adil.engineer" target="_blank" rel="noopener noreferrer" aria-label="Portfolio" className="text-muted-foreground hover:text-accent">
                <Globe className="h-5 w-5" />
              </Link>
              <Link href="https://github.com/adil200" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-accent">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="https://www.linkedin.com/in/adilnaib/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-accent">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Columns 2 & 3 wrapper for side-by-side on smaller screens */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Column 2: Navigate */}
            <div className="sm:text-right">
              <h3 className="font-semibold text-primary mb-3">Navigate</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/articles" className="hover:text-accent">Articles</Link></li>
                <li><Link href="/articles?category=ai-tools-review" className="hover:text-accent">AI Tools Review</Link></li>
                <li><Link href="/gh300-notes" className="hover:text-accent">GH-300 Notes</Link></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="sm:text-right">
              <h3 className="font-semibold text-primary mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-accent">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-accent">Contact</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-accent">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions" className="hover:text-accent">Terms &amp; Conditions</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-border/30" />

        <div className="text-center text-sm">
          <p>&copy; {currentYear} BagOfWords. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

    