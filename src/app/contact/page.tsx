'use client';

import React, { useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Mail, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    // Simulate submission
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Contact Us</h1>
        </div>

        {submitted ? (
          <div className="border border-success/20 bg-success/5 p-6 rounded-2xl text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
            <h2 className="text-xl font-bold text-foreground">Message Sent!</h2>
            <p className="text-sm text-muted">
              Thank you for contacting ToolForge. We have received your inquiry and our support team will get back to you shortly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
              }}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="border border-card-border bg-card p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-foreground pb-2 border-b border-card-border">
              Submit a Support Request
            </h2>

            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="text-xs font-semibold text-muted">Your Name</label>
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="text-xs font-semibold text-muted">Email Address</label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-sub" className="text-xs font-semibold text-muted">Subject</label>
              <input
                id="contact-sub"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Feature request or bug report"
                className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-msg" className="text-xs font-semibold text-muted">Message</label>
              <textarea
                id="contact-msg"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you today?"
                className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm glow-hover transition-all"
            >
              <Send className="w-4 h-4" /> Send Inquiry
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
