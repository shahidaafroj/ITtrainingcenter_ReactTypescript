import { IEmployee } from "./IEmployee";
import { IVisitor } from "./IVisitor";

export interface IDailySalesRecord {
    dailySalesRecordId?: number;
    employeeId: number;
    employee?: IEmployee;
    employeeName?: string;
      coldCallPositive: number;
    date: Date | string;
    coldCallsMade: number;
    meetingsScheduled: number;
    meetingsConducted: number;
    visitorNo: string;
    walkInsAttended: number;
    walkInVisitorNo: string;
    evaluationsAttended: number;
    corporateVisitsScheduled: number;
    corporateVisitsConducted: number;
    newRegistrations: number;
    enrollments: number;
    newCollections: number;
    dueCollections: number;
    remarks?: string;
    selectedVisitors?: IVisitor[];
    hotLeads: number;
  followUps: number;
  newAdmissions: number;
  oldCollections: number;
}
export interface IMonthlySummary {
  totalColdCalls: number;
  totalMeetingsConducted: number;
  totalWalkIns: number;
  totalEnrollments: number;
  totalCollections: number;
  totalDueCollections: number;
  employeeId: number;
  employee?: IEmployee;
}
export interface DailySalesRecordModalProps {
  recordId?: number;
  onSuccess?: () => void;
  mode: 'create' | 'edit' | 'view';
}






