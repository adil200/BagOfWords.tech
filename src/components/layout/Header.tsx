'use client';

import Link from 'next/link';
import { Menu, Shield, LayoutDashboard, FileText, Image, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { AdminAuthModal } from '@/components/admin/AdminAuthModal';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAdmin, loginAdmin, logoutAdmin } = useAdminAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Global keyboard shortcut (Ctrl+Shift+A or Cmd+Shift+A)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (isAdmin) {
          // Logout if already admin
          handleLogout();
        } else {
          // Show auth modal
          setShowAuthModal(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAdmin, logoutAdmin, toast]);

  const handleLogout = () => {
    logoutAdmin();
    toast({
      title: 'Logged out',
      description: 'Admin mode deactivated',
    });
    router.push('/');
  };

  const navLinks = [
    { href: "/articles", label: "Articles" },
    { href: "/articles?category=ai-tools-review", label: "AI Tools Review" },
    { href: "/gh300-notes", label: "GH-300 Notes" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header className="border-b shadow-sm sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 lg:px-16 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-accent transition-colors">
            <img src="/BagOfWords.svg" alt="BagOfWords Logo" className="h-[3.5rem] w-auto" />
            <span>BagOfWords</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-lg hover:text-white hover:no-underline transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-lg hover:text-white flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin Portal
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Admin Menu</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/admin')}>
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/admin/articles')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Articles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/admin/media')}>
                    <Image className="h-4 w-4 mr-2" />
                    Media
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-5 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-xl hover:text-accent transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {isAdmin && (
                    <>
                      <div className="border-t pt-4 mt-4">
                        <p className="text-sm text-muted-foreground mb-3 font-semibold">Admin Menu</p>
                        <Link
                          href="/admin"
                          className="text-xl hover:text-accent transition-colors flex items-center gap-2 mb-4"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <LayoutDashboard className="h-5 w-5" />
                          Dashboard
                        </Link>
                        <Link
                          href="/admin/articles"
                          className="text-xl hover:text-accent transition-colors flex items-center gap-2 mb-4"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <FileText className="h-5 w-5" />
                          Articles
                        </Link>
                        <Link
                          href="/admin/media"
                          className="text-xl hover:text-accent transition-colors flex items-center gap-2 mb-4"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Image className="h-5 w-5" />
                          Media
                        </Link>
                        <Button
                          variant="ghost"
                          className="text-xl hover:text-accent transition-colors flex items-center gap-2 w-full justify-start px-0"
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="h-5 w-5" />
                          Logout
                        </Button>
                      </div>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Admin Auth Modal */}
      <AdminAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={loginAdmin}
      />
    </>
  );
}

