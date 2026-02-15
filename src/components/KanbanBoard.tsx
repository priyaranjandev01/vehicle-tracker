import { Case, CaseStage, STAGE_ORDER } from '@/types/case';
import { safeGetTime } from '@/lib/safeDate';
import { KanbanColumn } from './KanbanColumn';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface KanbanBoardProps {
  cases: Case[];
  onMoveCase: (caseId: string, newStage: CaseStage) => void;
  onAddNote: (caseId: string) => void;
  onDeleteCase: (caseId: string) => void;
  onCaseClick: (caseData: Case) => void;
  onTogglePriority: (caseId: string) => void;
}

export function KanbanBoard({
  cases,
  onMoveCase,
  onAddNote,
  onDeleteCase,
  onCaseClick,
  onTogglePriority,
}: KanbanBoardProps) {
  const getCasesByStage = (stage: CaseStage) =>
    cases
      .filter((c) => c.stage === stage)
      .sort((a, b) => {
        // Priority cases first, then by update time
        if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
        if (a.priority !== 'urgent' && b.priority === 'urgent') return 1;
        return safeGetTime(b.updatedAt) - safeGetTime(a.updatedAt);
      });

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-4 p-4 min-h-[calc(100vh-180px)]">
        {STAGE_ORDER.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            cases={getCasesByStage(stage)}
            onMoveCase={onMoveCase}
            onAddNote={onAddNote}
            onDeleteCase={onDeleteCase}
            onCaseClick={onCaseClick}
            onTogglePriority={onTogglePriority}
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
