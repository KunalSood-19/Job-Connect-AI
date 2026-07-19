import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Trash2, FileText } from "lucide-react";

interface DocumentCardProps {
  title: string;
  fileName: string;
  fileUrl: string;
  onDelete?: () => void;
}

export default function DocumentCard({
  title,
  fileName,
  fileUrl,
  onDelete,
}: DocumentCardProps) {
  return (
    <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
      <CardContent className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FileText className="h-8 w-8 text-primary" />

          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {fileName}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            asChild
          >
            <a href={fileUrl} download>
              <Download className="h-4 w-4" />
            </a>
          </Button>

          <Button
            size="icon"
            variant="destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}