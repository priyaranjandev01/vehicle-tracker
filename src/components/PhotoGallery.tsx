import { useState } from 'react';
import { CasePhoto } from '@/types/case';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X, Trash2, ZoomIn } from 'lucide-react';
import { format } from 'date-fns';

interface PhotoGalleryProps {
  photos: CasePhoto[];
  onDeletePhoto?: (photoId: string) => void;
  readOnly?: boolean;
}

export function PhotoGallery({ photos, onDeletePhoto, readOnly }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<CasePhoto | null>(null);

  if (photos.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No photos yet
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo) => (
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
            {!readOnly && onDeletePhoto && (
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePhoto(photo.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Full-size photo viewer */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-2">
          <DialogHeader className="p-2">
            <DialogTitle className="text-sm font-normal text-muted-foreground">
              {selectedPhoto && format(selectedPhoto.timestamp, 'MMM d, yyyy h:mm a')}
            </DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="relative flex items-center justify-center">
              <img
                src={selectedPhoto.dataUrl}
                alt={selectedPhoto.caption || 'Case photo'}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
              {!readOnly && onDeletePhoto && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute bottom-4 right-4 gap-2"
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
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
