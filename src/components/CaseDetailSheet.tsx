import { useState } from 'react';
import { Case, CaseStage, STAGE_LABELS, InsuranceStatus, PartsStatus, INSURANCE_LABELS } from '@/types/case';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Phone,
  Car,
  Calendar,
  AlertTriangle,
  MessageSquare,
  Send,
  ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { PhotoCapture } from '@/components/PhotoCapture';
import { PhotoGallery } from '@/components/PhotoGallery';

interface CaseDetailSheetProps {
  caseData: Case | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateCase: (id: string, updates: Partial<Case>) => void;
  onAddNote: (caseId: string, text: string) => void;
  onAddPhoto: (caseId: string, dataUrl: string) => void;
  onDeletePhoto: (caseId: string, photoId: string) => void;
}

const insuranceColors: Record<InsuranceStatus, string> = {
  'not-applied': 'bg-muted text-muted-foreground',
  'applied': 'bg-blue-500 text-white',
  'inspector-scheduled': 'bg-purple-500 text-white',
  'inspected': 'bg-indigo-500 text-white',
  'under-review': 'bg-status-pending text-white',
  'approved': 'bg-status-approved text-white',
  'rejected': 'bg-status-rejected text-white',
  'not-applicable': 'bg-muted text-muted-foreground',
};

const partsColors = {
  'not-ordered': 'bg-muted text-muted-foreground',
  ordered: 'bg-status-pending text-white',
  arrived: 'bg-status-approved text-white',
};

export function CaseDetailSheet({
  caseData,
  open,
  onOpenChange,
  onUpdateCase,
  onAddNote,
  onAddPhoto,
  onDeletePhoto,
}: CaseDetailSheetProps) {
  const [newNote, setNewNote] = useState('');

  if (!caseData) return null;

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(caseData.id, newNote.trim());
      setNewNote('');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[480px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-2">
            {caseData.priority === 'urgent' && (
              <AlertTriangle className="h-5 w-5 text-status-urgent" />
            )}
            <SheetTitle className="text-xl">{caseData.customerName}</SheetTitle>
          </div>
          <a
            href={`tel:${caseData.customerPhone}`}
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <Phone className="h-4 w-4" />
            {caseData.customerPhone}
          </a>
        </SheetHeader>

        <div className="space-y-6">
          {/* Vehicle Info */}
          <div className="p-4 bg-secondary rounded-lg space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <Car className="h-5 w-5 text-primary" />
              Vehicle Details
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Model:</span>
                <p className="font-medium">{caseData.vehicleModel}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Color:</span>
                <p className="font-medium">{caseData.vehicleColor || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Registration:</span>
                <p className="font-medium text-lg">{caseData.registrationNumber}</p>
              </div>
            </div>
          </div>

          {/* Damage Description */}
          <div>
            <h3 className="font-semibold mb-2">Damage Description</h3>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              {caseData.damageDescription || 'No description provided'}
            </p>
          </div>

          <Separator />

          {/* Status Controls */}
          <div className="space-y-4">
            <h3 className="font-semibold">Status</h3>

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Stage</span>
                <Select
                  value={caseData.stage}
                  onValueChange={(value) =>
                    onUpdateCase(caseData.id, { stage: value as CaseStage })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STAGE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Insurance</span>
                <Select
                  value={caseData.insuranceStatus}
                  onValueChange={(value) =>
                    onUpdateCase(caseData.id, { insuranceStatus: value as InsuranceStatus })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <Badge className={cn('w-full justify-center', insuranceColors[caseData.insuranceStatus])}>
                      {INSURANCE_LABELS[caseData.insuranceStatus]}
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(INSURANCE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Parts</span>
                <Select
                  value={caseData.partsStatus}
                  onValueChange={(value) =>
                    onUpdateCase(caseData.id, { partsStatus: value as PartsStatus })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <Badge className={cn('w-full justify-center', partsColors[caseData.partsStatus])}>
                      {caseData.partsStatus.replace('-', ' ')}
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-ordered">Not Ordered</SelectItem>
                    <SelectItem value="ordered">Ordered</SelectItem>
                    <SelectItem value="arrived">Arrived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Photos Section */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Photos ({caseData.photos?.length || 0})
            </h3>

            <PhotoCapture
              onPhotoCapture={(dataUrl) => onAddPhoto(caseData.id, dataUrl)}
            />

            <PhotoGallery
              photos={caseData.photos || []}
              onDeletePhoto={(photoId) => onDeletePhoto(caseData.id, photoId)}
            />
          </div>

          <Separator />

          {/* Notes Section */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Notes ({caseData.notes.length})
            </h3>

            {/* Add Note */}
            <div className="flex gap-2">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a quick note..."
                rows={2}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleAddNote}
                disabled={!newNote.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Notes List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {caseData.notes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No notes yet
                </p>
              ) : (
                [...caseData.notes].reverse().map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-muted rounded-lg text-sm"
                  >
                    <p>{note.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(note.timestamp, 'MMM d, h:mm a')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Created: {format(caseData.createdAt, 'MMM d, yyyy h:mm a')}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Updated: {format(caseData.updatedAt, 'MMM d, yyyy h:mm a')}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
