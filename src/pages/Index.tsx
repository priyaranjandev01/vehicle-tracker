import { useState, useMemo } from 'react';
import { useCases } from '@/hooks/useCases';
import { Case } from '@/types/case';
import { KanbanBoard } from '@/components/KanbanBoard';
import { AddCaseDialog } from '@/components/AddCaseDialog';
import { CaseDetailSheet } from '@/components/CaseDetailSheet';
import { AddNoteDialog } from '@/components/AddNoteDialog';
import { SearchFilter } from '@/components/SearchFilter';
import { Button } from '@/components/ui/button';
import { Plus, Car, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { cases, addCase, updateCase, moveCase, addNote, deleteCase } = useCases();
  const { toast } = useToast();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [noteDialogCase, setNoteDialogCase] = useState<Case | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

  // Filter cases based on search and priority
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // Search filter
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        c.customerName.toLowerCase().includes(query) ||
        c.customerPhone.includes(query) ||
        c.registrationNumber.toLowerCase().includes(query) ||
        c.vehicleModel.toLowerCase().includes(query);

      // Priority filter
      const matchesPriority =
        filterPriority === 'all' || c.priority === filterPriority;

      return matchesSearch && matchesPriority;
    });
  }, [cases, searchQuery, filterPriority]);

  const handleAddCase = (
    caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt' | 'notes'>
  ) => {
    addCase(caseData);
    toast({
      title: 'Case Created',
      description: `${caseData.customerName}'s case has been added.`,
    });
  };

  const handleDeleteCase = (caseId: string) => {
    const caseToDelete = cases.find((c) => c.id === caseId);
    deleteCase(caseId);
    toast({
      title: 'Case Deleted',
      description: `${caseToDelete?.customerName}'s case has been removed.`,
    });
  };

  const handleAddNote = (caseId: string, text: string) => {
    addNote(caseId, text);
    setNoteDialogCase(null);
    toast({
      title: 'Note Added',
      description: 'Your note has been saved.',
    });
  };

  const totalCases = cases.length;
  const urgentCases = cases.filter((c) => c.priority === 'urgent').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-foreground/10 rounded-lg">
                <Car className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">ServiceDesk</h1>
                <p className="text-xs text-primary-foreground/70">
                  Accident Vehicle Tracker
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Stats */}
              <div className="hidden sm:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  <span>{totalCases} cases</span>
                </div>
                {urgentCases > 0 && (
                  <div className="flex items-center gap-1.5 bg-status-urgent/20 px-2 py-1 rounded">
                    <span className="font-semibold">{urgentCases} urgent</span>
                  </div>
                )}
              </div>

              <Button
                onClick={() => setShowAddDialog(true)}
                variant="secondary"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Case</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-3">
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterPriority={filterPriority}
            onFilterPriorityChange={setFilterPriority}
          />
        </div>
      </div>

      {/* Kanban Board */}
      <main className="container mx-auto">
        {cases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-muted rounded-full mb-4">
              <Car className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No cases yet</h2>
            <p className="text-muted-foreground mb-4">
              Add your first vehicle case to get started
            </p>
            <Button onClick={() => setShowAddDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add First Case
            </Button>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground">
              No cases match your search criteria
            </p>
          </div>
        ) : (
          <KanbanBoard
            cases={filteredCases}
            onMoveCase={moveCase}
            onAddNote={(caseId) => {
              const caseData = cases.find((c) => c.id === caseId);
              if (caseData) setNoteDialogCase(caseData);
            }}
            onDeleteCase={handleDeleteCase}
            onCaseClick={setSelectedCase}
          />
        )}
      </main>

      {/* Dialogs & Sheets */}
      <AddCaseDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddCase={handleAddCase}
      />

      <CaseDetailSheet
        caseData={selectedCase}
        open={!!selectedCase}
        onOpenChange={(open) => !open && setSelectedCase(null)}
        onUpdateCase={updateCase}
        onAddNote={handleAddNote}
      />

      <AddNoteDialog
        open={!!noteDialogCase}
        onOpenChange={(open) => !open && setNoteDialogCase(null)}
        onAddNote={(text) => noteDialogCase && handleAddNote(noteDialogCase.id, text)}
        customerName={noteDialogCase?.customerName}
      />
    </div>
  );
};

export default Index;
