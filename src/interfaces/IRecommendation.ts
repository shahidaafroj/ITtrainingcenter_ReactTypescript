export interface IRecommendation {
  recommendationId?: number;
  traineeId: number;
    traineeIDNo?: string;
  instructorId: number;
  batchId: number;
  assessmentId: number;
  invoiceId: number;
  recommendationText: string;
  recommendationDate: string; // yyyy-MM-dd
  recommendationStatus: string;

  // Additional fields from includes:
  traineeName?: string;
  instructorName?: string;
  batchName?: string;
  assessmentStatus?: string;
  invoiceNo?: string;


   /// Navigation properties
  trainee?: {
    registration?: {
      traineeName?: string;
    };
  };
  
  instructor?: {
    employee?: {
      employeeName?: string;
    };
  };
  
  batch?: {
    batchName?: string;
  };
  
  assessment?: {
    isFinalized?: boolean;
  };
  
  invoice?: {
    invoiceNo?: string;
  };
}
