import { useState, useMemo } from 'react';
import { useCases } from '@/hooks/useCases';
import { Case } from '@/types/case';
import { KanbanBoard } from '@/components/KanbanBoard';
import { AddCaseDialog } from '@/components/AddCaseDialog';
import { CaseDetailSheet } from '@/components/CaseDetailSheet';
import { AddNoteDialog } from '@/components/AddNoteDialog';
import { SearchFilter } from '@/components/SearchFilter';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Car, FileText, BookOpen, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { cases, addCase, updateCase, moveCase, addNote, addPhoto, deletePhoto, deleteCase } = useCases();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [noteDialogCaseId, setNoteDialogCaseId] = useState<string | null>(null);

  // Derive selected cases from the current cases array for real-time updates
  const selectedCase = selectedCaseId ? cases.find(c => c.id === selectedCaseId) || null : null;
  const noteDialogCase = noteDialogCaseId ? cases.find(c => c.id === noteDialogCaseId) || null : null;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'urgent' | 'normal'>('all');
  const [filterStage, setFilterStage] = useState<'all' | Case['stage']>('all');
  const [filterInsurance, setFilterInsurance] = useState<'all' | Case['insuranceStatus']>('all');
  const [filterParts, setFilterParts] = useState<'all' | Case['partsStatus']>('all');

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

      const matchesStage = filterStage === 'all' || c.stage === filterStage;
      const matchesInsurance =
        filterInsurance === 'all' || c.insuranceStatus === filterInsurance;
      const matchesParts = filterParts === 'all' || c.partsStatus === filterParts;

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStage &&
        matchesInsurance &&
        matchesParts
      );
    });
  }, [cases, searchQuery, filterPriority, filterStage, filterInsurance, filterParts]);

  const handleAddCase = (
    caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt' | 'notes' | 'photos'>,
    initialPhotos?: string[]
  ) => {
    addCase(caseData, initialPhotos);
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

  const handleTogglePriority = (caseId: string) => {
    const caseData = cases.find((c) => c.id === caseId);
    if (caseData) {
      const newPriority = caseData.priority === 'urgent' ? 'normal' : 'urgent';
      updateCase(caseId, { priority: newPriority });
      toast({
        title: newPriority === 'urgent' ? 'Marked Urgent' : 'Set to Normal',
        description: `${caseData.customerName}'s priority updated.`,
      });
    }
  };

  const handleAddNote = (caseId: string, text: string) => {
    addNote(caseId, text);
    setNoteDialogCaseId(null);
    toast({
      title: 'Note Added',
      description: 'Your note has been saved.',
    });
  };

  const totalCases = cases.length;
  const urgentCases = cases.filter(
    (c) => c.priority === 'urgent' && c.stage !== 'case-closed',
  ).length;
  const inWorkshop = cases.filter(
    (c) =>
      c.stage === 'damage-assessment' ||
      c.stage === 'repair-in-progress' ||
      c.stage === 'insurance-claim'
  ).length;
  const readyForDelivery = cases.filter(
    (c) => c.stage === 'ready-for-delivery'
  ).length;
  const closedCases = cases.filter((c) => c.stage === 'case-closed').length;
  const activeCases = cases.length - closedCases;

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
                onClick={() => navigate('/documentation')}
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/10"
                title="Documentation"
              >
                <BookOpen className="h-5 w-5" />
              </Button>

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
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Use filters below to focus on specific cases. Open summary for a quick overview.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Summary</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Board summary</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                    <p className="text-muted-foreground text-xs">Total cases</p>
                    <p className="text-lg font-semibold">{totalCases}</p>
                  </div>
                  <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                    <p className="text-muted-foreground text-xs">Active cases</p>
                    <p className="text-lg font-semibold">{activeCases}</p>
                  </div>
                  <div className="rounded-lg bg-status-urgent/10 px-3 py-2 text-sm">
                    <p className="text-xs text-status-urgent">Urgent cases</p>
                    <p className="text-lg font-semibold text-status-urgent">{urgentCases}</p>
                  </div>
                  <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                    <p className="text-muted-foreground text-xs">In workshop</p>
                    <p className="text-lg font-semibold">{inWorkshop}</p>
                  </div>
                  <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                    <p className="text-muted-foreground text-xs">Ready for delivery</p>
                    <p className="text-lg font-semibold">{readyForDelivery}</p>
                  </div>
                  <div className="rounded-lg bg-muted px-3 py-2 text-sm sm:col-span-2">
                    <p className="text-muted-foreground text-xs">Closed cases</p>
                    <p className="text-lg font-semibold">{closedCases}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterPriority={filterPriority}
            onFilterPriorityChange={setFilterPriority}
            filterStage={filterStage}
            onFilterStageChange={setFilterStage}
            filterInsurance={filterInsurance}
            onFilterInsuranceChange={setFilterInsurance}
            filterParts={filterParts}
            onFilterPartsChange={setFilterParts}
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
            onAddNote={(caseId) => setNoteDialogCaseId(caseId)}
            onDeleteCase={handleDeleteCase}
            onCaseClick={(caseData) => setSelectedCaseId(caseData.id)}
            onTogglePriority={handleTogglePriority}
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
        open={!!selectedCaseId}
        onOpenChange={(open) => !open && setSelectedCaseId(null)}
        onUpdateCase={updateCase}
        onAddNote={handleAddNote}
        onAddPhoto={addPhoto}
        onDeletePhoto={deletePhoto}
      />

      <AddNoteDialog
        open={!!noteDialogCaseId}
        onOpenChange={(open) => !open && setNoteDialogCaseId(null)}
        onAddNote={(text) => noteDialogCase && handleAddNote(noteDialogCase.id, text)}
        customerName={noteDialogCase?.customerName}
      />
    </div>
  );
};

export default Index;
