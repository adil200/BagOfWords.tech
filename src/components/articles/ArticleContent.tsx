'use client';

import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ArticleContentProps {
  content: string;
}

/**
 * Renders HTML article content and dynamically enhances <pre> code blocks with interactive copy buttons.
 */
export function ArticleContent({ content }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!contentRef.current) return;

    const codeBlocks = contentRef.current.querySelectorAll('pre');

    codeBlocks.forEach((pre) => {
      if (pre.querySelector('.copy-code-button')) return;

      pre.style.position = 'relative';

      const copyButton = document.createElement('button');
      copyButton.className =
        'copy-code-button absolute top-2 right-2 text-gray-400 hover:text-gray-200 transition-colors opacity-0 group-hover:opacity-100';
      copyButton.setAttribute('aria-label', 'Copy code');
      copyButton.style.cssText = `
        background: transparent;
        border: none;
        padding: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      copyButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
      `;

      copyButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const code = pre.querySelector('code');
        if (code) {
          const text = code.textContent || '';
          try {
            await navigator.clipboard.writeText(text);

            copyButton.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            `;

            setTimeout(() => {
              copyButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
              `;
            }, 2000);

            toast({
              description: 'Code copied to clipboard',
              duration: 2000,
            });
          } catch {
            toast({
              description: 'Failed to copy code',
              variant: 'destructive',
              duration: 2000,
            });
          }
        }
      });

      pre.classList.add('group');
      pre.appendChild(copyButton);
    });
  }, [content, toast]);

  return (
    <div
      ref={contentRef}
      className="prose prose-lg max-w-none article-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

