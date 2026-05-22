'use client';

import React from 'react';
import { Download, RotateCcw, FileCheck, HelpCircle } from 'lucide-react';

interface ResultCardProps {
  originalSize?: number;
  processedSize?: number;
  reductionPercent?: number;
  fileName?: string;
  downloadUrl?: string;
  downloadName?: string;
  onRestart: () => void;
  previewUrl?: string;
}

export default function ResultCard({
  originalSize,
  processedSize,
  reductionPercent,
  fileName,
  downloadUrl,
  downloadName,
  onRestart,
  previewUrl,
}: ResultCardProps) {
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full border border-card-border bg-card rounded-2xl p-6 shadow-md animate-in zoom-in-95 duration-200">
      <div className="flex flex-col md:flex-row items-stretch gap-6">
        {/* Preview Panel */}
        {previewUrl ? (
          <div className="w-full md:w-1/3 flex items-center justify-center border border-card-border bg-muted-bg rounded-xl overflow-hidden aspect-video md:aspect-square relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Processed File Preview"
              className="max-w-full max-h-full object-contain transition-transform group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center border border-card-border bg-muted-bg rounded-xl py-8 px-4 text-center">
            <div className="p-3 rounded-full bg-primary/10 text-primary mb-3">
              <FileCheck className="w-8 h-8" />
            </div>
            <div className="text-sm font-semibold text-foreground truncate max-w-[200px]">
              {fileName || 'document.pdf'}
            </div>
            <div className="text-xs text-muted mt-1">Processed successfully</div>
          </div>
        )}

        {/* Info & Stats Panel */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-success/15 text-success border border-success/20">
                Success
              </span>
              <span className="text-xs text-muted truncate max-w-[220px]">
                {fileName}
              </span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">
              Your file is ready!
            </h3>

            {/* Statistics */}
            {originalSize !== undefined && processedSize !== undefined && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-3 rounded-xl bg-background border border-card-border">
                  <div className="text-xs text-muted mb-1">Original Size</div>
                  <div className="font-bold text-foreground">{formatBytes(originalSize)}</div>
                </div>
                <div className="p-3 rounded-xl bg-background border border-card-border">
                  <div className="text-xs text-muted mb-1">Processed Size</div>
                  <div className="font-bold text-foreground">{formatBytes(processedSize)}</div>
                </div>
                {reductionPercent !== undefined && reductionPercent > 0 && (
                  <div className="p-3 rounded-xl bg-success/10 border border-success/20 col-span-2 sm:col-span-1">
                    <div className="text-xs text-success mb-1">Saved Size</div>
                    <div className="font-bold text-success">-{reductionPercent.toFixed(1)}%</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {downloadUrl && (
              <a
                href={downloadUrl}
                download={downloadName || 'processed_file'}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm glow-hover transition-all text-center"
              >
                <Download className="w-4 h-4" />
                Download File
              </a>
            )}
            <button
              onClick={onRestart}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-muted hover:text-foreground bg-muted-bg border border-card-border hover:border-muted rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Process Another File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
