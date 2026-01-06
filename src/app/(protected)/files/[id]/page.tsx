"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/ui/button";
import { PdfViewer } from "@/features/file-management/components/pdf-viewer";
import { formatBytes, formatDate } from "@/lib/utils";

interface FileDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function FileDetailPage({ params }: FileDetailPageProps) {
  const { id } = use(params);
  const { data: file, isLoading, error } = trpc.files.getById.useQuery({ id });
  const downloadMutation = trpc.files.getDownloadUrl.useMutation();

  const handleDownload = async () => {
    if (!file) return;
    try {
      const result = await downloadMutation.mutateAsync({ id: file.id });
      const link = document.createElement("a");
      link.href = result.downloadUrl;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="container flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-destructive">File not found</p>
          <Button asChild className="mt-4">
            <Link href="/files">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to files
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const isPdf = file.mimeType === "application/pdf";

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/files">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{file.originalName}</h1>
            <p className="text-sm text-muted-foreground">
              {formatBytes(file.sizeBytes)} • {formatDate(file.createdAt)}
            </p>
          </div>
        </div>
        <Button onClick={handleDownload} disabled={downloadMutation.isPending}>
          {downloadMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Download
        </Button>
      </div>

      {isPdf && downloadMutation.data?.downloadUrl ? (
        <PdfViewer url={downloadMutation.data.downloadUrl} />
      ) : isPdf ? (
        <div className="flex flex-col items-center justify-center rounded-lg border py-12">
          <p className="mb-4 text-muted-foreground">
            Click to load PDF viewer
          </p>
          <Button onClick={handleDownload}>Load PDF</Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border py-12">
          <p className="text-muted-foreground">
            Preview not available for this file type
          </p>
        </div>
      )}
    </div>
  );
}
