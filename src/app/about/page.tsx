import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Users, Mail, Globe, Linkedin, Github } from 'lucide-react';
import { authors } from '@/lib/data';
import { getR2AssetUrl } from '@/lib/file-mapping';

export const metadata: Metadata = {
  title: 'About | BagOfWords',
  description: 'Learn about BagOfWords, our mission, and founder Adil Naib.',
};

/**
 * Renders the About page showcasing the BagOfWords mission, author bio, and contact links.
 */
export default function AboutPage() {
  const adilNaib = authors.find((author) => author.name === 'Adil Naib');
  const authorAvatarUrl = getR2AssetUrl('compressedImage (1).jpeg');

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-12 article-content">
      <header className="text-center pb-8">
        <h1 className="text-5xl font-extrabold text-primary mb-4">About BagOfWords</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Unveiling the complexities of AI, ML, and NLP with clarity and depth.
        </p>
      </header>

      <section>
        <Card className="shadow-lg">
          <CardContent className="p-8 md:p-10">
            <div className="relative w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden">
              <Image
                src={getR2AssetUrl('mission.png')}
                alt="BagOfWords Mission"
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                className="object-cover"
                data-ai-hint="personal focus"
              />
            </div>
            <h2 className="text-3xl font-semibold text-primary mb-6 flex items-center">
              <Target className="h-8 w-8 mr-3 text-accent" /> My Mission
            </h2>
            <p className="text-lg text-foreground/80 mb-4 leading-relaxed">
              My mission with BagOfWords is to share my passion for Artificial Intelligence, Machine Learning, and Natural Language Processing. As a solo creator, I aim to provide clear, in-depth, and practical content that demystifies these complex fields. I believe in making AI accessible to everyone, from beginners to those with more experience, fostering a space for learning and exploration.
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              My goal is to offer unique insights, hands-on tutorials, and high-quality educational material, bridging the gap between technical research and practical understanding. My commitment is to clarity, accuracy, and providing unique perspectives in the AI space.
            </p>
          </CardContent>
        </Card>
      </section>

      {adilNaib && (
        <section>
          <h2 id="about-the-author" className="text-3xl font-semibold text-primary mb-8 text-center flex items-center justify-center">
            <Users className="h-8 w-8 mr-3 text-accent" /> About the Author
          </h2>
          <Card className="shadow-sm overflow-hidden">
            <div className="md:flex">
              {authorAvatarUrl && (
                <div className="md:w-1/3 flex justify-center md:block p-6 md:p-0">
                  <div className="relative w-40 h-40 md:w-full md:h-full rounded-full md:rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={authorAvatarUrl}
                      alt={adilNaib?.name || 'Adil Naib'}
                      fill
                      sizes="(max-width: 767px) 160px, 33vw"
                      className="object-cover"
                      data-ai-hint="professional portrait"
                    />
                  </div>
                </div>
              )}
              <div className={`p-6 md:pl-8 md:pt-6 md:pb-6 md:pr-6 ${adilNaib.avatarUrl ? 'md:w-2/3' : 'w-full'}`}>
                <h3 className="text-2xl font-semibold text-accent mb-1">{adilNaib.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">Data Science Enthusiast & Kaggle Notebooks Expert</p>
                <p className="text-foreground/80 leading-relaxed mb-2">
                  Hello! I'm Adil Naib, a passionate data science enthusiast and Kaggle Notebooks Expert, having graduated with a degree in Data Science from Presidency University. Through courses and independent projects, I've acquired expertise in Exploratory Data Analysis, Data Visualization, and Predictive Modelling.
                </p>
                <p className="text-foreground/80 leading-relaxed mb-2">
                  I've written and published informative data science blogs on Analytics Vidhya and GeeksforGeeks. As I continue my journey in the data science world, I aim to create more valuable content that provides insights, tips, and solutions to complex data-related challenges.
                </p>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  I'm excited to use my knowledge and talents to make a real-world impact. In my free time, I enjoy writing Data Science blogs and sharing my knowledge with the community.
                </p>
                <div className="flex space-x-4 mt-4">
                  <Link href="https://adil.engineer" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent">
                    <Globe className="h-6 w-6" />
                    <span className="sr-only">Portfolio</span>
                  </Link>
                  <Link href="https://www.linkedin.com/in/adilnaib/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent">
                    <Linkedin className="h-6 w-6" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                  <Link href="https://github.com/adil200" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent">
                    <Github className="h-6 w-6" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      <section className="text-center py-8 bg-muted/40 rounded-lg shadow-sm">
        <h2 className="text-3xl font-semibold text-primary mb-4 flex items-center justify-center">
          <Mail className="h-8 w-8 mr-3 text-accent" /> Get In Touch
        </h2>
        <p className="text-lg text-muted-foreground mb-2">
          Have questions, suggestions, or want to collaborate? I'd love to hear from you!
        </p>
        <p className="text-lg text-muted-foreground mb-6">
          Email: <a href="mailto:support@BagOfWords.tech" className="text-accent hover:opacity-80">support@BagOfWords.tech</a>
        </p>
        <Button
          asChild
          size="lg"
          className="bg-accent hover:bg-accent/90 text-lg py-3 font-medium px-6"
        >
          <Link href="/contact" className="text-black">
            Contact Me
          </Link>
        </Button>
      </section>
    </div>
  );
}
