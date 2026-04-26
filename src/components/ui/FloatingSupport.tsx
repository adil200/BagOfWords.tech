'use client';

import { useState } from 'react';
import { Heart, X, Coffee, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import confetti from 'canvas-confetti';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('100');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const fireConfetti = () => {
    const end = Date.now() + 2000;
    const colors = ['#00CFDE', '#ffffff', '#a855f7', '#06b6d4'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset after close animation completes
    setTimeout(() => {
      setIsSuccess(false);
      setAmount('5');
      setError('');
    }, 300);
  };

  const handleSupport = async () => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parsedAmount }),
      });

      if (!res.ok) throw new Error('Failed to create order');
      const { orderId, amount: orderAmount } = await res.json();

      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Razorpay'));
          document.body.appendChild(script);
        });
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency: 'INR',
        name: 'BagOfWords.tech',
        description: 'Support the author',
        order_id: orderId,
        handler: () => {
          setIsSuccess(true);
          fireConfetti();
        },
        prefill: { name: '', email: '' },
        theme: { color: '#00CFDE' },
        modal: {
          ondismiss: () => setIsLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setError('Payment failed. Please try again.');
        setIsLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* The Popover */}
      <div
        className={`mb-4 transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-0 opacity-0'
        }`}
      >
        <div className="bg-card text-card-foreground border shadow-xl rounded-xl p-5 w-72 relative overflow-hidden">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground z-10"
          >
            <X size={16} />
          </button>

          {/* Success State */}
          {isSuccess ? (
            <div className="flex flex-col items-center text-center space-y-4 py-4">
              {/* Animated icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping" />
                <div className="relative bg-accent/10 p-4 rounded-full text-accent">
                  <Sparkles size={28} />
                </div>
              </div>
              <h3 className="font-bold text-xl text-accent">Thank you!</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your support means the world to me. It truly keeps this site alive and growing!
              </p>
              <Button
                className="w-full mt-2"
                variant="outline"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          ) : (
            /* Normal State */
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <Coffee size={24} />
              </div>
              <h3 className="font-bold text-lg leading-none">Support my work</h3>
              <p className="text-sm text-muted-foreground">
                If you find these articles helpful, consider buying me a coffee!
              </p>

              {/* Amount Presets */}
              <div className="flex gap-2 w-full pt-2">
                {['100', '250', '400'].map((preset) => (
                  <Button
                    key={preset}
                    variant={amount === preset ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setAmount(preset)}
                  >
                    ₹{preset}
                  </Button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="relative w-full mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setError(''); }}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="pl-7 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="1"
                />
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              {/* Submit */}
              <Button
                className="w-full mt-2"
                size="lg"
                onClick={handleSupport}
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Loader2 size={16} className="mr-2 animate-spin" /> Processing...</>
                ) : (
                  <>Support ₹{amount}</>
                )}
              </Button>
              <p className="text-[10px] text-muted-foreground pt-1 flex items-center justify-center gap-1">
                Payments are securely processed by
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="h-3 w-3 text-[#3395FF]"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22.436 0l-11.91 7.773-1.174 4.276 6.625-4.297L11.65 24h4.391l6.395-24zM14.26 10.098L3.389 17.166 1.564 24h9.008l3.688-13.902Z"/>
                  </svg>
                  Razorpay
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-card border border-border shadow-xl flex items-center justify-center hover:bg-accent/10 hover:border-accent/50 hover:scale-105 transition-all text-accent pointer-events-auto"
        aria-label="Support me"
      >
        {isOpen ? <X size={24} /> : <Heart size={24} />}
      </button>
    </div>
  );
}
