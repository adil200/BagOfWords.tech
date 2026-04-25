'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Send, CheckCircle, AlertTriangle, Loader2, Linkedin, Github, Globe } from 'lucide-react';
import { checkSpam } from '@/services/spam-filter';
import { submitContactForm } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'spam'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    if (!name || !email || !message) {
      setStatus('error');
      setErrorMessage('Please fill in all fields.');
      toast({ title: 'Error', description: 'Please fill in all fields.', variant: 'destructive' });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      toast({ title: 'Error', description: 'Please enter a valid email address.', variant: 'destructive' });
      return;
    }

    try {
      const spamResult = await checkSpam(message);
      if (spamResult.isSpam) {
        setStatus('spam');
        setErrorMessage('Your message appears to be spam and was not sent.');
        toast({ title: 'Spam Detected', description: 'Your message appears to be spam and was not sent.', variant: 'destructive' });
        return;
      }
    } catch (error) {
      console.warn('Spam check failed, proceeding with submission:', error);
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);

    try {
      const result = await submitContactForm(null, formData);

      if (result.success) {
        setStatus('success');
        toast({
          title: 'Message Sent!',
          description: 'Your message has been sent successfully. I\'ll be in touch soon.'
        });
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
        setErrorMessage(result.message || 'There was an error sending your message. Please try again.');
        toast({
          title: 'Submission Error',
          description: result.message || 'Failed to send message.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage('There was an error sending your message. Please try again.');
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive'
      });
    }
  };

  return (
      <div className="container mx-auto px-4 py-8">
        {/* Centered Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-primary mb-4">Contact Me</h1>
          <p className="text-xl text-muted-foreground">
            I'm here to help and answer any question you might have.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 items-start">
          {/* Form Section */}
          <div className="lg:col-span-1 mx-auto lg:mx-0 lg:translate-x-[170px]">

          <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Mail className="h-7 w-7 mr-3 text-accent" /> Send Me a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and I'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (status === 'success') setStatus('idle');
                          }}
                          required
                          className="bg-background focus:border-accent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (status === 'success') setStatus('idle');
                          }}
                          required
                          className="bg-background focus:border-accent"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                        id="message"
                        name="message"
                        placeholder="Your message here..."
                        rows={6}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (status === 'success') setStatus('idle');
                        }}
                        required
                        className="bg-background focus:border-accent"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch gap-4">
                  {status === 'success' && (
                      <div className="flex items-center p-3 rounded-md bg-green-500/10 text-green-700 border border-green-500/30">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <p>Your message has been sent successfully! I'll be in touch soon.</p>
                      </div>
                  )}
                  {(status === 'error' || status === 'spam') && errorMessage && (
                      <div className="flex items-center p-3 rounded-md bg-red-500/10 text-red-700 border border-red-500/30">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        <p>{errorMessage}</p>
                      </div>
                  )}
                  <Button
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3"
                      disabled={status === 'submitting' || status === 'success'}
                  >
                    {status === 'submitting' ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Sending...
                        </>
                    ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" /> Send Message
                        </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          {/* Image Section - Hidden on mobile/tablet */}
          <div className="hidden lg:flex flex-col items-center">
            <div className="relative w-full max-w-md h-80 lg:h-96">
              <Image
                  src="/ai-working.svg"
                  alt="AI Working Illustration"
                  fill
                  sizes="400px"
                  className="object-contain"
                  style={{ transform: 'translateX(160px) translateY(23px)' }}
              />
            </div>
          </div>
        </div>

        {/* Centered Footer Section */}
        <section className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-primary mb-4">Other Ways to Reach Me</h2>
          <p className="text-muted-foreground mb-2">
            Email: <a href="mailto:support@BagOfWords.tech" className="text-accent hover:opacity-80">support@BagOfWords.tech</a>
          </p>
          <div className="flex justify-center space-x-6 mt-4">
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
        </section>
      </div>
  );


}
