import {
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ResumeCardProps {
  fileName?: string;
  fileUrl?: string;
  onUpload?: (file: File) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function ResumeCard({
  fileName,
  fileUrl,
  onUpload,
  onDelete,
}: ResumeCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file || !onUpload) return;

    try {
      setUploading(true);
      await onUpload(file);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    try {
      setDeleting(true);
      await onDelete();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="p-6 rounded-2xl shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 rounded-full p-3">
            <FileText className="h-8 w-8 text-primary" />
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              Resume
            </h3>

            <p className="text-sm text-muted-foreground">
              {fileName || "No Resume Uploaded"}
            </p>
          </div>
        </div>

        <input
          hidden
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleUpload}
        />

        <Button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </div>

      {fileUrl && (
        <div className="flex flex-wrap gap-3 mt-6">
          <Button
            variant="secondary"
            asChild
          >
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </a>
          </Button>

          <Button
            variant="outline"
            asChild
          >
            <a
              href={fileUrl}
              download
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </a>
          </Button>

          <Button
            variant="destructive"
            disabled={deleting}
            onClick={handleDelete}
          >
            {deleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}