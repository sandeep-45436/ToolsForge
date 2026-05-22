import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Scale } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Terms of Service</h1>
        </div>
        <div className="prose dark:prose-invert max-w-none text-muted space-y-6 leading-relaxed">
          <p className="text-sm">Last updated: May 20, 2026</p>
          
          <h2 className="text-xl font-bold text-foreground mt-8 mb-2">1. Agreement to Terms</h2>
          <p>
            By accessing or using ToolForge (accessible at toolforge.in), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-2">2. Description of Service</h2>
          <p>
            ToolForge provides in-browser utility tools for document processing, image optimization, and QR generation. All utilities operate client-side. The availability of services, features, and capabilities can change at any time without notice.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-2">3. Acceptable Use Policy</h2>
          <p>
            You agree not to use the services for any illegal or unauthorized purpose. You must not:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Process files containing malware, viruses, or malicious scripts.</li>
            <li>Use automated bots or scripts to query our utilities or overload our domain routing.</li>
            <li>Attempt to bypass file size limits or reverse-engineer our proprietary local scripts.</li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-2">4. Disclaimers</h2>
          <p>
            The services on ToolForge are provided "as is" and "as available". We make no warranties, expressed or implied, regarding the accuracy, completeness, or reliability of the tools. We are not liable for any data loss, page corruptions, or file resizing errors that occur during the browser processing.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-2">5. Limitations of Liability</h2>
          <p>
            In no event shall ToolForge, its developers, or affiliates be liable for any direct, indirect, incidental, special, or consequential damages arising out of your use or inability to use the tools.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
