'use client';

import React, { useEffect, useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import UploadZone from '@/components/common/UploadZone';
import ResultCard from '@/components/common/ResultCard';
import JSZip from 'jszip';
import { Loader2, Download, ImageIcon, FileText } from 'lucide-react';

interface PageImage {
  pageNumber: number;
  url: string;
}

export default function PdfToImage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [libLoaded, setLibLoaded] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  // Result images
  const [images, setImages] = useState<PageImage[]>([]);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [zipSize, setZipSize] = useState<number>(0);
  const [zipName, setZipName] = useState<string>('');

  // Load PDF.js from CDN dynamically on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if script already exists
    if ((window as any).pdfjsLib) {
      setLibLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    script.async = true;
    script.onload = () => {
      // Configure worker
      const pdfjsLib = (window as any).pdfjsLib;
      if (pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        setLibLoaded(true);
      }
    };
    script.onerror = () => {
      console.error('Failed to load PDF.js library');
    };
    document.body.appendChild(script);
  }, []);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setImages([]);
      setZipUrl(null);
    }
  };

  const handleConvert = async () => {
    if (!file || !libLoaded) return;

    setLoading(true);
    setLoadingMsg('Reading PDF document...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = (window as any).pdfjsLib;
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      const renderedImages: PageImage[] = [];

      for (let i = 1; i <= numPages; i++) {
        setLoadingMsg(`Rendering page ${i} of ${numPages}...`);
        
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for premium sharpness

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Canvas 2D context not available');
        }

        await page.render({
          canvasContext: ctx,
          viewport: viewport,
        }).promise;

        const dataUrl = canvas.toDataURL('image/png');
        renderedImages.push({
          pageNumber: i,
          url: dataUrl,
        });
      }

      setImages(renderedImages);

      // Create ZIP bundle
      setLoadingMsg('Bundling images into ZIP...');
      const zip = new JSZip();
      const baseName = file.name.substring(0, file.name.lastIndexOf('.'));

      renderedImages.forEach((img) => {
        const base64Data = img.url.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        zip.file(`${baseName}_page_${img.pageNumber}.png`, base64Data, { base64: true });
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipDownloadUrl = URL.createObjectURL(zipBlob);

      setZipUrl(zipDownloadUrl);
      setZipSize(zipBlob.size);
      setZipName(`${baseName}_pages.zip`);
    } catch (err) {
      console.error('PDF to Image failed:', err);
      alert('Failed to convert PDF. One of the pages may contain corrupted textures or strict encryption.');
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };

  const handleRestart = () => {
    setFile(null);
    setImages([]);
    setZipUrl(null);
    setZipSize(0);
  };

  return (
    <ToolLayout
      title="PDF to Image Converter"
      description="Convert PDF document pages into high-resolution PNG images directly in your browser. Download pages individually or packaged together in a ZIP file."
      category="conversion"
    >
      <div className="space-y-6">
        {!file && (
          <UploadZone
            onFilesSelected={handleFilesSelected}
            accept=".pdf"
            maxSizeMB={25}
            label="Upload your PDF file"
            subLabel="Supports PDF documents up to 25MB"
          />
        )}

        {file && images.length === 0 && (
          <div className="border border-card-border bg-card rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 pb-4 border-b border-card-border">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Conversion Details</h3>
                <p className="text-xs text-muted">Pages will render as transparent PNG files</p>
              </div>
            </div>

            {/* Selected File Card */}
            <div className="p-4 bg-background border border-card-border rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded bg-muted-bg text-muted shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate text-foreground">{file.name}</div>
                  <div className="text-xs text-muted">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
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

            {/* Convert Trigger */}
            <button
              onClick={handleConvert}
              disabled={loading || !libLoaded}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> {loadingMsg}
                </>
              ) : (
                'Render PDF to Images'
              )}
            </button>

            {!libLoaded && (
              <p className="text-xs text-center text-muted animate-pulse">
                Initializing rendering engines, please wait...
              </p>
            )}
          </div>
        )}

        {/* Conversion Results Grid */}
        {zipUrl && images.length > 0 && (
          <div className="space-y-6">
            {/* ZIP download card */}
            <ResultCard
              originalSize={file?.size}
              processedSize={zipSize}
              fileName={zipName}
              downloadUrl={zipUrl}
              downloadName={zipName}
              onRestart={handleRestart}
            />

            {/* Individual Pages Grid */}
            <div className="border border-card-border bg-card rounded-2xl p-6 shadow-sm">
              <h4 className="font-bold text-foreground mb-4">Individual Pages Preview</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {images.map((img) => (
                  <div
                    key={img.pageNumber}
                    className="border border-card-border bg-background rounded-xl p-3 flex flex-col justify-between items-center text-center group"
                  >
                    <div className="w-full flex items-center justify-center border border-card-border bg-muted-bg rounded-lg overflow-hidden aspect-[3/4] mb-3 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={`Page ${img.pageNumber} preview`}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="w-full flex items-center justify-between gap-2 px-1">
                      <span className="text-xs font-semibold text-muted">Page {img.pageNumber}</span>
                      <a
                        href={img.url}
                        download={`page_${img.pageNumber}.png`}
                        className="p-1.5 rounded-lg border border-card-border hover:bg-primary/10 hover:border-primary/20 text-muted hover:text-primary transition-all"
                        title={`Download Page ${img.pageNumber}`}
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
