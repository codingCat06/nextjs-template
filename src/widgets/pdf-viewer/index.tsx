"use client";

import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, Loader2 } from "lucide-react";
import { Button, Input } from "@/shared/ui";

interface PdfViewerProps {
  url: string;
}

const PDFJS_VERSION = "3.11.174";
const PDFJS_CDN = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}`;

// Load PDF.js scripts
async function loadPdfScripts(): Promise<void> {
  // Check if already loaded
  if ((window as any).pdfjsLib) {
    return;
  }

  // Load main library
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${PDFJS_CDN}/pdf.min.js`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load PDF.js"));
    document.head.appendChild(script);
  });

  // Configure worker
  const pdfjsLib = (window as any).pdfjsLib;
  if (!pdfjsLib) {
    throw new Error("PDF.js not loaded");
  }
  pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_CDN}/pdf.worker.min.js`;

  // Load viewer CSS for text layer
  if (!document.querySelector(`link[href*="pdf_viewer.min.css"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${PDFJS_CDN}/pdf_viewer.min.css`;
    document.head.appendChild(link);
  }
}

export function PdfViewer({ url }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pagesContainerRef = useRef<HTMLDivElement>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const pdfDocRef = useRef<any>(null);
  const renderTasksRef = useRef<Map<number, any>>(new Map());
  const pageElementsRef = useRef<Map<number, HTMLDivElement>>(new Map());

  // Load PDF
  useEffect(() => {
    let isMounted = true;

    const loadPdf = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await loadPdfScripts();

        const pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib || !isMounted) {
          if (isMounted) setError("Failed to initialize PDF viewer");
          return;
        }

        const loadingTask = pdfjsLib.getDocument(url);
        const pdfDoc = await loadingTask.promise;

        if (isMounted) {
          pdfDocRef.current = pdfDoc;
          setTotalPages(pdfDoc.numPages);
          setCurrentPage(1);
          setPageInput("1");
        }
      } catch (err) {
        console.error("Error loading PDF:", err);
        if (isMounted) {
          setError("Failed to load PDF");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
      // Cancel all render tasks
      renderTasksRef.current.forEach((task) => {
        if (task && task.cancel) task.cancel();
      });
      renderTasksRef.current.clear();
    };
  }, [url]);

  // Render pages when PDF is loaded or scale changes
  useEffect(() => {
    if (!pdfDocRef.current || totalPages === 0) return;

    const renderPages = async () => {
      const pdfDoc = pdfDocRef.current;
      const pdfjsLib = (window as any).pdfjsLib;
      const devicePixelRatio = window.devicePixelRatio || 1;

      // Cancel previous render tasks
      renderTasksRef.current.forEach((task) => {
        if (task && task.cancel) task.cancel();
      });
      renderTasksRef.current.clear();

      // Render each page
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const pageElement = pageElementsRef.current.get(pageNum);
        if (!pageElement) continue;

        try {
          const page = await pdfDoc.getPage(pageNum);
          const viewport = page.getViewport({ scale });

          // Clear previous content
          pageElement.innerHTML = "";

          // Create wrapper for canvas and text layer
          const wrapper = document.createElement("div");
          wrapper.style.position = "relative";
          wrapper.style.width = `${viewport.width}px`;
          wrapper.style.height = `${viewport.height}px`;

          // Create canvas
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) continue;

          // High DPI support
          canvas.width = viewport.width * devicePixelRatio;
          canvas.height = viewport.height * devicePixelRatio;
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;
          context.scale(devicePixelRatio, devicePixelRatio);

          wrapper.appendChild(canvas);

          // Render canvas
          const renderTask = page.render({
            canvasContext: context,
            viewport: viewport,
          });
          renderTasksRef.current.set(pageNum, renderTask);

          await renderTask.promise;

          // Create text layer for selection
          const textContent = await page.getTextContent();
          const textLayerDiv = document.createElement("div");
          textLayerDiv.className = "textLayer";
          textLayerDiv.style.position = "absolute";
          textLayerDiv.style.left = "0";
          textLayerDiv.style.top = "0";
          textLayerDiv.style.right = "0";
          textLayerDiv.style.bottom = "0";
          textLayerDiv.style.overflow = "hidden";
          textLayerDiv.style.lineHeight = "1";

          // Render text layer
          if (pdfjsLib.renderTextLayer) {
            pdfjsLib.renderTextLayer({
              textContent: textContent,
              container: textLayerDiv,
              viewport: viewport,
              textDivs: [],
            });
          }

          wrapper.appendChild(textLayerDiv);
          pageElement.appendChild(wrapper);
        } catch (err: any) {
          if (err?.name !== "RenderingCancelledException") {
            console.error(`Error rendering page ${pageNum}:`, err);
          }
        }
      }
    };

    renderPages();

    return () => {
      renderTasksRef.current.forEach((task) => {
        if (task && task.cancel) task.cancel();
      });
      renderTasksRef.current.clear();
    };
  }, [totalPages, scale]);

  // Track scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container || totalPages === 0) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      let closestPage = 1;
      let closestDistance = Infinity;

      pageElementsRef.current.forEach((element, pageNum) => {
        const rect = element.getBoundingClientRect();
        const pageCenter = rect.top + rect.height / 2;
        const distance = Math.abs(pageCenter - containerCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestPage = pageNum;
        }
      });

      if (currentPage !== closestPage) {
        setCurrentPage(closestPage);
        setPageInput(String(closestPage));
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [totalPages, currentPage]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      goToPage();
    }
  };

  const goToPage = () => {
    const pageNum = parseInt(pageInput, 10);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
      setPageInput(String(currentPage));
      return;
    }

    const pageElement = pageElementsRef.current.get(pageNum);
    if (pageElement && containerRef.current) {
      pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrentPage(pageNum);
    }
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 4));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const setPageRef = (pageNum: number) => (el: HTMLDivElement | null) => {
    if (el) {
      pageElementsRef.current.set(pageNum, el);
    } else {
      pageElementsRef.current.delete(pageNum);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="flex items-center justify-center gap-4 rounded-lg border bg-background p-2">
        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={pageInput}
            onChange={handlePageInputChange}
            onKeyDown={handlePageInputKeyDown}
            onBlur={goToPage}
            className="h-8 w-16 text-center"
          />
          <span className="text-sm text-muted-foreground">/ {totalPages}</span>
        </div>

        <div className="mx-2 h-6 w-px bg-border" />

        {/* Zoom Controls */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={zoomOut}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="min-w-[50px] text-center text-sm">
          {Math.round(scale * 100)}%
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={zoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      {/* PDF Pages Container */}
      <div
        ref={containerRef}
        className="max-h-[600px] overflow-auto rounded-lg border bg-muted p-4"
      >
        <div ref={pagesContainerRef} className="flex flex-col items-center gap-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <div
              key={pageNum}
              ref={setPageRef(pageNum)}
              className="bg-white shadow-md"
              style={{ minHeight: "100px" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
