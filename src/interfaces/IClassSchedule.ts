export interface IClassSchedule {
  classScheduleId?: number;
  selectedDayIds: number[];
  selectedDays?: string;
  slotId: number;
  scheduleDate: string;
  isActive: boolean;
  slot?: ISlot;
}

export interface ISlot {
  slotID: number;
  timeSlotType: string;
  startTimeString: string;
  endTimeString: string;
  isActive: boolean;
}

export interface IDay {
  dayId: number;
  dayName: string;
  isActive: boolean;
}
