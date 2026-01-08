import Link from "next/link";
import { Button } from "@/shared/ui";
import { FileText, Shield, Upload } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Next.js Full-Stack Template
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Production-grade template with authentication, file management, and
          admin capabilities. Built with Next.js, TypeScript, and Tailwind CSS.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-3">
        <div className="flex flex-col items-center gap-2 rounded-lg border p-6 text-center">
          <Shield className="h-12 w-12 text-primary" />
          <h3 className="text-xl font-semibold">Authentication</h3>
          <p className="text-sm text-muted-foreground">
            Secure email/password authentication with session management
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-lg border p-6 text-center">
          <Upload className="h-12 w-12 text-primary" />
          <h3 className="text-xl font-semibold">File Management</h3>
          <p className="text-sm text-muted-foreground">
            Upload, download, and manage files with Cloudflare R2 storage
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-lg border p-6 text-center">
          <FileText className="h-12 w-12 text-primary" />
          <h3 className="text-xl font-semibold">PDF Viewer</h3>
          <p className="text-sm text-muted-foreground">
            Built-in PDF viewer with navigation and zoom controls
          </p>
        </div>
      </div>
    </div>
  );
}
