export type CaseStage = 
  | 'new-intake'
  | 'damage-assessment'
  | 'repair-in-progress'
  | 'insurance-claim'
  | 'ready-for-delivery'
  | 'case-closed';

export type InsuranceStatus = 'pending' | 'approved' | 'rejected' | 'not-applicable';
export type PartsStatus = 'not-ordered' | 'ordered' | 'arrived';
export type Priority = 'normal' | 'urgent';

export interface CaseNote {
  id: string;
  text: string;
  timestamp: Date;
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
