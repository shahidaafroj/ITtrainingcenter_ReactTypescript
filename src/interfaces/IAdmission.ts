export interface AdmissionDetail {
  admissionDetailsId?: number; // optional for new entries
  admissionId?: number;
  registrationId: number;
  batchId: number;
}

export interface Admission {
  admissionId?: number; // optional when inserting
  admissionNo?: string;
  visitorId: number;
  organizationName?: string;
  offerId?: number | null;
  discountAmount?: number | null;
  admissionDate: string; // use ISO date string (e.g., '2025-07-07')
  remarks?: string;
  admissionDetails: AdmissionDetail[];
}
