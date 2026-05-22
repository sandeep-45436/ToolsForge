'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Shield, Scale, Info, HelpCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-card-border bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ToolForge
              </span>
            </Link>
            <p className="text-sm text-muted max-w-xs leading-relaxed">
              High-performance, secure, browser-based utility tools for documents, images, and QR codes. Processing happens fully locally.
            </p>
          </div>

          {/* PDF Tools Column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
              PDF Utilities
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tools/pdf-merger" className="text-sm text-muted hover:text-primary transition-colors">
                  Merge PDF files
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-splitter" className="text-sm text-muted hover:text-primary transition-colors">
                  Split PDF pages
                </Link>
              </li>
              <li>
                <Link href="/tools/image-to-pdf" className="text-sm text-muted hover:text-primary transition-colors">
                  Images to PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-to-image" className="text-sm text-muted hover:text-primary transition-colors">
                  PDF to Images
                </Link>
              </li>
            </ul>
          </div>

          {/* Image Tools Column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
              Image & QR Utilities
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tools/image-compressor" className="text-sm text-muted hover:text-primary transition-colors">
                  Compress Images
                </Link>
              </li>
              <li>
                <Link href="/tools/image-resizer" className="text-sm text-muted hover:text-primary transition-colors">
                  Resize Dimensions
                </Link>
              </li>
              <li>
                <Link href="/tools/jpg-to-png" className="text-sm text-muted hover:text-primary transition-colors">
                  JPG / PNG / WEBP Converter
                </Link>
              </li>
              <li>
                <Link href="/tools/qr-generator" className="text-sm text-muted hover:text-primary transition-colors">
                  QR Code Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform / Legal Column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
              Resources & Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-muted hover:text-primary transition-colors flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  SEO Blog & Tutorials
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted hover:text-primary transition-colors flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  About ToolForge
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted hover:text-primary transition-colors flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted hover:text-primary transition-colors flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted hover:text-primary transition-colors flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-card-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {currentYear} ToolForge. All rights reserved. All file processing is performed client-side inside your browser for maximum privacy.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-muted">
              AdSense Enabled
            </span>
            <span className="text-xs text-muted">|</span>
            <span className="text-xs text-muted">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
