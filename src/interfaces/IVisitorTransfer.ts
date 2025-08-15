// interfaces/IVisitorTransfer.ts
export interface IVisitorTransfer {
  visitorIds: number[];
  employeeId: number;
  transferDate: string;
  notes?: string;
  userName?: string;
}

export interface IEmployee {
  employeeId: number;
  employeeName: string;
  isAvailable: boolean;
}

export interface IVisitor {
  visitorId: number;
  visitorNo:string;
  visitorName: string;
  employeeId: number;
}