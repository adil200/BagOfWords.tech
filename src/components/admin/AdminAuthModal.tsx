'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { verifyAdminPassword } from '@/lib/admin-auth';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  redirectTo?: string;
}

export function AdminAuthModal({ isOpen, onClose, onSuccess, redirectTo }: AdminAuthModalProps) {
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Reset password when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPassword('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter password',
        variant: 'destructive',
      });
      return;
    }

    setIsVerifying(true);
    try {
      const result = await verifyAdminPassword(password);

      if (result.success) {
        onSuccess();
        toast({
          title: 'Success',
          description: 'Admin access granted',
        });
        onClose();
        
        // Redirect if specified
        if (redirectTo) {
          router.push(redirectTo);
        }
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Invalid password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify password',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-accent" />
            Admin Authentication
          </DialogTitle>
          <DialogDescription>
            Enter the admin password to access the admin portal.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isVerifying}
              autoFocus
              className="w-full pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isVerifying}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isVerifying}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!password.trim() || isVerifying}
              className="bg-accent hover:bg-accent/90"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
