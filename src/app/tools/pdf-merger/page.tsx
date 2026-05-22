'use client';

import React, { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import UploadZone from '@/components/common/UploadZone';
import ResultCard from '@/components/common/ResultCard';
import { PDFDocument } from 'pdf-lib';
import { Loader2, ArrowUp, ArrowDown, Trash2, FileText, Plus } from 'lucide-react';

interface FileItem {
  id: string;
  file: File;
}

export default function PdfMerger() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [mergedSize, setMergedSize] = useState<number>(0);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleFilesSelected = (selectedFiles: File[]) => {
    const newItems = selectedFiles.map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
    }));
    setFiles((prev) => [...prev, ...newItems]);
    setMergedUrl(null);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
    setMergedUrl(null);
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
    setMergedUrl(null);
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
    setMergedUrl(null);
  };

  // HTML5 Drag and Drop Handlers for Reordering
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
    setMergedUrl(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert('Please upload at least 2 PDF files to merge.');
      return;
    }

    setLoading(true);
    try {
      // Create empty PDF
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const fileBytes = await item.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBytes);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setMergedUrl(url);
      setMergedSize(blob.size);
    } catch (err) {
      console.error('Merge error:', err);
      alert('Failed to merge PDFs. One of the documents may be encrypted, corrupted, or incompatible.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setFiles([]);
    setMergedUrl(null);
    setMergedSize(0);
  };

  const totalOriginalSize = files.reduce((sum, item) => sum + item.file.size, 0);

  return (
    <ToolLayout
      title="PDF Merger"
      description="Combine multiple PDF documents into a single PDF file instantly. Rearrange pages or documents in your desired order securely in the browser."
      category="pdf"
    >
      <div className="space-y-6">
        {/* Upload Zone (Visible if no output ready) */}
        {!mergedUrl && (
          <UploadZone
            onFilesSelected={handleFilesSelected}
            accept=".pdf"
            multiple={true}
            maxSizeMB={25}
            label="Upload PDF files to combine"
            subLabel="Select two or more PDF files. Drag/drop or browser queue."
          />
        )}

        {/* Selected Files List & Sorting */}
        {files.length > 0 && !mergedUrl && (
          <div className="border border-card-border bg-card rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-card-border">
              <div>
                <h3 className="font-bold text-foreground">Merge Queue</h3>
                <p className="text-xs text-muted">Drag items or use arrow keys to change sequence</p>
              </div>
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.pdf';
                  input.multiple = true;
                  input.onchange = (e) => {
                    const selected = (e.target as HTMLInputElement).files;
                    if (selected) {
                      const filesArray = Array.from(selected);
                      handleFilesSelected(filesArray);
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

            {/* List */}
            <div className="space-y-3">
              {files.map((item, idx) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`p-4 bg-background border border-card-border hover:border-primary/40 rounded-xl flex items-center justify-between gap-4 cursor-grab active:cursor-grabbing transition-all ${
                    draggedIdx === idx ? 'opacity-40 border-primary bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-primary/10 text-primary rounded shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate text-foreground">
                        {item.file.name}
                      </div>
                      <div className="text-xs text-muted">
                        {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>
                  </div>

                  {/* Reordering Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg border border-card-border hover:bg-muted-bg text-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveDown(idx)}
                      disabled={idx === files.length - 1}
                      className="p-1.5 rounded-lg border border-card-border hover:bg-muted-bg text-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeFile(item.id)}
                      className="p-1.5 rounded-lg border border-error/20 hover:bg-error/10 text-error/80 hover:text-error"
                      title="Remove File"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Merge Trigger */}
            <div className="pt-4 border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-muted">
                Total Files: <strong className="text-foreground">{files.length}</strong> &bull; Total Size:{' '}
                <strong className="text-foreground">{(totalOriginalSize / (1024 * 1024)).toFixed(2)} MB</strong>
              </div>
              <button
                onClick={handleMerge}
                disabled={loading || files.length < 2}
                className="w-full sm:w-auto min-w-[150px] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Merging files...
                  </>
                ) : (
                  'Merge PDFs'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Merge Result */}
        {mergedUrl && (
          <ResultCard
            originalSize={totalOriginalSize}
            processedSize={mergedSize}
            fileName={`merged_document_${new Date().toISOString().slice(0, 10)}.pdf`}
            downloadUrl={mergedUrl}
            downloadName={`merged_${Date.now()}.pdf`}
            onRestart={handleRestart}
          />
        )}
      </div>
    </ToolLayout>
  );
}
