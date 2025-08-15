// interfaces/IBatch.ts
export interface IBatch {
  batchId: number;
  batchName: string;
  courseId: number;
  startDate: string;
  endDate?: string;
  batchType: 'Regular' | 'Weekend' | 'Online';
  instructorId: number;
  classRoomId: number;
  isActive: boolean;
  remarks?: string;
  selectedScheduleIds: number[];
  previousInstructorIds: number[];
}

export interface IBatchDetails extends IBatch {
  courseName?: string;
  instructorName?: string;
  classRoomName?: string;
  schedules?: IClassSchedule[];
  previousInstructorNames?: string[];

}

// interfaces/IBatch.ts
export interface IClassSchedule {
  classScheduleId: number;
  selectedDays: string;
  slotId: number;
  slot?: {  // Make this optional
    timeSlotType: string;
    startTimeString: string;
    endTimeString: string;
  };
  scheduleDate: string;
  isActive: boolean;
}

export interface IBatchListItem {
  batchId: number;
  batchName: string;
  courseName: string;
  instructorName: string;
  startDate: string;
  endDate?: string;
  batchType: string;
  isActive: boolean;
}