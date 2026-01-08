"use client";

import { useState } from "react";
import { Download, X } from "lucide-react";
import { FileUpload, FileList, PdfViewer } from "@/widgets";
import type { FileItem } from "@/entities/file";
import { Button } from "@/shared/ui";

interface ViewingFile {
  id: string;
  name: string;
  url: string;
}

export default function FilesPage() {
  // Inline preview state (shown in page section)
  const [inlineFile, setInlineFile] = useState<ViewingFile | null>(null);

  // Click on file item -> show inline preview
  const handleSelect = (file: FileItem) => {
    setInlineFile({
      id: file.id,
      name: file.originalName,
      url: `/api/files/${file.id}`,
    });
  };

  const handleDownload = (fileId: string) => {
    const link = document.createElement("a");
    link.href = `/api/files/${fileId}?download=true`;
    link.click();
  };

  const closeInlineViewer = () => {
    setInlineFile(null);
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Files</h1>
        <p className="text-muted-foreground">
          Upload and manage your files
        </p>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Upload</h2>
        <FileUpload />
      </div>

      {/* File List Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Your Files</h2>
        <FileList
          onSelect={handleSelect}
          selectedFileId={inlineFile?.id}
        />
      </div>

      {/* Inline PDF Viewer Section */}
      {inlineFile && (
        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="truncate font-semibold">{inlineFile.name}</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(inlineFile.id)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="ghost" size="icon" onClick={closeInlineViewer}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="p-4">
            <PdfViewer url={inlineFile.url} />
          </div>
        </div>
      )}
    </div>
  );
}
