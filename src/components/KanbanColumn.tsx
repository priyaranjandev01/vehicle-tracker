import { Case, CaseStage, STAGE_LABELS } from '@/types/case';
import { CaseCard } from './CaseCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  stage: CaseStage;
  cases: Case[];
  onMoveCase: (caseId: string, newStage: CaseStage) => void;
  onAddNote: (caseId: string) => void;
  onDeleteCase: (caseId: string) => void;
  onCaseClick: (caseData: Case) => void;
}

const stageColors: Record<CaseStage, string> = {
  'new-intake': 'bg-stage-new',
  'damage-assessment': 'bg-stage-assessment',
  'insurance-claim': 'bg-stage-insurance',
  'repair-in-progress': 'bg-stage-repair',
  'ready-for-delivery': 'bg-stage-ready',
};

export function KanbanColumn({
  stage,
  cases,
  onMoveCase,
  onAddNote,
  onDeleteCase,
  onCaseClick,
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px] bg-secondary/50 rounded-lg">
      {/* Column Header */}
      <div className="p-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className={cn('w-3 h-3 rounded-full', stageColors[stage])} />
          <h2 className="font-semibold text-sm">{STAGE_LABELS[stage]}</h2>
          <span className="ml-auto bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full">
            {cases.length}
          </span>
        </div>
      </div>

      {/* Cards Container */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {cases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No cases
            </div>
          ) : (
            cases.map((caseData) => (
              <CaseCard
                key={caseData.id}
                caseData={caseData}
                onMoveToStage={(newStage) => onMoveCase(caseData.id, newStage)}
                onAddNote={() => onAddNote(caseData.id)}
                onDelete={() => onDeleteCase(caseData.id)}
                onClick={() => onCaseClick(caseData)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
