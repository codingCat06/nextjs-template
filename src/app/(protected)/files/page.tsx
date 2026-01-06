import { FileUpload, FileList } from "@/features/file-management";

export default function FilesPage() {
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

      {/* File List & PDF Viewer Section */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Your Files</h2>
        <FileList />
      </div>
    </div>
  );
}
