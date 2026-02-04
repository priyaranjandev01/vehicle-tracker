import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { CaseStage, InsuranceStatus, PartsStatus } from '@/types/case';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterPriority: string;
  onFilterPriorityChange: (priority: string) => void;
  filterStage: CaseStage | 'all';
  onFilterStageChange: (stage: CaseStage | 'all') => void;
  filterInsurance: InsuranceStatus | 'all';
  onFilterInsuranceChange: (status: InsuranceStatus | 'all') => void;
  filterParts: PartsStatus | 'all';
  onFilterPartsChange: (status: PartsStatus | 'all') => void;
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  filterPriority,
  onFilterPriorityChange,
  filterStage,
  onFilterStageChange,
  filterInsurance,
  onFilterInsuranceChange,
  filterParts,
  onFilterPartsChange,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, phone, or registration..."
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => onSearchChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Select value={filterPriority} onValueChange={onFilterPriorityChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="urgent">Urgent Only</SelectItem>
            <SelectItem value="normal">Normal Only</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filterStage}
          onValueChange={(value) => onFilterStageChange(value as CaseStage | 'all')}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="new-intake">New Intake</SelectItem>
            <SelectItem value="damage-assessment">Damage Assessment</SelectItem>
            <SelectItem value="repair-in-progress">Repair In-Progress</SelectItem>
            <SelectItem value="insurance-claim">Insurance Claim</SelectItem>
            <SelectItem value="ready-for-delivery">Ready for Delivery</SelectItem>
            <SelectItem value="case-closed">Case Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filterInsurance}
          onValueChange={(value) => onFilterInsuranceChange(value as InsuranceStatus | 'all')}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Insurance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Insurance</SelectItem>
            <SelectItem value="not-applied">Not Applied</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="inspector-scheduled">Inspector Scheduled</SelectItem>
            <SelectItem value="inspected">Inspected</SelectItem>
            <SelectItem value="under-review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="not-applicable">Not Applicable</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filterParts}
          onValueChange={(value) => onFilterPartsChange(value as PartsStatus | 'all')}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Parts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Parts</SelectItem>
            <SelectItem value="not-ordered">Not Ordered</SelectItem>
            <SelectItem value="ordered">Ordered</SelectItem>
            <SelectItem value="arrived">Arrived</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
