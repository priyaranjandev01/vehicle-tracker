export type CaseStage = 
  | 'new-intake'
  | 'damage-assessment'
  | 'repair-in-progress'
  | 'insurance-claim'
  | 'ready-for-delivery'
  | 'case-closed';

export type InsuranceStatus = 
  | 'not-applied'
  | 'applied'
  | 'inspector-scheduled'
  | 'inspected'
  | 'under-review'
  | 'approved'
  | 'rejected'
  | 'not-applicable';

export const INSURANCE_LABELS: Record<InsuranceStatus, string> = {
  'not-applied': 'Not Applied',
  'applied': 'Applied',
  'inspector-scheduled': 'Inspector Scheduled',
  'inspected': 'Inspected',
  'under-review': 'Under Review',
  'approved': 'Approved',
  'rejected': 'Rejected',
  'not-applicable': 'Not Applicable',
};
export type PartsStatus = 'not-ordered' | 'ordered' | 'arrived';
export type Priority = 'normal' | 'urgent';

export interface CaseNote {
  id: string;
  text: string;
  timestamp: Date;
}

export interface CasePhoto {
  id: string;
  dataUrl: string; // Compressed base64 image
  timestamp: Date;
  caption?: string;
  /** Whether this photo has been aggressively archived to save space */
  archived?: boolean;
}

export interface Case {
  id: string;
  customerName: string;
  customerPhone: string;
  vehicleModel: string;
  vehicleColor: string;
  registrationNumber: string;
  damageDescription: string;
  stage: CaseStage;
  insuranceStatus: InsuranceStatus;
  partsStatus: PartsStatus;
  priority: Priority;
  notes: CaseNote[];
  photos: CasePhoto[];
  createdAt: Date;
  updatedAt: Date;
}

export const STAGE_LABELS: Record<CaseStage, string> = {
  'new-intake': 'New Intake',
  'damage-assessment': 'Damage Assessment',
  'repair-in-progress': 'Repair In-Progress',
  'insurance-claim': 'Insurance Claim',
  'ready-for-delivery': 'Ready for Delivery',
  'case-closed': 'Case Closed',
};

export const STAGE_ORDER: CaseStage[] = [
  'new-intake',
  'damage-assessment',
  'repair-in-progress',
  'insurance-claim',
  'ready-for-delivery',
  'case-closed',
];
