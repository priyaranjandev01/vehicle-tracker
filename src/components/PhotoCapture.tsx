import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, ImagePlus, Loader2 } from 'lucide-react';
import { compressImage } from '@/lib/imageCompression';
import { useToast } from '@/hooks/use-toast';

interface PhotoCaptureProps {
  onPhotoCapture: (dataUrl: string) => void;
  disabled?: boolean;
}

export function PhotoCapture({ onPhotoCapture, disabled }: PhotoCaptureProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }

    setIsCompressing(true);
    try {
      const compressedDataUrl = await compressImage(file);
      onPhotoCapture(compressedDataUrl);
      toast({
        title: 'Photo added',
        description: 'Image compressed and saved.',
      });
    } catch (error) {
      console.error('Failed to compress image:', error);
      toast({
        title: 'Error',
        description: 'Failed to process image.',
        variant: 'destructive',
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => handleFile(file));
    }
    // Reset input so same file can be selected again
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
