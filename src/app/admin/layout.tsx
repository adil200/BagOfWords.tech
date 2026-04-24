'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { AdminAuthModal } from '@/components/admin/AdminAuthModal';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Shield } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { isAdmin, loginAdmin, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isLoading) {
      if (!isAdminAuthenticated()) {
        setShowAuthModal(true);
      }
      setIsChecking(false);
    }
  }, [isLoading]);

  // Show loading while checking auth
  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-accent mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show auth modal if not authenticated
  if (!isAdmin) {
    return (
      <AdminAuthModal
        isOpen={showAuthModal}
        onClose={() => router.push('/')}
        onSuccess={loginAdmin}
      />
    );
  }

  return (
    <div className="min-h-screen">
      {/* Page Content - Full Width */}
      <main className="container mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16 py-8 max-w-[1800px]">
        {children}
      </main>
    </div>
  );
}
