'use client';

import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const isDraft = status === 'draft';

  return (
    <Badge
      variant={isDraft ? 'secondary' : 'default'}
      className={`${
        isDraft
          ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/30'
          : 'bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/30'
      } ${className}`}
    >
      {isDraft ? (
        <>
          <Clock className="h-3 w-3 mr-1" />
          Draft
        </>
      ) : (
        <>
          <CheckCircle className="h-3 w-3 mr-1" />
          Published
        </>
      )}
    </Badge>
  );
}
