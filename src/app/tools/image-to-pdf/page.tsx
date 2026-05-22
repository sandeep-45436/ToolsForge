'use client';

import React, { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import UploadZone from '@/components/common/UploadZone';
import ResultCard from '@/components/common/ResultCard';
import { PDFDocument } from 'pdf-lib';
import { Loader2, ArrowUp, ArrowDown, Trash2, FileImage, Settings, Plus } from 'lucide-react';

interface FileItem {
  id: string;
  file: File;
}

type PageSizeOption = 'fit' | 'a4' | 'letter';
type MarginOption = 'none' | 'small' | 'medium';
type OrientationOption = 'portrait' | 'landscape';

export default function ImageToPdf() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState<PageSizeOption>('fit');
  const [orientation, setOrientation] = useState<OrientationOption>('portrait');
  const [marginSize, setMarginSize] = useState<MarginOption>('none');

  // Result state
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfSize, setPdfSize] = useState<number>(0);
  const [outputName, setOutputName] = useState<string>('');
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleFilesSelected = (selectedFiles: File[]) => {
    const newItems = selectedFiles.map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
    }));
    setFiles((prev) => [...prev, ...newItems]);
    setPdfUrl(null);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
    setPdfUrl(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setPdfUrl(null);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setPdfUrl(null);
  };

  // Reordering Handlers
  const handleDragStart = (index: number) => {
    setDraggedIdx(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    setFiles((prev) => {
      const copy = [...prev];
      const draggedItem = copy[draggedIdx];
      copy.splice(draggedIdx, 1);
      copy.splice(index, 0, draggedItem);
      return copy;
    });
    setDraggedIdx(index);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setPdfUrl(null);
  };

  // Converts any image into JPEG bytes
  const getJpgBytesFromImage = (file: File): Promise<{ bytes: Uint8Array; width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }
          // Fill white in case of transparency
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to export canvas blob'));
              return;
            }
            const fileReader = new FileReader();
            fileReader.onload = () => {
              if (fileReader.result instanceof ArrayBuffer) {
                resolve({
                  bytes: new Uint8Array(fileReader.result),
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                });
              } else {
                reject(new Error('Failed to read array buffer'));
              }
            };
            fileReader.readAsArrayBuffer(blob);
          }, 'image/jpeg', 0.9);
        };
        img.onerror = () => reject(new Error('Failed to load image file.'));
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGeneratePdf = async () => {
    if (files.length === 0) return;

    setLoading(true);
    try {
      const pdfDoc = await PDFDocument.create();

      // Standard page dimensions in points (1 inch = 72 points)
      // A4: 595.27 x 841.89 points
      // Letter: 612 x 792 points
      const PAGES_DIMS = {
        a4: { w: 595.27, h: 841.89 },
        letter: { w: 612, h: 792 },
      };

      const MARGINS = {
        none: 0,
        small: 18, // 0.25 inch
        medium: 36, // 0.5 inch
      };

      for (const item of files) {
        const { bytes, width: imgW, height: imgH } = await getJpgBytesFromImage(item.file);
        const embeddedImage = await pdfDoc.embedJpg(bytes);

        let pageW = imgW;
        let pageH = imgH;
        let drawX = 0;
        let drawY = 0;
        let drawW = imgW;
        let drawH = imgH;

        const margin = MARGINS[marginSize];

        if (pageSize !== 'fit') {
          // Standard page sizes
          const dim = PAGES_DIMS[pageSize as 'a4' | 'letter'];
          pageW = orientation === 'portrait' ? dim.w : dim.h;
          pageH = orientation === 'portrait' ? dim.h : dim.w;

          const maxDrawW = pageW - margin * 2;
          const maxDrawH = pageH - margin * 2;

          // Scale proportionally to fit within limits
          const wRatio = maxDrawW / imgW;
          const hRatio = maxDrawH / imgH;
          const ratio = Math.min(wRatio, hRatio);

          drawW = imgW * ratio;
          drawH = imgH * ratio;

          // Center image on the page
          drawX = margin + (maxDrawW - drawW) / 2;
          drawY = margin + (maxDrawH - drawH) / 2;
        }

        const page = pdfDoc.addPage([pageW, pageH]);
        page.drawImage(embeddedImage, {
          x: drawX,
          y: drawY,
          width: drawW,
          height: drawH,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setPdfUrl(url);
      setPdfSize(blob.size);
      setOutputName(`images_compiled_${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF compilation failed:', err);
      alert('Failed to compile images to PDF. Please verify your graphics files are readable.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setFiles([]);
    setPdfUrl(null);
    setPdfSize(0);
  };

  const totalOriginalSize = files.reduce((sum, item) => sum + item.file.size, 0);

  return (
    <ToolLayout
      title="Image to PDF Converter"
      description="Convert your JPG, PNG, and WEBP images into a clean PDF document. Reorder pages and customize layout sizes securely inside your browser."
      category="conversion"
    >
      <div className="space-y-6">
        {!pdfUrl && (
          <UploadZone
            onFilesSelected={handleFilesSelected}
            accept=".png,.jpg,.jpeg,.webp"
            multiple={true}
            maxSizeMB={25}
            label="Upload images to convert to PDF"
            subLabel="Select one or more images. Supports JPG, PNG, and WEBP formats."
          />
        )}

        {files.length > 0 && !pdfUrl && (
          <div className="border border-card-border bg-card rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
            
            {/* Setting Tabs */}
            <div className="border-b border-card-border pb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Page Layout Settings</h3>
                  <p className="text-xs text-muted">Customize sheet dimensions, borders, and orientation</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {/* Page Size */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground block">Page Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['fit', 'a4', 'letter'] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setPageSize(opt)}
                        className={`py-2 text-xs font-semibold rounded-lg border capitalize transition-all ${
                          pageSize === opt
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-card-border bg-background hover:bg-muted-bg text-muted'
                        }`}
                      >
                        {opt === 'fit' ? 'Original Size' : opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orientation */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground block">Orientation</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['portrait', 'landscape'] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setOrientation(opt)}
                        disabled={pageSize === 'fit'}
                        className={`py-2 text-xs font-semibold rounded-lg border capitalize transition-all disabled:opacity-40 disabled:hover:bg-transparent ${
                          orientation === opt && pageSize !== 'fit'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-card-border bg-background hover:bg-muted-bg text-muted'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Margins */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground block">Margins</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['none', 'small', 'medium'] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setMarginSize(opt)}
                        disabled={pageSize === 'fit'}
                        className={`py-2 text-xs font-semibold rounded-lg border capitalize transition-all disabled:opacity-40 disabled:hover:bg-transparent ${
                          marginSize === opt && pageSize !== 'fit'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-card-border bg-background hover:bg-muted-bg text-muted'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Images Queue Header */}
            <div className="flex items-center justify-between pb-2">
              <div>
                <h4 className="font-bold text-foreground text-sm">Image Compilation Order</h4>
                <p className="text-xs text-muted">Arrange images to define target PDF pages</p>
              </div>
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.png,.jpg,.jpeg,.webp';
                  input.multiple = true;
                  input.onchange = (e) => {
                    const selected = (e.target as HTMLInputElement).files;
                    if (selected) {
                      handleFilesSelected(Array.from(selected));
                    }
                  };
                  input.click();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add More
              </button>
            </div>

            {/* Image cards list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1">
              {files.map((item, idx) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`p-3 bg-background border border-card-border hover:border-primary/40 rounded-xl flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing transition-all ${
                    draggedIdx === idx ? 'opacity-40 border-primary bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 bg-primary/10 text-primary rounded shrink-0">
                      <FileImage className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate text-foreground">
                        Page {idx + 1}: {item.file.name}
                      </div>
                      <div className="text-[10px] text-muted">
                        {(item.file.size / 1024).toFixed(0)} KB
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="p-1 rounded border border-card-border hover:bg-muted-bg text-muted hover:text-foreground disabled:opacity-30"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => moveDown(idx)}
                      disabled={idx === files.length - 1}
                      className="p-1 rounded border border-card-border hover:bg-muted-bg text-muted hover:text-foreground disabled:opacity-30"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeFile(item.id)}
                      className="p-1 rounded border border-error/20 hover:bg-error/10 text-error/80 hover:text-error"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-muted">
                Images: <strong className="text-foreground">{files.length}</strong> &bull; Total Size:{' '}
                <strong className="text-foreground">{(totalOriginalSize / (1024 * 1024)).toFixed(2)} MB</strong>
              </div>
              <button
                onClick={handleGeneratePdf}
                disabled={loading || files.length === 0}
                className="w-full sm:w-auto min-w-[150px] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Compiling PDF...
                  </>
                ) : (
                  'Generate PDF'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results output */}
        {pdfUrl && (
          <ResultCard
            originalSize={totalOriginalSize}
            processedSize={pdfSize}
            fileName={outputName}
            downloadUrl={pdfUrl}
            downloadName={outputName}
            onRestart={handleRestart}
          />
        )}
      </div>
    </ToolLayout>
  );
}
