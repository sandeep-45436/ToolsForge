'use client';

import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import UploadZone from '@/components/common/UploadZone';
import ResultCard from '@/components/common/ResultCard';
import { Loader2, Maximize2, Link as LinkIcon } from 'lucide-react';

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [resizingQuality, setResizingQuality] = useState<'high' | 'medium' | 'low'>('high');

  // Result stats
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [resizedSize, setResizedSize] = useState<number>(0);
  const [outputName, setOutputName] = useState<string>('');

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;

    const selectedFile = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setFile(selectedFile);
        setOriginalWidth(img.naturalWidth);
        setOriginalHeight(img.naturalHeight);
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
        setResizedUrl(null);
      };
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  // Keep aspect ratio in sync when width changes
  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspectRatio && originalWidth > 0 && originalHeight > 0) {
      const ratio = originalHeight / originalWidth;
      setHeight(Math.round(val * ratio));
    }
  };

  // Keep aspect ratio in sync when height changes
  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspectRatio && originalWidth > 0 && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      handleWidthChange(Math.round(val * ratio)); // Use width updater to sync
    }
  };

  const handleResize = () => {
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Canvas context not available.');
          }

          // Use appropriate scaling quality on context
          if (resizingQuality === 'high') {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
          } else if (resizingQuality === 'medium') {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'medium';
          } else {
            ctx.imageSmoothingEnabled = false;
          }

          ctx.drawImage(img, 0, 0, width, height);

          const mimeType = file.type;
          const dataUrl = canvas.toDataURL(mimeType, 0.92);

          // Get file size from dataURL
          const head = `data:${mimeType};base64,`;
          const sizeInBytes = Math.round((dataUrl.length - head.length) * 3 / 4);

          // Create base file name
          const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
          const ext = file.name.split('.').pop()?.toLowerCase();

          setResizedUrl(dataUrl);
          setResizedSize(sizeInBytes);
          setOutputName(`${originalName}_resized_${width}x${height}.${ext}`);
        } catch (err) {
          console.error('Resizing error:', err);
          alert('Could not resize image. Check dimensions or format.');
        } finally {
          setLoading(false);
        }
      };
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRestart = () => {
    setFile(null);
    setOriginalWidth(0);
    setOriginalHeight(0);
    setWidth(0);
    setHeight(0);
    setResizedUrl(null);
    setResizedSize(0);
  };

  return (
    <ToolLayout
      title="Image Resizer"
      description="Quickly scale and resize image file dimensions. Customize height and width in pixels, lock aspect ratio, and download the resized file instantly."
      category="image"
    >
      <div className="space-y-6">
        {!file && (
          <UploadZone
            onFilesSelected={handleFilesSelected}
            accept=".jpg,.jpeg,.png,.webp"
            maxSizeMB={25}
            label="Upload your image to resize"
            subLabel="Supports JPG, PNG, and WEBP formats up to 25MB"
          />
        )}

        {file && originalWidth > 0 && !resizedUrl && (
          <div className="border border-card-border bg-card rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 pb-4 border-b border-card-border">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Resizing Controls</h3>
                <p className="text-xs text-muted">Specify dimensional constraints and quality options</p>
              </div>
            </div>

            {/* Selected File Card */}
            <div className="p-4 bg-background border border-card-border rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded bg-muted-bg text-muted shrink-0">
                  <Maximize2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate text-foreground">{file.name}</div>
                  <div className="text-xs text-muted">
                    Original dimensions: <strong className="text-foreground">{originalWidth} x {originalHeight} px</strong>
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

            {/* Dimensional inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="resize-width" className="text-sm font-semibold text-foreground block">Width (Pixels)</label>
                <input
                  id="resize-width"
                  type="number"
                  value={width || ''}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="resize-height" className="text-sm font-semibold text-foreground block">Height (Pixels)</label>
                <input
                  id="resize-height"
                  type="number"
                  value={height || ''}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Aspect Ratio Lock & Quality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-2 py-2">
                <input
                  id="aspect-lock"
                  type="checkbox"
                  checked={lockAspectRatio}
                  onChange={(e) => setLockAspectRatio(e.target.checked)}
                  className="w-4 h-4 rounded border-card-border bg-transparent text-primary focus:ring-primary accent-primary"
                />
                <label htmlFor="aspect-lock" className="text-sm font-semibold text-foreground flex items-center gap-1 cursor-pointer">
                  <LinkIcon className="w-4 h-4 text-primary" /> Lock Aspect Ratio
                </label>
              </div>

              {/* Quality Picker */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground block">Interpolation Quality</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => setResizingQuality(q)}
                      className={`py-2 text-xs font-semibold rounded-lg border capitalize transition-all ${
                        resizingQuality === q
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-card-border bg-background hover:bg-muted-bg text-muted'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Resize Trigger */}
            <button
              onClick={handleResize}
              disabled={loading || !width || !height}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Resizing image...
                </>
              ) : (
                'Resize Image'
              )}
            </button>
          </div>
        )}

        {/* Resized Result Card */}
        {resizedUrl && (
          <ResultCard
            originalSize={file?.size}
            processedSize={resizedSize}
            fileName={file?.name}
            downloadUrl={resizedUrl}
            downloadName={outputName}
            onRestart={handleRestart}
            previewUrl={resizedUrl}
          />
        )}
      </div>
    </ToolLayout>
  );
}
