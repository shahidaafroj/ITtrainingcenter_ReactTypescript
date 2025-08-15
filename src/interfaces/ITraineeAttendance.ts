// src/interfaces/ITraineeAttendance.ts

// Main Attendance Interface
export interface ITraineeAttendance {
  traineeAttendanceId?: number;
  attendanceDate: string;
  batchId: number;
  instructorId: number;
  
  // Direct properties (optional)
  batchName?: string;
  instructorName?: string;
  markedTime?: string | null;
  remarks?: string | null;
  


  batch?: {
    batchId: number;
    batchName: string;
    instructor?: {
      instructorId: number;
      employee?: {
        employeeId: number;
        employeeName: string;
      };
    };
  };
  instructor?: {
    instructorId: number;
    employee?: {
      employeeId: number;
      employeeName: string;
    };
  };

  traineeAttendanceDetails?: ITraineeAttendanceDetail[];
}

// Batch Interface
export interface IBatch {
  batchId: number;
  batchName: string;
  instructor?: IInstructor;
  // Add other batch properties as needed
}

// Instructor Interface
export interface IInstructor {
  instructorId: number;
  employeeId?: number;
  Employee?: IEmployee;
}

// Employee Interface
export interface IEmployee {
  employeeId: number;
  employeeName: string;
}

// Trainee Interface
export interface ITrainee {
  traineeId: number;
  traineeIDNo?: string;
  Registration?: IRegistration;
}

// Registration Interface
export interface IRegistration {
  traineeName: string;
}

// Admission Interface
export interface IAdmission {
  admissionId: number;
  admissionNo: string;
}

// Invoice Interface
export interface IInvoice {
  invoiceId: number;
  invoiceNo: string;
}

// Attendance Detail Interface
export interface ITraineeAttendanceDetail {
  traineeAttendanceDetailId?: number;
  traineeAttendanceId?: number;
  traineeId: number;
  admissionId: number;
  invoiceId?: number | null;
  attendanceStatus: boolean;
  markedTime?: string | null;
  remarks?: string | null;
  
  // Direct properties (optional)
  traineeName?: string;
  admissionNo?: string;
  invoiceNo?: string | null;
  
  // Nested objects
  trainee?: ITrainee;
  admission?: IAdmission;
  invoice?: IInvoice;
}

// Batch Details Interface (for GetBatchDetails response)
export interface IBatchDetails {
  batchId: number;
  batchName: string;
  instructorId: number;
  instructorName: string;
  trainees: ITraineeWithDetails[];
}

// Extended Trainee Interface for Batch Details
export interface ITraineeWithDetails {
  traineeId: number;
  traineeName: string;
  admissionId: number;
  admissionNo: string;
  invoiceNos: IInvoiceInfo[];
}

// Simplified Invoice Info Interface
export interface IInvoiceInfo {
  invoiceId: number;
  invoiceNo: string;
}