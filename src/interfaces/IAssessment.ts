// interfaces/IAssessment.ts
export interface IAssessmentDetail {
  traineeId: number;
  assessmentType: string;
  theoreticalScore: number;
  practicalScore: number;
  daysPresent: number;
  totalDays: number;
  participationLevel: string;
  technicalSkillsRating: string;
  communicationSkillsRating: string;
  teamworkRating: string;
  disciplineRemarks: string;
  punctuality: string;
  attitudeRating: string;
  strengths: string;
  weaknesses: string;
  improvementAreas: string;
  trainerRemarks: string;
  isFinalized: boolean;
}

export interface IAssessmentCreate {
  assessmentDate: string;
  batchId: number;
  instructorId: number;
  assessments: IAssessmentDetail[];
}

export interface IAssessmentDetailsDTO extends IAssessmentDetail {
  assessmentId?: number;
  assessmentDate: string;
  batchId: number;
  instructorId: number;
  attendancePercentage?: number; 
  overallScore?: number;   
  traineeeId?: number; 
  traineeIdNo?: string; 
}

