'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { BLOG_POSTS } from '@/lib/blog-data';
import { BookOpen, Search, ChevronRight } from 'lucide-react';

export default function BlogList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pdf' | 'image'>('all');

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' ? true : post.category === activeTab;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      
      {/* Blog Hero */}
      <section className="relative py-16 border-b border-card-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-6">
            <BookOpen className="w-3.5 h-3.5" /> Tutorial Guides
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            ToolForge SEO Blog & Manuals
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto">
            Practical tips for image optimization, PDF editing guides, and secure digital processing techniques.
          </p>
        </div>
      </section>

      {/* Filter and Content Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Search & Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-card-border pb-6">
          {/* Category Tabs */}
          <div className="flex gap-1.5 p-1 rounded-xl bg-card border border-card-border">
            {(['all', 'pdf', 'image'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all uppercase ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted hover:text-foreground hover:bg-muted-bg'
                }`}
              >
                {tab === 'all' ? 'All Guides' : tab === 'pdf' ? 'PDF Tutorials' : 'Image Optimization'}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tutorials..."
              className="w-full pl-9 pr-4 py-2 border border-card-border rounded-lg bg-card text-foreground text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Blog Post List */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.slug}
                className="flex flex-col justify-between p-6 border border-card-border bg-card rounded-2xl hover:border-primary/45 transition-colors"
              >
                <div>
                  <div className="flex gap-2 mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-primary">
                      {post.category}
                    </span>
                    <span className="text-[10px] text-muted">•</span>
                    <span className="text-[10px] text-muted">{post.date}</span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-3 hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-sm text-muted leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-card-border/60">
                  <span className="text-xs text-muted font-medium">{post.readTime}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold uppercase tracking-wider text-foreground hover:text-primary inline-flex items-center gap-1"
                  >
                    Read Guide <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted border border-dashed border-card-border rounded-2xl">
            <BookOpen className="w-12 h-12 mx-auto mb-2 text-muted/30" />
            <p>No guides found matching your query.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
