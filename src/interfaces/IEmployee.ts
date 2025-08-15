export interface IEmployee {
    employeeId: number;
    employeeIDNo: string;
    employeeName: string;
    designationId: number;
    departmentId: number;
    contactNo: string;
    dOB: Date;
    joiningDate: Date;
    endDate?: Date;
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
    imageFile?: File;
    documentFile?: File;
    designation?: {
        designationId: number;
        designationName: string;
    };
    department?: {
        departmentId: number;
        departmentName: string;
    };
}