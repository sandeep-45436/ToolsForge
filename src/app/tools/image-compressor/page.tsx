'use client';

import React, { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import UploadZone from '@/components/common/UploadZone';
import ResultCard from '@/components/common/ResultCard';
import imageCompression from 'browser-image-compression';
import { Loader2, Settings } from 'lucide-react';

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [quality, setQuality] = useState<number>(80);
  const [maxSizeMB, setMaxSizeMB] = useState<number>(0.2);
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState<number>(1920);

  // Result stats
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [reduction, setReduction] = useState<number>(0);
  const [outputName, setOutputName] = useState<string>('');

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      // Clear previous results
      setCompressedUrl(null);
    }
  };

  const handleCompress = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const options = {
        maxSizeMB: maxSizeMB,
        maxWidthOrHeight: maxWidthOrHeight,
        useWebWorker: true,
        initialQuality: quality / 100,
      };

      const compressedFile = await imageCompression(file, options);

      // Create download URL
      const url = URL.createObjectURL(compressedFile);
      setCompressedUrl(url);

      // Stats
      setOriginalSize(file.size);
      setCompressedSize(compressedFile.size);
      setOutputName(`compressed_${file.name}`);

      const savedBytes = file.size - compressedFile.size;
      const savedPercent = savedBytes > 0 ? (savedBytes / file.size) * 100 : 0;
      setReduction(savedPercent);
    } catch (error) {
      console.error('Compression failed:', error);
      alert('Failed to compress the image. Please make sure it is not corrupted and try a different format.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setFile(null);
    setCompressedUrl(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setReduction(0);
  };

  return (
    <ToolLayout
      title="Image Compressor"
      description="Compress JPG, PNG, and WEBP images instantly in your browser. Control target size, quality level, and dimensions without server uploads."
      category="image"
    >
      <div className="space-y-6">
        {!file && (
          <UploadZone
            onFilesSelected={handleFilesSelected}
            accept=".jpg,.jpeg,.png,.webp"
            maxSizeMB={25}
            label="Upload your image to compress"
            subLabel="Supports JPG, PNG, and WEBP formats up to 25MB"
          />
        )}

        {file && !compressedUrl && (
          <div className="border border-card-border bg-card rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-card-border">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Compression Settings</h3>
                <p className="text-xs text-muted">Optimize resolution, scale, and compression weight</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quality slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <label htmlFor="quality-slider" className="text-foreground">Image Quality</label>
                  <span className="text-primary">{quality}%</span>
                </div>
                <input
                  id="quality-slider"
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-1.5 bg-muted-bg rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-[10px] text-muted leading-relaxed">
                  Lower quality results in smaller files but lower visual clarity.
                </p>
              </div>

              {/* Target Size (MB) */}
              <div className="space-y-2">
                <label htmlFor="target-size" className="text-sm font-semibold text-foreground block">
                  Target Size (Max MB)
                </label>
                <input
                  id="target-size"
                  type="number"
                  step="0.05"
                  min="0.01"
                  max="10"
                  value={maxSizeMB}
                  onChange={(e) => setMaxSizeMB(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                />
                <p className="text-[10px] text-muted leading-relaxed">
                  The compressor will attempt to reduce size below this limit.
                </p>
              </div>

              {/* Max Width/Height */}
              <div className="space-y-2">
                <label htmlFor="max-dimensions" className="text-sm font-semibold text-foreground block">
                  Max Dimension (Pixels)
                </label>
                <input
                  id="max-dimensions"
                  type="number"
                  step="100"
                  min="100"
                  max="8000"
                  value={maxWidthOrHeight}
                  onChange={(e) => setMaxWidthOrHeight(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                />
                <p className="text-[10px] text-muted leading-relaxed">
                  Resizes larger dimensions to keep resolution manageable.
                </p>
              </div>
            </div>

            {/* Selected File Card */}
            <div className="p-4 bg-background border border-card-border rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded bg-muted-bg text-muted shrink-0">
                  <Settings className="w-5 h-5" />
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

            {/* Compress Trigger */}
            <button
              onClick={handleCompress}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Compressing image...
                </>
              ) : (
                'Compress Image'
              )}
            </button>
          </div>
        )}

        {/* Compression Result Card */}
        {compressedUrl && (
          <ResultCard
            originalSize={originalSize}
            processedSize={compressedSize}
            reductionPercent={reduction}
            fileName={file?.name}
            downloadUrl={compressedUrl}
            downloadName={outputName}
            onRestart={handleRestart}
            previewUrl={compressedUrl}
          />
        )}
      </div>
    </ToolLayout>
  );
}
