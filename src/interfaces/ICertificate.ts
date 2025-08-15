export interface ICertificate {
  certificateId?: number;
   traineeName?: string;
  traineeId: number;
  registrationId: number;
  registrationNo?: string;
  batchId: number;
  courseId: number;
   courseName?: string;
  recommendationId: number;
  batchName?:string;
  issueDate?: string;
  certificateNumber?: string;
   recommendationStatus?: string;
}

export interface ITraineeDropdown {
  traineeId: number;           // 👈 Add this
  traineeIDNo: number;
  traineeName: string;
}

export interface ITraineeInfo {
  traineeId: number;
  traineeIDNo: number;
  registrationId: number;
  registrationNo: string;
  batchId: number;
  batchName: string;
  courseId: number;
  courseName: string;
  recommendationId: number;
  recommendationStatus: string;
}

export interface ITraineeDropdown {
  traineeId: number;
  traineeIDNo: number;
  traineeName: string;
}