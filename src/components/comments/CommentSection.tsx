
'use client';

import { useState, useEffect, FormEvent, useCallback } from 'react';
import type { Comment as CommentType } from '@/types';
import { addCommentToAppwrite, getCommentsFromAppwrite, upvoteComment, downvoteComment } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown, MessageSquare, Send, Loader2, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '../ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { getR2AssetUrl } from '@/lib/file-mapping';

interface LocalAuthor { id: string; name: string; avatarUrl?: string; isAuthor?: boolean; }

// Author profile - Adil Naib
const getAuthorProfile = (): LocalAuthor => ({
  id: 'author-1',
  name: 'Adil Naib',
  avatarUrl: getR2AssetUrl('adil (1).png'),
  isAuthor: true,
});

// Generate random anonymous user with bot icon
const getRandomAnonymousUser = (): LocalAuthor => {
  const botVariants = [
    { name: 'Anonymous Reader', icon: '/bot-icon.svg', color: 'Cyan' },
    { name: 'Anonymous Reader', icon: '/bot-icon-blue.svg', color: 'Blue' },
    { name: 'Anonymous Reader', icon: '/bot-icon-purple.svg', color: 'Purple' },
    { name: 'Anonymous Reader', icon: '/bot-icon-green.svg', color: 'Green' },
    { name: 'Anonymous Reader', icon: '/bot-icon-orange.svg', color: 'Orange' },
    { name: 'Anonymous Reader', icon: '/bot-icon-pink.svg', color: 'Pink' },
    { name: 'Anonymous Reader', icon: '/bot-icon-red.svg', color: 'Red' },
    { name: 'Anonymous Reader', icon: '/bot-icon-yellow.svg', color: 'Yellow' },
    { name: 'Anonymous Reader', icon: '/bot-icon-indigo.svg', color: 'Indigo' },
  ];

  const randomIndex = Math.floor(Math.random() * botVariants.length);
  const selected = botVariants[randomIndex];

  return {
    id: 'anonymous',
    name: selected.name,
    avatarUrl: selected.icon,
    isAuthor: false,
  };
};

interface CommentItemProps {
  comment: CommentType;
  onReplyToggle: (commentId: string) => void;
  articleSlug: string;
  currentUser: LocalAuthor;
  refreshComments: () => void;
  isReplyFormOpen: (commentId: string) => boolean;
}

