import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Info, Wrench, ShieldAlert, Cpu } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Info className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">About ToolForge</h1>
        </div>

        <div className="prose dark:prose-invert max-w-none text-muted space-y-6 leading-relaxed">
          <p className="text-lg text-foreground font-semibold">
            Welcome to ToolForge—the high-performance, browser-first utility suite designed to simplify your digital workflow.
          </p>
          <p>
            Traditional file utility tools make a major architectural compromise: they force you to upload your personal files, sensitive bank records, or legal documents to their cloud backends for compilation or compression. This creates unnecessary security risks, eats bandwidth, and introduces long waiting lines.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-2 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" /> Our Core Strategy
          </h2>
          <p>
            At ToolForge, we believe that processing belongs to the client. Modern browser sandboxes and hardware acceleration are fully capable of handling advanced graphic drawing and PDF compilation. 
            By designing all our utilities—such as PDF mergers, image compressors, converters, and QR engines—with <strong>100% browser-based JavaScript</strong>, we solve three problems:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Immediate Speeds</strong>: Files are processed instantly locally. No upload waits.</li>
            <li><strong>Complete Privacy</strong>: Your data never leaves your computer, making it 100% secure.</li>
            <li><strong>Minimal Server Cost</strong>: By eliminating server storage and bandwidth loads, we keep our operations free for everyone.</li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-2 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-primary" /> Supporting ToolForge
          </h2>
          <p>
            ToolForge is monetized through standard unobtrusive advertising channels like Google AdSense. This allows us to scale our authority and remain free to developers, designers, students, and freelancers around the world without requesting subscription payments.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
