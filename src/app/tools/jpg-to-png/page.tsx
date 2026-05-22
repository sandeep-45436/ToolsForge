'use client';

import React, { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import UploadZone from '@/components/common/UploadZone';
import ResultCard from '@/components/common/ResultCard';
import { ArrowRightLeft, Loader2, ArrowRight } from 'lucide-react';

export default function FormatConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number>(0);
  const [outputName, setOutputName] = useState<string>('');

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setResultUrl(null);
    }
  };

  const handleConvert = () => {
    if (!file) return;

    setLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Could not create Canvas context.');
          }

          // If converting to jpeg, fill canvas background with white to avoid black transparent areas
          if (targetFormat === 'jpeg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx.drawImage(img, 0, 0);

          const mimeType = `image/${targetFormat}`;
          const dataUrl = canvas.toDataURL(mimeType, 0.95);

          // Get file size from dataURL
          const head = `data:${mimeType};base64,`;
          const sizeInBytes = Math.round((dataUrl.length - head.length) * 3 / 4);

          // Get base file name without extension
          const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
          const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;

          setResultUrl(dataUrl);
          setResultSize(sizeInBytes);
          setOutputName(`${originalName}.${ext}`);
        } catch (err) {
          console.error('Conversion error:', err);
          alert('Failed to convert image. Please verify it is a valid, readable graphic file.');
        } finally {
          setLoading(false);
        }
      };

      img.onerror = () => {
        alert('Could not load image file.');
        setLoading(false);
      };

      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };

    reader.onerror = () => {
      alert('Could not read image file data.');
      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleRestart = () => {
    setFile(null);
    setResultUrl(null);
    setResultSize(0);
  };

  const currentExt = file ? file.name.split('.').pop()?.toLowerCase() : '';

  return (
    <ToolLayout
      title="JPG ↔ PNG Converter"
      description="Convert image files instantly between JPG, PNG, and WEBP formats. Runs completely in your browser, maintaining full resolution and image privacy."
      category="conversion"
    >
      <div className="space-y-6">
        {!file && (
          <UploadZone
            onFilesSelected={handleFilesSelected}
            accept=".jpg,.jpeg,.png,.webp"
            maxSizeMB={25}
            label="Upload your image to convert"
            subLabel="Supports JPG, PNG, and WEBP formats up to 25MB"
          />
        )}

        {file && !resultUrl && (
          <div className="border border-card-border bg-card rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-card-border">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Conversion Settings</h3>
                <p className="text-xs text-muted">Select output type and format details</p>
              </div>
            </div>

            {/* Conversion visual */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
              <div className="px-5 py-3.5 rounded-xl bg-background border border-card-border font-bold uppercase text-muted tracking-widest text-lg">
                {currentExt === 'jpeg' ? 'jpg' : currentExt}
              </div>
              <ArrowRight className="w-6 h-6 text-primary shrink-0 hidden sm:block rotate-0" />
              <div className="px-5 py-3.5 rounded-xl bg-primary/10 border border-primary/20 font-bold uppercase text-primary tracking-widest text-lg animate-pulse">
                {targetFormat === 'jpeg' ? 'jpg' : targetFormat}
              </div>
            </div>

            {/* Radio / Format selector */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground block">
                Select Target Format
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['png', 'jpeg', 'webp'] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => setTargetFormat(format)}
                    className={`py-3 rounded-xl border font-bold text-sm transition-all uppercase ${
                      targetFormat === format
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-card-border bg-background hover:bg-muted-bg text-muted hover:text-foreground'
                    }`}
                  >
                    {format === 'jpeg' ? 'jpg' : format}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {targetFormat === 'png' && 'PNG preserves full image quality and supports transparency.'}
                {targetFormat === 'jpeg' && 'JPG results in smaller files but does not support transparency.'}
                {targetFormat === 'webp' && 'WEBP provides excellent quality at extremely low file weights.'}
              </p>
            </div>

            {/* Selected File Card */}
            <div className="p-4 bg-background border border-card-border rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded bg-muted-bg text-muted shrink-0">
                  <ArrowRightLeft className="w-5 h-5" />
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

            {/* Trigger Button */}
            <button
              onClick={handleConvert}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Converting image...
                </>
              ) : (
                `Convert to ${targetFormat.toUpperCase()}`
              )}
            </button>
          </div>
        )}

        {/* Result component */}
        {resultUrl && (
          <ResultCard
            originalSize={file?.size}
            processedSize={resultSize}
            fileName={file?.name}
            downloadUrl={resultUrl}
            downloadName={outputName}
            onRestart={handleRestart}
            previewUrl={resultUrl}
          />
        )}
      </div>
    </ToolLayout>
  );
}
