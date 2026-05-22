import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
        </div>
        <div className="prose dark:prose-invert max-w-none text-muted space-y-6 leading-relaxed">
          <p className="text-sm">Last updated: May 20, 2026</p>
          <p>
            At ToolForge, accessible from toolforge.in, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ToolForge and how we use it.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-2">1. Client-Side Processing (Zero Upload Policy)</h2>
          <p>
            We take user security extremely seriously. Unlike standard utility platforms, <strong>ToolForge runs entirely in your browser</strong>. All file operations, including:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Compressing JPG/PNG/WEBP files</li>
            <li>Merging and splitting PDF documents</li>
            <li>Converting documents to images and vice versa</li>
            <li>Generating QR codes</li>
          </ul>
          <p>
            occur locally on your own computer or device using JavaScript. Your files are <strong>never uploaded to our servers, stored, cached, or seen by us</strong>.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-2">2. Information We Collect</h2>
          <p>
            Since we do not require account registration, we do not collect personal identifiers like your name, email address, or phone number.
            If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-2">3. Google DoubleClick DART Cookie</h2>
          <p>
            Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://policies.google.com/technologies/ads</a>
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-2">4. Our Advertising Partners</h2>
          <p>
            Some of advertisers on our site may use cookies and web beacons. Our advertising partners include:
          </p>
          <ul className="list-disc pl-6">
            <li>Google AdSense</li>
          </ul>
          <p>
            Each of our advertising partners has their own Privacy Policy for their policies on user data. For easier access, we hyperlinked to their Privacy Policies above.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-2">5. Children's Information</h2>
          <p>
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
            ToolForge does not knowingly collect any Personal Identifiable Information from children under the age of 13.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
