'use client';

import React, { useRef, useState } from 'react';
import { Upload, AlertCircle, File, CheckCircle } from 'lucide-react';

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept: string; // e.g. ".pdf" or ".png,.jpg,.jpeg,.webp" or "image/*"
  multiple?: boolean;
  maxSizeMB?: number;
  label?: string;
  subLabel?: string;
}

export default function UploadZone({
  onFilesSelected,
  accept,
  multiple = false,
  maxSizeMB = 25,
  label = 'Drag and drop files here',
  subLabel = 'or click to browse from your device',
}: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: FileList | null): File[] => {
    if (!files) return [];
    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    setError(null);
    setSuccessCount(0);

    // Expand formats list from accept string (e.g. ".pdf" or ".png,.jpg,.jpeg,.webp")
    const acceptTypes = accept
      .split(',')
      .map((t) => t.trim().toLowerCase());

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const fileType = file.type.toLowerCase();

      // Check if file type matches
      let isTypeValid = false;
      for (const type of acceptTypes) {
        if (type.startsWith('.')) {
          if (fileExtension === type) isTypeValid = true;
        } else if (type.endsWith('/*')) {
          const typePrefix = type.replace('/*', '');
          if (fileType.startsWith(typePrefix)) isTypeValid = true;
        } else {
          if (fileType === type) isTypeValid = true;
        }
      }

      if (!isTypeValid) {
        setError(`Invalid format: "${file.name}" is not supported. Supported extensions: ${accept}`);
        return [];
      }

      // Check file size
      if (file.size > maxSizeBytes) {
        setError(`File too large: "${file.name}" exceeds the ${maxSizeMB}MB limit.`);
        return [];
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setSuccessCount(validFiles.length);
    }
    return validFiles;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    const validated = validateFiles(files);
    if (validated.length > 0) {
      onFilesSelected(multiple ? validated : [validated[0]]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const validated = validateFiles(files);
    if (validated.length > 0) {
      onFilesSelected(multiple ? validated : [validated[0]]);
    }
  };

  const onAreaClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={onAreaClick}
        className={`w-full min-h-[220px] p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-primary bg-primary/5 scale-[0.99] shadow-lg shadow-primary-glow'
            : 'border-card-border bg-card hover:bg-muted-bg hover:border-primary/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="p-4 rounded-full bg-primary/10 text-primary mb-4 transition-transform group-hover:scale-110">
          <Upload className="w-8 h-8" />
        </div>

        <h3 className="font-semibold text-lg text-foreground mb-1">
          {label}
        </h3>
        <p className="text-sm text-muted mb-4">
          {subLabel}
        </p>

        <div className="text-xs text-muted/80 bg-background px-3 py-1.5 rounded-lg border border-card-border">
          Supported formats: {accept.toUpperCase()} &bull; Max size: {maxSizeMB}MB
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-error/10 border border-error/20 text-error flex items-start gap-2 text-sm animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {successCount > 0 && !error && (
        <div className="mt-4 p-3 rounded-xl bg-success/10 border border-success/20 text-success flex items-start gap-2 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            Successfully loaded {successCount} file(s). Ready for processing!
          </div>
        </div>
      )}
    </div>
  );
}
