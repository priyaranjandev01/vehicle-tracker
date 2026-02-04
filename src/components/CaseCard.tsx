import { Case, STAGE_LABELS, CaseStage, Priority, INSURANCE_LABELS, InsuranceStatus } from '@/types/case';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Phone,
  Car,
  AlertTriangle,
  ChevronRight,
  MoreVertical,
  MessageSquare,
  Trash2,
  Flag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface CaseCardProps {
  caseData: Case;
  onMoveToStage: (stage: CaseStage) => void;
  onAddNote: () => void;
  onDelete: () => void;
  onClick: () => void;
  onTogglePriority: () => void;
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

export function CaseCard({
  caseData,
  onMoveToStage,
  onAddNote,
  onDelete,
  onClick,
  onTogglePriority,
}: CaseCardProps) {
  const stages: CaseStage[] = [
    'new-intake',
    'damage-assessment',
    'repair-in-progress',
    'insurance-claim',
    'ready-for-delivery',
    'case-closed',
  ];

  const currentStageIndex = stages.indexOf(caseData.stage);
  const nextStage = stages[currentStageIndex + 1];

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5',
        caseData.priority === 'urgent' && 'ring-2 ring-status-urgent'
      )}
      onClick={onClick}
    >
      <CardHeader className="p-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {caseData.priority === 'urgent' && (
                <AlertTriangle className="h-4 w-4 text-status-urgent flex-shrink-0" />
              )}
              <h3 className="font-semibold text-sm truncate">
                {caseData.customerName}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Phone className="h-3 w-3" />
              {caseData.customerPhone}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={onAddNote}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Note
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onTogglePriority}>
                <Flag className="h-4 w-4 mr-2" />
                {caseData.priority === 'urgent' ? 'Set Normal Priority' : 'Mark as Urgent'}
              </DropdownMenuItem>
              {nextStage && (
                <DropdownMenuItem onClick={() => onMoveToStage(nextStage)}>
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Move to {STAGE_LABELS[nextStage]}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Case
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-0 space-y-2">
        {/* Vehicle Info */}
        <div className="flex items-center gap-2 p-2 bg-secondary rounded-md">
          <Car className="h-4 w-4 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{caseData.vehicleModel}</p>
            <p className="text-xs text-muted-foreground">
              {caseData.registrationNumber} • {caseData.vehicleColor}
            </p>
          </div>
        </div>

        {/* Damage Preview */}
        <p className="text-xs text-muted-foreground line-clamp-2">
          {caseData.damageDescription}
        </p>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-1.5">
          <Badge className={cn('text-xs', insuranceColors[caseData.insuranceStatus])}>
            {INSURANCE_LABELS[caseData.insuranceStatus]}
          </Badge>
          <Badge className={cn('text-xs', partsColors[caseData.partsStatus])}>
            Parts: {caseData.partsStatus.replace('-', ' ')}
          </Badge>
        </div>

        {/* Notes indicator & timestamp */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {caseData.notes.length} notes
          </span>
          <span>{formatDistanceToNow(caseData.updatedAt, { addSuffix: true })}</span>
        </div>
      </CardContent>
    </Card>
  );
}
