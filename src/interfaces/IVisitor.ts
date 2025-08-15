
export * from './IEmployee';


export interface IVisitor {
    employeeId: number;
    employeeComments: string;
  // employee: any;
    visitorId: number;
    visitorNo?: string;
    visitorName: string;
    visitorType: string;
    contactNo: string;
    email?: string;
    visitDateTime: Date | string;
    visitPurpose: string;
    expectedCourse: string;
    visitorSource: string;
    address: string;
    educationLevel: string;
    employee?: {
    employeeId: number;
    employeeName: string;
    employeeComments: string;
  };    
    // Additional fields from your model
    reference?: string;
    companyName?: string;
      referredByEmployeeId?: number | null;
}

export interface IVisitorr {
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
  employeeId: number | null;
  employeeName?: string;
  expectedCourse: string;
  visitorSource: string;
  reference?: string;
  companyName?: string;
}