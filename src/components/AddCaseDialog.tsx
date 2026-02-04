import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { Switch } from '@/components/ui/switch';
import { Case, CaseStage, InsuranceStatus, PartsStatus, CasePhoto } from '@/types/case';
import { PhotoCapture } from '@/components/PhotoCapture';
import { ImageIcon, X } from 'lucide-react';

interface AddCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCase: (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt' | 'notes' | 'photos'>, initialPhotos?: string[]) => void;
}

const MAHINDRA_MODELS = [
  'Scorpio-N',
  'Scorpio Classic',
  'XUV700',
  'XUV400',
  'XUV300',
  'Thar',
  'Thar Roxx',
  'Bolero',
  'Bolero Neo',
  'Marazzo',
  'KUV100',
  'Other',
];

const VEHICLE_COLORS = [
  'White',
  'Black',
  'Silver',
  'Red',
  'Blue',
  'Grey',
  'Brown',
  'Green',
  'Other',
];

export function AddCaseDialog({ open, onOpenChange, onAddCase }: AddCaseDialogProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    vehicleModel: '',
    vehicleColor: '',
    registrationNumber: '',
    damageDescription: '',
    isUrgent: false,
  });
  const [photos, setPhotos] = useState<string[]>([]);

  const handlePhotoCapture = (dataUrl: string) => {
    setPhotos(prev => [...prev, dataUrl]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAddCase({
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      vehicleModel: formData.vehicleModel,
      vehicleColor: formData.vehicleColor,
      registrationNumber: formData.registrationNumber.toUpperCase(),
      damageDescription: formData.damageDescription,
      stage: 'new-intake' as CaseStage,
      insuranceStatus: 'not-applied' as InsuranceStatus,
      partsStatus: 'not-ordered' as PartsStatus,
      priority: formData.isUrgent ? 'urgent' : 'normal',
    }, photos.length > 0 ? photos : undefined);

    // Reset form
    setFormData({
      customerName: '',
      customerPhone: '',
      vehicleModel: '',
      vehicleColor: '',
      registrationNumber: '',
      damageDescription: '',
      isUrgent: false,
    });
    setPhotos([]);

    onOpenChange(false);
  };

  const isValid =
    formData.customerName &&
    formData.customerPhone &&
    formData.vehicleModel &&
    formData.registrationNumber;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">New Case Intake</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, customerName: e.target.value }))
                }
                placeholder="Full name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="customerPhone">Phone *</Label>
              <Input
                id="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, customerPhone: e.target.value }))
                }
                placeholder="Mobile number"
              />
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Vehicle Model *</Label>
              <Combobox
                options={MAHINDRA_MODELS}
                value={formData.vehicleModel}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, vehicleModel: value }))
                }
                placeholder="Select or type model"
                searchPlaceholder="Search or type model..."
                emptyText="No model found"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Vehicle Color</Label>
              <Combobox
                options={VEHICLE_COLORS}
                value={formData.vehicleColor}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, vehicleColor: value }))
                }
                placeholder="Select or type color"
                searchPlaceholder="Search or type color..."
                emptyText="No color found"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="registrationNumber">Registration Number *</Label>
            <Input
              id="registrationNumber"
              value={formData.registrationNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  registrationNumber: e.target.value.toUpperCase(),
                }))
              }
              placeholder="e.g., MH12AB1234"
              className="uppercase"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="damageDescription">Damage Description</Label>
            <Textarea
              id="damageDescription"
              value={formData.damageDescription}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, damageDescription: e.target.value }))
              }
              placeholder="Describe the damage, accident details..."
              rows={3}
            />
          </div>

          {/* Photo Section - Optional */}
          <div className="space-y-2 p-3 bg-secondary/50 rounded-lg border border-dashed">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ImageIcon className="h-4 w-4 text-primary" />
              Damage Photos
              <span className="text-muted-foreground font-normal">(Recommended)</span>
            </div>
            <PhotoCapture onPhotoCapture={handlePhotoCapture} />
            {photos.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative w-16 h-16 rounded-md overflow-hidden group">
                    <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-0.5 right-0.5 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemovePhoto(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <div>
              <Label htmlFor="urgent" className="font-medium">
                Mark as Urgent
              </Label>
              <p className="text-xs text-muted-foreground">
                Priority cases appear at the top
              </p>
            </div>
            <Switch
              id="urgent"
              checked={formData.isUrgent}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isUrgent: checked }))
              }
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              Create Case
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
