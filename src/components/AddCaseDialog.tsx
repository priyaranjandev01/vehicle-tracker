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
import { Switch } from '@/components/ui/switch';
import { Case, CaseStage, InsuranceStatus, PartsStatus } from '@/types/case';

interface AddCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCase: (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt' | 'notes'>) => void;
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
      insuranceStatus: 'pending' as InsuranceStatus,
      partsStatus: 'not-ordered' as PartsStatus,
      priority: formData.isUrgent ? 'urgent' : 'normal',
    });

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

        <form onSubmit={handleSubmit} className="space-y-4">
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
              <Select
                value={formData.vehicleModel}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, vehicleModel: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {MAHINDRA_MODELS.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Vehicle Color</Label>
              <Select
                value={formData.vehicleColor}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, vehicleColor: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_COLORS.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
