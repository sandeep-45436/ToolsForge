'use client';

import React from 'react';
import { Download } from 'lucide-react';

interface DownloadButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  downloadName?: string;
  label?: string;
}

export default function DownloadButton({
  href,
  downloadName,
  label = 'Download File',
  className = '',
  ...props
}: DownloadButtonProps) {
  return (
    <a
      href={href}
      download={downloadName || 'download'}
      className={`inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm glow-hover transition-all text-center ${className}`}
      {...props}
    >
      <Download className="w-4 h-4" />
      {label}
    </a>
  );
}
