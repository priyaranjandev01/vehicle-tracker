import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';

interface AddNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddNote: (text: string) => void;
  customerName?: string;
}

export function AddNoteDialog({
  open,
  onOpenChange,
  onAddNote,
  customerName,
}: AddNoteDialogProps) {
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      onAddNote(note.trim());
      setNote('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Add Note
          </DialogTitle>
          {customerName && (
            <p className="text-sm text-muted-foreground">
              For: {customerName}
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Type your note here..."
            rows={4}
            autoFocus
          />

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!note.trim()}>
              Save Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