function CommentItem({ comment, onReplyToggle, articleSlug, currentUser, refreshComments, isReplyFormOpen }: CommentItemProps) {
  const showReplyForm = isReplyFormOpen(comment.id);
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState<'up' | 'down' | null>(null);

  const handleVote = async (commentId: string, type: 'up' | 'down') => {
    setIsVoting(type);
    let result;
    if (type === 'up') {
      result = await upvoteComment(commentId);
    } else {
      result = await downvoteComment(commentId);
    }
    setIsVoting(null);

    if (result.success) {
      toast({ title: "Success", description: result.message });
      refreshComments();
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };

  return (
    <Card className={`mb-4 ${comment.parentId ? 'ml-8 border-l-2 pl-4 border-muted' : ''} bg-card shadow-sm`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            {comment.author.avatarUrl && <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} className="object-cover" />}
            <AvatarFallback>{comment.author.name.substring(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-primary leading-tight">{comment.author.name}</p>
                {comment.isAuthor && (
                  <Badge variant="default" className="text-xs px-2 py-0 bg-accent text-accent-foreground">
                    Author
                  </Badge>
                )}
              </div>
              <time className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(comment.timestamp).toLocaleString()}
              </time>
            </div>
            <p className="text-foreground/90 mt-2 whitespace-pre-wrap break-words">{comment.content}</p>
            <div className="flex items-center space-x-3 text-sm text-muted-foreground mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(comment.id, 'up')}
                disabled={!!isVoting}
                className="flex items-center gap-1 px-2"
              >
                {isVoting === 'up' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
                {comment.upvotes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(comment.id, 'down')}
                disabled={!!isVoting}
                className="flex items-center gap-1 px-2"
              >
                {isVoting === 'down' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsDown className="h-4 w-4" />}
                {comment.downvotes}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onReplyToggle(comment.id)} className="flex items-center gap-1 px-2" disabled={!!isVoting}>
                <MessageSquare className="h-4 w-4" /> Reply
              </Button>
            </div>
          </div>
        </div>
        {showReplyForm && (
          <div className="ml-12 mt-3">
            <CommentForm
              articleSlug={articleSlug}
              parentId={comment.id}
              currentUser={currentUser}
              onCommentAdded={() => {
                refreshComments();
                onReplyToggle(comment.id);
              }}
            />
          </div>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3">
            {comment.replies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReplyToggle={onReplyToggle}
                articleSlug={articleSlug}
                currentUser={currentUser}
                refreshComments={refreshComments}
                isReplyFormOpen={isReplyFormOpen}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface CommentFormProps {
  articleSlug: string;
  parentId?: string | null;
  currentUser: LocalAuthor;
  onCommentAdded: () => void;
}

function CommentForm({ articleSlug, parentId, currentUser, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast({ title: "Error", description: "Comment cannot be empty.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    const result = await addCommentToAppwrite(
      articleSlug,
      content,
      currentUser.name,
      currentUser.avatarUrl,
      parentId,
      currentUser.isAuthor
    );

    setIsSubmitting(false);
    if (result.success) {
      toast({ title: "Success", description: parentId ? "Reply posted!" : "Comment posted!" });
      setContent('');
      onCommentAdded();
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? "Write a reply..." : "Leave a comment..."}
        rows={3}
        className="bg-background focus:border-accent"
        disabled={isSubmitting}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!content.trim() || isSubmitting} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
          {isSubmitting ? (parentId ? "Posting Reply..." : "Posting Comment...") : (parentId ? "Post Reply" : "Post Comment")}
        </Button>
      </div>
    </form>
  );
}

interface CommentSectionProps {
  articleSlug: string;
}

export function CommentSection({ articleSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [openReplyFormId, setOpenReplyFormId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<LocalAuthor>(() => {
    // Check if user is admin/author on initial load
    if (typeof window !== 'undefined') {
      const isAuthorSession = sessionStorage.getItem('isAuthor') === 'true';
      const isAdminSession = sessionStorage.getItem('isAdmin') === 'true'; // Changed from 'isAdminAuthenticated'
      if (isAuthorSession || isAdminSession) {
        return getAuthorProfile();
      }
    }
    return getRandomAnonymousUser();
  });
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  // Keyboard shortcut listener (Ctrl+Shift+A or Cmd+Shift+A)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (currentUser.isAuthor) {
          // Logout if already in author mode
          setCurrentUser(getRandomAnonymousUser());
          toast({ title: "Logged out", description: "Switched to anonymous mode" });
          sessionStorage.removeItem('isAuthor');
        } else {
          // Show password dialog
          setShowPasswordDialog(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentUser.isAuthor, toast]);

  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      toast({ title: "Error", description: "Please enter password", variant: "destructive" });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch('/api/verify-author-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        // Close dialog and reset password immediately
        setShowPasswordDialog(false);
        setPassword('');
        setIsVerifying(false);

        // Update user state and show toast
        setCurrentUser(getAuthorProfile());
        sessionStorage.setItem('isAuthor', 'true');
        toast({ title: "Success", description: "Author mode activated" });
      } else {
        setIsVerifying(false);
        toast({ title: "Error", description: data.message || "Invalid password", variant: "destructive" });
      }
    } catch (error) {
      console.error('Password verification error:', error);
      setIsVerifying(false);
      toast({ title: "Error", description: "Failed to verify password", variant: "destructive" });
    }
  };

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedComments = await getCommentsFromAppwrite(articleSlug);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      toast({ title: "Error", description: "Could not load comments.", variant: "destructive" });
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [articleSlug, toast]);

  useEffect(() => {
    if (articleSlug) {
      fetchComments();
    }
  }, [articleSlug, fetchComments]);

  const handleReplyToggle = (commentId: string) => {
    setOpenReplyFormId(prevId => (prevId === commentId ? null : commentId));
  };

  const isReplyFormOpen = (commentId: string): boolean => {
    return openReplyFormId === commentId;
  };

  const totalCommentsCount = comments.reduce((acc, c) => {
    let count = 1; // count the comment itself
    const countReplies = (replies?: CommentType[]): number => {
      if (!replies) return 0;
      return replies.reduce((sum, reply) => sum + 1 + countReplies(reply.replies), 0);
    };
    count += countReplies(c.replies);
    return acc + count;
  }, 0);


  return (
    <section aria-labelledby="comments-heading" className="mt-12 py-8 border-t border-border">
      <h2 id="comments-heading" className="text-2xl font-semibold mb-6">
        Comments ({isLoading ? '...' : totalCommentsCount})
      </h2>

      <CommentForm
        articleSlug={articleSlug}
        currentUser={currentUser}
        onCommentAdded={fetchComments}
      />

      <Separator className="my-8" />

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Author Authentication</DialogTitle>
            <DialogDescription>
              Enter your password to post comments as the author.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isVerifying) {
                  handlePasswordSubmit();
                }
              }}
              disabled={isVerifying}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordDialog(false);
                  setPassword('');
                }}
                disabled={isVerifying}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordSubmit}
                disabled={isVerifying || !password.trim()}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Login as Author'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-accent" />
          <p className="ml-3 text-muted-foreground">Loading comments...</p>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReplyToggle={handleReplyToggle}
              articleSlug={articleSlug}
              currentUser={currentUser}
              refreshComments={fetchComments}
              isReplyFormOpen={isReplyFormOpen}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-4">Be the first to comment!</p>
      )}
    </section>
  );
}

