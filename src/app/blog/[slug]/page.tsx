'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { BLOG_POSTS } from '@/lib/blog-data';
import { ArrowLeft, Clock, Tag } from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogPostDetail({ params }: BlogPostPageProps) {
  // Unwrap params using React.use() (Next.js 15/16 App Router standard)
  const { slug } = use(params);

  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted mb-6">The guide you are looking for does not exist.</p>
          <Link href="/blog" className="text-primary hover:underline font-semibold">
            Return to Blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Simple local parser to render basic markdown elements into HTML
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-4" />;

      if (trimmed.startsWith('# ')) {
        return (
          <h1 key={idx} className="text-3xl font-extrabold text-foreground mt-8 mb-4 border-b border-card-border pb-2">
            {trimmed.substring(2)}
          </h1>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl font-bold text-foreground mt-6 mb-3">
            {trimmed.substring(3)}
          </h2>
        );
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg font-bold text-foreground mt-4 mb-2">
            {trimmed.substring(4)}
          </h3>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        // Simple list item
        return (
          <li key={idx} className="list-disc ml-6 my-1.5 text-muted leading-relaxed">
            {trimmed.substring(2)}
          </li>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        // Ordered list item (e.g. 1. text)
        const contentStr = trimmed.replace(/^\d+\.\s/, '');
        return (
          <li key={idx} className="list-decimal ml-6 my-1.5 text-muted leading-relaxed">
            {contentStr}
          </li>
        );
      }

      // Check for inline links and bold text
      // Simple inline link parsing: [text](href) -> <a href=href>text</a>
      // Since it's a simple helper, we render standard paragraph text
      return (
        <p key={idx} className="my-3 text-muted leading-relaxed">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground animate-in fade-in duration-300">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to articles
          </Link>
        </div>

        <article className="border border-card-border bg-card rounded-2xl p-6 sm:p-10 shadow-sm">
          {/* Article Header Metadata */}
          <header className="border-b border-card-border pb-6 mb-8">
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted mb-4">
              <span className="flex items-center gap-1 text-primary font-semibold uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5" />
                {post.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
              <span>•</span>
              <span>{post.date}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              {post.title}
            </h1>
          </header>

          {/* Article Body */}
          <div className="prose dark:prose-invert max-w-none text-muted font-sans">
            {renderContent(post.content)}
          </div>

          {/* Sidebar / Bottom Ad slot */}
          <div className="border-t border-card-border mt-12 pt-8 text-center select-none overflow-hidden relative">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted/60 block mb-1">
              Sponsored Advertisement
            </span>
            <div className="min-h-[120px] flex items-center justify-center border border-dashed border-card-border/60 rounded-xl bg-background/50">
              <span className="text-xs text-muted">
                AdSense Placement Box. Ad units display dynamically between tutorials.
              </span>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
