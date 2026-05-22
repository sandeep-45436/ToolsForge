'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import {
  FileText,
  Image as ImageIcon,
  QrCode,
  ArrowRightLeft,
  ShieldCheck,
  Smartphone,
  Zap,
  Lock,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Scissors,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blog-data';

const TOOLS = [
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    desc: 'Compress JPG, PNG, and WEBP images directly in your browser with quality and size controls.',
    href: '/tools/image-compressor',
    icon: ImageIcon,
    category: 'image',
    badge: 'Popular',
  },
  {
    id: 'pdf-merger',
    name: 'PDF Merger',
    desc: 'Combine multiple PDF documents into a single file with simple drag-and-drop page ordering.',
    href: '/tools/pdf-merger',
    icon: FileText,
    category: 'pdf',
    badge: 'Popular',
  },
  {
    id: 'jpg-to-png',
    name: 'JPG ↔ PNG Converter',
    desc: 'Convert images instantly between JPG, PNG, and WEBP formats using local Canvas rendering.',
    href: '/tools/jpg-to-png',
    icon: ArrowRightLeft,
    category: 'conversion',
    badge: 'Fast',
  },
  {
    id: 'pdf-splitter',
    name: 'PDF Splitter',
    desc: 'Split page ranges from a PDF document and download the new extracted PDF instantly.',
    href: '/tools/pdf-splitter',
    icon: Scissors,
    category: 'pdf',
    badge: 'New',
  },
  {
    id: 'qr-generator',
    name: 'QR Generator',
    desc: 'Generate custom QR codes for URLs, WiFi configurations, text, and emails with color choices.',
    href: '/tools/qr-generator',
    icon: QrCode,
    category: 'qr',
    badge: 'Popular',
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    desc: 'Change width and height dimensions of images with aspect ratio lock and quality settings.',
    href: '/tools/image-resizer',
    icon: Maximize2,
    category: 'image',
    badge: 'Essential',
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    desc: 'Convert high-resolution JPG or PNG images into a print-ready PDF file in seconds.',
    href: '/tools/image-to-pdf',
    icon: FileText,
    category: 'conversion',
    badge: 'New',
  },
  {
    id: 'pdf-to-image',
    name: 'PDF to Image',
    desc: 'Convert pages of your PDF documents into high-quality PNG or JPG files locally.',
    href: '/tools/pdf-to-image',
    icon: ImageIcon,
    category: 'conversion',
    badge: 'Beta',
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All Tools' },
  { id: 'pdf', name: 'PDF Tools' },
  { id: 'image', name: 'Image Tools' },
  { id: 'conversion', name: 'Conversion Tools' },
  { id: 'qr', name: 'QR Utilities' },
];

const BENEFITS = [
  {
    title: 'Lightning Fast Processing',
    desc: 'No waiting lines or slow uploads. File operations happen locally on your processor in milliseconds.',
    icon: Zap,
  },
  {
    title: 'No Upload Required',
    desc: 'Your files never leave your device. All calculations run strictly in JavaScript on the client-side.',
    icon: Lock,
  },
  {
    title: '100% Privacy Secure',
    desc: 'Zero risk of data theft or interception. Ideal for merging bank records, passport photos, and IDs.',
    icon: ShieldCheck,
  },
  {
    title: 'Fully Mobile Optimized',
    desc: 'Responsive web interface styled with large touch targets for seamless processing on iOS and Android.',
    icon: Smartphone,
  },
];

const FAQS = [
  {
    q: 'Are my files uploaded to your servers?',
    a: 'Absolutely not. ToolForge operates on a serverless frontend architecture. All operations (merging PDFs, compressing images, generating QR codes) are processed directly inside your browser using JavaScript and HTML5 APIs. Your data remains completely private on your device.',
  },
  {
    q: 'How does the PDF merger and splitter work without a backend?',
    a: 'We leverage a powerful JavaScript library called pdf-lib. When you upload PDFs, they are loaded into WebAssembly/JS memory as ArrayBuffers. The code copies specific pages, compiles a new document structure, and generates a download link entirely in-browser.',
  },
  {
    q: 'Is there a file size limit?',
    a: 'Yes, we set a default limit of 25MB per file upload. This ensures that your browser does not crash or run out of memory (heap limit) since everything is processed locally in RAM.',
  },
  {
    q: 'Can I use ToolForge on my phone?',
    a: 'Yes, ToolForge is built using a mobile-first philosophy with Tailwind CSS. It supports file drops, sliders, and button clicks optimized for phone screens and tablets.',
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredTools = activeCategory === 'all'
    ? TOOLS
    : TOOLS.filter(t => t.category === activeCategory);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24 border-b border-card-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--primary-glow),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-6">
            <Zap className="w-3.5 h-3.5" /> 100% Client-Side Processing
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none mb-6">
            All-in-One PDF & Image <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-accent bg-clip-text text-transparent">
              Utility Platform
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Compress, convert, merge, and optimize files instantly with lightweight browser-based tools. Keep your documents private.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#all-tools"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-lg glow-hover transition-all"
            >
              Start Using Tools
            </a>
            <a
              href="#benefits"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-foreground bg-card hover:bg-muted-bg border border-card-border rounded-xl transition-all"
            >
              Explore Utilities
            </a>
          </div>
        </div>
      </section>

      {/* Popular Tools / Interactive Workspace */}
      <section id="all-tools" className="py-16 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-16">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ecosystem Utilities
            </h2>
            <p className="text-muted mt-1">
              Select one of our browser tools to process your documents.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-card border border-card-border overflow-x-auto max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted hover:text-foreground hover:bg-muted-bg'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group p-6 border border-card-border bg-card rounded-2xl shadow-sm hover:shadow-md glow-hover flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    {tool.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/20">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed mb-4">
                    {tool.desc}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors group-hover:translate-x-1 duration-200">
                  Open Tool <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 border-t border-b border-card-border bg-card scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Why Choose ToolForge?
            </h2>
            <p className="text-muted mt-2 max-w-xl mx-auto">
              Our frontend-first strategy provides unique advantages over server-heavy platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {BENEFITS.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center p-4">
                  <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Previews */}
      <section className="py-16 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              SEO Guides & Tutorials
            </h2>
            <p className="text-muted mt-1">
              Read simple guides about image optimizations, PDF management, and design rules.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover"
          >
            View all posts <BookOpen className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col justify-between p-6 border border-card-border bg-card rounded-2xl hover:border-primary/40 transition-colors"
            >
              <div>
                <div className="flex gap-2 mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary">
                    {post.category}
                  </span>
                  <span className="text-[10px] text-muted">•</span>
                  <span className="text-[10px] text-muted">{post.date}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="text-xs font-bold uppercase tracking-wider text-foreground hover:text-primary inline-flex items-center gap-1"
              >
                Read Article <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="py-16 border-t border-card-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center justify-center gap-2">
              <HelpCircle className="w-7 h-7 text-primary" /> Frequently Asked Questions
            </h2>
            <p className="text-muted mt-2">
              Learn how ToolForge offers top-tier security and instant processing.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="border border-card-border bg-background rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-foreground hover:bg-muted-bg transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-muted transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ${
                    openFaq === idx ? 'max-h-48 border-t border-card-border p-5' : 'max-h-0 pointer-events-none opacity-0'
                  } overflow-hidden`}
                >
                  <p className="text-sm text-muted leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
