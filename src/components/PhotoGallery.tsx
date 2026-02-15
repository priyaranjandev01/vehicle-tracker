import { useState } from 'react';
import { CasePhoto } from '@/types/case';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X, Trash2, ZoomIn, Download } from 'lucide-react';
import { safeFormat } from '@/lib/safeDate';
import { useToast } from '@/hooks/use-toast';

interface PhotoGalleryProps {
  photos: CasePhoto[];
  onDeletePhoto?: (photoId: string) => void;
  readOnly?: boolean;
}

const downloadImage = (dataUrl: string, filename: string): boolean => {
  try {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch {
    return false;
  }
};

export function PhotoGallery({ photos, onDeletePhoto, readOnly }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<CasePhoto | null>(null);
  const { toast } = useToast();
  const list = photos ?? [];

  const handleDownload = (dataUrl: string, photoId: string) => {
    const success = downloadImage(dataUrl, `photo-${photoId.slice(0, 8)}.jpg`);
    if (success) {
      toast({
        title: 'Downloaded successfully',
        description: 'Photo saved to your device.',
      });
    } else {
      toast({
        title: 'Download failed',
        description: 'Could not download the photo.',
        variant: 'destructive',
      });
    }
  };

  if (list.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No photos yet
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {list.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square rounded-lg overflow-hidden bg-muted group cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img
              src={photo.dataUrl}
              alt={photo.caption || 'Case photo'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <ZoomIn className="h-6 w-6 text-white" />
            </div>
            {!readOnly && (
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(photo.dataUrl, photo.id);
                  }}
                >
                  <Download className="h-3 w-3" />
                </Button>
                {onDeletePhoto && (
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePhoto(photo.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Full-size photo viewer */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-2">
          <DialogHeader className="p-2">
            <DialogTitle className="text-sm font-normal text-muted-foreground">
              {selectedPhoto && safeFormat(selectedPhoto.timestamp, 'MMM d, yyyy h:mm a')}
            </DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="relative flex flex-col items-center justify-center gap-4">
              <img
                src={selectedPhoto.dataUrl}
                alt={selectedPhoto.caption || 'Case photo'}
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleDownload(selectedPhoto.dataUrl, selectedPhoto.id)}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                {!readOnly && onDeletePhoto && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      onDeletePhoto(selectedPhoto.id);
                      setSelectedPhoto(null);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
