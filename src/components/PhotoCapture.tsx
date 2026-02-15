import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, ImagePlus, Loader2 } from 'lucide-react';
import { compressImage } from '@/lib/imageCompression';
import { useToast } from '@/hooks/use-toast';

interface PhotoCaptureProps {
  onPhotoCapture: (dataUrl: string) => void;
  disabled?: boolean;
  /** Max total photos allowed for this case (e.g. 20). Enforced to avoid memory/crash. */
  maxTotal?: number;
  /** Current number of photos already added (used with maxTotal to cap uploads). */
  currentCount?: number;
}

export function PhotoCapture({
  onPhotoCapture,
  disabled,
  maxTotal,
  currentCount = 0,
}: PhotoCaptureProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processFilesSequentially = async (fileList: FileList) => {
    const allFiles = Array.from(fileList).filter((file) => file.type.startsWith('image/'));
    const skipped = fileList.length - allFiles.length;
    if (allFiles.length === 0) {
      if (skipped > 0) {
        toast({
          title: 'Invalid files',
          description: 'Please select image files only.',
          variant: 'destructive',
        });
      }
      return;
    }

    const maxToAdd =
      maxTotal != null && currentCount != null
        ? Math.max(0, maxTotal - currentCount)
        : allFiles.length;
    const files = maxToAdd < allFiles.length ? allFiles.slice(0, maxToAdd) : allFiles;
    const capped = allFiles.length > files.length;

    if (maxToAdd === 0) {
      toast({
        title: 'Photo limit reached',
        description: `Maximum ${maxTotal} photos per case. Remove some to add more.`,
        variant: 'destructive',
      });
      return;
    }

    setIsCompressing(true);
    let added = 0;
    let failed = 0;

    for (let i = 0; i < files.length; i++) {
      try {
        const compressedDataUrl = await compressImage(files[i]);
        onPhotoCapture(compressedDataUrl);
        added++;
      } catch (error) {
        console.error('Failed to compress image:', error);
        failed++;
      }
    }

    setIsCompressing(false);

    if (skipped > 0) {
      toast({
        title: 'Skipped non-images',
        description: `${skipped} file(s) were not images and were skipped.`,
        variant: 'destructive',
      });
    }
    if (capped) {
      toast({
        title: 'Photo limit applied',
        description: `Only first ${maxToAdd} photo(s) added (max ${maxTotal} per case).`,
        variant: 'destructive',
      });
    }
    if (added > 0) {
      toast({
        title: added === 1 ? 'Photo added' : 'Photos added',
        description:
          added === 1
            ? 'Image compressed and saved.'
            : `${added} image(s) compressed and saved.`,
      });
    }
    if (failed > 0) {
      toast({
        title: 'Some photos failed',
        description: `${failed} image(s) could not be processed.`,
        variant: 'destructive',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      void processFilesSequentially(files);
    }
    e.target.value = '';
  };

  return (
    <div className="flex gap-2">
      {/* Camera capture - shows camera on mobile */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isCompressing}
      />
      
      {/* Gallery/file upload - multiple selection enabled */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isCompressing}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => cameraInputRef.current?.click()}
        disabled={disabled || isCompressing}
        className="flex-1 gap-2"
      >
        {isCompressing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Camera className="h-4 w-4" />
        )}
        Camera
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isCompressing}
        className="flex-1 gap-2"
      >
        {isCompressing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImagePlus className="h-4 w-4" />
        )}
        Gallery
      </Button>
    </div>
  );
}
