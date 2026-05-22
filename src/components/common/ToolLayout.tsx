'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import { FileText, Image as ImageIcon, QrCode, ArrowLeft, Clock, TrendingUp } from 'lucide-react';

interface ToolLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  category: 'pdf' | 'image' | 'qr' | 'conversion';
}

const ALL_TOOLS = [
  { id: 'image-compressor', name: 'Image Compressor', href: '/tools/image-compressor', icon: ImageIcon, category: 'image', desc: 'Reduce file size' },
  { id: 'jpg-to-png', name: 'JPG ↔ PNG Converter', href: '/tools/jpg-to-png', icon: ImageIcon, category: 'conversion', desc: 'Convert image format' },
  { id: 'pdf-merger', name: 'PDF Merger', href: '/tools/pdf-merger', icon: FileText, category: 'pdf', desc: 'Merge multiple PDFs' },
  { id: 'pdf-splitter', name: 'PDF Splitter', href: '/tools/pdf-splitter', icon: FileText, category: 'pdf', desc: 'Split pages from PDF' },
  { id: 'qr-generator', name: 'QR Generator', href: '/tools/qr-generator', icon: QrCode, category: 'qr', desc: 'Create custom QR codes' },
  { id: 'image-resizer', name: 'Image Resizer', href: '/tools/image-resizer', icon: ImageIcon, category: 'image', desc: 'Change image dimensions' },
  { id: 'image-to-pdf', name: 'Image to PDF', href: '/tools/image-to-pdf', icon: FileText, category: 'conversion', desc: 'Convert images to PDF' },
  { id: 'pdf-to-image', name: 'PDF to Image', href: '/tools/pdf-to-image', icon: FileText, category: 'conversion', desc: 'Convert PDF pages to image' },
];

export default function ToolLayout({
  children,
  title,
  description,
  category,
}: ToolLayoutProps) {
  const pathname = usePathname();
  const [recentTools, setRecentTools] = useState<typeof ALL_TOOLS>([]);

  // Update recent tools in localStorage
  useEffect(() => {
    const currentToolId = pathname.split('/').pop();
    if (!currentToolId) return;

    const currentTool = ALL_TOOLS.find((t) => t.id === currentToolId);
    if (!currentTool) return;

    const stored = localStorage.getItem('toolforge-recents');
    let list: string[] = [];
    if (stored) {
      try {
        list = JSON.parse(stored);
      } catch (e) {
        list = [];
      }
    }

    // Filter out current and keep max 4 recent tools
    list = list.filter((id) => id !== currentToolId);
    list.unshift(currentToolId);
    list = list.slice(0, 4);

    localStorage.setItem('toolforge-recents', JSON.stringify(list));

    const recentsObj = list
      .map((id) => ALL_TOOLS.find((t) => t.id === id))
      .filter((t): t is typeof ALL_TOOLS[number] => !!t);

    setRecentTools(recentsObj);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>

        {/* Title area */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary/80 bg-clip-text text-transparent mb-2">
            {title}
          </h1>
          <p className="text-lg text-muted max-w-3xl leading-relaxed">
            {description}
          </p>
        </div>

        {/* Layout Grid (Main content + Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main workspace */}
          <div className="lg:col-span-3 space-y-8">
            {children}

            {/* AdSense slot / monetization mock */}
            <div className="w-full p-4 border border-card-border bg-card rounded-2xl text-center select-none overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 pointer-events-none" />
              <div className="relative z-10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted/60 block mb-1">
                  Sponsored Advertisement
                </span>
                <div className="min-h-[100px] flex items-center justify-center border border-dashed border-card-border/60 rounded-xl bg-background/50">
                  <span className="text-sm text-muted">
                    Support ToolForge - Keep our tools 100% free by enabling ads.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Access Box */}
            <div className="p-6 border border-card-border bg-card rounded-2xl shadow-sm">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary" />
                Popular Utilities
              </h2>
              <div className="space-y-3">
                {ALL_TOOLS.filter((t) => t.href !== pathname)
                  .slice(0, 5)
                  .map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.id}
                        href={tool.href}
                        className="flex items-center gap-3 p-2.5 rounded-xl transition-all hover:bg-muted-bg border border-transparent hover:border-card-border group"
                      >
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {tool.name}
                          </div>
                          <div className="text-xs text-muted">
                            {tool.desc}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </div>

            {/* Recent Tools Box */}
            {recentTools.length > 0 && (
              <div className="p-6 border border-card-border bg-card rounded-2xl shadow-sm animate-in fade-in duration-300">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-primary" />
                  Recently Used
                </h2>
                <div className="space-y-2">
                  {recentTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.id}
                        href={tool.href}
                        className="flex items-center justify-between p-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-muted-bg transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-primary/70" />
                          {tool.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sidebar Ad Placement */}
            <div className="p-4 border border-card-border bg-card rounded-2xl text-center select-none overflow-hidden relative">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted/60 block mb-1">
                Sponsored Ad
              </span>
              <div className="min-h-[250px] flex flex-col items-center justify-center border border-dashed border-card-border/60 rounded-xl bg-background/50 p-4">
                <p className="text-xs text-muted leading-relaxed">
                  Placeholder for AdSense Vertical Banner Unit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
