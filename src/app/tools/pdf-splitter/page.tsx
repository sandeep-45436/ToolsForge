'use client';

import React, { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import UploadZone from '@/components/common/UploadZone';
import ResultCard from '@/components/common/ResultCard';
import { PDFDocument } from 'pdf-lib';
import { Loader2, Scissors, Info } from 'lucide-react';

export default function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [pageRange, setPageRange] = useState<string>('1');
  const [splitUrl, setSplitUrl] = useState<string | null>(null);
  const [splitSize, setSplitSize] = useState<number>(0);
  const [outputName, setOutputName] = useState<string>('');

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;

    const selectedFile = files[0];
    setLoading(true);
    try {
      // Load file to read page count
      const fileBytes = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
      const pages = pdfDoc.getPageCount();

      setFile(selectedFile);
      setPageCount(pages);
      setPageRange(`1-${Math.min(pages, 3)}`);
      setSplitUrl(null);
    } catch (err) {
      console.error('Error loading PDF:', err);
      alert('Failed to read PDF. Make sure the file is not corrupted or password-secured.');
    } finally {
      setLoading(false);
    }
  };

  const parsePageRanges = (rangeStr: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = rangeStr.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const min = Math.min(start, end);
          const max = Math.max(start, end);
          for (let i = min; i <= max; i++) {
            if (i >= 1 && i <= maxPages) {
              pages.add(i - 1); // 0-indexed
            }
          }
        }
      } else {
        const page = parseInt(trimmed, 10);
        if (!isNaN(page) && page >= 1 && page <= maxPages) {
          pages.add(page - 1); // 0-indexed
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file || pageCount === null) return;

    const indicesToExtract = parsePageRanges(pageRange, pageCount);
    if (indicesToExtract.length === 0) {
      alert(`Invalid page ranges. Please enter numbers between 1 and ${pageCount}.`);
      return;
    }

    setLoading(true);
    try {
      const fileBytes = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(fileBytes);
      const splitPdf = await PDFDocument.create();

      // Copy pages
      const copiedPages = await splitPdf.copyPages(srcPdf, indicesToExtract);
      copiedPages.forEach((page) => splitPdf.addPage(page));

      const splitBytes = await splitPdf.save();
      const blob = new Blob([splitBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setSplitUrl(url);
      setSplitSize(blob.size);

      // Construct name
      const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
      setOutputName(`${baseName}_split.pdf`);
    } catch (err) {
      console.error('Split error:', err);
      alert('Failed to split PDF. Check if page index is out of bounds or file has security layers.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setFile(null);
    setPageCount(null);
    setSplitUrl(null);
    setSplitSize(0);
  };

  return (
    <ToolLayout
      title="PDF Splitter"
      description="Extract specific pages or page ranges from a PDF document. Choose exact lists (e.g. 1, 3, 5-8) and download your custom sub-PDF instantly."
      category="pdf"
    >
      <div className="space-y-6">
        {!file && (
          <UploadZone
            onFilesSelected={handleFilesSelected}
            accept=".pdf"
            maxSizeMB={25}
            label="Upload your PDF file to split"
            subLabel="Supports PDF documents up to 25MB"
          />
        )}

        {file && pageCount !== null && !splitUrl && (
          <div className="border border-card-border bg-card rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 pb-4 border-b border-card-border">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Split Settings</h3>
                <p className="text-xs text-muted">Input pages to extract from the document</p>
              </div>
            </div>

            {/* Document Info Card */}
            <div className="p-4 bg-background border border-card-border rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded bg-muted-bg text-muted shrink-0">
                  <Scissors className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate text-foreground">{file.name}</div>
                  <div className="text-xs text-muted">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB &bull; {pageCount} pages
                  </div>
                </div>
              </div>
              <button
                onClick={handleRestart}
                className="text-xs text-error hover:underline"
                disabled={loading}
              >
                Remove
              </button>
            </div>

            {/* Page Range Input */}
            <div className="space-y-2">
              <label htmlFor="pages-input" className="text-sm font-semibold text-foreground block">
                Pages to Extract
              </label>
              <input
                id="pages-input"
                type="text"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                placeholder={`e.g. 1, 3, 5-${pageCount}`}
                className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary"
              />
              <div className="flex items-start gap-1.5 text-xs text-muted bg-background p-3 rounded-lg border border-card-border mt-1">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  Specify individual pages separated by commas, or page ranges using hyphens.
                  <br />
                  Example: <strong className="text-foreground">1, 3, 5-8</strong> (extracts pages 1, 3, 5, 6, 7, 8).
                </div>
              </div>
            </div>

            {/* Split Trigger */}
            <button
              onClick={handleSplit}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Splitting PDF...
                </>
              ) : (
                'Extract PDF Pages'
              )}
            </button>
          </div>
        )}

        {/* Split Result Card */}
        {splitUrl && (
          <ResultCard
            originalSize={file?.size}
            processedSize={splitSize}
            fileName={outputName}
            downloadUrl={splitUrl}
            downloadName={outputName}
            onRestart={handleRestart}
          />
        )}
      </div>
    </ToolLayout>
  );
}
