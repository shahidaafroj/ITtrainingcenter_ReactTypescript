import { IDepartment } from "./IDepartment";
import { IDesignation } from "./IDesignation";

export interface IRegistration {
  registrationId: number;
  registrationNo?: string;
  visitorId: number;
  visitor?: IVisitor;
  traineeName: string;
  registrationDate: string;
  courseId?: number;
  course?: ICourse;
  courseComboId?: number;
  courseCombo?: ICourseCombo;
  gender: string;
  nationality: string;
  religion: string;
  dateOfBirth: string;
  originatDateofBirth: string;
  maritalStatus: string;
  fatherName: string;
  motherName: string;
  contactNo: string;
  emergencyContactNo?: string;
  emailAddress: string;
  bloodGroup?: string;
  imagePath?: string;
  documentPath?: string;
  birthOrNIDNo: string;
  presentAddress: string;
  permanentAddress: string;
  highestEducation?: string;
  institutionName?: string;
  reference: string;
  remarks?: string;
  imageFile?: File;        // Add this
  documentFile?: File; 
}

export interface IVisitor {
  visitorId: number;
  visitorNo?: string;
  visitorName: string;
  contactNo: string;
  email: string;
  visitDateTime: string;
  visitPurpose?: string;
  address: string;
  educationLevel: string;
  visitorType: string;
  employeeComments: string;
  employeeId: number;
  employee?: IEmployee | null;
  expectedCourse: string;
  visitorSource: string;
  reference?: string;
  companyName?: string;
}

export interface IEmployee {
  employeeId: number;
  employeeIDNo?: string;
  employeeName: string;
  designationId: number;
  designation?: IDesignation;
  departmentId: number;
  department?: IDepartment;
  contactNo: string;
  dob: string;
  joiningDate: string;
  endDate?: string;
  emailAddress: string;
  permanentAddress: string;
  presentAddress: string;
  fathersName: string;
  mothersName: string;
  birthOrNIDNo: number;
  isAvailable: boolean;
  isWillingToSell: boolean;
  imagePath?: string;
  documentPath?: string;
  remarks?: string;
}

export interface ICourse {
  courseId: number;
  courseName: string;
  // add other course fields as needed
}

export interface ICourseCombo {
  courseComboId: number;
  comboName: string;
  // add other combo fields as needed
}